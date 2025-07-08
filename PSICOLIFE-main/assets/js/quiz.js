document.addEventListener('DOMContentLoaded', function() {
    // Atualizar nome do usuário
    updateUserName();
    
    // Dados do quiz expandido - 30 perguntas
    const questions = [
        // Ansiedade (6 perguntas)
        { text: "Com que frequência você se sente nervoso ou ansioso?", category: "ansiedade" },
        { text: "Você evita situações sociais por medo ou ansiedade?", category: "ansiedade" },
        { text: "Sente palpitações ou batimentos cardíacos acelerados sem motivo aparente?", category: "ansiedade" },
        { text: "Tem pensamentos repetitivos que causam preocupação?", category: "ansiedade" },
        { text: "Sente-se inquieto ou agitado durante o dia?", category: "ansiedade" },
        { text: "Tem medo excessivo de situações cotidianas?", category: "ansiedade" },
        
        // Depressão (6 perguntas)
        { text: "Com que frequência você se sente triste ou deprimido?", category: "depressao" },
        { text: "Perdeu o interesse em atividades que antes lhe davam prazer?", category: "depressao" },
        { text: "Sente-se sem esperança em relação ao futuro?", category: "depressao" },
        { text: "Tem pensamentos negativos sobre si mesmo?", category: "depressao" },
        { text: "Sente fadiga ou falta de energia na maior parte do tempo?", category: "depressao" },
        { text: "Tem dificuldade para sentir alegria ou satisfação?", category: "depressao" },
        
        // Estresse (6 perguntas)
        { text: "Com que frequência você se sente irritado ou com raiva?", category: "estresse" },
        { text: "Sente-se sobrecarregado com suas responsabilidades?", category: "estresse" },
        { text: "Tem dificuldade para relaxar mesmo em momentos livres?", category: "estresse" },
        { text: "Sente tensão muscular ou dores de cabeça frequentes?", category: "estresse" },
        { text: "Reage de forma exagerada a situações menores?", category: "estresse" },
        { text: "Sente que não consegue lidar com a pressão do dia a dia?", category: "estresse" },
        
        // Sono (6 perguntas)
        { text: "Com que frequência você tem dificuldade para dormir?", category: "sono" },
        { text: "Acorda frequentemente durante a noite?", category: "sono" },
        { text: "Sente-se cansado mesmo após uma noite de sono?", category: "sono" },
        { text: "Tem pesadelos ou sonhos perturbadores?", category: "sono" },
        { text: "Demora muito para conseguir adormecer?", category: "sono" },
        { text: "Acorda muito cedo e não consegue voltar a dormir?", category: "sono" },
        
        // Concentração (6 perguntas)
        { text: "Com que frequência você tem dificuldade para se concentrar?", category: "concentracao" },
        { text: "Esquece compromissos ou tarefas importantes?", category: "concentracao" },
        { text: "Tem dificuldade para tomar decisões simples?", category: "concentracao" },
        { text: "Sente que sua mente está sempre dispersa?", category: "concentracao" },
        { text: "Precisa ler algo várias vezes para entender?", category: "concentracao" },
        { text: "Tem dificuldade para completar tarefas que começou?", category: "concentracao" }
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
        const stressScore = calculateScore('estresse');
        const sleepScore = calculateScore('sono');
        const concentrationScore = calculateScore('concentracao');
        
        // Atualizar medidores
        document.getElementById('anxiety-meter').style.width = `${anxietyScore}%`;
        document.getElementById('anxiety-level').textContent = `${anxietyScore}%`;
        
        document.getElementById('depression-meter').style.width = `${depressionScore}%`;
        document.getElementById('depression-level').textContent = `${depressionScore}%`;
        
        document.getElementById('stress-meter').style.width = `${stressScore}%`;
        document.getElementById('stress-level').textContent = `${stressScore}%`;
        
        document.getElementById('sleep-meter').style.width = `${sleepScore}%`;
        document.getElementById('sleep-level').textContent = `${sleepScore}%`;
        
        document.getElementById('concentration-meter').style.width = `${concentrationScore}%`;
        document.getElementById('concentration-level').textContent = `${concentrationScore}%`;
        
        // Definir diagnóstico baseado em múltiplos fatores
        const diagnosis = document.getElementById('diagnosis');
        const diagnosisDescription = document.getElementById('diagnosis-description');
        const resultIcon = document.getElementById('result-icon');
        
        const scores = { anxietyScore, depressionScore, stressScore, sleepScore, concentrationScore };
        const highScores = Object.entries(scores).filter(([key, value]) => value > 70);
        const moderateScores = Object.entries(scores).filter(([key, value]) => value > 50 && value <= 70);
        
        if (highScores.length >= 3) {
            diagnosis.textContent = 'Atenção Necessária';
            diagnosisDescription.textContent = 'Seus resultados indicam múltiplas áreas que necessitam atenção. Recomendamos fortemente que procure um profissional de saúde mental para avaliação e acompanhamento.';
            resultIcon.className = 'fas fa-exclamation-triangle';
        } else if (highScores.length >= 1) {
            const mainIssue = highScores[0][0].replace('Score', '');
            const issueNames = {
                anxiety: 'Ansiedade Elevada',
                depression: 'Sinais de Depressão',
                stress: 'Estresse Elevado',
                sleep: 'Problemas de Sono',
                concentration: 'Dificuldades de Concentração'
            };
            diagnosis.textContent = issueNames[mainIssue] || 'Atenção Necessária';
            diagnosisDescription.textContent = 'Seus resultados indicam uma área que necessita atenção especial. Considere buscar orientação profissional e implementar estratégias de autocuidado.';
            resultIcon.className = 'fas fa-exclamation-circle';
        } else if (moderateScores.length >= 2) {
            diagnosis.textContent = 'Bem-estar Moderado';
            diagnosisDescription.textContent = 'Seus resultados mostram algumas áreas que podem se beneficiar de atenção. Continue praticando o autocuidado e considere implementar técnicas de bem-estar.';
            resultIcon.className = 'fas fa-info-circle';
        } else {
            diagnosis.textContent = 'Bem-estar Emocional Saudável';
            diagnosisDescription.textContent = 'Seus resultados indicam níveis saudáveis de bem-estar emocional. Continue mantendo seus hábitos saudáveis e praticando o autocuidado.';
            resultIcon.className = 'fas fa-smile';
        }
        
        // Gerar recomendações personalizadas
        const recommendationsList = document.getElementById('recommendations');
        recommendationsList.innerHTML = '';
        
        const recommendations = generateRecommendations(scores);
        
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
        
        // Configurar gráfico
        const ctx = document.getElementById('chartResult').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Ansiedade', 'Depressão', 'Estresse', 'Sono', 'Concentração'],
                datasets: [{
                    label: 'Níveis Atuais',
                    data: [anxietyScore, depressionScore, stressScore, sleepScore, concentrationScore],
                    backgroundColor: 'rgba(39, 34, 98, 0.2)',
                    borderColor: 'rgba(39, 34, 98, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(39, 34, 98, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(39, 34, 98, 1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
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
    
    // Função para gerar recomendações personalizadas
    function generateRecommendations(scores) {
        const recommendations = [];
        
        if (scores.anxietyScore > 60) {
            recommendations.push('Pratique técnicas de respiração profunda e relaxamento');
            recommendations.push('Considere atividades como yoga ou meditação');
        }
        
        if (scores.depressionScore > 60) {
            recommendations.push('Mantenha um diário de gratidão e pensamentos positivos');
            recommendations.push('Busque atividades que lhe tragam prazer e satisfação');
        }
        
        if (scores.stressScore > 60) {
            recommendations.push('Organize melhor seu tempo e estabeleça prioridades');
            recommendations.push('Pratique atividades físicas regulares para aliviar tensão');
        }
        
        if (scores.sleepScore > 60) {
            recommendations.push('Estabeleça uma rotina de sono consistente');
            recommendations.push('Evite telas e cafeína antes de dormir');
        }
        
        if (scores.concentrationScore > 60) {
            recommendations.push('Pratique exercícios de atenção plena (mindfulness)');
            recommendations.push('Organize seu ambiente de trabalho e elimine distrações');
        }
        
        // Recomendações gerais
        recommendations.push('Mantenha uma alimentação equilibrada e hidrate-se bem');
        recommendations.push('Busque apoio de amigos, familiares ou profissionais quando necessário');
        
        return recommendations.slice(0, 6); // Limitar a 6 recomendações
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