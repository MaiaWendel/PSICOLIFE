document.addEventListener('DOMContentLoaded', () => {

    
    // Configuração das abas
    setupTabs();
    
    // Configuração das categorias de vídeos
    setupVideoCategories();
    
    // Configuração das categorias de música
    setupMusicCategories();
    
    // Configuração do player de áudio
    setupAudioPlayer();
    
    // Configuração das técnicas de relaxamento
    setupTechniques();
    
    // Configuração das atividades
    setupActivities();
    

    
    // Configuração do desafio diário
    setupDailyChallenge();
    
    // Configuração do player de vídeo
    setupVideoPlayer();
    
    // Configuração do temporizador de áudio
    setupAudioTimer();
    
    // Iniciar animação das barras de visualização
    startVisualization();
});

// Função para configurar as abas
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');
            
            // Mostrar o painel correspondente
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Função para configurar as categorias de vídeos
function setupVideoCategories() {
    const videoCategories = document.querySelectorAll('.video-category');
    const videoCards = document.querySelectorAll('.video-grid .video-card');
    
    videoCategories.forEach(category => {
        category.addEventListener('click', () => {
            // Remover classe ativa de todas as categorias
            videoCategories.forEach(cat => cat.classList.remove('active'));
            
            // Adicionar classe ativa à categoria clicada
            category.classList.add('active');
            
            // Filtrar vídeos
            const selectedCategory = category.getAttribute('data-category');
            
            videoCards.forEach(card => {
                if (selectedCategory === card.getAttribute('data-category') || !card.hasAttribute('data-category')) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Função para configurar as categorias de música
function setupMusicCategories() {
    const musicCategories = document.querySelectorAll('.music-category');
    const playlistCards = document.querySelectorAll('.playlist-card');
    
    if (musicCategories.length > 0) {
        musicCategories.forEach(category => {
            category.addEventListener('click', () => {
                // Remover classe ativa de todas as categorias
                musicCategories.forEach(cat => cat.classList.remove('active'));
                
                // Adicionar classe ativa à categoria clicada
                category.classList.add('active');
                
                // Filtrar playlists
                const selectedCategory = category.getAttribute('data-category');
                
                playlistCards.forEach(card => {
                    if (selectedCategory === card.getAttribute('data-category')) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Função para configurar o player de áudio
function setupAudioPlayer() {
    const audioElement = document.getElementById('audio-element');
    const soundButtons = document.querySelectorAll('.sound-btn');
    const soundNameElement = document.getElementById('sound-name');
    
    if (audioElement && soundButtons.length > 0) {
        const sounds = {
            rain: 'https://soundbible.com/mp3/rain_thunder-Mike_Koenig-739472263.mp3',
            waves: 'https://soundbible.com/mp3/Ocean_Waves-Mike_Koenig-980635567.mp3',
            forest: 'https://soundbible.com/mp3/forest_ambience-JaBa-810606592.mp3',
            fire: 'https://soundbible.com/mp3/Fire_Burning-JaBa-810606592.mp3',
            birds: 'https://soundbible.com/mp3/birds-singing-02-Simon_Craggs-1780791796.mp3',
            whitenoise: 'https://soundbible.com/mp3/White-Noise-SoundBible.com-1238344867.mp3'
        };
        
        soundButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remover classe ativa de todos os botões
                soundButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adicionar classe ativa ao botão clicado
                button.classList.add('active');
                
                // Trocar o som
                const sound = button.getAttribute('data-sound');
                const soundName = button.getAttribute('data-name');
                
                // Atualizar o nome do som
                if (soundNameElement) {
                    soundNameElement.textContent = soundName;
                }
                
                // Pausar o áudio atual
                audioElement.pause();
                
                // Definir o novo som
                audioElement.src = sounds[sound];
                
                // Reproduzir o novo som
                audioElement.play().catch(e => console.log('Erro ao reproduzir áudio:', e));
                
                // Reiniciar a animação das barras
                restartVisualization();
            });
        });
        
        // Reproduzir automaticamente o som inicial
        audioElement.play().catch(e => console.log('Reprodução automática bloqueada pelo navegador'));
    }
}

// Função para iniciar a animação das barras de visualização
function startVisualization() {
    const bars = document.querySelectorAll('.visualization-bars .bar');
    if (bars.length > 0) {
        bars.forEach(bar => {
            const randomHeight = Math.floor(Math.random() * 60) + 40; // Entre 40% e 100%
            bar.style.height = `${randomHeight}%`;
        });
    }
}

// Função para reiniciar a animação das barras de visualização
function restartVisualization() {
    const bars = document.querySelectorAll('.visualization-bars .bar');
    if (bars.length > 0) {
        bars.forEach(bar => {
            // Remover e readicionar a animação
            bar.style.animation = 'none';
            bar.offsetHeight; // Trigger reflow
            bar.style.animation = null;
            
            // Definir uma altura aleatória
            const randomHeight = Math.floor(Math.random() * 60) + 40; // Entre 40% e 100%
            bar.style.height = `${randomHeight}%`;
        });
    }
}

// Função para configurar o temporizador de áudio
function setupAudioTimer() {
    const timerButtons = document.querySelectorAll('.timer-btn');
    const timerDisplay = document.getElementById('timer-display-audio');
    const timeRemaining = document.getElementById('time-remaining');
    const audioElement = document.getElementById('audio-element');
    
    if (timerButtons.length > 0 && timerDisplay && timeRemaining && audioElement) {
        let timer;
        let timeLeft = 0;
        
        timerButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remover classe ativa de todos os botões
                timerButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adicionar classe ativa ao botão clicado
                button.classList.add('active');
                
                // Limpar o timer anterior
                clearTimeout(timer);
                
                // Obter o tempo em minutos
                const minutes = parseInt(button.getAttribute('data-time'));
                
                if (minutes === 0) {
                    // Sem limite de tempo
                    timerDisplay.classList.add('hidden');
                    return;
                }
                
                // Converter para segundos
                timeLeft = minutes * 60;
                
                // Mostrar o timer
                timerDisplay.classList.remove('hidden');
                
                // Atualizar o display
                updateTimerDisplay();
                
                // Iniciar o timer
                timer = setInterval(() => {
                    timeLeft--;
                    updateTimerDisplay();
                    
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        audioElement.pause();
                        timerDisplay.textContent = 'Tempo esgotado!';
                    }
                }, 1000);
            });
        });
        
        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeRemaining.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// Função para configurar o player de vídeo
function setupVideoPlayer() {
    const playButtons = document.querySelectorAll('.btn-play-now');
    const videoModal = document.getElementById('video-player-modal');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const videoTitle = document.getElementById('video-title');
    const closeVideo = document.getElementById('close-video');
    
    if (playButtons.length > 0 && videoModal && modalVideoContainer) {
        playButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Obter o iframe do vídeo
                const videoCard = button.closest('.video-card');
                const videoIframe = videoCard.querySelector('iframe');
                const videoSrc = videoIframe.src;
                const title = videoCard.querySelector('h3').textContent;
                
                // Definir o título
                if (videoTitle) {
                    videoTitle.textContent = title;
                }
                
                // Criar um novo iframe para o modal
                const newIframe = document.createElement('iframe');
                newIframe.src = videoSrc + '?autoplay=1';
                newIframe.setAttribute('frameborder', '0');
                newIframe.setAttribute('allowfullscreen', '');
                newIframe.setAttribute('allow', 'autoplay');
                
                // Limpar o container e adicionar o novo iframe
                modalVideoContainer.innerHTML = '';
                modalVideoContainer.appendChild(newIframe);
                
                // Mostrar o modal
                videoModal.classList.remove('hidden');
            });
        });
        
        // Fechar o modal
        if (closeVideo) {
            closeVideo.addEventListener('click', () => {
                videoModal.classList.add('hidden');
                modalVideoContainer.innerHTML = '';
            });
        }
        
        // Fechar o modal ao clicar fora
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                videoModal.classList.add('hidden');
                modalVideoContainer.innerHTML = '';
            }
        });
    }
}

// Função para configurar as técnicas de relaxamento
function setupTechniques() {
    const startButtons = document.querySelectorAll('.start-technique');
    const techniquePlayer = document.getElementById('technique-player');
    const techniqueTitle = document.getElementById('technique-title');
    const techniqueInstruction = document.getElementById('technique-instruction');
    const timerDisplay = document.getElementById('timer-display');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const closeBtn = document.getElementById('close-technique');
    
    if (startButtons.length > 0 && techniquePlayer) {
        let timer;
        let timeLeft;
        let isPaused = true;
        let currentTechnique;
        
        const techniques = {
            breathing: {
                title: 'Respiração 4-7-8',
                duration: 300, // 5 minutos em segundos
                instructions: [
                    'Inspire pelo nariz contando até 4',
                    'Segure a respiração contando até 7',
                    'Expire pela boca contando até 8',
                    'Repita o ciclo'
                ]
            },
            meditation: {
                title: 'Meditação Guiada',
                duration: 300,
                instructions: [
                    'Sente-se em uma posição confortável',
                    'Feche os olhos e respire profundamente',
                    'Observe sua respiração sem julgamento',
                    'Mantenha o foco no momento presente'
                ]
            },
            muscle: {
                title: 'Relaxamento Muscular Progressivo',
                duration: 600, // 10 minutos em segundos
                instructions: [
                    'Tensione os músculos dos pés por 5 segundos',
                    'Relaxe completamente',
                    'Mova para as pernas, depois abdômen',
                    'Continue subindo pelo corpo até o rosto'
                ]
            }
        };
        
        startButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentTechnique = button.getAttribute('data-technique');
                const technique = techniques[currentTechnique];
                
                techniqueTitle.textContent = technique.title;
                timeLeft = technique.duration;
                updateTimerDisplay();
                
                techniqueInstruction.textContent = 'Prepare-se para começar...';
                techniquePlayer.classList.remove('hidden');
                
                isPaused = true;
                startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
                startPauseBtn.disabled = false;
            });
        });
        
        startPauseBtn.addEventListener('click', () => {
            if (isPaused) {
                // Iniciar o timer
                isPaused = false;
                startPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
                
                let instructionIndex = 0;
                const technique = techniques[currentTechnique];
                
                // Mostrar a primeira instrução
                techniqueInstruction.textContent = technique.instructions[instructionIndex];
                
                // Iniciar o timer
                timer = setInterval(() => {
                    timeLeft--;
                    updateTimerDisplay();
                    
                    // Alternar instruções a cada 15 segundos
                    if (timeLeft % 15 === 0) {
                        instructionIndex = (instructionIndex + 1) % technique.instructions.length;
                        techniqueInstruction.textContent = technique.instructions[instructionIndex];
                    }
                    
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        techniqueInstruction.textContent = 'Prática concluída!';
                        startPauseBtn.innerHTML = '<i class="fas fa-check"></i> Concluído';
                        startPauseBtn.disabled = true;
                    }
                }, 1000);
            } else {
                // Pausar o timer
                isPaused = true;
                startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Continuar';
                clearInterval(timer);
            }
        });
        
        resetBtn.addEventListener('click', () => {
            clearInterval(timer);
            const technique = techniques[currentTechnique];
            timeLeft = technique.duration;
            updateTimerDisplay();
            techniqueInstruction.textContent = 'Prepare-se para começar...';
            isPaused = true;
            startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
            startPauseBtn.disabled = false;
        });
        
        closeBtn.addEventListener('click', () => {
            clearInterval(timer);
            techniquePlayer.classList.add('hidden');
        });
        
        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// Função para configurar as atividades
