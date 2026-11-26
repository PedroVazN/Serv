package br.com.servmais.api;

public class ApiException extends RuntimeException {
    private final int status;
    public ApiException(int status, String message) { super(message); this.status = status; }
    public int status() { return status; }
    public static ApiException bad(String message) { return new ApiException(400, message); }
    public static ApiException missing(String message) { return new ApiException(404, message); }
    public static ApiException denied() { return new ApiException(403, "Permissão insuficiente."); }
    public static ApiException conflict(String message) { return new ApiException(409, message); }
}
