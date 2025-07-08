-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS psicolife CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE psicolife;

-- Tabela: Usuario
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    psicologo_id INT NOT NULL,
    nome VARCHAR(100) ,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo VARCHAR(50), -- paciente, psicologo, etc.
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
   FOREIGN KEY (psicologo_id) REFERENCES usuario(id) ON DELETE SET NULL
);

-- Tabela: Contato
CREATE TABLE Contato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    assunto VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL
);

-- Tabela: EntradaDiario
CREATE TABLE EntradaDiario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    conteudo TEXT NOT NULL,
    humor VARCHAR(20) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: EvolucaoPaciente
-- Criar tabela de evolução de pacientes
CREATE TABLE IF NOT EXISTS evolucao_paciente (
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
    
    -- Chaves estrangeiras
    FOREIGN KEY (paciente_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (psicologo_id) REFERENCES usuario(id) ON DELETE CASCADE,
    
    -- Índices para performance
    INDEX idx_paciente_data (paciente_id, data_avaliacao),
    INDEX idx_psicologo_data (psicologo_id, data_avaliacao)
);
-- Tabela: Quiz
CREATE TABLE Quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    perguntas TEXT -- JSON com perguntas e alternativas
);

-- Tabela: RespostaQuiz (deduzida)
CREATE TABLE RespostaQuiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    quiz_id INT NOT NULL,
    respostas TEXT, -- JSON com as respostas
    data_resposta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (quiz_id) REFERENCES Quiz(id)
);
