document.addEventListener('DOMContentLoaded', function() {
    // Atualizar nome do usuário
    updateUserName();
    
    // Dados das entradas
    const entriesData = {
        0: { // Dia produtivo
            title: 'Dia produtivo',
            date: '20 de Maio de 2025, 14:30',
            mood: 'Feliz',
            moodIcon: 'fas fa-smile mood-icon happy',
            content: 'Hoje foi um dia muito produtivo. Consegui terminar todas as tarefas que havia planejado e ainda tive tempo para relaxar um pouco. Pela manhã, fiz exercícios físicos e me senti muito bem. O exercício realmente ajuda a melhorar meu humor e me dá mais energia para o dia.',
            tags: ['trabalho', 'produtividade', 'bem-estar', 'família'],
            reflections: {
                good: 'Completar minhas tarefas, receber reconhecimento no trabalho e passar tempo com a família.',
                learned: 'Que equilibrar trabalho e descanso é fundamental para meu bem-estar.',
                improve: 'Dedicar mais tempo para leitura e desenvolvimento pessoal.'
            }
        },
        1: { // Dia comum
            title: 'Dia comum',
            date: '19 de Maio de 2025, 16:45',
            mood: 'Neutro',
            moodIcon: 'fas fa-meh mood-icon neutral',
            content: 'Nada de especial aconteceu hoje. Fiz as tarefas rotineiras, trabalhei normalmente e voltei para casa. Foi um dia tranquilo, sem grandes emoções ou eventos marcantes. Às vezes é bom ter dias assim, mais calmos.',
            tags: ['rotina', 'trabalho', 'tranquilidade'],
            reflections: {
                good: 'A tranquilidade e estabilidade do dia.',
                learned: 'Que nem todos os dias precisam ser extraordinários.',
                improve: 'Adicionar pequenas atividades que tragam mais alegria ao dia.'
            }
        },
        2: { // Dia difícil
            title: 'Dia difícil',
            date: '18 de Maio de 2025, 20:15',
            mood: 'Triste',
            moodIcon: 'fas fa-frown mood-icon sad',
            content: 'Hoje foi um dia complicado. Tive dificuldades no trabalho e me senti sobrecarregado. Algumas situações me deixaram triste e desanimado. Espero que amanhã seja melhor.',
            tags: ['dificuldades', 'trabalho', 'tristeza'],
            reflections: {
                good: 'Consegui superar os desafios, mesmo sendo difícil.',
                learned: 'Que é normal ter dias ruins e que eles passam.',
                improve: 'Buscar ajuda quando me sentir sobrecarregado.'
            }
        },
        3: { // Problemas no trabalho
            title: 'Problemas no trabalho',
            date: '17 de Maio de 2025, 18:30',
            mood: 'Irritado',
            moodIcon: 'fas fa-angry mood-icon angry',
            content: 'Tive alguns problemas no trabalho hoje que me deixaram irritado. Houve conflitos com colegas e prazos apertados que geraram muito estresse. Preciso encontrar formas melhores de lidar com essas situações.',
            tags: ['trabalho', 'estresse', 'conflitos'],
            reflections: {
                good: 'Consegui manter a calma na maior parte do tempo.',
                learned: 'A importância da comunicação clara para evitar conflitos.',
                improve: 'Desenvolver melhores estratégias para lidar com o estresse.'
            }
        },
        4: { // Novos planos
            title: 'Novos planos',
            date: '16 de Maio de 2025, 19:00',
            mood: 'Animado',
            moodIcon: 'fas fa-smile-beam mood-icon excited',
            content: 'Hoje comecei a planejar minhas férias e estou muito animado! Pesquisei destinos, fiz orçamentos e já estou imaginando como será relaxante. Ter algo para esperar realmente melhora o humor.',
            tags: ['férias', 'planejamento', 'animação'],
            reflections: {
                good: 'A expectativa e o planejamento das férias.',
                learned: 'Que ter algo para esperar melhora muito o humor.',
                improve: 'Organizar melhor meu tempo para aproveitar mais momentos assim.'
            }
        }
    };

    // Configurar cliques nas entradas
    const entryItems = document.querySelectorAll('.entry-item');
    
    entryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remover classe ativa de todas as entradas
            entryItems.forEach(entry => entry.classList.remove('active'));
            
            // Adicionar classe ativa à entrada clicada
            this.classList.add('active');
            
            // Atualizar índice atual
            currentEntryIndex = index;
            
            // Carregar conteúdo da entrada
            loadEntry(index);
        });
    });

    // Função para carregar entrada
    function loadEntry(index) {
        // Primeiro tentar carregar entradas salvas
        const savedEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
        let entry;
        
        if (savedEntries.length > 0 && index < savedEntries.length) {
            entry = savedEntries[index];
        } else {
            // Ajustar índice para entradas padrão
            const adjustedIndex = index - savedEntries.length;
            entry = entriesData[adjustedIndex];
        }
        
        if (!entry) return;

        // Atualizar título
        const titleElement = document.querySelector('.entry-content h2');
        if (titleElement) titleElement.textContent = entry.title;

        // Atualizar data
        const dateElement = document.querySelector('.entry-date-full span');
        if (dateElement) dateElement.textContent = entry.date;

        // Atualizar humor
        const moodElement = document.querySelector('.entry-mood-full');
        if (moodElement) {
            moodElement.innerHTML = `<i class="${entry.moodIcon}"></i><span>${entry.mood}</span>`;
        }

        // Atualizar conteúdo
        const contentElement = document.querySelector('.entry-text');
        if (contentElement) {
            contentElement.innerHTML = `<p>${entry.content}</p>`;
        }

        // Atualizar tags
        const tagsElement = document.querySelector('.entry-tags');
        if (tagsElement) {
            tagsElement.innerHTML = entry.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
        }

        // Atualizar reflexões
        const reflectionElements = document.querySelectorAll('.reflection-item p');
        if (reflectionElements.length >= 3) {
            reflectionElements[0].textContent = entry.reflections.good;
            reflectionElements[1].textContent = entry.reflections.learned;
            reflectionElements[2].textContent = entry.reflections.improve;
        }
    }

    // Carregar entradas salvas na inicialização
    loadSavedEntries();
    
    // Variável para rastrear entrada atual
    let currentEntryIndex = 0;
    
    // Configurar botões de ação
    setupActionButtons();
    
    // Carregar primeira entrada por padrão
    loadEntry(0);
    
    // Função para configurar botões de editar e excluir
    function setupActionButtons() {
        const editBtn = document.querySelector('.entry-actions .btn-icon[title="Editar"]');
        const deleteBtn = document.querySelector('.entry-actions .btn-icon[title="Excluir"]');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editCurrentEntry();
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deleteCurrentEntry();
            });
        }
    }
    
    // Função para editar entrada atual
    function editCurrentEntry() {
        const savedEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
        
        if (savedEntries.length > 0 && currentEntryIndex < savedEntries.length) {
            const entry = savedEntries[currentEntryIndex];
            
            // Preencher formulário
            document.getElementById('entry-title').value = entry.title;
            document.getElementById('entry-content').value = entry.content;
            document.getElementById('entry-reflection1').value = entry.reflections.good;
            document.getElementById('entry-reflection2').value = entry.reflections.learned;
            document.getElementById('entry-reflection3').value = entry.reflections.improve;
            document.getElementById('entry-tags').value = entry.tags.join(', ');
            
            // Selecionar humor
            const moodValue = entry.mood.toLowerCase();
            const moodRadio = document.querySelector(`input[name="mood"][value="${moodValue}"]`);
            if (moodRadio) moodRadio.checked = true;
            
            // Marcar como edição
            modal.dataset.editing = currentEntryIndex;
            modal.style.display = 'block';
            
            showFeedback('success', 'Modo de edição ativado');
        } else {
            showFeedback('error', 'Esta entrada não pode ser editada');
        }
    }
    
    // Função para excluir entrada atual
    function deleteCurrentEntry() {
        if (confirm('Tem certeza que deseja excluir esta entrada?')) {
            const savedEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
            
            if (savedEntries.length > 0 && currentEntryIndex < savedEntries.length) {
                // Remover do localStorage
                savedEntries.splice(currentEntryIndex, 1);
                localStorage.setItem('diaryEntries', JSON.stringify(savedEntries));
                
                // Remover da interface
                const entryItems = document.querySelectorAll('.entry-item');
                if (entryItems[currentEntryIndex]) {
                    entryItems[currentEntryIndex].remove();
                }
                
                // Reconfigurar eventos
                setupEntryClicks();
                
                // Carregar primeira entrada disponível
                const remainingEntries = document.querySelectorAll('.entry-item');
                if (remainingEntries.length > 0) {
                    remainingEntries[0].classList.add('active');
                    currentEntryIndex = 0;
                    loadEntry(0);
                }
                
                showFeedback('success', 'Entrada excluída com sucesso');
            } else {
                showFeedback('error', 'Esta entrada não pode ser excluída');
            }
        }
    }
    
    // Função para carregar entradas salvas
    function loadSavedEntries() {
        const savedEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
        const entriesContainer = document.querySelector('.diary-entries');
        
        savedEntries.forEach(entry => {
            const entryDate = new Date(entry.timestamp);
            const day = entryDate.getDate();
            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const month = months[entryDate.getMonth()];
            
            const entryHTML = `
                <div class="entry-item">
                    <div class="entry-date">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="entry-preview">
                        <div class="entry-mood">
                            <i class="${entry.moodIcon}"></i>
                            <span>${entry.mood}</span>
                        </div>
                        <h3>${entry.title}</h3>
                        <p>${entry.content.substring(0, 50)}...</p>
                    </div>
                </div>
            `;
            
            entriesContainer.insertAdjacentHTML('afterbegin', entryHTML);
        });
        
        setupEntryClicks();
    }

    // Modal de nova entrada
    const newEntryBtn = document.getElementById('new-entry-btn');
    const modal = document.getElementById('new-entry-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelModal = document.querySelector('.cancel-modal');
    const entryForm = document.getElementById('entry-form');

    if (newEntryBtn && modal) {
        newEntryBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (cancelModal) {
            cancelModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Envio do formulário
        if (entryForm) {
            entryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (modal.dataset.editing !== undefined) {
                    // Modo edição
                    updateEntry(parseInt(modal.dataset.editing));
                    delete modal.dataset.editing;
                    showFeedback('success', 'Entrada atualizada com sucesso!');
                } else {
                    // Modo criação
                    saveNewEntry();
                    showFeedback('success', 'Entrada salva com sucesso!');
                }
                
                modal.style.display = 'none';
            });
        }
        
        // Função para atualizar entrada existente
        function updateEntry(index) {
            const title = document.getElementById('entry-title').value;
            const mood = document.querySelector('input[name="mood"]:checked').value;
            const content = document.getElementById('entry-content').value;
            const reflection1 = document.getElementById('entry-reflection1').value;
            const reflection2 = document.getElementById('entry-reflection2').value;
            const reflection3 = document.getElementById('entry-reflection3').value;
            const tags = document.getElementById('entry-tags').value;

            const moodIcons = {
                'feliz': 'fas fa-smile mood-icon happy',
                'neutro': 'fas fa-meh mood-icon neutral',
                'triste': 'fas fa-frown mood-icon sad',
                'irritado': 'fas fa-angry mood-icon angry',
                'ansioso': 'fas fa-tired mood-icon anxious'
            };

            const moodNames = {
                'feliz': 'Feliz',
                'neutro': 'Neutro',
                'triste': 'Triste',
                'irritado': 'Irritado',
                'ansioso': 'Ansioso'
            };

            // Atualizar no localStorage
            const savedEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
            if (savedEntries[index]) {
                savedEntries[index] = {
                    ...savedEntries[index],
                    title: title,
                    mood: moodNames[mood],
                    moodIcon: moodIcons[mood],
                    content: content,
                    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                    reflections: {
                        good: reflection1,
                        learned: reflection2,
                        improve: reflection3
                    }
                };
                
                localStorage.setItem('diaryEntries', JSON.stringify(savedEntries));
                
                // Atualizar interface
                const entryItems = document.querySelectorAll('.entry-item');
                if (entryItems[index]) {
                    const entryItem = entryItems[index];
                    entryItem.querySelector('.entry-preview h3').textContent = title;
                    entryItem.querySelector('.entry-preview p').textContent = content.substring(0, 50) + '...';
                    entryItem.querySelector('.entry-mood span').textContent = moodNames[mood];
                    entryItem.querySelector('.entry-mood i').className = moodIcons[mood];
                }
                
                // Recarregar entrada atual
                loadEntry(index);
            }
            
            // Limpar formulário
            entryForm.reset();
        }
    }

    // Função para salvar nova entrada
    function saveNewEntry() {
        const title = document.getElementById('entry-title').value;
        const mood = document.querySelector('input[name="mood"]:checked').value;
        const content = document.getElementById('entry-content').value;
        const reflection1 = document.getElementById('entry-reflection1').value;
        const reflection2 = document.getElementById('entry-reflection2').value;
        const reflection3 = document.getElementById('entry-reflection3').value;
        const tags = document.getElementById('entry-tags').value;

        const moodIcons = {
            'feliz': 'fas fa-smile mood-icon happy',
            'neutro': 'fas fa-meh mood-icon neutral',
            'triste': 'fas fa-frown mood-icon sad',
            'irritado': 'fas fa-angry mood-icon angry',
            'ansioso': 'fas fa-tired mood-icon anxious'
        };

        const moodNames = {
            'feliz': 'Feliz',
            'neutro': 'Neutro',
            'triste': 'Triste',
            'irritado': 'Irritado',
            'ansioso': 'Ansioso'
        };

        const now = new Date();
        const day = now.getDate();
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const month = months[now.getMonth()];
        const fullDate = now.toLocaleDateString('pt-BR') + ', ' + now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});

        // Criar nova entrada HTML
        const newEntryHTML = `
            <div class="entry-item">
                <div class="entry-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="entry-preview">
                    <div class="entry-mood">
                        <i class="${moodIcons[mood]}"></i>
                        <span>${moodNames[mood]}</span>
                    </div>
                    <h3>${title}</h3>
                    <p>${content.substring(0, 50)}...</p>
                </div>
            </div>
        `;

        // Adicionar à lista de entradas
        const entriesContainer = document.querySelector('.diary-entries');
        entriesContainer.insertAdjacentHTML('afterbegin', newEntryHTML);

        // Salvar no localStorage
        const savedEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
        const newEntry = {
            id: Date.now(),
            title: title,
            date: fullDate,
            mood: moodNames[mood],
            moodIcon: moodIcons[mood],
            content: content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            reflections: {
                good: reflection1,
                learned: reflection2,
                improve: reflection3
            },
            timestamp: now.getTime()
        };
        
        savedEntries.unshift(newEntry);
        localStorage.setItem('diaryEntries', JSON.stringify(savedEntries));

        // Reconfigurar eventos
        setupEntryClicks();
        
        // Limpar formulário
        entryForm.reset();
    }

    // Função para reconfigurar cliques
    function setupEntryClicks() {
        const entryItems = document.querySelectorAll('.entry-item');
        entryItems.forEach((item, index) => {
            item.replaceWith(item.cloneNode(true));
        });
        
        const newEntryItems = document.querySelectorAll('.entry-item');
        newEntryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                newEntryItems.forEach(entry => entry.classList.remove('active'));
                this.classList.add('active');
                currentEntryIndex = index;
                loadEntry(index);
            });
        });
    }

    // Função para mostrar feedback
    function showFeedback(type, message) {
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type} show`;
        feedback.innerHTML = `
            <div class="feedback-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    // Função para atualizar nome do usuário
    function updateUserName() {
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        const userNameElement = document.getElementById('user-name');
        
        if (userNameElement && userLogged.nome) {
            const firstName = userLogged.nome.split(' ')[0];
            userNameElement.textContent = firstName;
        }
    }
    

});