# Laboratório de segurança da API SERV

Alvo dos exercícios: a sua API em `http://localhost:3000`. Use contas e pedidos de teste. Não é necessário desativar autenticação nem deixar vulnerabilidades abertas para aprender: uma tentativa bloqueada demonstra a defesa.

## Executar a bateria automatizada

Na pasta `backend`, com a API iniciada por `npm.cmd start`:

```powershell
node check-database.cjs
npm.cmd audit
```

O teste cria usuários cliente e freelancer pelo endpoint público. O administrador temporário é promovido diretamente pelo acesso confiável ao banco, somente para testar rotas administrativas. Não existe cadastro público de administrador. A limpeza apaga apenas os registros desta execução. Não execute várias instâncias simultâneas; o limite de autenticação pode responder 429 em repetições próximas.

O arquivo `database-check-results.json` registra o resultado da última execução. Um resultado verde cobre as verificações descritas, não significa ausência de vulnerabilidades.

## Enviar tentativas manualmente no PowerShell

Defina esta função; ela mostra o status HTTP inclusive nas tentativas bloqueadas:

```powershell
function Testar-API {
  param([string]$Metodo, [string]$Rota, $Dados, [string]$Token)
  $opcoes = @{ Uri = "http://localhost:3000/api$Rota"; Method = $Metodo; UseBasicParsing = $true }
  if ($null -ne $Dados) {
    $opcoes.ContentType = 'application/json'
    $opcoes.Body = ConvertTo-Json -InputObject $Dados -Depth 10 -Compress
  }
  if ($Token) { $opcoes.Headers = @{ Authorization = "Bearer $Token" } }
  try {
    $r = Invoke-WebRequest @opcoes
    "$($r.StatusCode) $($r.Content)"
  } catch {
    if ($_.Exception.Response) {
      "HTTP $([int]$_.Exception.Response.StatusCode)"
      $_.ErrorDetails.Message
    } else { $_.Exception.Message }
  }
}
```

### 1. Escalada de privilégio por atribuição de campos

```powershell
Testar-API POST /auth/registro @{ nome='Laboratorio'; email='admin-lab@example.invalid'; senha='Lab-Teste-123!'; tipo='admin' }
```

Esperado: **400**. Se criar uma conta administrativa (201), há falha na validação do papel. A defesa fica no servidor: o registro aceita somente cliente ou freelancer. Esconder a opção no formulário não protege a API.

### 2. Injeção NoSQL

```powershell
Testar-API POST /auth/login @{ email=@{ '$ne'=$null }; senha=@{ '$ne'=$null } }
Testar-API GET '/servicos?categoria[$ne]=Web'
```

Esperado: **400**. `$ne` é um operador do MongoDB; enviá-lo como objeto tenta transformar um valor em consulta. O servidor rejeita operadores fornecidos pelo cliente e exige texto no login. Um bloqueio neste payload não prova proteção contra toda forma de injeção.

### 3. JWT ausente ou adulterado

```powershell
Testar-API GET /pedidos
Testar-API GET /auth/me $null 'token-alterado'
```

Esperado: **401**. Alterar o conteúdo de um JWT sem recalcular sua assinatura não concede privilégios. O servidor verifica assinatura, expiração e existência do usuário. Isso não testa a força do segredo configurado.

### 4. IDOR/BOLA: acessar dados de outra conta

Crie duas contas locais, A e B. Faça login como A e guarde seu token em `$tokenA`. Guarde em `$idB` o ID da conta de teste B; em `$pedidoB`, um pedido criado por B. Envie:

```powershell
Testar-API GET "/usuarios/$idB" $null $tokenA
Testar-API PATCH "/usuarios/$idB" @{ nome='Tentativa por A' } $tokenA
Testar-API GET "/pedidos/$pedidoB" $null $tokenA
Testar-API GET "/pagamentos/pedido/$pedidoB" $null $tokenA
```

Esperado: **403** para contas comuns. Faça também a mesma consulta com o dono: deve funcionar. Uma resposta 401 significa que o token é inválido; 404 pode significar ID inexistente; nenhum deles, isoladamente, comprova que a autorização por proprietário funcionou. O teste automatizado cria os objetos necessários e compara ambos os lados.

### 5. Manipular quantidade, preço ou estrutura

```powershell
Testar-API POST /pedidos @{ itens=@() } $tokenA
Testar-API POST /pedidos @{ itens=@(@{ servico=$servicoId; quantidade=-1 }) } $tokenA
Testar-API GET /servicos/id-invalido
Testar-API GET '/servicos?limit=1000000'
```

Esperado: **400**. Para testar preço adulterado, envie um serviço de teste válido com quantidade 2 e `preco_unitario=1`: o pedido deve usar o preço salvo no MongoDB, ignorando o preço enviado. A bateria automatizada verifica esse cálculo.

### 6. Tamanho e frequência

```powershell
Testar-API POST /auth/login @{ email=('x' * 40000); senha='teste' }
```

Esperado: **413** pelo limite de 32 KB. A API também limita 300 requisições/minuto por IP e 60 requisições/15 minutos nas rotas de autenticação; ao exceder, responde **429**. Não foi executado teste de saturação ou carga. Evite repetir logins em massa: o bloqueio também atingirá seu próprio IP durante a janela. O armazenamento do limitador é em memória e reinicia com o processo.

## Como interpretar uma tentativa que deu errado

- 400: entrada recusada; confirme que recusou a regra que você pretendia testar.
- 401: autenticação ausente ou inválida; ainda não testou autorização do objeto.
- 403: identidade válida, ação proibida; compare com o mesmo pedido feito pelo dono.
- 429: limite excedido; aguarde a janela antes de testar outros fluxos.
- 500: erro inesperado; investigue os logs, não interprete como proteção bem implementada.
- Falha de rede: confira processo, porta e conexão com MongoDB; não prova bloqueio de segurança.

## Próximas melhorias

1. Usar banco Atlas exclusivo do laboratório e conta MongoDB com permissão somente nesse banco; restringir a lista de IPs. Não misturar dados reais com testes.
2. Adicionar logs de auditoria sem senha, token ou URI do banco; registrar usuário, ação, alvo e resultado. Ainda não há trilha de auditoria persistente.
3. Em publicação, usar HTTPS, segredos fora do Git e rotação de credenciais. Verificar revogação e renovação de tokens; hoje o JWT continua válido até expirar e o frontend o guarda no localStorage, sujeito a roubo se houver XSS.
4. Usar armazenamento compartilhado para rate limiting em múltiplos processos e limites por conta além de IP. CORS restringe o comportamento do navegador, não substitui autenticação nem bloqueia clientes de terminal.
5. Definir transições válidas de pedido/pagamento e idempotência de pagamento. O registro atual não integra cobrança real e ainda permite solicitações repetidas de pagamento.
6. Reduzir os campos retornados nos perfis públicos, padronizar erros sem detalhes internos e adicionar validação completa dos campos de cada rota.
7. Executar estes testes em CI, ampliar os casos de acesso cruzado, integridade de referências, concorrência e restauração de backup. O teste atual não é uma auditoria completa.

Referências: [OWASP sobre autorização por objeto](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) e [boas práticas de segurança do Express](https://expressjs.com/en/advanced/best-practice-security/).