function setupActivities() {
    const startButtons = document.querySelectorAll('.start-activity');
    const activityModal = document.getElementById('activity-modal');
    
    if (startButtons.length > 0 && activityModal) {
        const activityTitle = document.getElementById('activity-title');
        const activityInstructions = document.getElementById('activity-instructions');
        const activityTimer = document.getElementById('activity-timer');
        const startActivityBtn = document.getElementById('start-activity-btn');
        const pauseActivityBtn = document.getElementById('pause-activity-btn');
        const closeActivityBtn = document.getElementById('close-activity');
        
        let timer;
        let timeLeft;
        let isPaused = true;
        
        const activities = {
            writing: {
                title: 'Escrita Expressiva',
                duration: 600, // 10 minutos
                instructions: 'Escreva livremente sobre seus pensamentos e sentimentos. Não se preocupe com gramática ou estrutura. Apenas deixe as palavras fluírem.'
            },
            walking: {
                title: 'Caminhada Mindful',
                duration: 900, // 15 minutos
                instructions: 'Caminhe lentamente, prestando atenção em cada passo. Sinta o contato dos pés com o chão. Observe sua respiração e as sensações do corpo em movimento.'
            },
            art: {
                title: 'Arte Terapêutica',
                duration: 1200, // 20 minutos
                instructions: 'Expresse suas emoções através de desenho ou pintura. Não se preocupe com o resultado final. Foque no processo criativo e na expressão dos seus sentimentos.'
            }
        };
        
        startButtons.forEach(button => {
            button.addEventListener('click', () => {
                const activityType = button.getAttribute('data-activity');
                const activity = activities[activityType];
                
                activityTitle.textContent = activity.title;
                activityInstructions.textContent = activity.instructions;
                
                timeLeft = activity.duration;
                updateActivityTimer();
                
                activityModal.classList.remove('hidden');
                
                isPaused = true;
                startActivityBtn.disabled = false;
                pauseActivityBtn.disabled = true;
            });
        });
        
        startActivityBtn.addEventListener('click', () => {
            isPaused = false;
            startActivityBtn.disabled = true;
            pauseActivityBtn.disabled = false;
            
            timer = setInterval(() => {
                timeLeft--;
                updateActivityTimer();
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    activityInstructions.textContent = 'Atividade concluída!';
                    startActivityBtn.disabled = true;
                    pauseActivityBtn.disabled = true;
                }
            }, 1000);
        });
        
        pauseActivityBtn.addEventListener('click', () => {
            clearInterval(timer);
            isPaused = true;
            startActivityBtn.disabled = false;
            pauseActivityBtn.disabled = true;
        });
        
        closeActivityBtn.addEventListener('click', () => {
            clearInterval(timer);
            activityModal.classList.add('hidden');
        });
        
        function updateActivityTimer() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            activityTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}



