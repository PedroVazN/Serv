package br.com.servmais.api;

import br.com.servmais.security.CurrentUser;
import br.com.servmais.service.CatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/servicos")
public class CatalogController {
    private final CatalogService services;
    public CatalogController(CatalogService services) { this.services=services; }
    @GetMapping
    Map<String,Object> list(@RequestParam(required=false) String categoria,@RequestParam(required=false) String busca,@RequestParam(required=false) String profissional,
        @RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="20") int limit) { return services.list(categoria,busca,profissional,page,limit); }
    @GetMapping("/meus") List<?> mine(@AuthenticationPrincipal CurrentUser user) { return services.mine(user); }
    @GetMapping("/{id}") Map<String,Object> find(@PathVariable String id) { return services.find(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    Map<String,Object> create(@AuthenticationPrincipal CurrentUser user,@Valid @RequestBody Requests.ServiceInput body) { return services.create(user,body); }
    @PatchMapping("/{id}") Map<String,Object> update(@AuthenticationPrincipal CurrentUser user,@PathVariable String id,@Valid @RequestBody Requests.ServicePatch body) { return services.update(user,id,body); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@AuthenticationPrincipal CurrentUser user,@PathVariable String id) { services.delete(user,id); }
}
