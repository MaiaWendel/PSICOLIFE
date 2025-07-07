-- =====================================================
-- PSICOLIFE - SCRIPT COMPLETO PARA MYSQL WORKBENCH
-- =====================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS psicolife CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE psicolife;

-- =====================================================
-- TABELA: USUARIO
-- =====================================================
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(128),
    tipo VARCHAR(20) DEFAULT 'paciente',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    usuario VARCHAR(50) UNIQUE,
    telefone VARCHAR(20),
    genero VARCHAR(20),
    psicologo_id INT,
    
    FOREIGN KEY (psicologo_id) REFERENCES usuario(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_tipo (tipo),
    INDEX idx_psicologo (psicologo_id)
);

-- =====================================================
-- TABELA: CONTATO
-- =====================================================
CREATE TABLE contato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    assunto VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    respondido BOOLEAN DEFAULT FALSE,
    
    INDEX idx_data_envio (data_envio),
    INDEX idx_respondido (respondido)
);

-- =====================================================
-- TABELA: ENTRADA_DIARIO
-- =====================================================
CREATE TABLE entrada_diario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    conteudo TEXT NOT NULL,
    humor VARCHAR(20) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    reflexao_positiva TEXT,
    reflexao_aprendizado TEXT,
    reflexao_melhoria TEXT,
    tags VARCHAR(200),
    
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    INDEX idx_usuario_data (usuario_id, data_criacao),
    INDEX idx_humor (humor)
);

-- =====================================================
-- TABELA: QUIZ
-- =====================================================
CREATE TABLE quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    perguntas TEXT,
    
    INDEX idx_categoria (categoria)
);

-- =====================================================
-- TABELA: RESPOSTA_QUIZ
-- =====================================================
CREATE TABLE resposta_quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    usuario_id INT NOT NULL,
    respostas TEXT,
    resultado TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    INDEX idx_usuario_data (usuario_id, data_criacao),
    INDEX idx_quiz (quiz_id)
);

-- =====================================================
-- TABELA: EVOLUCAO_PACIENTE
-- =====================================================
CREATE TABLE evolucao_paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    psicologo_id INT NOT NULL,
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Campos de avaliação (1-10)
    humor_geral INT CHECK (humor_geral >= 1 AND humor_geral <= 10),
    ansiedade_nivel INT CHECK (ansiedade_nivel >= 1 AND ansiedade_nivel <= 10),
    depressao_nivel INT CHECK (depressao_nivel >= 1 AND depressao_nivel <= 10),
    sono_qualidade INT CHECK (sono_qualidade >= 1 AND sono_qualidade <= 10),
    
    -- Observações clínicas
    observacoes TEXT,
    objetivos_sessao TEXT,
    progresso_observado TEXT,
    proximos_passos TEXT,
    
    FOREIGN KEY (paciente_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (psicologo_id) REFERENCES usuario(id) ON DELETE CASCADE,
    INDEX idx_paciente_data (paciente_id, data_avaliacao),
    INDEX idx_psicologo_data (psicologo_id, data_avaliacao)
);

-- =====================================================
-- INSERÇÃO DE DADOS INICIAIS
-- =====================================================

-- Usuário Administrador
INSERT INTO usuario (nome, email, senha_hash, tipo, ativo) VALUES 
('Administrador', 'admin@psicolife.com', 'pbkdf2:sha256:600000$salt$hash', 'admin', TRUE);

-- Psicólogos
INSERT INTO usuario (nome, email, usuario, senha_hash, tipo, ativo) VALUES 
('Dra. Ana Silva', 'ana.silva@psicolife.com', 'anasilva', 'pbkdf2:sha256:600000$salt$hash', 'psicologo', TRUE),
('Dr. Carlos Mendes', 'carlos.mendes@psicolife.com', 'carlosmendes', 'pbkdf2:sha256:600000$salt$hash', 'psicologo', TRUE),
('Dra. Juliana Alves', 'juliana.alves@psicolife.com', 'julianaalves', 'pbkdf2:sha256:600000$salt$hash', 'psicologo', TRUE),
('Dr. Ricardo Santos', 'ricardo.santos@psicolife.com', 'ricardosantos', 'pbkdf2:sha256:600000$salt$hash', 'psicologo', TRUE);

