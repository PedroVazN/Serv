package br.com.servmais.security;

import org.bson.Document;
import org.bson.types.ObjectId;

public record CurrentUser(Document document) {
    public ObjectId id() { return document.getObjectId("_id"); }
    public String role() { return document.getString("tipo"); }
    public boolean admin() { return "admin".equals(role()); }
}
