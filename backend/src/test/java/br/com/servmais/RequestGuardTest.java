package br.com.servmais;

import br.com.servmais.security.RequestGuard;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.*;
import static org.junit.jupiter.api.Assertions.*;

class RequestGuardTest {
    @Test void rateLimitsWithoutTrustingSpoofedForwardedHeaders() throws Exception {
        var guard=new RequestGuard(new ObjectMapper(),true);
        for(int n=0;n<61;n++) {
            var req=new MockHttpServletRequest("POST","/api/auth/login");req.setRemoteAddr("127.0.0.1");req.addHeader("X-Forwarded-For","198.51.100."+n);
            var res=new MockHttpServletResponse();guard.doFilter(req,res,new MockFilterChain());
            assertEquals(n<60?200:429,res.getStatus());
            if(n==60) assertNotNull(res.getHeader("Retry-After"));
        }
    }
    @Test void rejectsNestedNoSqlOperators() throws Exception {
        var guard=new RequestGuard(new ObjectMapper(),false);
        var req=new MockHttpServletRequest("POST","/api/auth/login");req.setContentType("application/json");req.setContent("{\"email\":{\"$ne\":null}}".getBytes());
        var res=new MockHttpServletResponse();guard.doFilter(req,res,new MockFilterChain());assertEquals(400,res.getStatus());
    }
}
