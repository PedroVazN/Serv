package br.com.servmais.api;

import br.com.servmais.security.CurrentUser;
import br.com.servmais.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/avaliacoes")
public class ReviewController {
    private final ReviewService reviews;
    public ReviewController(ReviewService reviews) { this.reviews=reviews; }
    @GetMapping("/servico/{id}") Map<String,Object> list(@PathVariable String id) { return reviews.list(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    Map<String,Object> create(@AuthenticationPrincipal CurrentUser user,@Valid @RequestBody Requests.ReviewInput body) { return reviews.create(user,body); }
}