// Função para configurar o desafio diário
function setupDailyChallenge() {
    const completeButton = document.getElementById('complete-challenge');
    const challengeText = document.getElementById('daily-challenge-text');
    
    if (completeButton && challengeText) {
        // Lista de desafios
        const challenges = [
            'Pratique 5 minutos de respiração consciente hoje.',
            'Escreva 3 coisas pelas quais você é grato hoje.',
            'Faça uma caminhada de 10 minutos prestando atenção na natureza.',
            'Desconecte-se das redes sociais por 2 horas hoje.',
            'Beba pelo menos 8 copos de água ao longo do dia.',
            'Pratique um ato de gentileza com alguém hoje.',
            'Dedique 10 minutos para alongar seu corpo.'
        ];
        
        // Verificar se já completou o desafio hoje
        const today = new Date().toDateString();
        const lastCompleted = localStorage.getItem('lastChallengeCompleted');
        const isCompleted = localStorage.getItem('challengeCompleted') === 'true' && lastCompleted === today;
        
        if (isCompleted) {
            completeButton.textContent = 'Concluído';
            completeButton.disabled = true;
            completeButton.classList.add('completed');
        }
        
        // Definir desafio do dia
        const lastChallengeDate = localStorage.getItem('challengeDate');
        if (lastChallengeDate !== today) {
            // Novo dia, novo desafio
            const randomIndex = Math.floor(Math.random() * challenges.length);
            challengeText.textContent = challenges[randomIndex];
            localStorage.setItem('currentChallenge', challenges[randomIndex]);
            localStorage.setItem('challengeDate', today);
            localStorage.setItem('challengeCompleted', 'false');
        } else {
            // Mesmo dia, manter o desafio
            const currentChallenge = localStorage.getItem('currentChallenge');
            if (currentChallenge) {
                challengeText.textContent = currentChallenge;
            }
        }
        
        completeButton.addEventListener('click', () => {
            completeButton.textContent = 'Concluído';
            completeButton.disabled = true;
            completeButton.classList.add('completed');
            
            localStorage.setItem('challengeCompleted', 'true');
            localStorage.setItem('lastChallengeCompleted', today);
        });
    }
    

}