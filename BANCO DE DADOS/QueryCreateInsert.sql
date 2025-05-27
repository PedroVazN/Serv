
-- Criação do banco de dados
CREATE DATABASE serv;
USE serv;

-- Tabela de usuários
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('cliente', 'freelancer', 'admin') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de informações adicionais dos usuários
CREATE TABLE info_usuarios (
    id_info INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    genero ENUM('M','F','NB'),
    nascimento DATE,
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabela de perfil do freelancer
CREATE TABLE perfil_freelancer (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    descricao TEXT,
    area_atuacao VARCHAR(100),
    experiencia TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabela de serviços
CREATE TABLE servicos (
    id_servico INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'pendente',
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabela de pedidos de serviços (tabela de relacionamento)
CREATE TABLE pedidos_servico (
    id_pedidos_servico INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_servico INT NOT NULL,
    quantidade INT DEFAULT 1,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE CASCADE
);

-- Tabela de avaliações de serviços
CREATE TABLE avaliacoes_servicos (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_servico INT NOT NULL,
    nota DECIMAL(2,1) NOT NULL CHECK (nota >= 0 AND nota <= 5),
    comentario TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE CASCADE
);

-- Tabela de métodos de pagamento
CREATE TABLE metodo_pagamento (
    id_metodo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(255),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pagamentos
CREATE TABLE pagamentos (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_metodo INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'processando', 'concluido', 'cancelado', 'reembolsado') DEFAULT 'pendente',
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_metodo) REFERENCES metodo_pagamento(id_metodo) ON DELETE CASCADE
);

-- Selecionar o banco
-- Usuários (15+)
INSERT INTO usuarios (nome, email, senha, tipo) VALUES
('João Silva', 'joao@email.com', 'senha123', 'cliente'),
('Maria Oliveira', 'maria@email.com', 'senha456', 'freelancer'),
('Carlos Souza', 'carlos@email.com', 'senha789', 'freelancer'),
('Ana Lima', 'ana@email.com', 'senha321', 'cliente'),
('Lucas Rocha', 'lucas@email.com', 'senha654', 'admin'),
('Paula Mendes', 'paula@email.com', 'senha987', 'freelancer'),
('Roberta Costa', 'roberta@email.com', 'senha111', 'cliente'),
('Fernando Almeida', 'fernando@email.com', 'senha222', 'freelancer'),
('Juliana Pereira', 'juliana@email.com', 'senha333', 'cliente'),
('Ricardo Santos', 'ricardo@email.com', 'senha444', 'freelancer'),
('Patrícia Souza', 'patricia@email.com', 'senha555', 'cliente'),
('Eduardo Lima', 'eduardo@email.com', 'senha666', 'freelancer'),
('Camila Rocha', 'camila@email.com', 'senha777', 'cliente'),
('Gustavo Oliveira', 'gustavo@email.com', 'senha888', 'freelancer'),
('Fernanda Costa', 'fernanda@email.com', 'senha999', 'cliente'),
('Marcos Vinicius', 'marcos@email.com', 'senha000', 'freelancer'),
('Luiza Fernandes', 'luiza@email.com', 'senhaabc', 'cliente');

-- info_usuarios (correspondentes)
INSERT INTO info_usuarios (id_usuario, cpf, genero, nascimento, telefone, endereco) VALUES
(1, '123.456.786-57', 'M', '1990-05-10', '(11) 99999-1111', 'Rua A, 100 - São Paulo'),
(2, '987.654.327-56', 'F', '1992-07-15', '(21) 98888-2222', 'Rua B, 200 - Rio de Janeiro'),
(3, '456.789.675-75', 'M', '1988-03-22', '(31) 97777-3333', 'Av C, 300 - Belo Horizonte'),
(4, '789.123.457-55', 'F', '1995-12-01', '(41) 96666-4444', 'Rua D, 400 - Curitiba'),
(5, '321.654.675-75', 'M', '1985-09-30', '(51) 95555-5555', 'Av E, 500 - Porto Alegre'),
(6, '654.321.974-68', 'F', '1993-11-20', '(61) 94444-6666', 'Rua F, 600 - Brasília'),
(7, '159.753.486-20', 'F', '1991-04-18', '(11) 93333-7777', 'Rua G, 700 - São Paulo'),
(8, '357.159.486-22', 'M', '1986-06-30', '(21) 92222-8888', 'Rua H, 800 - Rio de Janeiro'),
(9, '258.456.789-33', 'F', '1994-08-25', '(31) 91111-9999', 'Rua I, 900 - Belo Horizonte'),
(10, '147.258.369-44', 'M', '1982-01-12', '(41) 90000-1234', 'Rua J, 1000 - Curitiba'),
(11, '369.147.258-55', 'F', '1990-02-22', '(51) 98888-5678', 'Rua K, 1100 - Porto Alegre'),
(12, '951.357.258-66', 'M', '1993-03-03', '(61) 97777-6789', 'Rua L, 1200 - Brasília'),
(13, '753.159.456-77', 'F', '1989-04-04', '(11) 96666-7890', 'Rua M, 1300 - São Paulo'),
(14, '852.456.357-88', 'M', '1987-05-05', '(21) 95555-8901', 'Rua N, 1400 - Rio de Janeiro'),
(15, '741.852.963-99', 'F', '1996-06-06', '(31) 94444-9012', 'Rua O, 1500 - Belo Horizonte'),
(16, '963.741.852-11', 'M', '1984-07-07', '(41) 93333-0123', 'Rua P, 1600 - Curitiba'),
(17, '159.753.258-12', 'F', '1995-08-08', '(51) 92222-1234', 'Rua Q, 1700 - Porto Alegre');

-- perfil_freelancer (15+)
INSERT INTO perfil_freelancer (id_usuario, descricao, area_atuacao, experiencia) VALUES
(2, 'Designer gráfico com foco em identidade visual.', 'Design', '5 anos de experiência em agências.'),
(3, 'Desenvolvedor web especializado em front-end.', 'Desenvolvimento Web', 'Mais de 4 anos com React e Vue.'),
(6, 'Tradutora profissional de inglês e espanhol.', 'Tradução', '7 anos trabalhando com agências internacionais.'),
(8, 'Especialista em SEO e SEM.', 'Marketing Digital', '5 anos otimizando sites e campanhas.'),
(10, 'Fotógrafo profissional especializado em eventos.', 'Fotografia', '6 anos de experiência.'),
(11, 'Editor de vídeo para YouTube e redes sociais.', 'Edição de Vídeo', '4 anos criando conteúdo para influenciadores.'),
(12, 'Consultora de imagem e estilo pessoal.', 'Consultoria de Imagem', '7 anos ajudando clientes a se expressarem melhor.'),
(13, 'Gestora de redes sociais e engajamento.', 'Social Media', '5 anos gerenciando perfis de empresas.'),
(14, 'Assistente virtual para pequenas empresas.', 'Administração', '3 anos organizando tarefas e agendas.'),
(15, 'Desenvolvedor de jogos independentes.', 'Desenvolvimento de Jogos', '2 anos criando jogos para PC e mobile.'),
(16, 'Consultor financeiro para freelancers.', 'Consultoria Financeira', '8 anos de experiência com finanças pessoais e profissionais.'),
(17, 'Coach de carreira e produtividade.', 'Coaching', '5 anos ajudando profissionais a alcançar seus objetivos.'),
(9, 'Desenvolvedora de aplicativos móveis.', 'Desenvolvimento Mobile', '3 anos criando apps para Android e iOS.'),
(7, 'Consultora de marketing digital para pequenas empresas.', 'Marketing', '8 anos ajudando empresas a crescer online.'),
(4, 'Especialista em UX/UI Design.', 'Design', '5 anos em experiência do usuário.');

-- servicos (15+)
INSERT INTO servicos (id_usuario, titulo, descricao, preco) VALUES
(2, 'Criação de logotipo', 'Desenvolvo logotipos personalizados para sua marca.', 300.00),
(3, 'Website responsivo', 'Criação de site moderno e responsivo para empresas.', 1200.00),
(6, 'Tradução de documentos', 'Tradução profissional de documentos técnicos.', 150.00),
(8, 'Otimização SEO', 'Melhore o ranking do seu site com técnicas avançadas.', 700.00),
(10, 'Fotografia de eventos', 'Cobertura fotográfica profissional para eventos.', 900.00),
(11, 'Edição de vídeos', 'Edição e montagem de vídeos para YouTube e redes sociais.', 500.00),
(12, 'Consultoria de imagem', 'Sessões para melhorar seu estilo pessoal e profissional.', 350.00),
(13, 'Gestão de redes sociais', 'Criação e gerenciamento de conteúdo para redes sociais.', 600.00),
(14, 'Assistente virtual', 'Organização de agendas, emails e tarefas administrativas.', 400.00),
(15, 'Desenvolvimento de jogos', 'Criação de jogos independentes para plataformas variadas.', 2000.00),
(16, 'Planejamento financeiro', 'Consultoria para gestão financeira pessoal e empresarial.', 450.00),
(17, 'Coaching de carreira', 'Sessões para desenvolvimento profissional e pessoal.', 550.00),
(9, 'App mobile iOS/Android', 'Desenvolvimento de aplicativos móveis personalizados.', 2500.00),
(7, 'Campanhas de marketing digital', 'Criação e execução de campanhas para aumentar vendas.', 800.00),
(4, 'Design UX/UI', 'Criação de interfaces focadas na experiência do usuário.', 1000.00);

-- pedidos (15+)
INSERT INTO pedidos (cliente_id, status) VALUES
(1, 'concluido'),
(4, 'pendente'),
(7, 'em_andamento'),
(9, 'cancelado'),
(13, 'concluido'),
(15, 'pendente'),
(3, 'em_andamento'),
(12, 'concluido'),
(5, 'pendente'),
(10, 'em_andamento'),
(14, 'concluido'),
(17, 'pendente'),
(11, 'cancelado'),
(2, 'concluido'),
(6, 'em_andamento'),
(8, 'concluido');

-- pedidos_servico (vários)
INSERT INTO pedidos_servico (id_pedido, id_servico, quantidade) VALUES
(1, 1, 1),
(2, 4, 1),
(3, 7, 2),
(4, 10, 1),
(5, 13, 1),
(6, 15, 1),
(7, 3, 1),
(8, 12, 1),
(9, 5, 2),
(10, 9, 1),
(11, 6, 1),
(12, 11, 1),
(13, 8, 1),
(14, 2, 1),
(15, 14, 1);

-- avaliacoes_servicos (mais variadas)
INSERT INTO avaliacoes_servicos (id_pedido, id_servico, nota, comentario) VALUES
(1, 1, 4.5, 'Serviço excelente!'),
(3, 7, 5.0, 'Consultoria muito profissional.'),
(5, 13, 4.0, 'Interface muito intuitiva.'),
(6, 15, 3.5, 'Jogo divertido, mas com bugs.'),
(8, 12, 4.8, 'Ótimas dicas para estilo.'),
(10, 9, 4.2, 'Aplicativo rápido e estável.'),
(12, 11, 3.8, 'Vídeo ficou bom, poderia melhorar no áudio.'),
(14, 2, 4.9, 'Site ficou moderno e responsivo.'),
(2, 4, 4.1, 'SEO realmente melhorou o tráfego.'),
(4, 10, 3.9, 'Fotos boas, mas faltou diversidade de ângulos.'),
(7, 3, 4.3, 'Tradução precisa e rápida.'),
(9, 5, 3.5, 'Fotografia agradou o cliente.'),
(11, 6, 4.7, 'Edição dinâmica e criativa.'),
(13, 8, 4.0, 'Gestão das redes funcionou bem.');

-- Inserir metodo_pagamento
INSERT INTO metodo_pagamento (nome, descricao) VALUES
('Cartão de Crédito', 'Pagamentos com bandeiras Visa, MasterCard, etc.'),
('Boleto Bancário', 'Gerar boleto para pagamento em até 3 dias.'),
('Pix', 'Transferência imediata via chave Pix.'),
('PayPal', 'Pagamento via conta PayPal.'),
('Crédito na plataforma', 'Utilize saldo em conta para pagar.'),
('Transferência Bancária', 'TED ou DOC via banco.');


-- pagamentos (mais variados)
INSERT INTO pagamentos (id_pedido, id_metodo, valor, status) VALUES
(1, 1, 300.00, 'concluido'),
(2, 3, 700.00, 'pendente'),
(3, 5, 700.00, 'concluido'),
(4, 2, 2000.00, 'cancelado'),
(5, 1, 1000.00, 'concluido'),
(6, 4, 2000.00, 'processando'),
(7, 1, 150.00, 'concluido'),
(8, 3, 350.00, 'concluido'),
(9, 2, 1800.00, 'pendente'),
(10, 4, 2500.00, 'concluido'),
(11, 5, 500.00, 'cancelado'),
(12, 1, 450.00, 'concluido'),
(13, 3, 400.00, 'concluido'),
(14, 2, 1200.00, 'concluido'),
(15, 1, 400.00, 'pendente'),
(16, 4, 550.00, 'concluido');

