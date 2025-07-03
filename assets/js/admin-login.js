document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const CONFIG = {
        MAX_ATTEMPTS: 5,
        LOCKOUT_TIME: 5 * 60, // 5 minutos em segundos
        SESSION_EXPIRY: 30 * 24 * 60 * 60 * 1000 // 30 dias em ms
    };
    
    // Credenciais (em produção, isso viria do backend)
    const CREDENTIALS = {
        dev: [
            { username: 'wendel', password: hashPassword('dev123'), name: 'Wendel' },
            { username: 'raphael', password: hashPassword('dev123'), name: 'Raphael' },
            { username: 'igor', password: hashPassword('dev123'), name: 'Igor' },
            { username: 'pedro', password: hashPassword('dev123'), name: 'Pedro' }
        ],
        psi: [
            { username: 'ana.silva', password: hashPassword('psi123'), name: 'Dra. Ana Silva' },
            { username: 'carlos.mendes', password: hashPassword('psi123'), name: 'Dr. Carlos Mendes' },
            { username: 'juliana.alves', password: hashPassword('psi123'), name: 'Dra. Juliana Alves' },
            { username: 'ricardo.santos', password: hashPassword('psi123'), name: 'Dr. Ricardo Santos' }
        ],
        clinic: [
            { username: 'andreia.monteiro', password: hashPassword('clinica123'), name: 'Andreia Monteiro' }
        ]
    };
    
    // Estado da aplicação
    const state = {
        attempts: {},
        lockouts: {}
    };
    
    // Inicialização
    setupTabs();
    setupPasswordToggles();
    setupForms();
    setupModal();
    checkPreviousSession();
    
    // Configurar as abas
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remover classe ativa de todas as abas
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Adicionar classe ativa à aba selecionada
                button.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Limpar mensagens de erro
                document.querySelectorAll('.error-message').forEach(el => {
                    el.style.display = 'none';
                    el.textContent = '';
                });
            });
        });
    }
    
    // Configurar toggles de senha
    function setupPasswordToggles() {
        const toggles = document.querySelectorAll('.toggle-password');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    }
    
    // Configurar formulários
    function setupForms() {
        setupForm('dev', CREDENTIALS.dev);
        setupForm('psi', CREDENTIALS.psi);
        setupForm('clinic', CREDENTIALS.clinic);
    }
    
    // Configurar um formulário específico
    function setupForm(prefix, users) {
        const form = document.getElementById(`${prefix}-form`);
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById(`${prefix}-user`).value.trim();
            const password = document.getElementById(`${prefix}-pass`).value;
            const remember = document.getElementById(`${prefix}-remember`).checked;
            const errorElement = document.getElementById(`${prefix}-error`);
            
            // Verificar bloqueio
            if (isLocked(username)) {
                showModal(getRemainingLockoutTime(username));
                return;
            }
            
            // Mostrar loading
            const button = form.querySelector('.login-btn');
            toggleLoading(button, true);
            
            // Simular delay de rede (remover em produção)
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Verificar credenciais
            const user = users.find(u => u.username === username && u.password === hashPassword(password));
            
            if (user) {
                // Login bem-sucedido
                resetAttempts(username);
                loginSuccess(prefix, user, remember);
            } else {
                // Login falhou
                loginFailed(username, errorElement);
            }
            
            toggleLoading(button, false);
        });
    }
    
    // Hash de senha
    function hashPassword(password) {
        return CryptoJS.SHA256(password + 'PsicoLifeSalt').toString();
    }
    
    // Verificar se uma conta está bloqueada
    function isLocked(username) {
        const lockoutUntil = state.lockouts[username];
        return lockoutUntil && lockoutUntil > Math.floor(Date.now() / 1000);
    }
    
    // Obter tempo restante de bloqueio em segundos
    function getRemainingLockoutTime(username) {
        const now = Math.floor(Date.now() / 1000);
        const lockoutUntil = state.lockouts[username] || 0;
        return Math.max(0, lockoutUntil - now);
    }
    
    // Configurar modal
    function setupModal() {
        const modal = document.getElementById('lockout-modal');
        const closeBtn = document.querySelector('.close-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Mostrar modal de bloqueio
    function showModal(remainingSeconds) {
        const modal = document.getElementById('lockout-modal');
        const timer = document.getElementById('lockout-timer');
        
        if (!modal || !timer) return;
        
        modal.classList.add('active');
        
        // Atualizar timer
        updateTimer(timer, remainingSeconds);
    }
    
    // Atualizar timer
    function updateTimer(timerElement, seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
        
        if (seconds > 0) {
            setTimeout(() => updateTimer(timerElement, seconds - 1), 1000);
        } else {
            document.getElementById('lockout-modal').classList.remove('active');
        }
    }
    
    // Resetar tentativas de login
    function resetAttempts(username) {
        delete state.attempts[username];
        delete state.lockouts[username];
    }
    
    // Processar login bem-sucedido
    function loginSuccess(type, user, remember) {
        // Criar token de autenticação
        const token = generateToken(user);
        
        // Salvar informações do usuário
        const adminData = {
            name: user.name,
            username: user.username,
            type: type,
            token: token,
            expiry: Date.now() + CONFIG.SESSION_EXPIRY
        };
        
        // Salvar no localStorage
        localStorage.setItem('adminLogged', JSON.stringify(adminData));
        localStorage.setItem('adminLoggedIn', 'true');
        
        if (remember) {
            localStorage.setItem('rememberAdmin', 'true');
        } else {
            localStorage.removeItem('rememberAdmin');
        }
        
        // Redirecionar para o dashboard apropriado
        const dashboards = {
            dev: '../html/admin-dashboard.html',
            psi: '../html/psicologo-dashboard.html',
            clinic: '../html/clinica-dashboard.html'
        };
        
        window.location.href = dashboards[type];
    }
    
    // Processar login falho
    function loginFailed(username, errorElement) {
        // Incrementar tentativas
        state.attempts[username] = (state.attempts[username] || 0) + 1;
        
        // Verificar se excedeu o limite
        if (state.attempts[username] >= CONFIG.MAX_ATTEMPTS) {
            // Bloquear conta
            const now = Math.floor(Date.now() / 1000);
            state.lockouts[username] = now + CONFIG.LOCKOUT_TIME;
            
            showModal(CONFIG.LOCKOUT_TIME);
        } else {
            // Mostrar erro
            const remaining = CONFIG.MAX_ATTEMPTS - state.attempts[username];
            showError(errorElement, `Usuário ou senha incorretos. ${remaining} tentativa${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}.`);
        }
    }
    
    // Gerar token de autenticação
    function generateToken(user) {
        const data = {
            username: user.username,
            name: user.name,
            timestamp: Date.now()
        };
        
        return CryptoJS.AES.encrypt(
            JSON.stringify(data),
            'PsicoLifeSecretKey'
        ).toString();
    }
    
    // Verificar sessão anterior
    function checkPreviousSession() {
        const adminLogged = localStorage.getItem('adminLogged');
        
        if (adminLogged) {
            try {
                const session = JSON.parse(adminLogged);
                
                // Verificar expiração
                if (session.expiry && session.expiry > Date.now()) {
                    // Sessão válida, redirecionar para o dashboard
                    const dashboards = {
                        dev: '../html/admin-dashboard.html',
                        psi: '../html/psicologo-dashboard.html',
                        clinic: '../html/clinica-dashboard.html'
                    };
                    
                    window.location.href = dashboards[session.type];
                    return;
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
            }
            
            // Limpar sessão expirada ou inválida
            localStorage.removeItem('adminLogged');
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('rememberAdmin');
        }
    }
    
    // Alternar estado de loading
    function toggleLoading(button, isLoading) {
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (isLoading) {
            button.classList.add('loading');
            icon.style.display = 'none';
            text.textContent = 'Entrando...';
        } else {
            button.classList.remove('loading');
            icon.style.display = '';
            text.textContent = 'Entrar';
        }
    }
    
    // Mostrar mensagem de erro
    function showError(element, message) {
        if (!element) return;
        
        element.textContent = message;
        element.style.display = 'block';
    }
});