package com.mycompany.interfaceserv;

public class Servico {
    String id_usuario, titulo, descricao, data_criacao;

    public String getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(String id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getData_criacao() {
        return data_criacao;
    }

    public void setData_criacao(String data_criacao) {
        this.data_criacao = data_criacao;
    }

    public String status() {
        return "ID Usuário: " + this.id_usuario +
                "\nTítulo: " + this.titulo +
                "\nDescrição: " + this.descricao +
                "\nData de Criação: " + this.data_criacao +
                "\n";
    }
}