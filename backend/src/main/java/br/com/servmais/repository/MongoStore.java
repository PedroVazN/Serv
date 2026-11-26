package br.com.servmais.repository;

import br.com.servmais.api.ApiException;
import com.mongodb.client.ClientSession;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.stereotype.Repository;
import java.util.*;

/** Explicit collection names and BSON references preserve the existing Mongoose database. */
@Repository
public class MongoStore {
    public static final String USERS="usuarios", SERVICES="servicos", QUOTES="orcamentos", ORDERS="pedidos", REVIEWS="avaliacaos", PAYMENTS="pagamentos";
    private final MongoTemplate mongo;
    public MongoStore(MongoTemplate mongo) { this.mongo = mongo; }
    public static ObjectId id(String id) {
        if (id == null || !id.matches("[a-fA-F0-9]{24}")) throw ApiException.bad("Identificador inválido.");
        return new ObjectId(id);
    }
    public static Document filter(String field, Object value) { return new Document(field, value); }
    public Document find(String collection, Document filter) { return mongo.findOne(new BasicQuery(filter), Document.class, collection); }
    public Document require(String collection, String id) {
        Document found=find(collection, filter("_id", id(id)));
        if (found==null) throw ApiException.missing("Registro não encontrado.");
        return found;
    }
    public List<Document> list(String collection, Document filter, Document sort, int page, int limit) {
        BasicQuery query=new BasicQuery(filter);
        query.setSortObject(sort);
        query.skip((long)(page-1)*limit).limit(limit);
        return mongo.find(query, Document.class, collection);
    }
    public long count(String collection, Document filter) { return mongo.count(new BasicQuery(filter), collection); }
    public Document insert(String collection, Document doc) {
        doc.putIfAbsent("_id", new ObjectId());
        return mongo.insert(doc, collection);
    }
    public Document update(String collection, Document filter, Document fields) {
        Update update=new Update(); fields.forEach(update::set);
        return mongo.findAndModify(new BasicQuery(filter), update, FindAndModifyOptions.options().returnNew(true), Document.class, collection);
    }
    public Document delete(String collection, String id) { return mongo.findAndRemove(new BasicQuery(filter("_id", id(id))), Document.class, collection); }
    public MongoCollection<Document> collection(String name) { return mongo.getCollection(name); }
    public Document find(ClientSession session, String collection, Bson filter) { return collection(collection).find(session, filter).first(); }
    public Document update(ClientSession session, String collection, Bson filter, Document fields) {
        return collection(collection).findOneAndUpdate(session, filter, new Document("$set", fields), new FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER));
    }
    public Document insert(ClientSession session, String collection, Document doc) {
        doc.putIfAbsent("_id", new ObjectId()); collection(collection).insertOne(session, doc); return doc;
    }
    public boolean healthy() { return ((Number)mongo.executeCommand(new Document("ping", 1)).get("ok")).doubleValue() == 1.0; }
}
