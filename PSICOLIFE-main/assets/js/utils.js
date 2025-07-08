// Utilitários comuns para toda a aplicação

const Utils = {
    // Função para mostrar feedback visual
    showFeedback: (type, message, duration = 5000) => {
        // Remover feedback anterior se existir
        const oldFeedback = document.querySelector('.feedback-message');
        if (oldFeedback) {
            oldFeedback.remove();
        }
        
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.innerHTML = `
            <div class="feedback-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
                <button class="close-feedback"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(feedback);
        
        // Mostrar com animação
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        // Configurar botão de fechar
        const closeBtn = feedback.querySelector('.close-feedback');
        closeBtn.addEventListener('click', () => {
            feedback.classList.remove('show');
            setTimeout(() => {
                feedback.remove();
            }, 300);
        });
        
        // Auto-fechar após duração especificada
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.classList.remove('show');
                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.remove();
                    }
                }, 300);
            }
        }, duration);
    },
    
    // Função para validar email
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Função para validar senha
    validatePassword: (password) => {
        return password && password.length >= 6;
    },
    
    // Função para formatar telefone
    formatPhone: (phone) => {
        let value = phone.replace(/\D/g, '');
        if (value.length > 0) {
            value = '(' + value;
            if (value.length > 3) {
                value = value.substring(0, 3) + ') ' + value.substring(3);
            }
            if (value.length > 10) {
                value = value.substring(0, 10) + '-' + value.substring(10, 14);
            }
        }
        return value;
    },
    
    // Função para verificar se usuário está autenticado
    isAuthenticated: () => {
        return window.API && window.API.auth ? window.API.auth.isAuthenticated() : false;
    },
    
    // Função para redirecionar se não autenticado
    requireAuth: (redirectTo = './signin.html') => {
        if (!Utils.isAuthenticated()) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },
    
    // Função para logout
    logout: () => {
        if (window.API && window.API.auth) {
            window.API.auth.logout();
        }
        window.location.href = './landing-page.html';
    },
    
    // Função para debounce (evitar múltiplas chamadas)
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Função para formatar data
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Função para obter ícone de humor
    getMoodIcon: (mood) => {
        const icons = {
            'feliz': 'smile',
            'neutro': 'meh',
            'triste': 'frown',
            'irritado': 'angry',
            'ansioso': 'tired',
            'animado': 'smile-beam'
        };
        return icons[mood.toLowerCase()] || 'smile';
    },
    
    // Função para sanitizar HTML
    sanitizeHTML: (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },
    
    // Função para copiar texto para clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            Utils.showFeedback('success', 'Texto copiado para a área de transferência!', 2000);
        } catch (err) {
            console.error('Erro ao copiar texto: ', err);
            Utils.showFeedback('error', 'Erro ao copiar texto', 2000);
        }
    },
    
    // Função para detectar dispositivo móvel
    isMobile: () => {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Função para scroll suave
    smoothScrollTo: (element) => {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },
    
    // Função para alternar tema
    toggleTheme: () => {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'dark');
        }
    },
    
    // Função para aplicar tema salvo
    applySavedTheme: () => {
        const savedTheme = localStorage.getItem('theme');
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
    },
    
    // Função para inicializar tema
    initTheme: () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', Utils.toggleTheme);
        }
        Utils.applySavedTheme();
    },
    
    // Função para logout simples
    simpleLogout: () => {
        localStorage.removeItem('userLogged');
        localStorage.removeItem('userLoggedIn');
        window.location.href = '../html/signin.html';
    },
    
    // Função para configurar botão de logout
    setupLogout: () => {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Utils.simpleLogout();
            });
        }
    }
};

// Inicializar tema e logout quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    Utils.initTheme();
    Utils.setupLogout();
});

// Disponibilizar globalmente
window.Utils = Utils;