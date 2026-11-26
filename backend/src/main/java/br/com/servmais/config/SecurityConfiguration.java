package br.com.servmais.config;

import br.com.servmais.repository.MongoStore;
import br.com.servmais.security.CurrentUser;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;
import java.util.*;

@Configuration
public class SecurityConfiguration {
    public static void jsonError(HttpServletResponse response, int status, String message) throws java.io.IOException {
        response.setStatus(status); response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"erro\":\""+message+"\"}");
    }
    @Bean PasswordEncoder passwords() { return new BCryptPasswordEncoder(12); }
    @Bean CorsConfigurationSource cors(@Value("${serv.cors-origins}") String origins) {
        var c=new CorsConfiguration();
        c.setAllowedOrigins(Arrays.stream(origins.split(",")).map(String::trim).filter(s->!s.isBlank()).toList());
        c.setAllowedMethods(List.of("GET","POST","PATCH","DELETE","OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization","Content-Type")); c.setExposedHeaders(List.of("RateLimit","Retry-After"));
        var source=new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/**",c); return source;
    }
    @Bean
    SecurityFilterChain security(HttpSecurity http, MongoStore store) throws Exception {
        http.csrf(c->c.disable()).cors(c->{})
            .sessionManagement(c->c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(c->c.disable()).httpBasic(c->c.disable())
            .headers(h->h.contentSecurityPolicy(c->c.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'")))
            .authorizeHttpRequests(a->a
                .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers(HttpMethod.POST,"/api/auth/login","/api/auth/registro").permitAll()
                .requestMatchers(HttpMethod.GET,"/api/usuarios/freelancers","/api/usuarios/freelancers/*","/api/avaliacoes/servico/*").permitAll()
                .requestMatchers(HttpMethod.GET,"/api/servicos/meus").hasAnyRole("freelancer","admin")
                .requestMatchers(HttpMethod.GET,"/api/servicos","/api/servicos/*").permitAll()
                .requestMatchers(HttpMethod.GET,"/api/usuarios","/api/pedidos/todos").hasRole("admin")
                .requestMatchers(HttpMethod.DELETE,"/api/usuarios/*").hasRole("admin")
                .requestMatchers(HttpMethod.PATCH,"/api/pedidos/*/status","/api/pagamentos/*/status").hasRole("admin")
                .requestMatchers(HttpMethod.GET,"/api/pedidos/recebidos").hasRole("freelancer")
                .requestMatchers(HttpMethod.POST,"/api/servicos").hasAnyRole("freelancer","admin")
                .requestMatchers(HttpMethod.PATCH,"/api/servicos/*").hasAnyRole("freelancer","admin")
                .requestMatchers(HttpMethod.DELETE,"/api/servicos/*").hasAnyRole("freelancer","admin")
                .requestMatchers(HttpMethod.POST,"/api/orcamentos","/api/orcamentos/*/aceitar").hasRole("cliente")
                .requestMatchers(HttpMethod.PATCH,"/api/orcamentos/*/responder").hasRole("freelancer")
                .requestMatchers(HttpMethod.PATCH,"/api/orcamentos/*/recusar").hasAnyRole("cliente","freelancer")
                .requestMatchers(HttpMethod.PATCH,"/api/pedidos/*/concluir").hasRole("cliente")
                .requestMatchers("/api/auth/me","/api/usuarios","/api/usuarios/*","/api/servicos/**",
                    "/api/pedidos","/api/pedidos/**","/api/orcamentos","/api/orcamentos/**",
                    "/api/avaliacoes","/api/pagamentos","/api/pagamentos/**").authenticated()
                .anyRequest().permitAll())
            .exceptionHandling(c->c.authenticationEntryPoint((req,res,e)->jsonError(res,401,"Token não fornecido ou inválido."))
                .accessDeniedHandler((req,res,e)->jsonError(res,403,"Permissão insuficiente.")))
            .oauth2ResourceServer(c->c
                .authenticationEntryPoint((req,res,e)->jsonError(res,401,"Token inválido ou expirado."))
                .jwt(j->j.jwtAuthenticationConverter(jwt->{
                    String id=jwt.getClaimAsString("id");
                    if(id==null || !id.matches("[a-fA-F0-9]{24}")) throw new OAuth2AuthenticationException(new OAuth2Error("invalid_token"));
                    var user=store.find(MongoStore.USERS,new org.bson.Document("_id",MongoStore.id(id)));
                    if(user==null) throw new OAuth2AuthenticationException(new OAuth2Error("invalid_token"));
                    return new UsernamePasswordAuthenticationToken(new CurrentUser(user),null,List.of(new SimpleGrantedAuthority("ROLE_"+user.getString("tipo"))));
                })));
        return http.build();
    }
}
