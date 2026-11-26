package br.com.servmais.service;

import br.com.servmais.api.*;
import br.com.servmais.repository.MongoStore;
import br.com.servmais.security.CurrentUser;
import org.bson.Document;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;
import static br.com.servmais.repository.MongoStore.*;

@Service
public class OrderService {
    public static final Set<String> STATUSES=Set.of("pendente","em_andamento","concluido","cancelado");
    private final MongoStore store; private final Views views;
    public OrderService(MongoStore store,Views views) { this.store=store;this.views=views; }
    public Map<String,Object> create(CurrentUser actor,Requests.OrderInput input) {
        List<Document> items=new ArrayList<>(); BigDecimal total=BigDecimal.ZERO;
        for(var item:input.itens()) {
            var service=store.find(SERVICES,new Document("_id",id(item.servico())).append("ativo",true));
            if(service==null) throw ApiException.bad("Serviço não encontrado ou inativo.");
            int quantity=item.quantidade()==null?1:item.quantidade();
            BigDecimal price=new BigDecimal(service.get("preco").toString());
            total=total.add(price.multiply(BigDecimal.valueOf(quantity)));
            items.add(new Document("_id",new org.bson.types.ObjectId()).append("servico",service.get("_id")).append("quantidade",quantity).append("preco_unitario",price.doubleValue()));
        }
        if(total.compareTo(new BigDecimal("1000000000"))>0) throw ApiException.bad("Valor total excede o limite.");
        Date now=new Date();
        var order=new Document("cliente",actor.id()).append("itens",items).append("valor_total",total.doubleValue()).append("status","pendente")
            .append("data_pedido",now).append("data_atualizacao",now);
        store.insert(ORDERS,order); return views.order(order,actor.id());
    }
    public Map<String,Object> list(CurrentUser actor,String status,int page,int limit,String mode) {
        var filter=mode.equals("all")?new Document():new Document(mode.equals("received")?"profissional":"cliente",actor.id());
        if(status!=null && !status.isBlank()) { validStatus(status); filter.put("status",status); }
        return views.page(store.count(ORDERS,filter),page,store.list(ORDERS,filter,new Document("data_pedido",-1).append("_id",-1),page,limit).stream().map(d->views.order(d,actor.id())).toList());
    }
    public Map<String,Object> find(CurrentUser actor,String orderId) { return views.order(owned(actor,orderId,false),actor.id()); }
    public Document owned(CurrentUser actor,String orderId,boolean clientOnly) {
        var order=store.require(ORDERS,orderId);
        if(!actor.admin() && !actor.id().equals(order.get("cliente")) && (clientOnly || !actor.id().equals(order.get("profissional")))) throw ApiException.denied();
        return order;
    }
    public Map<String,Object> complete(CurrentUser actor,String orderId) {
        var filter=new Document("_id",id(orderId)).append("cliente",actor.id()).append("orcamento",new Document("$exists",true)).append("status","em_andamento");
        var order=store.update(ORDERS,filter,new Document("status","concluido").append("data_atualizacao",new Date()));
        if(order==null) throw ApiException.conflict("Pedido indisponível para conclusão nesta conta."); return views.json(order);
    }
    public Map<String,Object> status(String orderId,String status) {
        validStatus(status);
        var result=store.update(ORDERS,new Document("_id",id(orderId)),new Document("status",status).append("data_atualizacao",new Date()));
        if(result==null) throw ApiException.missing("Pedido não encontrado."); return views.json(result);
    }
    private void validStatus(String value) { if(!STATUSES.contains(value)) throw ApiException.bad("Status inválido."); }
}
