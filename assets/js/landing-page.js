document.addEventListener('DOMContentLoaded', function() {
    // Garantir que o tema funcione
    if (window.Utils && window.Utils.initTheme) {
        window.Utils.initTheme();
    }
    
    // Configuração do formulário de contato
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter os dados do formulário
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Aqui você enviaria os dados para o backend
            // Por enquanto, vamos simular uma resposta bem-sucedida
            
            // Mostrar feedback de sucesso
            showFeedback('success', 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
            
            // Limpar o formulário
            contactForm.reset();
        });
    }
    
    // Função para mostrar feedback
    function showFeedback(type, message) {
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
        
        // Auto-fechar após 5 segundos
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.classList.remove('show');
                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
});