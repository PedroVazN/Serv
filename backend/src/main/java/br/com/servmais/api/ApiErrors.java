package br.com.servmais.api;

import com.mongodb.MongoException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import java.util.Map;

@RestControllerAdvice
public class ApiErrors {
    static ResponseEntity<Map<String, String>> error(int status, String message) {
        return ResponseEntity.status(status).body(Map.of("erro", message));
    }
    @ExceptionHandler(ApiException.class)
    ResponseEntity<?> api(ApiException e) { return error(e.status(), e.getMessage()); }
    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class})
    ResponseEntity<?> invalid(Exception e) { return error(400, "Dados inválidos. Confira os campos e seus limites."); }
    @ExceptionHandler(DuplicateKeyException.class)
    ResponseEntity<?> duplicate() { return error(409, "Registro já existente."); }
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    ResponseEntity<?> method() { return error(405, "Método não permitido."); }
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    ResponseEntity<?> contentType() { return error(415, "Envie JSON."); }
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    ResponseEntity<?> parameter() { return error(400, "Parâmetro inválido."); }
    @ExceptionHandler({NoResourceFoundException.class, NoHandlerFoundException.class})
    ResponseEntity<?> missing() { return error(404, "Rota não encontrada."); }
    @ExceptionHandler({MongoException.class, DataAccessException.class})
    ResponseEntity<?> database(Exception e) { return error(503, "Banco de dados temporariamente indisponível."); }
    @ExceptionHandler(Exception.class)
    ResponseEntity<?> internal(Exception e) {
        org.slf4j.LoggerFactory.getLogger(ApiErrors.class).error("Falha interna: {}", e.getClass().getSimpleName());
        return error(500, "Erro interno do servidor.");
    }
}
