package com.mycompany.interfaceserv;

public class Pedido {
    String id_cliente, data_pedido, status;

    public String getId_cliente() {
        return id_cliente;
    }

    public void setId_cliente(String id_cliente) {
        this.id_cliente = id_cliente;
    }

    public String getData_pedido() {
        return data_pedido;
    }

    public void setData_pedido(String data_pedido) {
        this.data_pedido = data_pedido;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String status() {
        return "ID Cliente: " + this.id_cliente +
               "\nData do Pedido: " + this.data_pedido +
               "\nStatus: " + this.status +
               "\n";
    }
}