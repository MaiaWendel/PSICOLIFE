document.addEventListener('DOMContentLoaded', function() {
    // Dados de exemplo para o quiz
    const questions = [
        {
            text: "Com que frequência você se sente nervoso ou ansioso?",
            category: "ansiedade"
        },
        {
            text: "Com que frequência você tem dificuldade para dormir?",
            category: "sono"
        },
        {
            text: "Com que frequência você se sente triste ou deprimido?",
            category: "depressao"
        },
        {
            text: "Com que frequência você se sente irritado ou com raiva?",
            category: "humor"
        },
        {
            text: "Com que frequência você tem dificuldade para se concentrar?",
            category: "concentracao"
        }
    ];
    
    // Variáveis do quiz
    let currentQuestion = 0;
    const answers = [];
    
    // Elementos do DOM
    const startQuizBtn = document.getElementById('start-quiz');
    const quizIntro = document.getElementById('quiz-intro');
    const questionContainer = document.getElementById('questionContainer');
    const resultSection = document.getElementById('result');
    const questionText = document.getElementById('questionText');
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const answerOptions = document.querySelectorAll('.answer-radio');
    
    // Inicialização
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', showPreviousQuestion);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', handleNextButton);
    }
    
    // Configurar opções de resposta
    answerOptions.forEach(option => {
        option.addEventListener('change', function() {
            nextButton.disabled = false;
        });
    });
    
    // Função para iniciar o quiz
    function startQuiz() {
        quizIntro.classList.remove('active');
        questionContainer.classList.add('active');
        showQuestion(0);
    }
    
    // Função para mostrar uma pergunta
    function showQuestion(index) {
        currentQuestion = index;
        
        // Atualizar texto da pergunta
        questionText.textContent = questions[index].text;
        
        // Atualizar progresso
        const progress = ((index + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Pergunta ${index + 1}/${questions.length}`;
        
        // Habilitar/desabilitar botões de navegação
        prevButton.disabled = index === 0;
        nextButton.disabled = !answers[index];
        
        // Marcar resposta selecionada anteriormente, se houver
        if (answers[index]) {
            const selectedOption = document.querySelector(`.answer-radio[value="${answers[index]}"]`);
            if (selectedOption) {
                selectedOption.checked = true;
            }
        } else {
            // Limpar seleção
            answerOptions.forEach(option => {
                option.checked = false;
            });
        }
        
        // Atualizar texto do botão "Próximo"
        if (index === questions.length - 1) {
            nextButton.textContent = 'Finalizar';
        } else {
            nextButton.textContent = 'Próxima';
        }
    }
    
    // Função para mostrar a pergunta anterior
    function showPreviousQuestion() {
        if (currentQuestion > 0) {
            showQuestion(currentQuestion - 1);
        }
    }
    
    // Função para lidar com o botão "Próximo"
    function handleNextButton() {
        // Salvar resposta atual
        const selectedOption = document.querySelector('.answer-radio:checked');
        if (selectedOption) {
            answers[currentQuestion] = selectedOption.value;
        }
        
        // Verificar se é a última pergunta
        if (currentQuestion === questions.length - 1) {
            showResult();
        } else {
            showQuestion(currentQuestion + 1);
        }
    }
    
    // Função para mostrar o resultado
    function showResult() {
        questionContainer.classList.remove('active');
        resultSection.classList.add('active');
        
        // Calcular pontuações
        const anxietyScore = calculateScore('ansiedade');
        const depressionScore = calculateScore('depressao');
        const stressScore = calculateScore('humor');
        
        // Atualizar medidores
        document.getElementById('anxiety-meter').style.width = `${anxietyScore}%`;
        document.getElementById('anxiety-level').textContent = `${anxietyScore}%`;
        
        document.getElementById('depression-meter').style.width = `${depressionScore}%`;
        document.getElementById('depression-level').textContent = `${depressionScore}%`;
        
        document.getElementById('stress-meter').style.width = `${stressScore}%`;
        document.getElementById('stress-level').textContent = `${stressScore}%`;
        
        // Definir diagnóstico
        const diagnosis = document.getElementById('diagnosis');
        const diagnosisDescription = document.getElementById('diagnosis-description');
        
        if (anxietyScore > 70) {
            diagnosis.textContent = 'Ansiedade Elevada';
            diagnosisDescription.textContent = 'Seus resultados indicam níveis elevados de ansiedade. Recomendamos que consulte um profissional de saúde mental.';
        } else if (depressionScore > 70) {
            diagnosis.textContent = 'Sinais de Depressão';
            diagnosisDescription.textContent = 'Seus resultados indicam possíveis sinais de depressão. Recomendamos que consulte um profissional de saúde mental.';
        } else if (stressScore > 70) {
            diagnosis.textContent = 'Estresse Elevado';
            diagnosisDescription.textContent = 'Seus resultados indicam níveis elevados de estresse. Recomendamos técnicas de relaxamento e gerenciamento de estresse.';
        } else {
            diagnosis.textContent = 'Bem-estar Emocional';
            diagnosisDescription.textContent = 'Seus resultados indicam níveis saudáveis de bem-estar emocional. Continue praticando o autocuidado.';
        }
        
        // Adicionar recomendações
        const recommendationsList = document.getElementById('recommendations');
        recommendationsList.innerHTML = '';
        
        const recommendations = [
            'Pratique técnicas de respiração profunda diariamente',
            'Mantenha um diário de gratidão',
            'Pratique atividade física regularmente',
            'Estabeleça uma rotina de sono saudável',
            'Considere a meditação ou mindfulness'
        ];
        
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
        
        // Configurar gráfico
        const ctx = document.getElementById('chartResult').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Ansiedade', 'Depressão', 'Estresse', 'Bem-estar'],
                datasets: [{
                    data: [anxietyScore, depressionScore, stressScore, 100 - (anxietyScore + depressionScore + stressScore) / 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // Configurar botões de resultado
        const restartButton = document.getElementById('restart-quiz');
        const saveButton = document.getElementById('save-result');
        
        if (restartButton) {
            restartButton.addEventListener('click', function() {
                // Reiniciar o quiz
                currentQuestion = 0;
                answers.length = 0;
                resultSection.classList.remove('active');
                quizIntro.classList.add('active');
            });
        }
        
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                // Aqui você enviaria os resultados para o backend
                // Por enquanto, vamos apenas mostrar um feedback
                showFeedback('success', 'Resultado salvo com sucesso!');
            });
        }
    }
    
    // Função para calcular pontuação por categoria
    function calculateScore(category) {
        let total = 0;
        let count = 0;
        
        questions.forEach((question, index) => {
            if (question.category === category && answers[index]) {
                total += parseInt(answers[index]);
                count++;
            }
        });
        
        return count > 0 ? Math.round((total / (count * 5)) * 100) : 0;
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