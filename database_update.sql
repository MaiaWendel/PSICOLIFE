-- Script para atualizar o banco de dados com as novas funcionalidades

-- Atualizar tabela de usuários para relacionamento psicólogo-paciente
ALTER TABLE usuario 
MODIFY COLUMN psicologo_id INT,
ADD CONSTRAINT fk_usuario_psicologo 
FOREIGN KEY (psicologo_id) REFERENCES usuario(id) ON DELETE SET NULL;

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

-- Inserir psicólogos de exemplo
INSERT INTO usuario (nome, email, senha_hash, tipo, ativo, usuario) VALUES
('Dra. Ana Silva', 'ana.silva@psicolife.com', '$2b$12$example_hash_1', 'psicologo', TRUE, 'ana.silva'),
('Dr. Carlos Mendes', 'carlos.mendes@psicolife.com', '$2b$12$example_hash_2', 'psicologo', TRUE, 'carlos.mendes'),
('Dra. Juliana Alves', 'juliana.alves@psicolife.com', '$2b$12$example_hash_3', 'psicologo', TRUE, 'juliana.alves'),
('Dr. Ricardo Santos', 'ricardo.santos@psicolife.com', '$2b$12$example_hash_4', 'psicologo', TRUE, 'ricardo.santos')
ON DUPLICATE KEY UPDATE nome=VALUES(nome);