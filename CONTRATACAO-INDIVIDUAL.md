# Contratação individual — primeira versão funcional

## Fluxo implementado

1. Usuário cria conta de cliente ou profissional e acessa `/painel`.
2. Profissional preenche apresentação, área, experiência, portfólio HTTPS e disponibilidade; publica serviços com preço de referência.
3. `/freelancers` e `/profissionais/:id` exibem perfis reais, sem email, documentos, endereço ou senha. As iniciais identificam contas que não têm fotografia própria.
4. `/servicos` busca serviços ativos no MongoDB por categoria, texto e profissional. As fotografias de categoria são ilustrativas.
5. Cliente abre `/servicos/:id` e solicita orçamento descrevendo o trabalho. Se precisar entrar, retorna ao serviço após o login.
6. Profissional responde no painel com preço final, prazo em dias corridos após o aceite e entregas.
7. Cliente aceita; uma transação cria exatamente um pedido com cópia das condições acordadas. Aceites repetidos retornam o mesmo pedido. O aceite não processa cobrança.
8. Ambos acompanham o pedido. Cliente confirma que recebeu as entregas e registra uma avaliação.

Estados do orçamento: `solicitado → respondido → aceito`; cliente pode encerrar antes do aceite e profissional pode recusar uma solicitação ainda não respondida. Pedidos oriundos de orçamento entram em `em_andamento`, e o cliente confirma a conclusão. Não há cancelamento ou disputa após aceite nesta versão.

## Executar e testar localmente

O `.env` local do backend define `MONGODB_DB_NAME=serv_desenvolvimento`. A URI e as credenciais não foram publicadas. Esse nome substitui o banco contido na URI somente neste processo; a Vercel continua com suas próprias variáveis. Produção não foi atualizada nesta etapa.

Na pasta `backend`:

```powershell
npm.cmd run demo:local
npm.cmd run dev
```

Na pasta `frontend`:

```powershell
npm.cmd run dev -- --port 5174
```

Contas **apenas da demonstração local**:

- Cliente: `cliente.demo@example.invalid`
- Profissional: `profissional.demo@example.invalid`
- Senha dessas duas contas fictícias: `ServDemo2026!`

O script de demonstração recusa execução em produção, na Vercel ou fora de `serv_desenvolvimento`. Não altera contas reais nem redefine senhas de contas existentes. Para cadastrar uma conta comum, use o formulário de criação de conta.

O teste de integração `npm.cmd run test:marketplace` cria um banco exclusivo `serv_test_marketplace_<timestamp>`, verifica privacidade, autorização, aceites concorrentes, estados, preço acordado e avaliação, e remove somente esse banco ao terminar. Requer credenciais com permissão para o banco temporário e suporte a transações (como Atlas). `check-database.cjs` agora exige explicitamente o banco de desenvolvimento e continua limitado aos registros temporários identificados pelo próprio teste.

## Novos endpoints

- `GET /api/usuarios/freelancers/:id`: perfil público selecionado.
- `GET /api/servicos?profissional=<id>`: serviços ativos do profissional.
- `GET /api/orcamentos`: somente negociações da conta; administrador pode consultar todas.
- `POST /api/orcamentos`: cliente solicita com `servico_id` e `descricao`.
- `PATCH /api/orcamentos/:id/responder`: profissional responsável informa `valor`, `prazo_dias` e `escopo`.
- `POST /api/orcamentos/:id/aceitar`: cliente aceita; valores do corpo são ignorados.
- `PATCH /api/orcamentos/:id/recusar`: participante encerra no estado permitido.
- `GET /api/pedidos/recebidos`: profissional consulta seus projetos.
- `PATCH /api/pedidos/:id/concluir`: cliente confirma entrega de pedido aceito em andamento.

## Verificação desta entrega

- 59 verificações de integração em banco temporário separado, incluindo aceite simultâneo sem duplicação de pedido.
- 67 verificações de regressão existentes aprovadas no banco de desenvolvimento, com limpeza dos registros temporários do teste.
- Build do frontend aprovado.
- Fluxo manual no navegador usando as duas contas demonstrativas: login com retorno ao serviço, solicitação, resposta do profissional, gravação de perfil, aceite, pedido, confirmação de entrega e avaliação.

## Limites desta versão

Esta entrega cobre contratação individual por orçamento. Skill Pods ainda são exemplos editoriais; composição de equipes, mensagens, anexos, comprovantes, pagamentos reais, disputas/cancelamentos, notificações por email, verificação de email e recuperação de senha continuam pendentes. O token permanece no localStorage, como na versão anterior; planejar sessões com cookies seguros e revogação antes de atender clientes reais. Nenhum serviço externo de cobrança ou email foi contratado/configurado.

Os limites de acesso, transações e validações continuam sendo do servidor. Para produção, configure credenciais específicas, backups e política de índices antes da publicação. O índice único em `Pedido.orcamento` deve estar criado antes de receber tráfego; o ambiente de desenvolvimento e o teste aguardam os índices necessários.
