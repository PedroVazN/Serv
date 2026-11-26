# Publicação do SERV+ com Java e React

## Versão migrada

Backend Java 21/Spring Boot 3.5.16, frontend React/Vite e MongoDB. A migração está no código local: publicar exige enviar as alterações e validar um novo deployment. O serviço público anterior continua independente da execução local.

## Vercel Services

`vercel.json` define frontend Vite e backend com `runtime: container` e `entrypoint: Dockerfile`. A imagem do backend é construída em `backend/`. Os caminhos `/api/*` e `/health` mantêm o prefixo e chegam ao Spring Boot; os outros caminhos chegam ao site. O backend abre um servidor HTTP na porta `PORT` (3000 por padrão).

Services e Container Runtime estão em beta. Referências oficiais consultadas em 25/11/2026:

- https://vercel.com/docs/services
- https://vercel.com/docs/functions/runtimes/container

Variáveis do backend, configuradas no ambiente remoto:

- `MONGODB_URI`: credencial e endereço do Atlas.
- `MONGODB_DB_NAME`: nome explícito do banco correto para cada ambiente.
- `JWT_SECRET`: segredo aleatório com pelo menos 32 bytes; preserve o segredo antigo se quiser manter JWTs ainda válidos.
- `JWT_EXPIRES_IN`: por exemplo `1h` ou `7d`, máximo 30 dias.
- `PORT=3000`.
- `CORS_ORIGINS`: somente as origens reais autorizadas.
- `SERVE_FRONTEND=false` na Vercel, pois o Vite serve o React separadamente.

Não transfira `backend/.env` nem segredos de desenvolvimento para o repositório. Não coloque segredos em `VITE_*`, pois o build React é público. Use bancos diferentes para preview e produção. O container não executa seeds nem cadastra contas de demonstração.

## Docker unificado

O Dockerfile da raiz compila React e Java em etapas separadas e executa somente o JRE 21, como usuário sem privilégios. O Spring Boot serve o React compilado e `/api` na mesma porta.

```sh
docker build -t serv-java .
docker run --rm --env-file /caminho/seguro/serv.env -p 3000:3000 serv-java
```

Também é possível usar `docker compose up --build` com `backend/.env` configurado. A imagem define `SERVE_FRONTEND=true` e `FRONTEND_PATH=/app/frontend`.

Sem Docker: compile com `backend/mvnw verify`, gere `frontend/dist` com `npm run build`, e execute `java -jar target/serv-api.jar` a partir de `backend`, com `SERVE_FRONTEND=true`. No Windows, use `mvnw.cmd`. Configure JDK 21 para o build e Java 21 para a execução.

## Banco e compatibilidade

Não há exportação/importação obrigatória do banco. A API mantém as coleções Mongoose, os ObjectIds, referências BSON, timestamps e BCrypt. Os JWTs continuam com HS256 e claim `id`. Os índices são garantidos na inicialização, inclusive unicidade do pedido por orçamento e da avaliação por pedido/serviço. A credencial precisa permitir índices; se houver duplicatas antigas, corrija-as sob revisão antes de publicar.

Aceitar orçamento usa uma transação com retry do driver e índice único, exigindo Atlas ou um replica set. Não use MongoDB standalone para esse fluxo. Faça backup antes da troca de runtime e valide a compatibilidade em homologação.

## Segurança operacional

O Spring Security valida JWT e carrega o papel atual da conta. DTOs controlam campos editáveis. Há limite de 32 KiB por corpo JSON, paginação limitada e rejeição de operadores Mongo fornecidos pelo cliente.

O limitador em memória aplica 300 requisições/minuto e 60 tentativas de autenticação/15 minutos por endereço do peer. Cabeçalhos de IP enviados pelo cliente não são confiados. Atrás de proxy ou com múltiplas instâncias, configure também rate limiting compartilhado no ingress/WAF. Não desative a autenticação para testar o acesso ao banco.

No Atlas, restrinja usuários e endereços de saída autorizados. Mantenha TLS, backups e monitoramento. Pagamentos continuam como registros de demonstração, sem cobrança por um provedor real.

## Verificar antes de promover

- `/health`: 200 com MongoDB acessível; 503 quando indisponível.
- `/api/servicos` e `/api/usuarios/freelancers`: 200 JSON sem dados privados.
- `/api/orcamentos`, `/api/pedidos`, `/api/auth/me`: 401 sem token.
- Login de uma conta antiga e acesso ao seu painel.
- Orçamento, resposta, aceite concorrente e avaliação com contas de homologação.
- Rotas administrativas negadas para clientes; acesso entre contas negado.
- `/`, `/login` e rotas profundas carregam o React; arquivos CSS/JS retornam os tipos corretos.

Validação local: build Java, 90 requisições de integração em banco temporário, testes de filtros, build React e login/pedidos antigos no navegador. Docker não está instalado nesta máquina; a imagem e o novo deployment ainda precisam ser construídos e testados no ambiente de hospedagem. A CI em `.github/workflows/verify.yml` foi preparada, mas só executará após envio ao GitHub.
