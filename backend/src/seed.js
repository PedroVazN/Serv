require("dotenv").config();
const conectar = require("./db");
const Usuario = require("./models/Usuario");
const Servico = require("./models/Servico");
const Pedido = require("./models/Pedido");
const Avaliacao = require("./models/Avaliacao");
const Pagamento = require("./models/Pagamento");

const seed = async () => {
  await conectar();

  console.log("🧹 Limpando coleções...");
  await Promise.all([
    Usuario.deleteMany(),
    Servico.deleteMany(),
    Pedido.deleteMany(),
    Avaliacao.deleteMany(),
    Pagamento.deleteMany(),
  ]);

  console.log("👤 Criando usuários...");
  const usuarios = await Usuario.insertMany([
    { nome: "João Silva",       email: "joao@email.com",     senha: "senha123", tipo: "cliente",    info: { cpf: "123.456.786-57", genero: "M", nascimento: "1990-05-10", telefone: "(11) 99999-1111", endereco: "Rua A, 100 - São Paulo" } },
    { nome: "Maria Oliveira",   email: "maria@email.com",    senha: "senha456", tipo: "freelancer", info: { cpf: "987.654.327-56", genero: "F", nascimento: "1992-07-15", telefone: "(21) 98888-2222", endereco: "Rua B, 200 - Rio de Janeiro" }, perfil_freelancer: { descricao: "Designer gráfico com foco em identidade visual.", area_atuacao: "Design", experiencia: "5 anos de experiência em agências." } },
    { nome: "Carlos Souza",     email: "carlos@email.com",   senha: "senha789", tipo: "freelancer", info: { cpf: "456.789.675-75", genero: "M", nascimento: "1988-03-22", telefone: "(31) 97777-3333", endereco: "Av C, 300 - Belo Horizonte" }, perfil_freelancer: { descricao: "Desenvolvedor web especializado em front-end.", area_atuacao: "Desenvolvimento Web", experiencia: "Mais de 4 anos com React e Vue." } },
    { nome: "Ana Lima",         email: "ana@email.com",      senha: "senha321", tipo: "cliente",    info: { cpf: "789.123.457-55", genero: "F", nascimento: "1995-12-01", telefone: "(41) 96666-4444", endereco: "Rua D, 400 - Curitiba" } },
    { nome: "Lucas Rocha",      email: "lucas@email.com",    senha: "senha654", tipo: "admin",      info: { cpf: "321.654.675-75", genero: "M", nascimento: "1985-09-30", telefone: "(51) 95555-5555", endereco: "Av E, 500 - Porto Alegre" } },
    { nome: "Paula Mendes",     email: "paula@email.com",    senha: "senha987", tipo: "freelancer", info: { cpf: "654.321.974-68", genero: "F", nascimento: "1993-11-20", telefone: "(61) 94444-6666", endereco: "Rua F, 600 - Brasília" }, perfil_freelancer: { descricao: "Tradutora profissional de inglês e espanhol.", area_atuacao: "Tradução", experiencia: "7 anos trabalhando com agências internacionais." } },
    { nome: "Roberta Costa",    email: "roberta@email.com",  senha: "senha111", tipo: "cliente",    info: { cpf: "159.753.486-20", genero: "F", nascimento: "1991-04-18", telefone: "(11) 93333-7777", endereco: "Rua G, 700 - São Paulo" } },
    { nome: "Fernando Almeida", email: "fernando@email.com", senha: "senha222", tipo: "freelancer", info: { cpf: "357.159.486-22", genero: "M", nascimento: "1986-06-30", telefone: "(21) 92222-8888", endereco: "Rua H, 800 - Rio de Janeiro" }, perfil_freelancer: { descricao: "Especialista em SEO e SEM.", area_atuacao: "Marketing Digital", experiencia: "5 anos otimizando sites e campanhas." } },
    { nome: "Juliana Pereira",  email: "juliana@email.com",  senha: "senha333", tipo: "cliente",    info: { cpf: "258.456.789-33", genero: "F", nascimento: "1994-08-25", telefone: "(31) 91111-9999", endereco: "Rua I, 900 - Belo Horizonte" } },
    { nome: "Ricardo Santos",   email: "ricardo@email.com",  senha: "senha444", tipo: "freelancer", info: { cpf: "147.258.369-44", genero: "M", nascimento: "1982-01-12", telefone: "(41) 90000-1234", endereco: "Rua J, 1000 - Curitiba" }, perfil_freelancer: { descricao: "Fotógrafo profissional especializado em eventos.", area_atuacao: "Fotografia", experiencia: "6 anos de experiência." } },
  ]);

  const [joao, maria, carlos, ana, , paula, roberta, fernando, juliana, ricardo] = usuarios;

  console.log("🛠️  Criando serviços...");
  const servicos = await Servico.insertMany([
    { usuario: maria._id,    titulo: "Criação de logotipo",     descricao: "Desenvolvo logotipos personalizados para sua marca.", preco: 300,  categoria: "Design" },
    { usuario: carlos._id,   titulo: "Website responsivo",      descricao: "Criação de site moderno e responsivo para empresas.", preco: 1200, categoria: "Web" },
    { usuario: paula._id,    titulo: "Tradução de documentos",  descricao: "Tradução profissional de documentos técnicos.",        preco: 150,  categoria: "Consultoria" },
    { usuario: fernando._id, titulo: "Otimização SEO",          descricao: "Melhore o ranking do seu site com técnicas avançadas.", preco: 700, categoria: "Marketing" },
    { usuario: ricardo._id,  titulo: "Fotografia de eventos",   descricao: "Cobertura fotográfica profissional para eventos.",     preco: 900,  categoria: "Outro" },
  ]);

  const [logo, website, traducao, seo, foto] = servicos;

  console.log("📦 Criando pedidos...");
  const pedido1 = await Pedido.create({
    cliente: joao._id,
    itens: [{ servico: logo._id, quantidade: 1, preco_unitario: logo.preco }],
    status: "concluido",
  });

  const pedido2 = await Pedido.create({
    cliente: ana._id,
    itens: [{ servico: seo._id, quantidade: 1, preco_unitario: seo.preco }],
    status: "concluido",
  });

  const pedido3 = await Pedido.create({
    cliente: roberta._id,
    itens: [{ servico: website._id, quantidade: 1, preco_unitario: website.preco }],
    status: "em_andamento",
  });

  const pedido4 = await Pedido.create({
    cliente: juliana._id,
    itens: [{ servico: foto._id, quantidade: 1, preco_unitario: foto.preco }],
    status: "pendente",
  });

  console.log("⭐ Criando avaliações...");
  await Avaliacao.insertMany([
    { pedido: pedido1._id, servico: logo._id,    avaliador: joao._id, nota: 4.5, comentario: "Logotipo ficou excelente!" },
    { pedido: pedido2._id, servico: seo._id,     avaliador: ana._id,  nota: 4.1, comentario: "SEO realmente melhorou o tráfego." },
  ]);

  console.log("💳 Criando pagamentos...");
  await Pagamento.insertMany([
    { pedido: pedido1._id, metodo: "cartao_credito", valor: pedido1.valor_total, status: "concluido" },
    { pedido: pedido2._id, metodo: "pix",            valor: pedido2.valor_total, status: "concluido" },
    { pedido: pedido3._id, metodo: "boleto",         valor: pedido3.valor_total, status: "processando" },
    { pedido: pedido4._id, metodo: "pix",            valor: pedido4.valor_total, status: "pendente" },
  ]);

  console.log("✅ Seed concluído com sucesso!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
