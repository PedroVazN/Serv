package br.com.servmais.api;

import br.com.servmais.security.CurrentUser;
import br.com.servmais.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AccountController {
    private final AccountService accounts; private final Views views;
    public AccountController(AccountService accounts,Views views) { this.accounts=accounts;this.views=views; }
    @PostMapping("/auth/registro") @ResponseStatus(HttpStatus.CREATED)
    Map<String,Object> register(@Valid @RequestBody Requests.Registration body) { return accounts.register(body); }
    @PostMapping("/auth/login")
    Map<String,Object> login(@Valid @RequestBody Requests.Login body) { return accounts.login(body); }
    @GetMapping("/auth/me")
    Map<String,Object> me(@AuthenticationPrincipal CurrentUser user) { return views.json(user.document()); }
    @GetMapping("/usuarios")
    Map<String,Object> list(@RequestParam(required=false) String tipo,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="20") int limit) {
        return accounts.list(tipo,null,page,limit,false);
    }
    @GetMapping("/usuarios/freelancers")
    Map<String,Object> professionals(@RequestParam(required=false) String area,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="20") int limit) {
        return accounts.list(null,area,page,limit,true);
    }
    @GetMapping("/usuarios/freelancers/{id}") Map<String,Object> publicProfile(@PathVariable String id) { return accounts.publicProfile(id); }
    @GetMapping("/usuarios/{id}") Map<String,Object> find(@AuthenticationPrincipal CurrentUser user,@PathVariable String id) { return accounts.find(user,id); }
    @PatchMapping("/usuarios/{id}") Map<String,Object> update(@AuthenticationPrincipal CurrentUser user,@PathVariable String id,@Valid @RequestBody Requests.ProfilePatch body) { return accounts.update(user,id,body); }
    @DeleteMapping("/usuarios/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) void delete(@PathVariable String id) { accounts.delete(id); }
}
