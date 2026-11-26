# SERV+ - Java, Spring Boot e React

Plataforma para conectar clientes e profissionais, negociar orçamentos e acompanhar pedidos.

## Stack ativa

- **Java 21 + Spring Boot 3.5.16:** API REST, Spring Security, JWT HS256, validação de DTOs e Spring Data MongoDB.
- **React 18 + Vite:** site, cadastro/login, diretórios, perfil, serviços e painéis. A identidade visual roxa foi preservada.
- **MongoDB:** mantém as coleções, os ObjectIds e os hashes BCrypt já existentes. Atlas ou MongoDB local com replica set.
- **Maven Wrapper:** compila e testa o backend sem instalar Maven globalmente.

Node.js é utilizado para as ferramentas de build do React. A API ativa é Java; a implementação Express anterior está arquivada em `legacy/backend-node/` para consulta.

## Executar localmente

Requisitos: **JDK 21**, `JAVA_HOME` apontando para o JDK e Node.js 24 para o frontend.

1. Copie `backend/.env.example` para `backend/.env` se ainda não existir. Configure `MONGODB_URI`, `MONGODB_DB_NAME` e um `JWT_SECRET` aleatório com pelo menos 32 bytes. As variáveis reais do processo têm precedência sobre o arquivo.
2. Inicie a API, na pasta `backend`:

```powershell
.\mvnw.cmd spring-boot:run
```

Em Linux/macOS: `sh mvnw spring-boot:run`. A API escuta em `http://localhost:3000`; `GET /health` verifica a conexão com o MongoDB.

3. Em outro terminal, na pasta `frontend`:

```powershell
npm.cmd ci
npm.cmd run dev -- --port 5174
```

Abra `http://localhost:5174`. O Vite encaminha `/api` para o Spring Boot. É possível mudar o destino por `API_PROXY_TARGET` em `frontend/.env.local`.

No Windows, `scripts/run-backend.ps1` também compila e inicia a API; `-ServeFrontend` compila o React e serve tudo na porta 3000. O script encontra o JDK portátil em `.tools/`, quando presente nesta máquina. Essa pasta não é versionada; em outra máquina instale o JDK 21.

## Build, testes e execução unificada

Na pasta `backend`, execute:

```powershell
.\mvnw.cmd verify
```

Os testes de integração usam `TEST_MONGODB_URI` ou a URI local configurada e **sempre substituem o nome do banco** por `serv_test_spring_<id>`. Requerem permissão para esse banco isolado e suporte a transações. Removem exclusivamente esse banco ao terminar. Os testes cobrem autenticação, isolamento, privacidade, preço do servidor, concorrência no aceite, avaliação, pagamentos de demonstração e administração. A CI usa um replica set descartável local.

```powershell
npm.cmd --prefix frontend run build
cd backend
$env:SERVE_FRONTEND='true'
java -jar target/serv-api.jar
```

Nesse modo, `FRONTEND_PATH` é `../frontend/dist`, e o Spring Boot serve o site e a API. O JAR é gerado em `backend/target/serv-api.jar`.

Com Docker e `backend/.env` configurado: `docker compose up --build`. Para um MongoDB inteiramente local, defina `JWT_SECRET` no ambiente e execute `docker compose -f docker-compose.local.yml up --build`; esse modo usa um banco próprio e não acessa o Atlas.

## Estrutura

```text
backend/src/main/java/br/com/servmais/
  api/          # Controllers REST, DTOs e erros em JSON
  service/      # Regras de conta, catálogo, orçamento, pedido e avaliação
  repository/   # Persistência MongoDB compatível com o banco existente
  security/     # JWT, principal da conta e proteção de requisições
  config/       # Spring Security, MongoDB, índices e arquivos React
backend/src/test/             # JUnit: HTTP real + MongoDB e filtros
frontend/                    # React + Vite
legacy/backend-node/         # API anterior, fora da execução ativa
scripts/                     # Comandos auxiliares
```

`interfaceServ/`, `LINGUAGEM DE PROGRAMACAO/`, `BANCO DE DADOS/` e `CIENCIA DE DADOS/` preservam as entregas acadêmicas originais. O SQL e o Swing não são dependências do site atual.

## Funcionalidades e publicação

Cadastro/login, perfis, serviços, orçamento, aceite transacional e idempotente, acompanhamento, conclusão e avaliação foram migrados. As rotas `/api` e os formatos usados pelo React foram mantidos. Não há processador de pagamentos real, recuperação de senha ou contratação coletiva de Skill Pods.

`vercel.json` mantém o serviço Vite e muda o backend para runtime de container com `backend/Dockerfile`. Os caminhos `/api/*` e `/health` continuam no mesmo domínio. Vercel Services e Container Runtime são recursos beta; o novo deployment precisa ser validado antes de substituir o serviço publicado.

Veja [PRODUCAO.md](PRODUCAO.md) e [CONTRATACAO-INDIVIDUAL.md](CONTRATACAO-INDIVIDUAL.md). As alterações da migração são locais até serem enviadas e publicadas; o código Node atualmente publicado não muda apenas por editar este repositório.

## Contexto acadêmico e autor

Projeto integrado de Análise e Desenvolvimento de Sistemas, SENAI 1.23 - Escola SENAI Armando de Arruda Pereira. Desenvolvido por [Pedro Vaz Nascimento](https://github.com/PedroVazN).
