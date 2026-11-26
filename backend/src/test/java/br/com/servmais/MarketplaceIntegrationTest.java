package br.com.servmais;

import br.com.servmais.repository.MongoStore;
import br.com.servmais.security.TokenService;
import com.fasterxml.jackson.databind.*;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import static br.com.servmais.repository.MongoStore.*;
import static org.junit.jupiter.api.Assertions.*;

/** Real HTTP + real MongoDB transactions, isolated from every application database. */
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT,properties={"serv.rate-limit.enabled=false","serv.serve-frontend=false"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MarketplaceIntegrationTest {
    static final String DATABASE="serv_test_spring_"+UUID.randomUUID().toString().replace("-","").substring(0,20);
    static final Map<String,Object> LOCAL=br.com.servmais.config.DotEnv.read();
    @DynamicPropertySource static void config(DynamicPropertyRegistry r) {
        r.add("serv.mongodb-uri",()->System.getenv().getOrDefault("TEST_MONGODB_URI",LOCAL.getOrDefault("MONGODB_URI","mongodb://localhost:27017/?replicaSet=rs0").toString()));
        r.add("serv.mongodb-database",()->DATABASE);
        r.add("serv.jwt-secret",()->"test-only-secret-"+UUID.randomUUID());
    }
    @LocalServerPort int port;
    @Autowired ObjectMapper json;
    @Autowired MongoTemplate mongo;
    @Autowired MongoStore store;
    @Autowired PasswordEncoder passwords;
    @Autowired JwtEncoder encoder;
    private final HttpClient http=HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    private final java.util.concurrent.atomic.AtomicInteger checks=new java.util.concurrent.atomic.AtomicInteger();
    record Account(String token,String id) {}
    JsonNode request(String method,String path,Object body,String token,int expected) throws Exception {
        var builder=HttpRequest.newBuilder(URI.create("http://127.0.0.1:"+port+path)).timeout(Duration.ofSeconds(40));
        if(token!=null) builder.header("Authorization","Bearer "+token);
        if(body!=null) builder.header("Content-Type","application/json");
        builder.method(method,body==null?HttpRequest.BodyPublishers.noBody():HttpRequest.BodyPublishers.ofString(json.writeValueAsString(body)));
        var response=http.send(builder.build(),HttpResponse.BodyHandlers.ofString());
        assertEquals(expected,response.statusCode(),method+" "+path+": "+response.body()); checks.incrementAndGet();
        if(expected==204) return json.nullNode();
        assertTrue(response.headers().firstValue("content-type").orElse("").contains("application/json"));
        return json.readTree(response.body());
    }
    Account register(String name,String role) throws Exception {
        var response=request("POST","/api/auth/registro",Map.of("nome",name,"tipo",role,"email",UUID.randomUUID()+"@example.invalid","senha","TesteMercado123!"),null,201);
        assertFalse(response.path("usuario").has("senha"));
        return new Account(response.path("token").asText(),response.path("usuario").path("_id").asText());
    }
    @Test void completeHiringFlowAndConcurrency() throws Exception {
        var a=register("Cliente A","cliente"); var b=register("Cliente B","cliente");
        var p=register("Profissional A","freelancer"); var q=register("Profissional B","freelancer");
        request("POST","/api/auth/registro",Map.of("nome","Admin","email","bad@example.invalid","senha","TesteMercado123!","tipo","admin"),null,400);
        request("PATCH","/api/usuarios/"+p.id(),Map.of("perfil_freelancer",Map.of("descricao","Sites acessíveis.","area_atuacao","Web","portfolio_url","https://example.com/portfolio")),p.token(),200);
        request("PATCH","/api/usuarios/"+p.id(),Map.of("nome","Invasão"),b.token(),403);
        var pub=request("GET","/api/usuarios/freelancers/"+p.id(),null,null,200);
        assertFalse(pub.has("email")); assertFalse(pub.has("info")); assertFalse(pub.has("senha"));
        assertEquals(1,request("GET","/api/usuarios/freelancers?area=Web",null,null,200).path("total").asInt());
        request("GET","/api/usuarios/freelancers/"+a.id(),null,null,404);
        var service=request("POST","/api/servicos",Map.of("titulo","Site institucional","descricao","Site responsivo e acessível.","preco",100,"categoria","Web","usuario",a.id()),p.token(),201);
        String sid=service.path("_id").asText(); assertEquals(p.id(),service.path("usuario").asText());
        var extra=request("POST","/api/servicos",Map.of("titulo","Outro serviço","descricao","Outro serviço de teste.","preco",50,"categoria","Design"),p.token(),201);
        var catalog=request("GET","/api/servicos?profissional="+p.id(),null,null,200);
        assertEquals(2,catalog.path("total").asInt()); assertFalse(catalog.path("resultados").get(0).path("usuario").has("email"));
        assertEquals(1,request("GET","/api/servicos?busca=institucional",null,null,200).path("total").asInt());
        var input=Map.of("servico_id",sid,"descricao","Preciso de um site com cinco páginas institucionais.");
        request("POST","/api/orcamentos",input,null,401); request("POST","/api/orcamentos",input,p.token(),403);
        request("POST","/api/orcamentos",Map.of("servico_id",sid,"descricao","curta"),a.token(),400);
        var attack=new HashMap<String,Object>(input);attack.put("profissional",q.id());attack.put("status","aceito");
        var quote=request("POST","/api/orcamentos",attack,a.token(),201);String quoteId=quote.path("_id").asText();
        assertEquals(p.id(),quote.path("profissional").asText());assertEquals("solicitado",quote.path("status").asText());
        assertEquals(0,request("GET","/api/orcamentos",null,b.token(),200).path("total").asInt());
        assertEquals(1,request("GET","/api/orcamentos",null,p.token(),200).path("total").asInt());
        request("POST","/api/orcamentos/"+quoteId+"/aceitar",null,a.token(),409);
        var proposal=Map.of("valor",750.5,"prazo_dias",14,"escopo","Cinco páginas responsivas e uma rodada de revisão.");
        String respond="/api/orcamentos/"+quoteId+"/responder";
        request("PATCH",respond,proposal,q.token(),409);
        var bad=new HashMap<String,Object>(proposal);bad.put("valor",-1);request("PATCH",respond,bad,p.token(),400);
        bad=new HashMap<>(proposal);bad.put("prazo_dias",1.5);request("PATCH",respond,bad,p.token(),400);
        bad=new HashMap<>(proposal);bad.put("valor",1.234);request("PATCH",respond,bad,p.token(),400);
        request("PATCH",respond,proposal,p.token(),200);request("PATCH",respond,proposal,p.token(),409);
        request("POST","/api/orcamentos/"+quoteId+"/aceitar",null,b.token(),409);
        ExecutorService pool=Executors.newFixedThreadPool(2);
        JsonNode order,same;
        try {
            var f1=pool.submit(()->request("POST","/api/orcamentos/"+quoteId+"/aceitar",Map.of("valor",1),a.token(),200));
            var f2=pool.submit(()->request("POST","/api/orcamentos/"+quoteId+"/aceitar",null,a.token(),200));
            order=f1.get(60,TimeUnit.SECONDS);same=f2.get(60,TimeUnit.SECONDS);
        } finally { pool.shutdownNow(); }
        String oid=order.path("_id").asText();assertEquals(oid,same.path("_id").asText());assertEquals(750.5,order.path("valor_total").asDouble());
        assertEquals(1,store.count(ORDERS,new Document("orcamento",id(quoteId))));
        assertEquals("aceito",store.require(QUOTES,quoteId).getString("status"));
        request("PATCH","/api/orcamentos/"+quoteId+"/recusar",null,a.token(),409);
        request("GET","/api/pedidos/"+oid,null,b.token(),403); request("GET","/api/pedidos/"+oid,null,p.token(),200);
        assertEquals(1,request("GET","/api/pedidos/recebidos",null,p.token(),200).path("total").asInt());
        assertEquals(0,request("GET","/api/pedidos/recebidos",null,q.token(),200).path("total").asInt());
        request("PATCH","/api/pedidos/"+oid+"/concluir",null,b.token(),409);
        var review=Map.of("pedido_id",oid,"servico_id",sid,"nota",5,"comentario","Tudo entregue conforme combinado.");
        request("POST","/api/avaliacoes",review,a.token(),403);
        request("PATCH","/api/pedidos/"+oid+"/concluir",null,a.token(),200);request("PATCH","/api/pedidos/"+oid+"/concluir",null,a.token(),409);
        var badReview=new HashMap<String,Object>(review);badReview.put("servico_id",extra.path("_id").asText());
        request("POST","/api/avaliacoes",badReview,a.token(),400);
        request("POST","/api/avaliacoes",review,a.token(),201);request("POST","/api/avaliacoes",review,a.token(),409);
        assertTrue(request("GET","/api/pedidos",null,a.token(),200).path("resultados").get(0).path("avaliado").asBoolean());
        assertEquals(5,request("GET","/api/avaliacoes/servico/"+sid,null,null,200).path("media").asDouble());
        String rejected=request("POST","/api/orcamentos",input,a.token(),201).path("_id").asText();
        request("PATCH","/api/orcamentos/"+rejected+"/recusar",null,q.token(),409);
        request("PATCH","/api/orcamentos/"+rejected+"/recusar",null,p.token(),200);
        request("POST","/api/orcamentos/"+rejected+"/aceitar",null,a.token(),409);
        request("PATCH","/api/servicos/"+sid,Map.of("ativo",false),p.token(),200);
        request("POST","/api/orcamentos",input,a.token(),404);request("GET","/api/servicos/"+sid,null,null,404);
        request("GET","/api/orcamentos?limit=99999",null,a.token(),400);
        request("POST","/api/orcamentos/id-invalido/aceitar",null,a.token(),400);
    }
    @Test void validationSecurityAndLegacyCompatibility() throws Exception {
        request("GET","/health",null,null,200);
        request("GET","/api/rota-inexistente",null,null,404);
        request("GET","/api/auth/me",null,null,401);request("GET","/api/auth/me",null,"token-falso",401);
        request("POST","/api/auth/login",Map.of("email",Map.of("$ne",""),"senha","teste"),null,400);
        request("GET","/api/servicos?limit=-1",null,null,400);request("GET","/api/servicos?page=abc",null,null,400);
        request("GET","/api/servicos/id-invalido",null,null,400);request("GET","/api/servicos?busca%5B%24ne%5D=x",null,null,400);
        request("POST","/api/auth/login",Map.of("email","none@example.invalid","senha","a".repeat(33000)),null,413);
        var a=register("Perfil protegido","cliente");
        request("GET","/api/usuarios",null,a.token(),403);request("GET","/api/pedidos/todos",null,a.token(),403);
        request("PATCH","/api/usuarios/"+a.id(),Map.of("tipo","admin","senha","mudar"),a.token(),200);
        assertEquals("cliente",store.require(USERS,a.id()).getString("tipo"));
        request("PATCH","/api/usuarios/"+a.id(),Map.of("perfil_freelancer",Map.of("portfolio_url","javascript:alert(1)")),a.token(),400);
        String expired=encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),JwtClaimsSet.builder().claim("id",a.id()).issuedAt(Instant.now().minusSeconds(600)).expiresAt(Instant.now().minusSeconds(300)).build())).getTokenValue();
        request("GET","/api/auth/me",null,expired,401);
        // Simulate an existing bcryptjs $2b$ hash and a legacy JWT containing only the id claim.
        String hash=passwords.encode("SenhaLegada123!").replaceFirst("\\$2a\\$","\\$2b\\$");
        var legacy=new Document("nome","Conta legada").append("email","legacy@example.invalid").append("senha",hash).append("tipo","cliente");
        store.insert(USERS,legacy);
        var login=request("POST","/api/auth/login",Map.of("email","legacy@example.invalid","senha","SenhaLegada123!"),null,200);
        assertEquals(legacy.getObjectId("_id").toHexString(),login.path("usuario").path("_id").asText());
        String legacyToken=encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),JwtClaimsSet.builder().claim("id",a.id()).expiresAt(Instant.now().plusSeconds(300)).build())).getTokenValue();
        request("GET","/api/auth/me",null,legacyToken,200);
    }
    @Test void legacyOrdersPaymentsAndAdminRoutes() throws Exception {
        var c=register("Cliente pagamentos","cliente");var p=register("Profissional pagamentos","freelancer");var other=register("Outra conta pagamentos","cliente");
        String adminId=new ObjectId().toHexString();
        store.insert(USERS,new Document("_id",id(adminId)).append("nome","Admin teste").append("email","admin-test@example.invalid").append("senha",passwords.encode("Teste123!")).append("tipo","admin"));
        String admin=request("POST","/api/auth/login",Map.of("email","admin-test@example.invalid","senha","Teste123!"),null,200).path("token").asText();
        request("GET","/api/usuarios",null,admin,200);
        var s=request("POST","/api/servicos",Map.of("titulo","Serviço pagamento","descricao","Registro de demonstração de pagamento.","preco",35.5,"categoria","Outro"),p.token(),201);
        String sid=s.path("_id").asText();
        request("PATCH","/api/servicos/"+sid,Map.of("preco",1),other.token(),403);
        var o=request("POST","/api/pedidos",Map.of("itens",List.of(Map.of("servico",sid,"quantidade",2,"preco_unitario",0.01))),c.token(),201);
        String oid=o.path("_id").asText();assertEquals(71,o.path("valor_total").asDouble());
        request("POST","/api/pagamentos",Map.of("pedido_id",oid,"metodo","pix"),other.token(),404);
        var payment=request("POST","/api/pagamentos",Map.of("pedido_id",oid,"metodo","pix","valor",0.01),c.token(),201);
        assertEquals(71,payment.path("valor").asDouble());
        request("GET","/api/pagamentos/pedido/"+oid,null,other.token(),403);
        assertEquals(1,request("GET","/api/pagamentos/pedido/"+oid,null,c.token(),200).size());
        String pid=payment.path("_id").asText();
        request("PATCH","/api/pagamentos/"+pid+"/status",Map.of("status","concluido"),c.token(),403);
        request("PATCH","/api/pagamentos/"+pid+"/status",Map.of("status","concluido"),admin,200);
        request("PATCH","/api/pedidos/"+oid+"/status",Map.of("status","invalido"),admin,400);
        request("PATCH","/api/pedidos/"+oid+"/status",Map.of("status","concluido"),admin,200);
        request("GET","/api/pedidos/todos",null,admin,200);
        request("DELETE","/api/servicos/"+sid,null,p.token(),204);
        request("DELETE","/api/usuarios/"+other.id(),null,admin,204);
    }
    @AfterAll void cleanup() {
        assertTrue(DATABASE.matches("serv_test_spring_[a-f0-9]{20}"));assertEquals(DATABASE,mongo.getDb().getName());
        mongo.getDb().drop();
        System.out.println("PASS: "+checks+" requisições verificadas com MongoDB real. Banco temporário removido.");
    }
}
