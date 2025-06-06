
package com.mycompany.interfaceserv;


public class Pessoa {
        String nome, email, senha, sexo, cpf, telefone, endereco, nascimento;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getNascimento() {
        return nascimento;
    }

    public void setNascimento(String nascimento) {
        this.nascimento = nascimento;
    }
    public String status() {
        return "Nome: " + this.nome +
                "\nE-mail: " + this.email +
                "\nCPF: " + this.cpf + 
                "\nTelefone: " + this.telefone + 
                "\nEndereco: " + this.endereco +
                "\nSexo: " + this.sexo +
                "\nNascimento" + this.nascimento +
                "\n"
                ;
    }
}
