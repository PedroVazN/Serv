package br.com.servmais.service;

import br.com.servmais.api.*;
import br.com.servmais.repository.MongoStore;
import br.com.servmais.security.CurrentUser;
import org.bson.Document;
import org.springframework.stereotype.Service;
import java.util.*;
import static br.com.servmais.repository.MongoStore.*;

@Service
public class ReviewService {
    private final MongoStore store; private final Views views;
    public ReviewService(MongoStore store,Views views) { this.store=store;this.views=views; }
    public Map<String,Object> create(CurrentUser actor,Requests.ReviewInput input) {
        var serviceId=id(input.servico_id());
        var order=store.find(ORDERS,new Document("_id",id(input.pedido_id())).append("cliente",actor.id()).append("status","concluido"));
        if(order==null) throw new ApiException(403,"Só é possível avaliar pedidos concluídos do próprio usuário.");
        if(order.getList("itens",Document.class,List.of()).stream().noneMatch(item->serviceId.equals(item.get("servico")))) throw ApiException.bad("O serviço não pertence ao pedido.");
        Date now=new Date();
        var review=new Document("pedido",order.get("_id")).append("servico",serviceId).append("avaliador",actor.id()).append("nota",input.nota().doubleValue())
            .append("comentario",input.comentario()==null?"":input.comentario()).append("data_criacao",now).append("updatedAt",now);
        return views.json(store.insert(REVIEWS,review));
    }
    public Map<String,Object> list(String serviceId) {
        var filter=new Document("servico",id(serviceId));
        var reviews=store.list(REVIEWS,filter,new Document("data_criacao",-1),1,100);
        var stats=store.collection(REVIEWS).aggregate(List.of(new Document("$match",filter),
            new Document("$group",new Document("_id",null).append("media",new Document("$avg","$nota")).append("total",new Document("$sum",1))))).first();
        double mean=stats==null?0:((Number)stats.get("media")).doubleValue();
        var list=reviews.stream().map(d->{ var copy=new Document(d);copy.put("avaliador",views.person(d.get("avaliador"),false));return views.json(copy); }).toList();
        return Map.of("media",Math.round(mean*10)/10.0,"total",stats==null?0:stats.get("total"),"avaliacoes",list);
    }
}
