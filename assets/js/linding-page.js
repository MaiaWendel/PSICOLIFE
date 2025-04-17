// Selecionar elementos do DOM
const themeToggle = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('nav a');
const profileButton = document.getElementById('profile-button');
const inicioButton = document.querySelector('nav a[href="./index.html"]'); // Botão "Início"

// Função para alternar entre temas claro e escuro
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'Escuro' : 'Claro';
    themeToggle.innerText = `Tema: ${theme}`;
}

// Adicionar evento de clique no botão de alternar tema
themeToggle.addEventListener('click', toggleTheme);

// Adicionar comportamento de rolagem suave para os links de navegação
navLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Mostrar alerta ao clicar no botão de perfil (exemplo de interatividade)
profileButton.addEventListener('click', () => {
    alert('Perfil: Funcionalidade em desenvolvimento.');
});

// Função para exibir uma mensagem dinâmica de boas-vindas
function showWelcomeMessage() {
    const currentHour = new Date().getHours();
    const messages = {
        morning: 'Bom dia! Bem-vindo à PsicoLife.',
        afternoon: 'Boa tarde! Que bom tê-lo aqui.',
        evening: 'Boa noite! Esperamos que esteja bem.',
        default: 'Bem-vindo!'
    };

    let welcomeMessage = messages.default;
    if (currentHour >= 5 && currentHour < 12) {
        welcomeMessage = messages.morning;
    } else if (currentHour >= 12 && currentHour < 18) {
        welcomeMessage = messages.afternoon;
    } else {
        welcomeMessage = messages.evening;
    }

    const headerElement = document.querySelector('header h1');
    if (headerElement) {
        headerElement.innerText = welcomeMessage;
    } else {
        console.warn('Elemento de cabeçalho não encontrado.');
    }
}

// Chamar a função de boas-vindas ao carregar a página
window.addEventListener('DOMContentLoaded', showWelcomeMessage);

// Animações simples para as seções ao rolar a página
const sections = document.querySelectorAll('section');
function animateSectionsOnScroll() {
    const viewportHeight = window.innerHeight;
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < viewportHeight - 100) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
}

// Adicionar evento de rolagem para animações
window.addEventListener('scroll', animateSectionsOnScroll);

// Adicionar funcionalidade para o botão "Início" sempre voltar à Landing Page
inicioButton.addEventListener("click", function(event) {
    event.preventDefault(); // Impede a ação padrão do link
    window.location.href = "./index.html"; // Redireciona para a Landing Page
});
