// Função para verificar se o usuário está logado
function checkUserLogin() {
    const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    // Se não estiver logado, redirecionar para a página de login
    if (!isLoggedIn) {
        window.location.href = '../html/signin.html';
        return;
    }
    
    // Atualizar nome do usuário na interface
    const userNameElement = document.getElementById('user-name');
    
    if (userNameElement && userLogged.nome) {
        // Pegar apenas o primeiro nome
        const firstName = userLogged.nome.split(' ')[0];
        userNameElement.textContent = firstName;
    }
    
    // Preencher os campos do formulário com os dados do usuário
    fillAccountForm(userLogged);
}

// Função para preencher o formulário de conta com os dados do usuário
function fillAccountForm(userData) {
    // Buscar o usuário completo na lista de usuários
    const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
    const userFull = listaUser.find(user => user.usuario === userData.usuario) || userData;
    
    // Preencher os campos
    document.getElementById('email').value = userFull.email || '';
    document.getElementById('telefone').value = userFull.telefone || '';
}

// Função para alternar o tema
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
        
        // Atualizar o radio button do tema
        document.getElementById('theme-light').checked = true;
    } else {
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
        
        // Atualizar o radio button do tema
        document.getElementById('theme-dark').checked = true;
    }
}

// Função para verificar o tema salvo
function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        
        // Atualizar o radio button do tema
        document.getElementById('theme-dark').checked = true;
    } else if (savedTheme === 'light') {
        document.getElementById('theme-light').checked = true;
    } else {
        document.getElementById('theme-system').checked = true;
    }
}

// Função para alternar entre as seções de configurações
function setupSettingsNavigation() {
    const menuLinks = document.querySelectorAll('.settings-menu a');
    const sections = document.querySelectorAll('.settings-section');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe ativa de todos os links e seções
            menuLinks.forEach(item => item.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Adicionar classe ativa ao link clicado
            this.classList.add('active');
            
            // Mostrar a seção correspondente
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Função para configurar o formulário de conta
function setupAccountForm() {
    const accountForm = document.getElementById('account-form');
    
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const idioma = document.getElementById('idioma').value;
        
        // Validar campos
        if (!email) {
            alert('Por favor, informe um email válido.');
            return;
        }
        
        // Atualizar dados no localStorage
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        
        // Encontrar e atualizar o usuário na lista
        const userIndex = listaUser.findIndex(user => user.usuario === userLogged.usuario);
        
        if (userIndex !== -1) {
            listaUser[userIndex].email = email;
            listaUser[userIndex].telefone = telefone;
            listaUser[userIndex].idioma = idioma;
            
            // Atualizar localStorage
            localStorage.setItem('listaUser', JSON.stringify(listaUser));
            
            // Atualizar dados do usuário logado
            userLogged.email = email;
            localStorage.setItem('userLogged', JSON.stringify(userLogged));
            
            alert('Configurações de conta atualizadas com sucesso!');
        }
    });
}

// Função para configurar o formulário de segurança
function setupSecurityForm() {
    const securityForm = document.getElementById('security-form');
    
    // Configurar toggles de visibilidade de senha
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    securityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const senhaAtual = document.getElementById('senha-atual').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        const autenticacao = document.getElementById('autenticacao').checked;
        
        // Validar campos
        if (!senhaAtual) {
            alert('Por favor, informe sua senha atual.');
            return;
        }
        
        if (!novaSenha) {
            alert('Por favor, informe uma nova senha.');
            return;
        }
        
        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }
        
        // Verificar se a senha atual está correta
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        const user = listaUser.find(user => user.usuario === userLogged.usuario);
        
        if (user && user.senha === senhaAtual) {
            // Atualizar senha
            const userIndex = listaUser.findIndex(user => user.usuario === userLogged.usuario);
            listaUser[userIndex].senha = novaSenha;
            listaUser[userIndex].autenticacaoDoisFatores = autenticacao;
            
            // Atualizar localStorage
            localStorage.setItem('listaUser', JSON.stringify(listaUser));
            
            alert('Senha atualizada com sucesso!');
            
            // Limpar campos
            document.getElementById('senha-atual').value = '';
            document.getElementById('nova-senha').value = '';
            document.getElementById('confirmar-senha').value = '';
        } else {
            alert('Senha atual incorreta.');
        }
    });
    
    // Configurar botão de exclusão de conta
    const btnDeleteAccount = document.querySelector('.btn-danger');
    btnDeleteAccount.addEventListener('click', async function() {
        const confirmDelete = confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
        
        if (confirmDelete) {
            try {
                const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
                
                if (userLogged.email) {
                    // Excluir do backend
                    const response = await fetch('http://localhost:5000/api/auth/excluir', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: userLogged.email })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        alert('Sua conta foi excluída com sucesso.');
                    } else {
                        alert('Erro ao excluir conta: ' + result.mensagem);
                        return;
                    }
                } else {
                    alert('Erro: usuário não identificado.');
                    return;
                }
                
                // Limpar todos os dados de sessão
                localStorage.removeItem('userLogged');
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                window.location.href = '../html/signin.html';
                
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao excluir conta. Tente novamente.');
            }
        }
    });
}

