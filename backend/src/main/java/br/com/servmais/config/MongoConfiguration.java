package br.com.servmais.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfiguration {
    @Bean
    MongoClient mongoClient(@Value("${serv.mongodb-uri}") String uri) {
        return MongoClients.create(MongoClientSettings.builder().applyConnectionString(new ConnectionString(uri))
            .applyToClusterSettings(s -> s.serverSelectionTimeout(10, TimeUnit.SECONDS))
            .applyToConnectionPoolSettings(s -> s.maxSize(10)).build());
    }
    @Bean
    MongoDatabaseFactory mongoDatabaseFactory(MongoClient client, @Value("${serv.mongodb-uri}") String uri,
                                             @Value("${serv.mongodb-database}") String override) {
        String database = override.isBlank() ? new ConnectionString(uri).getDatabase() : override;
        if (database == null || database.isBlank()) throw new IllegalStateException("Defina o banco em MONGODB_URI ou MONGODB_DB_NAME.");
        return new SimpleMongoClientDatabaseFactory(client, database);
    }
}
