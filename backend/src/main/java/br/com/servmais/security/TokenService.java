package br.com.servmais.security;

import br.com.servmais.api.ApiException;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.regex.*;

@Service
public class TokenService {
    private final JwtEncoder encoder;
    private final Duration validity;
    public TokenService(JwtEncoder encoder, @Value("${serv.jwt-expires-in}") String expires) {
        this.encoder=encoder;
        Matcher m=Pattern.compile("^(\\d+)([smhd])$").matcher(expires);
        if (!m.matches()) throw new IllegalArgumentException("JWT_EXPIRES_IN deve ser como 30m, 24h ou 7d.");
        long count=Long.parseLong(m.group(1));
        validity=Duration.ofSeconds(count * switch(m.group(2)) { case "m" -> 60; case "h" -> 3600; case "d" -> 86400; default -> 1; });
        if (validity.isZero() || validity.compareTo(Duration.ofDays(30))>0) throw new IllegalArgumentException("Validade JWT fora do intervalo.");
    }
    public String issue(ObjectId id) {
        Instant now=Instant.now();
        var claims=JwtClaimsSet.builder().issuedAt(now).expiresAt(now.plus(validity)).claim("id", id.toHexString()).build();
        return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
    }
    @Configuration
    static class Keys {
        @Bean
        SecretKeySpec jwtKey(@Value("${serv.jwt-secret}") String secret) {
            if (secret.getBytes(StandardCharsets.UTF_8).length<32 || secret.matches("(?i).*your_secret.*|.*change.?me.*"))
                throw new IllegalStateException("Configure JWT_SECRET aleatório com pelo menos 32 bytes.");
            return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        }
        @Bean JwtDecoder jwtDecoder(SecretKeySpec key) { return NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build(); }
        @Bean JwtEncoder jwtEncoder(SecretKeySpec key) { return new NimbusJwtEncoder(new ImmutableSecret<>(key)); }
    }
}
