# 🧠 PsicoLife - Plataforma de Bem-Estar Mental

> **Transformando vidas através do cuidado com a saúde mental**

Uma plataforma digital completa para acompanhamento psicológico, desenvolvida em parceria com a **Clínica Andreia Monteiro Espaço Saúde e Fisioterapia Integrada** em Atibaia-SP.

## 📋 Sobre o Projeto

PsicoLife é uma aplicação web que oferece ferramentas digitais para complementar o trabalho dos profissionais de psicologia, incluindo:

- 📝 **Diário Emocional** - Registro de sentimentos e reflexões diárias
- 🧩 **Quiz de Autoavaliação** - Questionários para avaliar estado emocional
- 🆘 **Guia de Escape** - Técnicas de relaxamento e recursos para momentos difíceis
- 👥 **Gestão de Usuários** - Sistema completo de cadastro e autenticação
- 📊 **Dashboard Administrativo** - Painel para profissionais acompanharem pacientes
- 👩‍⚕️ **Dashboard do Psicólogo** - Ferramenta especializada para acompanhamento de evolução de pacientes

## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e responsividade
- **JavaScript ES6+** - Interatividade e integração com API
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Poppins)

### Backend
- **Python 3.8+** - Linguagem principal
- **Flask** - Framework web
- **SQLAlchemy** - ORM para banco de dados
- **Flask-JWT-Extended** - Autenticação JWT
- **Flask-CORS** - Controle de acesso
- **Werkzeug** - Utilitários web

### Banco de Dados
- **MySQL** - Banco de dados principal
- **SQLite** - Desenvolvimento local

## 📁 Estrutura do Projeto

```
PsicoLife/
├── 📂 Backend/
│   ├── 📂 Api/           # Endpoints da API REST
│   ├── 📂 Models/        # Modelos de dados
│   ├── App.py           # Aplicação principal
│   ├── Config.py        # Configurações
│   └── Init_DB.py       # Inicialização do banco
├── 📂 assets/
│   ├── 📂 css/          # Estilos
│   ├── 📂 html/         # Páginas web
│   ├── 📂 js/           # Scripts JavaScript
│   └── 📂 images/       # Imagens e recursos
└── index.html           # Página inicial
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- MySQL Server
- Navegador web moderno

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/psicolife.git
cd psicolife
```

### 2. Configure o Backend
```bash
cd Backend
pip install -r requirements.txt
```

### 3. Configure o Banco de Dados
```sql
CREATE DATABASE psicolife CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Configure as Variáveis de Ambiente
Crie um arquivo `.env` no diretório Backend:
```env
SECRET_KEY=sua-chave-secreta
DATABASE_URL=mysql+pymysql://usuario:senha@localhost/psicolife
JWT_SECRET_KEY=sua-chave-jwt
```

### 5. Inicialize o Banco de Dados
```bash
python Init_DB.py
```

### 6. Execute o Servidor
```bash
python App.py
```

### 7. Acesse a Aplicação
Abra `index.html` no navegador ou acesse `http://localhost:5000`

## 👤 Usuários Padrão

### Administrador
- **Email:** admin@psicolife.com
- **Senha:** admin123

### Psicólogos
- **Dra. Ana Silva:** ana.silva@psicolife.com / psicologo123
- **Dr. Carlos Mendes:** carlos.mendes@psicolife.com / psicologo123
- **Dra. Juliana Alves:** juliana.alves@psicolife.com / psicologo123
- **Dr. Ricardo Santos:** ricardo.santos@psicolife.com / psicologo123

## 🔧 Funcionalidades

### 🔐 Autenticação
- Cadastro de usuários
- Login seguro com JWT
- Recuperação de senha
- Perfis de usuário (Paciente, Psicólogo, Admin)

### 📝 Diário Emocional
- Registro de humor diário
- Reflexões pessoais
- Sistema de tags
- Histórico completo

### 🧩 Quiz de Autoavaliação
- Questionários personalizados
- Análise de resultados
- Recomendações baseadas nas respostas
- Histórico de avaliações

### 🆘 Guia de Escape
- Técnicas de respiração
- Meditações guiadas
- Vídeos relaxantes
- Músicas para bem-estar
- Atividades terapêuticas

### 📊 Dashboard
- Visão geral do progresso
- Estatísticas de uso
- Acesso rápido às funcionalidades

### 👩‍⚕️ Dashboard do Psicólogo
- Acompanhamento de pacientes
- Registro de evolução clínica
- Gráficos de progresso
- Timeline de avaliações
- Visualização de atividades do paciente

## 🔒 Segurança

- **Autenticação JWT** para sessões seguras
- **Hash de senhas** com Werkzeug
- **Validação de dados** no frontend e backend
- **Sanitização de inputs** contra XSS
- **CORS configurado** para requisições seguras

## 📱 Responsividade

- Design adaptável para desktop, tablet e mobile
- Interface otimizada para diferentes tamanhos de tela
- Experiência consistente em todos os dispositivos

## 🤝 Parceria

Desenvolvido em parceria com:

**Clínica Andreia Monteiro Espaço Saúde e Fisioterapia Integrada**
- 📍 Rua Castro Fafe, 333 - 1° Andar - Bloco B - Centro, Atibaia - SP
- 📞 (11) 4402-7675 / (11) 4411-9232
- 📱 [@clinicaandreiamonteiro](https://www.instagram.com/clinicaandreiamonteiro)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

- **Email:** contato@psicolife.com.br
- **Instagram:** [@clinicaandreiamonteiro](https://www.instagram.com/clinicaandreiamonteiro)

---

<div align="center">

**PsicoLife** - *Bem-estar emocional ao seu alcance* 🧠💙

Desenvolvido com ❤️ para transformar vidas através do cuidado com a saúde mental

</div>