# 🧠 PSICOLIFE - GUIA DE APRESENTAÇÃO

## ✅ STATUS DO PROJETO

### VERIFICAÇÕES REALIZADAS:
- ✅ **Dependências**: Todas instaladas (Flask, SQLAlchemy, PyMySQL, etc.)
- ✅ **Conexão MySQL**: Funcionando com XAMPP
- ✅ **Configuração Flask**: App configurada corretamente
- ✅ **Estrutura de Arquivos**: Todos os arquivos essenciais presentes

## 🚀 COMO EXECUTAR PARA APRESENTAÇÃO

### 1. PREPARAÇÃO (5 minutos antes)
```bash
# 1. Inicie o XAMPP
# - Abra XAMPP Control Panel
# - Start Apache e MySQL

# 2. Vá para a pasta do Backend
cd "c:\Users\Wende\Downloads\PSICOLIFE-ATTPEDRO-main\PSICOLIFE-main\Backend"

# 3. Execute o servidor
python App.py
```

### 2. ACESSO À APLICAÇÃO
- **Frontend**: Abra `index.html` no navegador
- **API**: `http://localhost:5000/api`
- **phpMyAdmin**: `http://localhost/phpmyadmin`

## 🎯 ROTEIRO DE APRESENTAÇÃO

### 1. INTRODUÇÃO (2 min)
- **O que é**: Plataforma de bem-estar mental
- **Objetivo**: Complementar trabalho de psicólogos
- **Parceria**: Clínica Andreia Monteiro - Atibaia/SP

### 2. DEMONSTRAÇÃO TÉCNICA (8 min)

#### A. ARQUITETURA
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python Flask + MySQL
- **Banco**: 6 tabelas relacionais

#### B. FUNCIONALIDADES
1. **Sistema de Login**
   - Usuários: Paciente, Psicólogo, Admin
   - JWT Authentication

2. **Diário Emocional**
   - Registro de humor diário
   - Reflexões pessoais
   - Histórico completo

3. **Quiz de Autoavaliação**
   - Questionários personalizados
   - Análise de resultados
   - Acompanhamento temporal

4. **Dashboard do Psicólogo**
   - Acompanhamento de pacientes
   - Registro de evolução
   - Gráficos de progresso

5. **Guia de Escape**
   - Técnicas de relaxamento
   - Recursos para crises

#### C. BANCO DE DADOS
- **6 Tabelas**: usuario, contato, entrada_diario, quiz, resposta_quiz, evolucao_paciente
- **Relacionamentos**: Chaves estrangeiras bem definidas
- **Segurança**: Senhas criptografadas, validações

### 3. DEMONSTRAÇÃO PRÁTICA (5 min)
1. **Login como Paciente**
2. **Criar entrada no diário**
3. **Responder quiz**
4. **Login como Psicólogo**
5. **Visualizar evolução do paciente**

## 🔑 USUÁRIOS PARA DEMONSTRAÇÃO

### Admin
- **Email**: admin@psicolife.com
- **Senha**: admin123

### Psicólogos
- **Dra. Ana Silva**: ana.silva@psicolife.com / psicologo123
- **Dr. Carlos Mendes**: carlos.mendes@psicolife.com / psicologo123

### Pacientes
- Criar durante a apresentação

## 📊 DADOS PARA MOSTRAR

### Estatísticas do Sistema
```sql
-- Ver usuários por tipo
SELECT tipo, COUNT(*) FROM usuario GROUP BY tipo;

-- Ver atividade do diário
SELECT DATE(data_criacao), COUNT(*) FROM entrada_diario GROUP BY DATE(data_criacao);

-- Ver respostas de quiz
SELECT quiz_id, COUNT(*) FROM resposta_quiz GROUP BY quiz_id;
```

## 🎨 PONTOS FORTES A DESTACAR

1. **Interface Responsiva**: Funciona em desktop, tablet e mobile
2. **Segurança**: Autenticação JWT, senhas criptografadas
3. **Escalabilidade**: Arquitetura modular, fácil de expandir
4. **Usabilidade**: Interface intuitiva, foco na experiência do usuário
5. **Profissional**: Desenvolvido com parceria real de clínica

## 🔧 TROUBLESHOOTING RÁPIDO

### Se der erro na apresentação:
1. **Banco não conecta**: Verificar se MySQL está rodando no XAMPP
2. **Página não carrega**: Verificar se Flask está rodando na porta 5000
3. **Login não funciona**: Verificar se Init_DB.py foi executado

### Comandos de emergência:
```bash
# Reiniciar banco
python Backend/Init_DB.py

# Verificar conexão
python -c "import pymysql; pymysql.connect(host='localhost', user='root', password='', database='psicolife')"

# Testar Flask
python -c "from Backend.App import app; print('OK')"
```

## 🏆 CONCLUSÃO

### Resultados Alcançados:
- ✅ Sistema completo e funcional
- ✅ Banco de dados estruturado
- ✅ Interface profissional
- ✅ Parceria real estabelecida
- ✅ Pronto para uso em produção

### Próximos Passos:
- Deploy em servidor
- Testes com usuários reais
- Expansão de funcionalidades
- Integração com mais clínicas

---

**PROJETO PRONTO PARA APRESENTAÇÃO! 🎉**