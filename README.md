# Serv — Plataforma de Serviços Freelancer

Projeto integrado de uma plataforma para conectar clientes e profissionais prestadores de serviços.

![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=fff)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=fff)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=fff)

## Sobre o projeto

O Serv reúne entregas de diferentes disciplinas: interface web, aplicação desktop Java, modelagem de banco de dados e análise de dados. A proposta é permitir o cadastro e a contratação de serviços oferecidos por freelancers.

## Módulos

- Interface web em HTML, CSS e JavaScript
- Telas de cadastro, login, profissionais e contratação
- Aplicação desktop Java com Swing
- Cadastro de pessoas, serviços e pedidos
- Banco de dados relacional
- Bases CSV e notebook de análise de dados

## Estrutura

```text
.
├── Serv/                    # interface web
├── interfaceServ/           # aplicação Java
├── LINGUAGEM DE PROGRAMACAO/
├── BANCO DE DADOS/          # scripts SQL
└── CIENCIA DE DADOS/        # CSVs e notebook
```

## Como utilizar

### Interface web

Abra `Serv/index.html` em um navegador.

### Aplicação Java

```bash
cd interfaceServ
mvn clean package
```

Também é possível importar o projeto Maven no NetBeans e executar a classe principal.

### Banco de dados

Execute `BANCO DE DADOS/QueryCreateInsert.sql` em um servidor MySQL.

### Análise de dados

Abra `CIENCIA DE DADOS/NOTEBOOKS/Serv_análise.ipynb` no Google Colab ou Jupyter Notebook, mantendo os arquivos CSV disponíveis.

## Contexto acadêmico

Projeto integrado do curso superior de Tecnologia em Análise e Desenvolvimento de Sistemas do SENAI 1.23 — Escola SENAI Armando de Arruda Pereira.

## Autor

Desenvolvido por [Pedro Vaz Nascimento](https://github.com/PedroVazN).
