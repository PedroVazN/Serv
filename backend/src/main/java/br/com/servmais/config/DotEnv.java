package br.com.servmais.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

/** Local dotenv compatibility. Real environment variables always take precedence. Never logs values. */
public class DotEnv implements EnvironmentPostProcessor {
    public static Map<String,Object> read() {
        var values=new LinkedHashMap<String,Object>();
        for(var path:List.of(Path.of("backend/.env"),Path.of(".env"))) {
            if(!Files.isRegularFile(path)) continue;
            try {
                for(String raw:Files.readAllLines(path,StandardCharsets.UTF_8)) {
                    String line=raw.replace("\uFEFF","").trim();if(line.startsWith("export ")) line=line.substring(7).trim();
                    int split=line.indexOf('=');if(split<1 || line.startsWith("#")) continue;
                    String key=line.substring(0,split).trim(),value=line.substring(split+1).trim();
                    if(!key.matches("[A-Za-z_][A-Za-z0-9_]*")) continue;
                    if(value.length()>=2 && ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'")))) value=value.substring(1,value.length()-1);
                    else { int comment=value.indexOf(" #");if(comment>=0) value=value.substring(0,comment).stripTrailing(); }
                    values.put(key,value);
                }
            } catch(java.io.IOException e) { throw new IllegalStateException("Não foi possível carregar o arquivo .env local."); }
        }
        return values;
    }
    @Override public void postProcessEnvironment(ConfigurableEnvironment environment,SpringApplication app) {
        environment.getPropertySources().addAfter(StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,new MapPropertySource("servLocalDotenv",read()));
    }
}
