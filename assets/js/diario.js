document.addEventListener('DOMContentLoaded', function() {
    // Configuração do diário
    setupDiaryEntries();
    setupNewEntryModal();
    
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
    
    // Configuração das entradas do diário
    function setupDiaryEntries() {
        const entryItems = document.querySelectorAll('.entry-item');
        
        entryItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remover classe ativa de todas as entradas
                entryItems.forEach(entry => entry.classList.remove('active'));
                
                // Adicionar classe ativa à entrada clicada
                this.classList.add('active');
                
                // Aqui você carregaria os detalhes da entrada do backend
                // Por enquanto, vamos simular que já está carregado no HTML
            });
        });
        
        // Configurar botões de ação
        const editButton = document.querySelector('.entry-actions .btn-icon[title="Editar"]');
        const deleteButton = document.querySelector('.entry-actions .btn-icon[title="Excluir"]');
        
        if (editButton) {
            editButton.addEventListener('click', function() {
                // Aqui você abriria o modal de edição
                // Por enquanto, vamos apenas mostrar um feedback
                showFeedback('success', 'Modo de edição ativado');
            });
        }
        
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                if (confirm('Tem certeza que deseja excluir esta entrada?')) {
                    // Aqui você enviaria a solicitação de exclusão para o backend
                    // Por enquanto, vamos apenas mostrar um feedback
                    showFeedback('success', 'Entrada excluída com sucesso');
                }
            });
        }
    }
    
    // Configuração do modal de nova entrada
    function setupNewEntryModal() {
        const newEntryBtn = document.getElementById('new-entry-btn');
        const modal = document.getElementById('new-entry-modal');
        const closeModal = document.querySelector('.close-modal');
        const cancelModal = document.querySelector('.cancel-modal');
        const entryForm = document.getElementById('entry-form');
        
        if (newEntryBtn && modal) {
            newEntryBtn.addEventListener('click', function() {
                modal.style.display = 'block';
            });
            
            if (closeModal) {
                closeModal.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            }
            
            if (cancelModal) {
                cancelModal.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            }
            
            // Fechar modal ao clicar fora
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Envio do formulário
            if (entryForm) {
                entryForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Aqui você enviaria os dados para o backend
                    // Por enquanto, vamos apenas mostrar um feedback
                    
                    modal.style.display = 'none';
                    showFeedback('success', 'Entrada adicionada com sucesso!');
                });
            }
        }
    }
});