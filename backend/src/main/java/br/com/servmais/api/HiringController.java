package br.com.servmais.api;

import br.com.servmais.security.CurrentUser;
import br.com.servmais.service.HiringService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/orcamentos")
public class HiringController {
    private final HiringService hiring;
    public HiringController(HiringService hiring) { this.hiring=hiring; }
    @GetMapping Map<String,Object> list(@AuthenticationPrincipal CurrentUser user,@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="20") int limit) { return hiring.list(user,page,limit); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    Map<String,Object> create(@AuthenticationPrincipal CurrentUser user,@Valid @RequestBody Requests.QuoteInput body) { return hiring.create(user,body); }
    @PatchMapping("/{id}/responder") Map<String,Object> respond(@AuthenticationPrincipal CurrentUser user,@PathVariable String id,@Valid @RequestBody Requests.Proposal body) { return hiring.respond(user,id,body); }
    @PostMapping("/{id}/aceitar") Map<String,Object> accept(@AuthenticationPrincipal CurrentUser user,@PathVariable String id) { return hiring.accept(user,id); }
    @PatchMapping("/{id}/recusar") Map<String,Object> decline(@AuthenticationPrincipal CurrentUser user,@PathVariable String id) { return hiring.decline(user,id); }
}
