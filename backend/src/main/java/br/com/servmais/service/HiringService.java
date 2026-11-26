package br.com.servmais.service;

import br.com.servmais.api.*;
import br.com.servmais.repository.MongoStore;
import br.com.servmais.security.CurrentUser;
import com.mongodb.client.MongoClient;
import org.bson.Document;
import org.springframework.stereotype.Service;
import java.util.*;
import static br.com.servmais.repository.MongoStore.*;

@Service
public class HiringService {
    private final MongoStore store; private final Views views; private final MongoClient client;
    public HiringService(MongoStore store,Views views,MongoClient client) { this.store=store;this.views=views;this.client=client; }
    public Map<String,Object> list(CurrentUser actor,int page,int limit) {
        var filter=actor.admin()?new Document():new Document(actor.role().equals("freelancer")?"profissional":"cliente",actor.id());
        return views.page(store.count(QUOTES,filter),page,store.list(QUOTES,filter,new Document("createdAt",-1).append("_id",-1),page,limit).stream().map(views::quote).toList());
    }
    public Map<String,Object> create(CurrentUser actor,Requests.QuoteInput input) {
        if(input.descricao().trim().length()<10) throw ApiException.bad("Descreva o projeto em 10 a 4000 caracteres.");
        var service=store.find(SERVICES,new Document("_id",id(input.servico_id())).append("ativo",true));
        var professional=service==null?null:store.find(USERS,new Document("_id",service.get("usuario")).append("tipo","freelancer"));
        if(professional==null || "indisponivel".equals(professional.get("perfil_freelancer",new Document()).getString("disponibilidade")))
            throw ApiException.missing("Este serviço não está disponível para orçamento.");
        Date now=new Date();
        var quote=new Document("cliente",actor.id()).append("profissional",professional.get("_id")).append("servico",service.get("_id"))
            .append("titulo_servico",service.get("titulo")).append("descricao",input.descricao().trim()).append("status","solicitado").append("createdAt",now).append("updatedAt",now);
        return views.json(store.insert(QUOTES,quote));
    }
    public Map<String,Object> respond(CurrentUser actor,String quoteId,Requests.Proposal input) {
        if(input.escopo().trim().length()<10) throw ApiException.bad("Escopo deve ter de 10 a 4000 caracteres.");
        var proposal=new Document("valor",input.valor().doubleValue()).append("prazo_dias",input.prazo_dias()).append("escopo",input.escopo().trim());
        var quote=store.update(QUOTES,new Document("_id",id(quoteId)).append("profissional",actor.id()).append("status","solicitado"),
            new Document("status","respondido").append("proposta",proposal).append("updatedAt",new Date()));
        if(quote==null) throw ApiException.conflict("Orçamento indisponível para resposta nesta conta ou já respondido."); return views.json(quote);
    }
    public Map<String,Object> accept(CurrentUser actor,String quoteId) {
        var oid=id(quoteId);
        // Mongo driver retries transient transaction/commit failures. Unique quote index prevents duplicates across instances.
        try(var session=client.startSession()) {
            var order=session.withTransaction(()->{
                var quote=store.find(session,QUOTES,new Document("_id",oid).append("cliente",actor.id()));
                if(quote==null || !Set.of("respondido","aceito").contains(quote.getString("status"))) throw ApiException.conflict("Orçamento indisponível para aceite.");
                if("aceito".equals(quote.getString("status"))) {
                    var existing=store.find(session,ORDERS,new Document("orcamento",oid));
                    if(existing==null) throw new IllegalStateException("Pedido ausente para orçamento aceito.");
                    return existing;
                }
                Date now=new Date();
                store.update(session,QUOTES,new Document("_id",oid).append("status","respondido"),new Document("status","aceito").append("updatedAt",now));
                var proposal=quote.get("proposta",Document.class);
                var item=new Document("_id",new org.bson.types.ObjectId()).append("servico",quote.get("servico")).append("quantidade",1).append("preco_unitario",proposal.get("valor"));
                var created=new Document("cliente",actor.id()).append("profissional",quote.get("profissional")).append("orcamento",oid)
                    .append("itens",List.of(item)).append("escopo",proposal.get("escopo")).append("prazo_dias",proposal.get("prazo_dias"))
                    .append("status","em_andamento").append("valor_total",proposal.get("valor")).append("data_pedido",now).append("data_atualizacao",now);
                return store.insert(session,ORDERS,created);
            });
            return views.json(order);
        }
    }
    public Map<String,Object> decline(CurrentUser actor,String quoteId) {
        boolean professional=actor.role().equals("freelancer");
        var filter=new Document("_id",id(quoteId)).append(professional?"profissional":"cliente",actor.id())
            .append("status",professional?"solicitado":new Document("$in",List.of("solicitado","respondido")));
        var quote=store.update(QUOTES,filter,new Document("status","recusado").append("updatedAt",new Date()));
        if(quote==null) throw ApiException.conflict("Orçamento indisponível para recusa nesta conta."); return views.json(quote);
    }
}
