document.addEventListener('DOMContentLoaded', function() {
    // Verificar se é psicólogo
    if (!Utils.requireAuth()) return;
    
    const user = window.API.auth.getUser();
    if (!user || user.tipo !== 'psicologo') {
        Utils.showFeedback('error', 'Acesso negado. Apenas psicólogos podem acessar esta página.');
        setTimeout(() => {
            window.location.href = './dashboard.html';
        }, 2000);
        return;
    }
    
    // Variáveis globais
    let currentPatientId = null;
    let currentPatientData = null;
    let moodChart = null;
    let anxietyDepressionChart = null;
    
    // Inicialização
    setupTabs();
    setupModal();
    loadPatients();
    
    // Configurar abas
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remover classe ativa
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Adicionar classe ativa
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Botão voltar
        document.getElementById('back-to-patients').addEventListener('click', () => {
            document.querySelector('[data-tab="pacientes"]').click();
        });
    }
    
    // Configurar modal
    function setupModal() {
        const modal = document.getElementById('evolution-modal');
        const newEvolutionBtn = document.getElementById('new-evolution-btn');
        const closeModal = document.getElementById('close-evolution-modal');
        const cancelBtn = document.getElementById('cancel-evolution');
        const form = document.getElementById('evolution-form');
        
        newEvolutionBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
        
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        cancelBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        // Configurar ranges
        const ranges = form.querySelectorAll('input[type="range"]');
        ranges.forEach(range => {
            const valueSpan = range.nextElementSibling;
            range.addEventListener('input', () => {
                valueSpan.textContent = range.value;
            });
        });
        
        // Envio do formulário
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveEvolution();
        });
    }
    
    // Carregar pacientes
    async function loadPatients() {
        try {
            const config = getConfig();
            const response = await fetch(`${config.API_BASE_URL}/evolucao/pacientes`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Erro ao carregar pacientes');
            
            const patients = await response.json();
            renderPatients(patients);
            
        } catch (error) {
            console.error('Erro:', error);
            Utils.showFeedback('error', 'Erro ao carregar pacientes');
        }
    }
    
    // Renderizar pacientes
    function renderPatients(patients) {
        const grid = document.getElementById('patients-grid');
        
        if (patients.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Nenhum paciente encontrado</h3>
                    <p>Você ainda não possui pacientes cadastrados.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = patients.map(patient => {
            const lastEvolution = patient.ultima_evolucao;
            const isActive = patient.atividade_recente.entradas_diario > 0 || 
                           patient.atividade_recente.quizzes_respondidos > 0;
            
            return `
                <div class="patient-card" onclick="viewPatientEvolution(${patient.id})">
                    <div class="patient-header">
                        <div class="patient-avatar">
                            ${patient.nome.charAt(0).toUpperCase()}
                        </div>
                        <div class="patient-info">
                            <h3>${patient.nome}</h3>
                            <p>${patient.email}</p>
                        </div>
                    </div>
                    
                    <div class="patient-stats">
                        <div class="stat-item">
                            <span class="stat-number">${patient.atividade_recente.entradas_diario}</span>
                            <span class="stat-label">Entradas (30d)</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${patient.atividade_recente.quizzes_respondidos}</span>
                            <span class="stat-label">Quizzes (30d)</span>
                        </div>
                    </div>
                    
                    ${lastEvolution ? `
                        <div class="last-evolution">
                            <small>Última avaliação: ${Utils.formatDate(lastEvolution.data_avaliacao)}</small>
                            <div class="evolution-scores">
                                <span>Humor: ${lastEvolution.humor_geral}/10</span>
                                <span>Ansiedade: ${lastEvolution.ansiedade_nivel}/10</span>
                            </div>
                        </div>
                    ` : '<p><small>Nenhuma avaliação registrada</small></p>'}
                    
                    <div class="patient-status ${isActive ? 'status-active' : 'status-inactive'}">
                        <i class="fas ${isActive ? 'fa-circle' : 'fa-circle'}"></i>
                        ${isActive ? 'Ativo' : 'Inativo'}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Ver evolução do paciente
    window.viewPatientEvolution = async function(patientId) {
        currentPatientId = patientId;
        
        try {
            const config = getConfig();
            const response = await fetch(`${config.API_BASE_URL}/evolucao/paciente/${patientId}/evolucao`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Erro ao carregar evolução');
            
            currentPatientData = await response.json();
            
            // Atualizar informações do paciente
            document.getElementById('patient-info').innerHTML = `
                <h2>${currentPatientData.paciente.nome}</h2>
                <p>${currentPatientData.paciente.email} • ${currentPatientData.paciente.telefone || 'Telefone não informado'}</p>
            `;
            
            // Renderizar timeline
            renderEvolutionTimeline(currentPatientData.evolucoes);
            
            // Renderizar gráficos
            renderCharts(currentPatientData.evolucoes);
            
            // Renderizar atividades
            renderPatientActivity(currentPatientData.entradas_diario, currentPatientData.respostas_quiz);
            
            // Mudar para aba de evolução
            document.querySelector('[data-tab="evolucao"]').click();
            
        } catch (error) {
            console.error('Erro:', error);
            Utils.showFeedback('error', 'Erro ao carregar evolução do paciente');
        }
    };
    
    // Renderizar timeline de evolução
    function renderEvolutionTimeline(evolutions) {
        const timeline = document.getElementById('evolution-timeline');
        
        if (evolutions.length === 0) {
            timeline.innerHTML = '<p>Nenhuma avaliação registrada</p>';
            return;
        }
        
        timeline.innerHTML = evolutions.map((evolution, index) => `
            <div class="timeline-item ${index === 0 ? 'active' : ''}" onclick="selectEvolution(${evolution.id})">
                <div class="timeline-date">${Utils.formatDate(evolution.data_avaliacao)}</div>
                <div class="timeline-summary">Avaliação #${evolutions.length - index}</div>
                <div class="timeline-scores">
                    <span class="score-item">H: ${evolution.humor_geral}/10</span>
                    <span class="score-item">A: ${evolution.ansiedade_nivel}/10</span>
                    <span class="score-item">D: ${evolution.depressao_nivel}/10</span>
                </div>
            </div>
        `).join('');
    }
    
    // Renderizar gráficos
    function renderCharts(evolutions) {
        if (evolutions.length === 0) return;
        
        const dates = evolutions.map(e => new Date(e.data_avaliacao).toLocaleDateString('pt-BR'));
        const moodData = evolutions.map(e => e.humor_geral);
        const anxietyData = evolutions.map(e => e.ansiedade_nivel);
        const depressionData = evolutions.map(e => e.depressao_nivel);
        
        // Gráfico de humor
        const moodCtx = document.getElementById('mood-chart').getContext('2d');
        if (moodChart) moodChart.destroy();
        
        moodChart = new Chart(moodCtx, {
            type: 'line',
            data: {
                labels: dates.reverse(),
                datasets: [{
                    label: 'Humor Geral',
                    data: moodData.reverse(),
                    borderColor: '#272262',
                    backgroundColor: 'rgba(39, 34, 98, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
        
        // Gráfico de ansiedade e depressão
        const anxietyCtx = document.getElementById('anxiety-depression-chart').getContext('2d');
        if (anxietyDepressionChart) anxietyDepressionChart.destroy();
        
        anxietyDepressionChart = new Chart(anxietyCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Ansiedade',
                        data: anxietyData.reverse(),
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Depressão',
                        data: depressionData.reverse(),
                        borderColor: '#4ecdc4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }
    
    // Renderizar atividade do paciente
    function renderPatientActivity(diaryEntries, quizResults) {
        // Entradas do diário
        const diaryContainer = document.getElementById('diary-entries');
        if (diaryEntries.length === 0) {
            diaryContainer.innerHTML = '<p>Nenhuma entrada recente no diário</p>';
        } else {
            diaryContainer.innerHTML = diaryEntries.slice(0, 5).map(entry => `
                <div class="activity-item">
                    <div class="activity-date">${Utils.formatDate(entry.data_criacao)}</div>
                    <div class="activity-content">
                        <strong>${entry.titulo}</strong> - Humor: ${entry.humor}
                        <p>${entry.conteudo.substring(0, 100)}...</p>
                    </div>
                </div>
            `).join('');
        }
        
        // Resultados de quiz
        const quizContainer = document.getElementById('quiz-results');
        if (quizResults.length === 0) {
            quizContainer.innerHTML = '<p>Nenhum quiz respondido recentemente</p>';
        } else {
            quizContainer.innerHTML = quizResults.slice(0, 5).map(result => `
                <div class="activity-item">
                    <div class="activity-date">${Utils.formatDate(result.data_criacao)}</div>
                    <div class="activity-content">
                        <strong>Quiz Respondido</strong>
                        <p>Pontuação: ${result.resultado.pontuacao || 'N/A'}</p>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Salvar evolução
    async function saveEvolution() {
        if (!currentPatientId) return;
        
        const formData = {
            humor_geral: parseInt(document.getElementById('humor-geral').value),
            ansiedade_nivel: parseInt(document.getElementById('ansiedade-nivel').value),
            depressao_nivel: parseInt(document.getElementById('depressao-nivel').value),
            sono_qualidade: parseInt(document.getElementById('sono-qualidade').value),
            observacoes: document.getElementById('observacoes').value,
            objetivos_sessao: document.getElementById('objetivos-sessao').value,
            progresso_observado: document.getElementById('progresso-observado').value,
            proximos_passos: document.getElementById('proximos-passos').value
        };
        
        try {
            const config = getConfig();
            const response = await fetch(`${config.API_BASE_URL}/evolucao/paciente/${currentPatientId}/evolucao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) throw new Error('Erro ao salvar evolução');
            
            Utils.showFeedback('success', 'Evolução salva com sucesso!');
            document.getElementById('evolution-modal').classList.add('hidden');
            
            // Recarregar dados do paciente
            viewPatientEvolution(currentPatientId);
            
        } catch (error) {
            console.error('Erro:', error);
            Utils.showFeedback('error', 'Erro ao salvar evolução');
        }
    }
    
    // Selecionar evolução na timeline
    window.selectEvolution = function(evolutionId) {
        const items = document.querySelectorAll('.timeline-item');
        items.forEach(item => item.classList.remove('active'));
        event.target.closest('.timeline-item').classList.add('active');
        
        // Aqui você pode mostrar detalhes específicos da evolução selecionada
        const evolution = currentPatientData.evolucoes.find(e => e.id === evolutionId);
        if (evolution) {
            // Implementar visualização detalhada da evolução selecionada
            console.log('Evolução selecionada:', evolution);
        }
    };
});