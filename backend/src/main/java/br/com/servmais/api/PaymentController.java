package br.com.servmais.api;

import br.com.servmais.security.CurrentUser;
import br.com.servmais.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/pagamentos")
public class PaymentController {
    private final PaymentService payments;
    public PaymentController(PaymentService payments) { this.payments=payments; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    Map<String,Object> create(@AuthenticationPrincipal CurrentUser user,@Valid @RequestBody Requests.PaymentInput body) { return payments.create(user,body); }
    @GetMapping("/pedido/{id}") List<?> list(@AuthenticationPrincipal CurrentUser user,@PathVariable String id) { return payments.list(user,id); }
    @PatchMapping("/{id}/status") Map<String,Object> status(@PathVariable String id,@Valid @RequestBody Requests.Status body) { return payments.status(id,body.status()); }
}
