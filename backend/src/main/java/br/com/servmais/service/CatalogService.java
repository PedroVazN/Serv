package br.com.servmais.service;

import br.com.servmais.api.*;
import br.com.servmais.repository.MongoStore;
import br.com.servmais.security.CurrentUser;
import org.bson.Document;
import org.springframework.stereotype.Service;
import java.util.*;
import static br.com.servmais.repository.MongoStore.*;

@Service
public class CatalogService {
    static final Set<String> CATEGORIES=Set.of("Web","Design","Marketing","Consultoria","Construção","Reformas","Mobile","Data","Outro");
    private final MongoStore store; private final Views views;
    public CatalogService(MongoStore store,Views views) { this.store=store;this.views=views; }
    public Map<String,Object> list(String category,String search,String professional,int page,int limit) {
        var filter=new Document("ativo",true);
        if(category!=null && !category.isBlank()) filter.put("categoria",category);
        if(professional!=null && !professional.isBlank()) filter.put("usuario",id(professional));
        if(search!=null && !search.isBlank()) filter.put("$text",new Document("$search",search));
        return views.page(store.count(SERVICES,filter),page,store.list(SERVICES,filter,new Document("data_criacao",-1).append("_id",-1),page,limit).stream().map(views::service).toList());
    }
    public Map<String,Object> find(String serviceId) {
        var service=store.find(SERVICES,new Document("_id",id(serviceId)).append("ativo",true));
        if(service==null) throw ApiException.missing("Serviço não encontrado."); return views.service(service);
    }
    public List<?> mine(CurrentUser actor) {
        return store.list(SERVICES,new Document("usuario",actor.id()),new Document("data_criacao",-1),1,100).stream().map(views::json).toList();
    }
    public Map<String,Object> create(CurrentUser actor,Requests.ServiceInput input) {
        String category=input.categoria()==null?"Outro":category(input.categoria()); Date now=new Date();
        var service=new Document("usuario",actor.id()).append("titulo",input.titulo().trim()).append("descricao",input.descricao().trim())
            .append("preco",input.preco().doubleValue()).append("categoria",category).append("ativo",true).append("data_criacao",now).append("data_atualizacao",now);
        return views.json(store.insert(SERVICES,service));
    }
    public Map<String,Object> update(CurrentUser actor,String serviceId,Requests.ServicePatch input) {
        var fields=new Document("data_atualizacao",new Date());
        if(input.titulo()!=null) { if(input.titulo().isBlank()) throw ApiException.bad("Título obrigatório."); fields.put("titulo",input.titulo().trim()); }
        if(input.descricao()!=null) { if(input.descricao().isBlank()) throw ApiException.bad("Descrição obrigatória."); fields.put("descricao",input.descricao()); }
        if(input.preco()!=null) fields.put("preco",input.preco().doubleValue());
        if(input.categoria()!=null) fields.put("categoria",category(input.categoria()));
        if(input.ativo()!=null) fields.put("ativo",input.ativo());
        var updated=store.update(SERVICES,new Document("_id",id(serviceId)).append("usuario",actor.id()),fields);
        if(updated==null) throw ApiException.missing("Serviço não encontrado."); return views.json(updated);
    }
    public void delete(CurrentUser actor,String serviceId) {
        var found=store.find(SERVICES,new Document("_id",id(serviceId)).append("usuario",actor.id()));
        if(found==null) throw ApiException.missing("Serviço não encontrado."); store.delete(SERVICES,serviceId);
    }
    private String category(String value) { if(!CATEGORIES.contains(value)) throw ApiException.bad("Categoria inválida."); return value; }
}
