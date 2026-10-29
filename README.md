# Serv — Plataforma de Serviços Freelancer

Projeto integrado de uma plataforma para conectar clientes e profissionais prestadores de serviços.

![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=fff)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=fff)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=fff)

## Sobre o projeto

O Serv reúne entregas de diferentes disciplinas: interface web, aplicação desktop Java, modelagem de banco de dados e análise de dados. A proposta é permitir o cadastro e a contratação de serviços oferecidos por freelancers.

## Módulos

- Interface web em React, JavaScript e CSS
- Telas de cadastro, login, profissionais e contratação
- Aplicação desktop Java com Swing
- Cadastro de pessoas, serviços e pedidos
- Banco de dados relacional
- Bases CSV e notebook de análise de dados

## Estrutura

```text
.
├── frontend/                # site React + Vite (páginas, componentes e ativos)
├── backend/                 # API Node.js + MongoDB
├── Serv/Assets/             # recursos legados do projeto
├── interfaceServ/           # aplicação Java
├── LINGUAGEM DE PROGRAMACAO/
├── BANCO DE DADOS/          # scripts SQL
└── CIENCIA DE DADOS/        # CSVs e notebook
```

## Como utilizar

### Interface web

O site está implementado em React com Vite. Para executá-lo localmente:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. A interface inclui as páginas inicial, contratação, catálogo de Skill Pods, freelancers e login/cadastro. O login usa a API Node.js descrita abaixo.

### API e execução com Docker

A API fica em `backend/` e usa MongoDB. Configure `backend/.env` com `MONGODB_URI` e `JWT_SECRET` e então execute `docker compose up --build` na raiz do repositório. Sem Docker, rode `npm install` e `npm run dev` dentro de `backend/`.

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