-- Quiz de exemplo
INSERT INTO quiz (titulo, descricao, categoria, perguntas) VALUES 
('Avaliação de Saúde Mental', 'Um quiz para avaliar seu estado emocional atual', 'saude_mental', 
'[
    {"id": 1, "texto": "Com que frequência você se sente nervoso ou ansioso?", "categoria": "ansiedade"},
    {"id": 2, "texto": "Com que frequência você tem dificuldade para dormir?", "categoria": "sono"},
    {"id": 3, "texto": "Com que frequência você se sente triste ou deprimido?", "categoria": "depressao"},
    {"id": 4, "texto": "Com que frequência você se sente irritado ou com raiva?", "categoria": "humor"},
    {"id": 5, "texto": "Com que frequência você tem dificuldade para se concentrar?", "categoria": "concentracao"}
]');

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas de usuários
CREATE VIEW v_estatisticas_usuarios AS
SELECT 
    tipo,
    COUNT(*) as total,
    COUNT(CASE WHEN ativo = TRUE THEN 1 END) as ativos
FROM usuario 
GROUP BY tipo;

-- View para evolução dos pacientes
CREATE VIEW v_evolucao_resumo AS
SELECT 
    ep.paciente_id,
    u.nome as paciente_nome,
    COUNT(ep.id) as total_avaliacoes,
    AVG(ep.humor_geral) as media_humor,
    AVG(ep.ansiedade_nivel) as media_ansiedade,
    AVG(ep.depressao_nivel) as media_depressao,
    AVG(ep.sono_qualidade) as media_sono,
    MAX(ep.data_avaliacao) as ultima_avaliacao
FROM evolucao_paciente ep
JOIN usuario u ON ep.paciente_id = u.id
GROUP BY ep.paciente_id, u.nome;

-- View para atividade do diário
CREATE VIEW v_atividade_diario AS
SELECT 
    ed.usuario_id,
    u.nome as usuario_nome,
    COUNT(ed.id) as total_entradas,
    DATE(ed.data_criacao) as data_entrada,
    ed.humor
FROM entrada_diario ed
JOIN usuario u ON ed.usuario_id = u.id
GROUP BY ed.usuario_id, u.nome, DATE(ed.data_criacao), ed.humor
ORDER BY ed.data_criacao DESC;

-- =====================================================
-- PROCEDURES ÚTEIS
-- =====================================================

DELIMITER //

-- Procedure para obter estatísticas de um paciente
CREATE PROCEDURE sp_estatisticas_paciente(IN p_paciente_id INT)
BEGIN
    SELECT 
        'Diário' as categoria,
        COUNT(*) as total,
        MAX(data_criacao) as ultima_atividade
    FROM entrada_diario 
    WHERE usuario_id = p_paciente_id
    
    UNION ALL
    
    SELECT 
        'Quiz' as categoria,
        COUNT(*) as total,
        MAX(data_criacao) as ultima_atividade
    FROM resposta_quiz 
    WHERE usuario_id = p_paciente_id
    
    UNION ALL
    
    SELECT 
        'Evolução' as categoria,
        COUNT(*) as total,
        MAX(data_avaliacao) as ultima_atividade
    FROM evolucao_paciente 
    WHERE paciente_id = p_paciente_id;
END //

DELIMITER ;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

-- Tabela usuario: Armazena todos os usuários do sistema (pacientes, psicólogos, admin)
-- Tabela contato: Formulário de contato do site
-- Tabela entrada_diario: Entradas do diário emocional dos usuários
-- Tabela quiz: Questionários disponíveis no sistema
-- Tabela resposta_quiz: Respostas dos usuários aos questionários
-- Tabela evolucao_paciente: Avaliações clínicas feitas pelos psicólogos

-- =====================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índices compostos para consultas frequentes
CREATE INDEX idx_diario_usuario_humor ON entrada_diario(usuario_id, humor);
CREATE INDEX idx_evolucao_paciente_periodo ON evolucao_paciente(paciente_id, data_avaliacao);
CREATE INDEX idx_quiz_resposta_periodo ON resposta_quiz(usuario_id, data_criacao);

-- =====================================================
-- SCRIPT FINALIZADO
-- =====================================================
-- Este script cria toda a estrutura necessária para o PsicoLife
-- Execute no MySQL Workbench para criar o banco completo