// Função para configurar o formulário de notificações
function setupNotificationsForm() {
    const notificationsForm = document.getElementById('notifications-form');
    
    notificationsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const emailLembretes = document.getElementById('email-lembretes').checked;
        const emailDicas = document.getElementById('email-dicas').checked;
        const emailAtualizacoes = document.getElementById('email-atualizacoes').checked;
        const appLembretes = document.getElementById('app-lembretes').checked;
        const appConsultas = document.getElementById('app-consultas').checked;
        const appMensagens = document.getElementById('app-mensagens').checked;
        
        // Salvar preferências no localStorage
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        const userIndex = listaUser.findIndex(user => user.usuario === userLogged.usuario);
        
        if (userIndex !== -1) {
            // Criar objeto de notificações se não existir
            if (!listaUser[userIndex].notificacoes) {
                listaUser[userIndex].notificacoes = {};
            }
            
            // Atualizar preferências
            listaUser[userIndex].notificacoes = {
                email: {
                    lembretes: emailLembretes,
                    dicas: emailDicas,
                    atualizacoes: emailAtualizacoes
                },
                app: {
                    lembretes: appLembretes,
                    consultas: appConsultas,
                    mensagens: appMensagens
                }
            };
            
            // Atualizar localStorage
            localStorage.setItem('listaUser', JSON.stringify(listaUser));
            
            alert('Preferências de notificações salvas com sucesso!');
        }
    });
}

// Função para configurar o formulário de privacidade
function setupPrivacyForm() {
    const privacyForm = document.getElementById('privacy-form');
    
    privacyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const compartilharDiario = document.getElementById('compartilhar-diario').checked;
        const compartilharQuiz = document.getElementById('compartilhar-quiz').checked;
        const compartilharAtividade = document.getElementById('compartilhar-atividade').checked;
        const cookiesAnaliticos = document.getElementById('cookies-analiticos').checked;
        const cookiesMarketing = document.getElementById('cookies-marketing').checked;
        
        // Salvar preferências no localStorage
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        const userIndex = listaUser.findIndex(user => user.usuario === userLogged.usuario);
        
        if (userIndex !== -1) {
            // Criar objeto de privacidade se não existir
            if (!listaUser[userIndex].privacidade) {
                listaUser[userIndex].privacidade = {};
            }
            
            // Atualizar preferências
            listaUser[userIndex].privacidade = {
                compartilhamento: {
                    diario: compartilharDiario,
                    quiz: compartilharQuiz,
                    atividade: compartilharAtividade
                },
                cookies: {
                    analiticos: cookiesAnaliticos,
                    marketing: cookiesMarketing
                }
            };
            
            // Atualizar localStorage
            localStorage.setItem('listaUser', JSON.stringify(listaUser));
            
            alert('Preferências de privacidade salvas com sucesso!');
        }
    });
    
    // Configurar botão de download de dados
    const btnDownloadData = document.querySelector('.btn-secondary');
    btnDownloadData.addEventListener('click', function() {
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        const user = listaUser.find(user => user.usuario === userLogged.usuario);
        
        if (user) {
            // Criar um objeto com os dados do usuário
            const userData = {
                perfil: {
                    nome: user.nomeCompleto || user.nome,
                    usuario: user.usuario,
                    email: user.email,
                    telefone: user.telefone,
                    sexo: user.sexo,
                    psicologo: user.psicologo,
                    dataCadastro: user.dataCadastro
                },
                configuracoes: {
                    notificacoes: user.notificacoes || {},
                    privacidade: user.privacidade || {}
                }
            };
            
            // Converter para JSON
            const dataStr = JSON.stringify(userData, null, 2);
            
            // Criar um blob e link para download
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'meus_dados_psicolife.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });
}

// Função para configurar o formulário de aparência
function setupAppearanceForm() {
    const appearanceForm = document.getElementById('appearance-form');
    const themeOptions = document.querySelectorAll('input[name="theme"]');
    const fontSizeSlider = document.getElementById('font-size');
    
    // Configurar alteração de tema
    themeOptions.forEach(option => {
        option.addEventListener('change', function() {
            const theme = this.value;
            
            if (theme === 'light') {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
                
                // Atualizar ícone do botão de tema
                const themeIcon = document.querySelector('#theme-toggle i');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else if (theme === 'dark') {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                
                // Atualizar ícone do botão de tema
                const themeIcon = document.querySelector('#theme-toggle i');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                // Tema do sistema
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (prefersDark) {
                    document.body.classList.add('dark-theme');
                    
                    // Atualizar ícone do botão de tema
                    const themeIcon = document.querySelector('#theme-toggle i');
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    document.body.classList.remove('dark-theme');
                    
                    // Atualizar ícone do botão de tema
                    const themeIcon = document.querySelector('#theme-toggle i');
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                
                localStorage.setItem('theme', 'system');
            }
        });
    });
    
    // Configurar tamanho da fonte
    fontSizeSlider.addEventListener('input', function() {
        const fontSize = this.value;
        document.documentElement.style.fontSize = `${fontSize}%`;
        localStorage.setItem('fontSize', fontSize);
    });
    
    // Carregar tamanho da fonte salvo
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSizeSlider.value = savedFontSize;
        document.documentElement.style.fontSize = `${savedFontSize}%`;
    }
    
    appearanceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const theme = document.querySelector('input[name="theme"]:checked').value;
        const fontSize = fontSizeSlider.value;
        
        // Salvar preferências no localStorage
        localStorage.setItem('theme', theme);
        localStorage.setItem('fontSize', fontSize);
        
        alert('Preferências de aparência salvas com sucesso!');
    });
}



// Inicializar todas as funções quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar login do usuário
    checkUserLogin();
    
    // Adicionar evento ao botão de alternar tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Verificar tema salvo
    checkSavedTheme();
    
    // Configurar navegação das configurações
    setupSettingsNavigation();
    
    // Configurar formulário de conta
    setupAccountForm();
    
    // Configurar formulário de segurança
    setupSecurityForm();
    
    // Configurar formulário de notificações
    setupNotificationsForm();
    
    // Configurar formulário de privacidade
    setupPrivacyForm();
    
    // Configurar formulário de aparência
    setupAppearanceForm();
    

});