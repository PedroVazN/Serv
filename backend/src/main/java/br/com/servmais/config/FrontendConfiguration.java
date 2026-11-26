package br.com.servmais.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.config.annotation.*;
import java.nio.file.*;

@Configuration
@ConditionalOnProperty(name="serv.serve-frontend",havingValue="true")
public class FrontendConfiguration implements WebMvcConfigurer {
    private final Path frontend;
    public FrontendConfiguration(@Value("${serv.frontend-path}") String path) {
        frontend=Path.of(path).toAbsolutePath().normalize();
        if(!Files.isRegularFile(frontend.resolve("index.html"))) throw new IllegalStateException("Build React ausente. Execute npm run build no frontend.");
    }
    @Override public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/Assets/**").addResourceLocations(frontend.resolve("Assets").toUri().toString());
        registry.addResourceHandler("/bundles/**").addResourceLocations(frontend.resolve("bundles").toUri().toString());
    }
    @Controller
    @ConditionalOnProperty(name="serv.serve-frontend",havingValue="true")
    static class Spa {
        private final Resource index;
        Spa(@Value("${serv.frontend-path}") String path) { index=new FileSystemResource(Path.of(path).toAbsolutePath().normalize().resolve("index.html")); }
        @GetMapping(value={"/","/login","/servicos","/servicos/{id}","/profissionais/{id}","/freelancers","/painel","/skillpods","/contratar","/{path:^(?!api$|health$|Assets$|bundles$).+}"},produces=MediaType.TEXT_HTML_VALUE)
        ResponseEntity<Resource> index() { return ResponseEntity.ok().cacheControl(CacheControl.noStore()).contentType(MediaType.TEXT_HTML).body(index); }
    }
}
