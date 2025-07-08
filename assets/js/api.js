// Função para obter configurações (com fallback se config.js não estiver carregado)
function getConfig() {
    return window.CONFIG || {
        API_BASE_URL: 'http://localhost:5000/api',
        ENDPOINTS: {
            AUTH: {
                LOGIN: '/auth/login',
                REGISTRO: '/auth/registro',
                PERFIL: '/auth/perfil'
            }
        },
        AUTH: {
            TOKEN_KEY: 'token',
            USER_KEY: 'user'
        }
    };
}

// Função para fazer requisições não autenticadas
async function fetchNoAuth(endpoint, options = {}) {
    const config = getConfig();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    try {
        const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.mensagem || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        
        // Se for erro de rede, tentar usar dados locais como fallback
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.warn('API indisponível, usando dados locais como fallback');
            throw new Error('Servidor indisponível. Usando dados locais.');
        }
        
        throw error;
    }
}

// Função para fazer requisições autenticadas
async function fetchAuth(endpoint, options = {}) {
    const config = getConfig();
    const token = localStorage.getItem(config.AUTH.TOKEN_KEY);
    
    if (!token) {
        throw new Error('Usuário não autenticado');
    }
    
    return fetchNoAuth(endpoint, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });
}

// API de Autenticação
const authAPI = {
    login: async (email, senha) => {
        const config = getConfig();
        
        try {
            const data = await fetchNoAuth(config.ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ email, senha })
            });
            
            localStorage.setItem(config.AUTH.TOKEN_KEY, data.token);
            localStorage.setItem(config.AUTH.USER_KEY, JSON.stringify(data.usuario));
            
            return data.usuario;
        } catch (error) {
            // Se a API falhar, tentar login local como fallback
            if (error.message.includes('indisponível')) {
                return authAPI.loginLocal(email, senha);
            }
            throw error;
        }
    },
    
    registro: async (userData) => {
        const config = getConfig();
        
        try {
            const data = await fetchNoAuth(config.ENDPOINTS.AUTH.REGISTRO, {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            
            localStorage.setItem(config.AUTH.TOKEN_KEY, data.token);
            localStorage.setItem(config.AUTH.USER_KEY, JSON.stringify(data.usuario));
            
            return data.usuario;
        } catch (error) {
            // Se a API falhar, salvar localmente como fallback
            if (error.message.includes('indisponível')) {
                return authAPI.registroLocal(userData);
            }
            throw error;
        }
    },
    
    logout: () => {
        const config = getConfig();
        localStorage.removeItem(config.AUTH.TOKEN_KEY);
        localStorage.removeItem(config.AUTH.USER_KEY);
        localStorage.removeItem('userLogged');
        localStorage.removeItem('userLoggedIn');
    },
    
    getUser: () => {
        const config = getConfig();
        const userStr = localStorage.getItem(config.AUTH.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },
    
    isAuthenticated: () => {
        const config = getConfig();
        return !!localStorage.getItem(config.AUTH.TOKEN_KEY) || localStorage.getItem('userLoggedIn') === 'true';
    },
    
    // Métodos de fallback para funcionamento offline
    loginLocal: (email, senha) => {
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        
        const userValid = listaUser.find(user => 
            (user.email === email || user.usuario === email) && user.senha === senha
        );
        
        if (userValid) {
            const userLoggedObj = {
                nome: userValid.nome || userValid.nomeCompleto,
                usuario: userValid.usuario,
                email: userValid.email,
                psicologo: userValid.psicologo
            };
            
            localStorage.setItem('userLogged', JSON.stringify(userLoggedObj));
            localStorage.setItem('userLoggedIn', 'true');
            
            return userLoggedObj;
        } else {
            throw new Error('Email ou senha incorretos');
        }
    },
    
    registroLocal: (userData) => {
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        
        // Verificar se email já existe
        if (listaUser.find(user => user.email === userData.email)) {
            throw new Error('Email já cadastrado');
        }
        
        // Verificar se usuário já existe
        if (userData.usuario && listaUser.find(user => user.usuario === userData.usuario)) {
            throw new Error('Nome de usuário já cadastrado');
        }
        
        // Adicionar novo usuário
        const novoUsuario = {
            id: Date.now(),
            nome: userData.nome,
            nomeCompleto: userData.nome,
            usuario: userData.usuario,
            email: userData.email,
            telefone: userData.telefone,
            senha: userData.senha,
            genero: userData.genero,
            psicologo: userData.psicologo,
            dataCadastro: new Date().toISOString()
        };
        
        listaUser.push(novoUsuario);
        localStorage.setItem('listaUser', JSON.stringify(listaUser));
        
        // Fazer login automático
        const userLoggedObj = {
            nome: novoUsuario.nome,
            usuario: novoUsuario.usuario,
            email: novoUsuario.email,
            psicologo: novoUsuario.psicologo
        };
        
        localStorage.setItem('userLogged', JSON.stringify(userLoggedObj));
        localStorage.setItem('userLoggedIn', 'true');
        
        return userLoggedObj;
    }
};

// API do Diário
const diarioAPI = {
    listarEntradas: async () => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.DIARIO.BASE);
    },
    
    obterEntrada: async (id) => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.DIARIO.BY_ID(id));
    },
    
    criarEntrada: async (entrada) => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.DIARIO.BASE, {
            method: 'POST',
            body: JSON.stringify(entrada)
        });
    },
    
    atualizarEntrada: async (id, entrada) => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.DIARIO.BY_ID(id), {
            method: 'PUT',
            body: JSON.stringify(entrada)
        });
    },
    
    excluirEntrada: async (id) => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.DIARIO.BY_ID(id), {
            method: 'DELETE'
        });
    }
};

// API do Quiz
const quizAPI = {
    listarQuizzes: async () => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.QUIZ.BASE);
    },
    
    obterQuiz: async (id) => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.QUIZ.BY_ID(id));
    },
    
    responderQuiz: async (quizId, respostas) => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.QUIZ.RESPONDER, {
            method: 'POST',
            body: JSON.stringify({ quiz_id: quizId, respostas })
        });
    },
    
    obterHistorico: async () => {
        const config = getConfig();
        return await fetchAuth(config.ENDPOINTS.QUIZ.HISTORICO);
    }
};

// API de Contato
const contatoAPI = {
    enviarMensagem: async (mensagem) => {
        const config = getConfig();
        return await fetchNoAuth(config.ENDPOINTS.CONTATO.BASE, {
            method: 'POST',
            body: JSON.stringify(mensagem)
        });
    }
};

// Exportar todas as APIs
window.API = {
    auth: authAPI,
    diario: diarioAPI,
    quiz: quizAPI,
    contato: contatoAPI
};