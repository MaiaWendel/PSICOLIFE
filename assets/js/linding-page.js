// scripts.js
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".menu-link");
    const sections = document.querySelectorAll(".content-section");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Função para exibir a seção correspondente
    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove("active");
            if (section.id === targetId) {
                section.classList.add("active");
            }
        });
    }

    // Adicionar evento de clique aos links do menu
    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const targetId = link.getAttribute("data-target");
            showSection(targetId);
        });
    });

    // Alternar tema claro/escuro
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-theme");
    });

    // Exibir a seção inicial ao carregar a página
    showSection("sobre");

    const profileButton = document.getElementById('profile-button');
    profileButton.addEventListener('click', function() {
        window.location.href = '#perfil';
    });
});
