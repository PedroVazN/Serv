package br.com.servmais.config;

import br.com.servmais.repository.MongoStore;
import org.bson.Document;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import static br.com.servmais.repository.MongoStore.*;

@Component
public class DatabaseIndexes implements ApplicationRunner {
    private final MongoStore store;
    public DatabaseIndexes(MongoStore store) { this.store=store; }
    @Override public void run(ApplicationArguments args) {
        store.collection(USERS).createIndex(new Document("email",1),new IndexOptions().unique(true));
        store.collection(SERVICES).createIndex(new Document("titulo","text").append("descricao","text"));
        store.collection(ORDERS).createIndex(new Document("orcamento",1),new IndexOptions().unique(true).sparse(true));
        store.collection(REVIEWS).createIndex(new Document("pedido",1).append("servico",1),new IndexOptions().unique(true));
        store.collection(QUOTES).createIndex(new Document("cliente",1).append("createdAt",-1));
        store.collection(QUOTES).createIndex(new Document("profissional",1).append("createdAt",-1));
    }
}
