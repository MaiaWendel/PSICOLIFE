// Função para verificar se o usuário está logado
function checkUserLogin() {
    // Usar a função do utils.js que não redireciona automaticamente
    if (!Utils.isAuthenticated()) {
        window.location.href = '../html/signin.html';
        return;
    }
    
    const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
    
    // Verificar se é psicólogo e adicionar link para dashboard específico
    if (userLogged.tipo === 'psicologo') {
        addPsychologistDashboardLink();
    }
    
    // Atualizar nome do usuário na interface
    const userNameElement = document.getElementById('user-name');
    const userWelcomeNameElement = document.getElementById('user-welcome-name');
    
    if (userNameElement && userLogged.nome) {
        // Pegar apenas o primeiro nome
        const firstName = userLogged.nome.split(' ')[0];
        userNameElement.textContent = firstName;
    }
    
    if (userWelcomeNameElement && userLogged.nome) {
        userWelcomeNameElement.textContent = userLogged.nome;
    }
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
    } else {
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
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
    }
}

// Função para animar elementos quando entram na viewport
function animateOnScroll() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// Função para rolagem suave ao clicar em links internos
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}



// Inicializar todas as funções quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o usuário está logado, mas não redirecionar automaticamente
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (isLoggedIn) {
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        
        // Atualizar nome do usuário na interface
        const userNameElement = document.getElementById('user-name');
        const userWelcomeNameElement = document.getElementById('user-welcome-name');
        
        if (userNameElement && userLogged.nome) {
            const firstName = userLogged.nome.split(' ')[0];
            userNameElement.textContent = firstName;
        }
        
        if (userWelcomeNameElement && userLogged.nome) {
            userWelcomeNameElement.textContent = userLogged.nome;
        }
        
        // Verificar se é psicólogo e adicionar link para dashboard específico
        if (userLogged.tipo === 'psicologo') {
            addPsychologistDashboardLink();
        }
    } else {
        // Se não estiver logado, mostrar mensagem de boas-vindas genérica
        const userWelcomeNameElement = document.getElementById('user-welcome-name');
        if (userWelcomeNameElement) {
            userWelcomeNameElement.textContent = 'Visitante';
        }
    }
    
    // Garantir que o tema funcione
    if (window.Utils && window.Utils.initTheme) {
        window.Utils.initTheme();
    } else {
        // Fallback caso utils.js não esteja carregado
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        checkSavedTheme();
    }
    
    // Configurar animações de rolagem
    animateOnScroll();
    
    // Configurar rolagem suave
    smoothScroll();
    

});

// Função para adicionar link do dashboard do psicólogo
function addPsychologistDashboardLink() {
    const nav = document.querySelector('nav');
    if (nav && !document.querySelector('.psychologist-dashboard-link')) {
        const link = document.createElement('a');
        link.href = './psicologo-dashboard.html';
        link.className = 'psychologist-dashboard-link';
        link.innerHTML = '<i class="fas fa-users-cog"></i> Meus Pacientes';
        
        // Inserir após o link "Início"
        const homeLink = nav.querySelector('a[href*="dashboard"]');
        if (homeLink && homeLink.nextSibling) {
            nav.insertBefore(link, homeLink.nextSibling);
        } else {
            nav.appendChild(link);
        }
    }
}

// Adicionar estilos CSS para animações
document.head.insertAdjacentHTML('beforeend', `
<style>
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
</style>
`);