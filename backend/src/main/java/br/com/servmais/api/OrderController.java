package br.com.servmais.api;

import br.com.servmais.security.CurrentUser;
import br.com.servmais.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class OrderController {
    private final OrderService orders;
    public OrderController(OrderService orders) { this.orders=orders; }
    @GetMapping Map<String,Object> list(@AuthenticationPrincipal CurrentUser user,@RequestParam(required=false) String status,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="20") int limit) { return orders.list(user,status,page,limit,"mine"); }
    @GetMapping("/recebidos") Map<String,Object> received(@AuthenticationPrincipal CurrentUser user,@RequestParam(required=false) String status,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="20") int limit) { return orders.list(user,status,page,limit,"received"); }
    @GetMapping("/todos") Map<String,Object> all(@AuthenticationPrincipal CurrentUser user,@RequestParam(required=false) String status,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="20") int limit) { return orders.list(user,status,page,limit,"all"); }
    @GetMapping("/{id}") Map<String,Object> find(@AuthenticationPrincipal CurrentUser user,@PathVariable String id) { return orders.find(user,id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    Map<String,Object> create(@AuthenticationPrincipal CurrentUser user,@Valid @RequestBody Requests.OrderInput body) { return orders.create(user,body); }
    @PatchMapping("/{id}/concluir") Map<String,Object> complete(@AuthenticationPrincipal CurrentUser user,@PathVariable String id) { return orders.complete(user,id); }
    @PatchMapping("/{id}/status") Map<String,Object> status(@PathVariable String id,@Valid @RequestBody Requests.Status body) { return orders.status(id,body.status()); }
}
