// Script para ajustar navegação baseado no status de login
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    // Ajustar link de início baseado no status de login
    const homeLinks = document.querySelectorAll('a[href*="landing-page.html"], a[href*="dashboard.html"]');
    
    homeLinks.forEach(link => {
        if (link.textContent.includes('Início') || link.innerHTML.includes('fa-home')) {
            if (isLoggedIn) {
                link.href = './dashboard.html';
            } else {
                link.href = './landing-page.html';
            }
        }
    });
    
    // Mostrar/ocultar elementos baseado no login
    const userMenus = document.querySelectorAll('.user-menu');
    const authButtons = document.querySelectorAll('.auth-buttons');
    
    if (isLoggedIn) {
        userMenus.forEach(menu => menu.style.display = 'block');
        authButtons.forEach(buttons => buttons.style.display = 'none');
        
        // Atualizar nome do usuário
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        const userNameElement = document.getElementById('user-name');
        
        if (userNameElement && userLogged.nome) {
            const firstName = userLogged.nome.split(' ')[0];
            userNameElement.textContent = firstName;
        }
    } else {
        userMenus.forEach(menu => menu.style.display = 'none');
        authButtons.forEach(buttons => buttons.style.display = 'flex');
    }
});