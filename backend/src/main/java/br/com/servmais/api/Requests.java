package br.com.servmais.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

/** Request-only DTOs: identity, ownership, totals and state never come from the client. */
public final class Requests {
    private Requests() {}
    public record Registration(@NotBlank @Size(max=120) String nome, @NotBlank @Email @Size(max=254) String email,
        @NotBlank @Size(min=6,max=72) String senha, @Pattern(regexp="cliente|freelancer") String tipo) {}
    public record Login(@NotBlank @Email @Size(max=254) String email, @NotBlank @Size(max=72) String senha) {}
    public record FreelancerProfile(@Size(max=2000) String descricao, @Size(max=120) String area_atuacao,
        @Size(max=2000) String experiencia, @Pattern(regexp="disponivel|indisponivel") String disponibilidade,
        @Size(max=500) String portfolio_url) {}
    public record UserInfo(@Size(max=32) String cpf, @Pattern(regexp="M|F|NB") String genero,
        @Size(max=35) String nascimento, @Size(max=40) String telefone, @Size(max=500) String endereco) {}
    public record ProfilePatch(@Size(min=1,max=120) String nome, @Email @Size(min=3,max=254) String email,
        @Valid UserInfo info, @Valid FreelancerProfile perfil_freelancer) {}
    public record ServiceInput(@NotBlank @Size(max=160) String titulo, @NotBlank @Size(max=4000) String descricao,
        @NotNull @DecimalMin("0") @DecimalMax("1000000") @Digits(integer=7,fraction=2) BigDecimal preco, String categoria) {}
    public record ServicePatch(@Size(min=1,max=160) String titulo, @Size(min=1,max=4000) String descricao,
        @DecimalMin("0") @DecimalMax("1000000") @Digits(integer=7,fraction=2) BigDecimal preco, String categoria, Boolean ativo) {}
    public record QuoteInput(@NotBlank String servico_id, @NotBlank @Size(min=10,max=4000) String descricao) {}
    public record Proposal(@NotNull @DecimalMin("0.01") @DecimalMax("1000000") @Digits(integer=7,fraction=2) BigDecimal valor,
        @NotNull @Min(1) @Max(365) Integer prazo_dias, @NotBlank @Size(min=10,max=4000) String escopo) {}
    public record OrderItem(@NotBlank String servico, @Min(1) @Max(1000000) Integer quantidade) {}
    public record OrderInput(@NotEmpty @Size(max=100) List<@Valid OrderItem> itens) {}
    public record Status(@NotBlank String status) {}
    public record ReviewInput(@NotBlank String pedido_id, @NotBlank String servico_id, @NotNull @DecimalMin("0") @DecimalMax("5") BigDecimal nota,
        @Size(max=2000) String comentario) {}
    public record PaymentInput(@NotBlank String pedido_id, @NotBlank String metodo) {}
}
