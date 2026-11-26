package br.com.servmais.service;

import br.com.servmais.api.*;
import br.com.servmais.repository.MongoStore;
import br.com.servmais.security.CurrentUser;
import com.mongodb.client.MongoClient;
import org.bson.Document;
import org.springframework.stereotype.Service;
import java.util.*;
import static br.com.servmais.repository.MongoStore.*;

/** Legacy payment records only: no real payment provider or charge is executed. */
@Service
public class PaymentService {
    private static final Set<String> METHODS=Set.of("cartao_credito","boleto","pix","paypal","credito_plataforma","transferencia");
    private static final Set<String> STATUSES=Set.of("pendente","processando","concluido","cancelado","reembolsado");
    private final MongoStore store; private final Views views; private final OrderService orders; private final MongoClient client;
    public PaymentService(MongoStore store,Views views,OrderService orders,MongoClient client) { this.store=store;this.views=views;this.orders=orders;this.client=client; }
    public Map<String,Object> create(CurrentUser actor,Requests.PaymentInput input) {
        if(!METHODS.contains(input.metodo())) throw ApiException.bad("Método inválido.");
        var orderId=id(input.pedido_id());
        try(var session=client.startSession()) {
            var payment=session.withTransaction(()->{
                var order=store.find(session,ORDERS,new Document("_id",orderId).append("cliente",actor.id()));
                if(order==null) throw ApiException.missing("Pedido não encontrado.");
                if(!Set.of("pendente","em_andamento").contains(order.getString("status"))) throw ApiException.conflict("Pedido não disponível para pagamento.");
                Date now=new Date();
                var created=new Document("pedido",orderId).append("metodo",input.metodo()).append("valor",order.get("valor_total"))
                    .append("status","processando").append("data",now).append("data_atualizacao",now);
                store.update(session,ORDERS,new Document("_id",orderId),new Document("status","em_andamento").append("data_atualizacao",now));
                return store.insert(session,PAYMENTS,created);
            });
            return views.json(payment);
        }
    }
    public List<?> list(CurrentUser actor,String orderId) {
        var order=orders.owned(actor,orderId,true);
        return store.list(PAYMENTS,new Document("pedido",order.get("_id")),new Document("data",-1),1,100).stream().map(d->{
            var copy=new Document(d); copy.put("pedido",new Document("_id",order.get("_id")).append("status",order.get("status")).append("valor_total",order.get("valor_total")));return views.json(copy);
        }).toList();
    }
    public Map<String,Object> status(String paymentId,String status) {
        if(!STATUSES.contains(status)) throw ApiException.bad("Status inválido.");
        var payment=store.update(PAYMENTS,new Document("_id",id(paymentId)),new Document("status",status).append("data_atualizacao",new Date()));
        if(payment==null) throw ApiException.missing("Pagamento não encontrado."); return views.json(payment);
    }
}
