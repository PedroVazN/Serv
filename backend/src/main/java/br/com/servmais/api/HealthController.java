package br.com.servmais.api;

import br.com.servmais.repository.MongoStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
public class HealthController {
    private final MongoStore store;
    public HealthController(MongoStore store) { this.store=store; }
    @GetMapping("/health") ResponseEntity<?> health() {
        try { if(store.healthy()) return ResponseEntity.ok(Map.of("status","ok")); }
        catch(Exception ignored) { }
        return ResponseEntity.status(503).body(Map.of("status","unavailable"));
    }
}
