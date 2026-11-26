package br.com.servmais.service;

import br.com.servmais.repository.MongoStore;
import org.bson.Document;
import org.bson.types.*;
import org.springframework.stereotype.Component;
import java.util.*;

/** Explicit public projections; BSON IDs/dates retain the JSON contract of the React client. */
@Component
public class Views {
    private final MongoStore store;
    public Views(MongoStore store) { this.store=store; }
    public Map<String,Object> json(Document doc) {
        if(doc==null) return null;
        Map<String,Object> result=new LinkedHashMap<>();
        doc.forEach((key,value)->{ if(!Set.of("senha","__v","_class").contains(key)) result.put(key,convert(value)); });
        return result;
    }
    private Object convert(Object v) {
        if(v instanceof ObjectId id) return id.toHexString();
        if(v instanceof Date date) return date.toInstant().toString();
        if(v instanceof Decimal128 decimal) return decimal.bigDecimalValue();
        if(v instanceof Document doc) return json(doc);
        if(v instanceof List<?> list) return list.stream().map(this::convert).toList();
        return v;
    }
    public Document person(Object value, boolean profile) {
        if(!(value instanceof ObjectId id)) return null;
        Document user=store.find(MongoStore.USERS,new Document("_id",id));
        if(user==null) return null;
        var result=new Document("_id",id).append("nome",user.getString("nome"));
        if(profile && user.containsKey("perfil_freelancer")) result.put("perfil_freelancer",user.get("perfil_freelancer"));
        return result;
    }
    public Map<String,Object> publicPerson(Document user) {
        var d=new Document("_id",user.get("_id")).append("nome",user.get("nome"));
        if(user.containsKey("perfil_freelancer")) d.put("perfil_freelancer",user.get("perfil_freelancer"));
        return json(d);
    }
    public Map<String,Object> service(Document d) { var copy=new Document(d); copy.put("usuario",person(d.get("usuario"),true)); return json(copy); }
    public Map<String,Object> quote(Document d) {
        var copy=new Document(d); copy.put("cliente",person(d.get("cliente"),false)); copy.put("profissional",person(d.get("profissional"),false)); return json(copy);
    }
    public Map<String,Object> order(Document d, ObjectId viewer) {
        var copy=new Document(d);
        copy.put("cliente",person(d.get("cliente"),false));
        if(d.containsKey("profissional")) copy.put("profissional",person(d.get("profissional"),false));
        List<Document> items=d.getList("itens",Document.class,List.of());
        copy.put("itens",items.stream().map(item->{
            var out=new Document(item); var service=store.find(MongoStore.SERVICES,new Document("_id",item.get("servico")));
            out.put("servico",service==null ? null : new Document("_id",service.get("_id")).append("titulo",service.get("titulo")).append("preco",service.get("preco")));
            return out;
        }).toList());
        if(viewer!=null) copy.put("avaliado",store.count(MongoStore.REVIEWS,new Document("pedido",d.get("_id")).append("avaliador",viewer))>0);
        return json(copy);
    }
    public Map<String,Object> page(long total,int page,List<?> results) { return Map.of("total",total,"pagina",page,"resultados",results); }
}
