package br.com.servmais.security;

import br.com.servmais.config.SecurityConfiguration;
import com.fasterxml.jackson.databind.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/** Bounded body/query validation and local IP limits. Never trust arbitrary forwarded headers. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE+10)
public class RequestGuard extends OncePerRequestFilter {
    private static final int MAX_BODY=32768, MAX_BUCKETS=10000;
    private final ObjectMapper mapper;
    private final boolean limitEnabled;
    private final ConcurrentHashMap<String, Bucket> buckets=new ConcurrentHashMap<>();
    public RequestGuard(ObjectMapper mapper,@Value("${serv.rate-limit.enabled}") boolean enabled) { this.mapper=mapper; limitEnabled=enabled; }
    @Override protected boolean shouldNotFilter(HttpServletRequest r) { return !r.getRequestURI().startsWith("/api/") || "OPTIONS".equals(r.getMethod()); }
    @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
        if(limitEnabled && (!allowed(req.getRemoteAddr(),60000,300,res) ||
            (req.getRequestURI().startsWith("/api/auth/") && !allowed("auth:"+req.getRemoteAddr(),900000,60,res)))) return;
        for(var e:req.getParameterMap().entrySet()) {
            String key=e.getKey(); String[] values=e.getValue();
            if(unsafeKey(key) || key.contains("[") || values.length!=1 || values[0].length()>200) { fail(res,400,"Consulta inválida."); return; }
            if(Set.of("page","limit").contains(key)) {
                try { long n=Long.parseLong(values[0]); if(!values[0].matches("[0-9]+") || n<1 || n>(key.equals("limit")?100:100000)) throw new NumberFormatException(); }
                catch(NumberFormatException ex) { fail(res,400,"Paginação inválida."); return; }
            }
        }
        byte[] body=req.getInputStream().readNBytes(MAX_BODY+1);
        if(body.length>MAX_BODY) { fail(res,413,"Corpo da requisição muito grande."); return; }
        if(body.length>0) {
            if(req.getContentType()==null || !req.getContentType().toLowerCase(Locale.ROOT).startsWith("application/json")) { fail(res,415,"Envie JSON."); return; }
            try { var json=mapper.readTree(body); if(!json.isObject() || unsafe(json)) { fail(res,400,"Parâmetros inválidos."); return; } }
            catch(Exception e) { fail(res,400,"JSON inválido."); return; }
        }
        chain.doFilter(new BodyRequest(req,body),res);
    }
    private static boolean unsafeKey(String k) { return k.startsWith("$") || k.contains(".") || Set.of("__proto__","constructor","prototype").contains(k); }
    private static boolean unsafe(JsonNode node) {
        if(node.isObject()) { var fields=node.fields(); while(fields.hasNext()) { var e=fields.next(); if(unsafeKey(e.getKey()) || unsafe(e.getValue())) return true; } }
        else if(node.isArray()) for(JsonNode child:node) if(unsafe(child)) return true;
        return false;
    }
    private boolean allowed(String key,long window,int limit,HttpServletResponse res) throws IOException {
        long now=System.currentTimeMillis();
        if(buckets.size()>=MAX_BUCKETS) { buckets.entrySet().removeIf(e->e.getValue().expires<=now); if(!buckets.containsKey(key) && buckets.size()>=MAX_BUCKETS) { fail(res,429,"Muitas tentativas. Aguarde."); return false; } }
        var bucket=buckets.compute(key,(k,b)->b==null || b.expires<=now ? new Bucket(now+window) : b);
        synchronized(bucket) {
            bucket.count++;
            res.setHeader("RateLimit","limit="+limit+", remaining="+Math.max(0,limit-bucket.count)+", reset="+Math.max(1,(bucket.expires-now+999)/1000));
            if(bucket.count>limit) { res.setHeader("Retry-After",Long.toString(Math.max(1,(bucket.expires-now+999)/1000))); fail(res,429,"Muitas tentativas. Aguarde."); return false; }
        }
        return true;
    }
    private static void fail(HttpServletResponse res,int status,String message) throws IOException { SecurityConfiguration.jsonError(res,status,message); }
    private static final class Bucket { final long expires; int count; Bucket(long expires) { this.expires=expires; } }
    private static final class BodyRequest extends HttpServletRequestWrapper {
        private final byte[] bytes;
        BodyRequest(HttpServletRequest req,byte[] bytes) { super(req); this.bytes=bytes; }
        @Override public ServletInputStream getInputStream() {
            var in=new ByteArrayInputStream(bytes);
            return new ServletInputStream() {
                @Override public int read() { return in.read(); }
                @Override public boolean isFinished() { return in.available()==0; }
                @Override public boolean isReady() { return true; }
                @Override public void setReadListener(ReadListener listener) { throw new UnsupportedOperationException(); }
            };
        }
        @Override public BufferedReader getReader() { return new BufferedReader(new InputStreamReader(getInputStream(),StandardCharsets.UTF_8)); }
    }
}
