# Publicação do SERV

## Estado atual

Preparação local de implantação: frontend React compilado e servido pelo Express junto com `/api`. MongoDB Atlas continua sendo o banco externo. Não há serviço remoto ou domínio configurado por estes arquivos.

O catálogo e o diretório de freelancers ainda usam dados fixos. A contratação completa e a cobrança real ainda não estão integradas. Publicar esta versão não transforma esses recursos em funcionalidades completas. Antes de receber clientes reais, concluir esses fluxos e revisar autorização, validações, privacidade, recuperação de senha, backups e monitoramento.

## Implantação com Docker

### Vercel

`vercel.json` na raiz define dois Vercel Services (recurso beta): Vite em `frontend` e Express em `backend`. `/api/*` e `/health` chegam ao backend; as demais rotas chegam ao site. O Express exporta o aplicativo sem abrir porta quando importado pela Vercel, e reutiliza conexões com o Atlas. A execução local por `npm start` continua disponível.

O projeto deve apontar para a raiz do repositório. Configure `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN` e `CORS_ORIGINS` nos ambientes desejados. Na Vercel, deixe `SERVE_FRONTEND=false` (ou ausente), pois o frontend é servido pelo serviço Vite. Não copie `.env` para o repositório. Confira as regras de proxy da plataforma antes de configurar `TRUST_PROXY` e revise limites de autenticação em homologação. Segredos de preview devem apontar para banco de homologação, separado do de produção.

A publicação exige equipe acessível na integração e envio das alterações locais ao repositório vinculado. Os testes locais não substituem o build e a verificação do deployment Vercel.

Use o `Dockerfile` da **raiz** com contexto da raiz. Ele compila o frontend, instala as dependências travadas no lockfile, copia somente código necessário para execução e usa usuário sem privilégios de root.

```sh
docker build -t serv-production .
docker run --rm --env-file /caminho/seguro/serv-production.env -p 3000:3000 serv-production
```

O arquivo de variáveis fica fora do Git e contém:

```dotenv
MONGODB_URI=<URI Atlas com banco explicitamente definido>
JWT_SECRET=<segredo aleatório com pelo menos 32 caracteres>
JWT_EXPIRES_IN=1h
PORT=3000
CORS_ORIGINS=https://seu-dominio-real
```

`NODE_ENV=production` e `SERVE_FRONTEND=true` já são definidos na imagem. Nunca configure segredos como argumentos de build nem variáveis `VITE_*`: estas últimas ficam públicas no JavaScript do navegador. Não utilize os valores de exemplo como credenciais.

A hospedagem deve encaminhar HTTPS para a porta `PORT` do processo e verificar `/health`. A raiz apresenta o site, `/login` é atendida pelo React e `/api/*` pela API. Para um domínio próprio, configure DNS e certificado no provedor após criar o serviço.

Configure `TRUST_PROXY` com IPs ou sub-redes dos proxies conhecidos somente depois de confirmar a arquitetura do provedor. Sem isso, o limitador pode enxergar todas as pessoas como o mesmo IP atrás do proxy. Não configure confiança irrestrita em cabeçalhos fornecidos pelo cliente. O limitador atual é em memória; para múltiplas instâncias é necessário armazenamento compartilhado.

No Atlas, autorize os endereços de saída da hospedagem e use credencial restrita ao banco do aplicativo. Não abra a lista de IPs indiscriminadamente. Mantenha o laboratório e seus testes separados do banco de produção.

## Alternativa de build sem Docker

Na raiz, execute:

```sh
npm --prefix frontend ci
npm --prefix frontend run build
npm --prefix backend ci --omit=dev
```

Inicie `node src/app.js` com diretório de trabalho `backend`, `NODE_ENV=production`, `SERVE_FRONTEND=true` e as variáveis do ambiente configuradas pelo provedor. O artefato deve preservar as pastas irmãs `frontend/dist` e `backend`.

## Verificação após publicar

- `/health`: HTTP 200 quando conectado ao MongoDB; 503 se perder a conexão.
- `/`, `/login` e `/freelancers`: HTML do site.
- `/api/servicos`: JSON da API.
- `/api/rota-inexistente`: 404 JSON, não HTML.
- Testar cadastro/login com conta de homologação e conferir HTTPS, logs e origem CORS.

O script `backend/check-database.cjs` é de laboratório, cria e remove dados temporários, e não faz parte da imagem de produção. Não o execute no banco de clientes.

## Validação realizada nesta preparação

- Build Vite local gerado com sucesso.
- Processo de produção iniciado localmente em porta separada e conectado ao Atlas.
- Docker não está instalado nesta máquina; imagem ainda precisa ser construída e validada pelo provedor ou CI.
- Publicação remota, TLS, DNS e comportamento dos proxies ainda dependem da hospedagem.

Referências: [Express: arquivos estáticos](https://expressjs.com/en/starter/static-files/), [Express: proxies](https://expressjs.com/en/guide/behind-proxies/) e [Docker: build em etapas](https://docs.docker.com/build/building/multi-stage/).
