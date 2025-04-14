// quiz.js
document.addEventListener('DOMContentLoaded', () => {
    const questions = generateQuestions();
    const questionText = document.querySelector('#questionText');
    const answerOptions = document.querySelectorAll('.answer');
    const nextButton = document.querySelector('#nextButton');
    const resultContainer = document.querySelector('#result');
    const diagnosisText = document.querySelector('#diagnosis');
    const chartCanvas = document.querySelector('#chartResult');
    const questionContainer = document.querySelector('#questionContainer');

    let currentQuestionIndex = 0;
    let answers = [];

    // Inicializa a primeira pergunta
    loadQuestion();

    // Adiciona evento de clique para cada resposta
    answerOptions.forEach(button => {
        button.addEventListener('click', (e) => {
            // Salvar resposta e destacar a opção selecionada
            const value = parseInt(e.target.getAttribute('data-value'));
            answers[currentQuestionIndex] = value;

            answerOptions.forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');

            nextButton.classList.remove('hidden');
        });
    });

    // Botão "Próxima"
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    // Função para carregar uma pergunta
    function loadQuestion() {
        nextButton.classList.add('hidden');

        // Exibir a pergunta atual e o número dela
        questionContainer.querySelector(
            "#questionText"
        ).innerHTML = `<span class="question-number">Pergunta ${currentQuestionIndex + 1}/${questions.length}</span> <br> ${questions[currentQuestionIndex]}`;
    }

    // Função para gerar perguntas
    function generateQuestions() {
        const pool = [
            "Você sente falta de energia frequentemente?",
            "Você tem dificuldade em se concentrar?",
            "Você apresenta alterações de humor repentinas?",
            "Você sente desânimo ao realizar tarefas diárias?",
            "Você percebe mudanças bruscas de apetite?",
            "Você sofre com insônia ou excesso de sono?",
            "Você sente pensamentos negativos recorrentes?",
            "Você sente irritação excessiva com frequência?",
            "Você tem crises de ansiedade regularmente?",
            "Você sente solidão em momentos do dia?",
            "Você sente culpa constantemente?",
            "Você percebe alterações hormonais frequentes?",
            "Você sente dificuldade em lidar com o estresse?",
            "Você sente isolamento social?",
            "Você apresenta dificuldades de memória?",
            "Você tem dificuldade em sentir prazer em atividades do dia a dia?",
            "Você sente inutilidade ou incapacidade?",
            "Você sente angústia em relação ao futuro?",
            "Você tem baixa autoestima?",
            "Você apresenta mudanças de humor durante períodos hormonais?",
            "Você evita sair de casa ou socializar?",
            "Você sente extrema preocupação com pequenos eventos?",
            "Você percebe alterações de humor durante mudanças de estação?",
            "Você tem episódios de tristeza inexplicável?",
            "Você sente dificuldade em relaxar em momentos tranquilos?",
            "Você evita situações estressantes ao extremo?",
            "Você sente vontade de chorar sem um motivo aparente?",
            "Você tem problemas recorrentes de relacionamento interpessoal?",
            "Você sente inquietação frequentemente?",
            "Você evita atividades sociais mesmo sem motivo específico?"
        ];

        return pool.sort(() => Math.random() - 0.5).slice(0, 30); // Seleciona 30 perguntas aleatórias
    }

    // Função para mostrar os resultados
    function showResults() {
        const diagnosis = analyzeResults(answers);
        diagnosisText.textContent = `Diagnóstico: ${diagnosis.diagnosis}`;
        resultContainer.classList.remove('hidden');

        // Gerar gráfico
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Sim, sempre", "Sempre", "Às vezes", "Quase nunca", "Nunca"],
                datasets: [{
                    label: 'Distribuição de Respostas',
                    data: [
                        diagnosis.distribution[5] || 0,
                        diagnosis.distribution[4] || 0,
                        diagnosis.distribution[3] || 0,
                        diagnosis.distribution[2] || 0,
                        diagnosis.distribution[1] || 0
                    ],
                    backgroundColor: ['#007BFF', '#28A745', '#FFC107', '#DC3545', '#6C757D']
                }]
            }
        });
    }

    // Função para analisar os resultados
    function analyzeResults(answers) {
        const sum = answers.reduce((acc, value) => acc + value, 0);
        const diagnosisList = [
            "Transtorno Depressivo Maior",
            "Depressão Bipolar",
            "Distimia",
            "Depressão Pós-parto",
            "Transtorno Disfórico Pré-menstrual",
            "Transtorno Afetivo Sazonal",
            "Depressão Psicótica",
            "Transtorno Depressivo Induzido por Substâncias"
        ];

        return {
            diagnosis: diagnosisList[Math.floor(sum / 40)], // Lógica simples de diagnóstico
            distribution: answers.reduce((acc, value) => {
                acc[value] = acc[value] ? acc[value] + 1 : 1;
                return acc;
            }, {})
        };
    }
});
