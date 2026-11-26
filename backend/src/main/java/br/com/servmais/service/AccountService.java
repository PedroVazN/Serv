package br.com.servmais.service;

import br.com.servmais.api.*;
import br.com.servmais.repository.MongoStore;
import br.com.servmais.security.*;
import org.bson.Document;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;
import java.util.regex.Pattern;
import static br.com.servmais.repository.MongoStore.*;

@Service
public class AccountService {
    private final MongoStore store;
    private final Views views;
    private final PasswordEncoder passwords;
    private final TokenService tokens;
    private final String dummyHash;
    public AccountService(MongoStore store,Views views,PasswordEncoder passwords,TokenService tokens) {
        this.store=store;this.views=views;this.passwords=passwords;this.tokens=tokens;
        dummyHash=passwords.encode(UUID.randomUUID().toString());
    }
    public Map<String,Object> register(Requests.Registration input) {
        if(input.senha().getBytes(StandardCharsets.UTF_8).length>72) throw ApiException.bad("Senha deve ter até 72 bytes.");
        String email=input.email().trim().toLowerCase(Locale.ROOT);
        if(store.find(USERS,new Document("email",email))!=null) throw ApiException.conflict("E-mail já cadastrado.");
        Date now=new Date();
        var user=new Document("nome",input.nome().trim()).append("email",email).append("senha",passwords.encode(input.senha()))
            .append("tipo",input.tipo()==null?"cliente":input.tipo()).append("data_criacao",now).append("data_atualizacao",now);
        store.insert(USERS,user); return authenticated(user);
    }
    public Map<String,Object> login(Requests.Login input) {
        var user=store.find(USERS,new Document("email",input.email().trim().toLowerCase(Locale.ROOT)));
        boolean matches=passwords.matches(input.senha(),user==null?dummyHash:user.getString("senha"));
        if(user==null || !matches) throw new ApiException(401,"Credenciais inválidas.");
        return authenticated(user);
    }
    private Map<String,Object> authenticated(Document user) { return Map.of("token",tokens.issue(user.getObjectId("_id")),"usuario",views.json(user)); }
    public Map<String,Object> find(CurrentUser actor,String userId) {
        var oid=id(userId); if(!actor.admin() && !actor.id().equals(oid)) throw ApiException.denied();
        return views.json(store.require(USERS,userId));
    }
    public Map<String,Object> list(String role,String area,int page,int limit,boolean publicOnly) {
        var filter=new Document();
        if(publicOnly) filter.put("tipo","freelancer"); else if(role!=null) filter.put("tipo",role);
        if(publicOnly && area!=null && !area.isBlank()) filter.put("perfil_freelancer.area_atuacao",Pattern.compile(Pattern.quote(area),Pattern.CASE_INSENSITIVE));
        var people=store.list(USERS,filter,new Document("nome",1).append("_id",1),page,limit);
        return views.page(store.count(USERS,filter),page,people.stream().map(d->publicOnly?views.publicPerson(d):views.json(d)).toList());
    }
    public Map<String,Object> publicProfile(String userId) {
        var user=store.find(USERS,new Document("_id",id(userId)).append("tipo","freelancer"));
        if(user==null) throw ApiException.missing("Profissional não encontrado.");
        return views.publicPerson(user);
    }
    public Map<String,Object> update(CurrentUser actor,String userId,Requests.ProfilePatch input) {
        var oid=id(userId); if(!actor.admin() && !actor.id().equals(oid)) throw ApiException.denied();
        var fields=new Document("data_atualizacao",new Date());
        if(input.nome()!=null) { if(input.nome().isBlank()) throw ApiException.bad("Nome obrigatório."); fields.put("nome",input.nome().trim()); }
        if(input.email()!=null) fields.put("email",input.email().trim().toLowerCase(Locale.ROOT));
        if(input.info()!=null) {
            var info=input.info(); var d=new Document();
            put(d,"cpf",info.cpf());put(d,"genero",info.genero());put(d,"telefone",info.telefone());put(d,"endereco",info.endereco());
            if(info.nascimento()!=null && !info.nascimento().isBlank()) {
                try { d.put("nascimento",Date.from(LocalDate.parse(info.nascimento().substring(0,10)).atStartOfDay(ZoneOffset.UTC).toInstant())); }
                catch(Exception e) { throw ApiException.bad("Nascimento inválido."); }
            }
            fields.put("info",d);
        }
        if(input.perfil_freelancer()!=null) {
            var profile=input.perfil_freelancer(); var d=new Document();
            if(profile.portfolio_url()!=null && !profile.portfolio_url().isEmpty()) {
                try { var u=URI.create(profile.portfolio_url()); if(!"https".equalsIgnoreCase(u.getScheme()) || u.getHost()==null || u.getUserInfo()!=null) throw new IllegalArgumentException(); }
                catch(Exception e) { throw ApiException.bad("O portfólio deve usar uma URL HTTPS válida."); }
            }
            put(d,"descricao",profile.descricao());put(d,"area_atuacao",profile.area_atuacao());put(d,"experiencia",profile.experiencia());put(d,"portfolio_url",profile.portfolio_url());
            d.put("disponibilidade",profile.disponibilidade()==null?"disponivel":profile.disponibilidade()); fields.put("perfil_freelancer",d);
        }
        var result=store.update(USERS,new Document("_id",oid),fields);
        if(result==null) throw ApiException.missing("Usuário não encontrado.");
        return views.json(result);
    }
    private static void put(Document d,String k,Object v) { if(v!=null) d.put(k,v); }
    public void delete(String userId) { if(store.delete(USERS,userId)==null) throw ApiException.missing("Usuário não encontrado."); }
}
