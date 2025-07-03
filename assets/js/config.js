// Configurações globais da aplicação
const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    
    // Endpoints da API
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTRO: '/auth/registro',
            PERFIL: '/auth/perfil'
        },
        DIARIO: {
            BASE: '/diario',
            BY_ID: (id) => `/diario/${id}`
        },
        QUIZ: {
            BASE: '/quiz',
            BY_ID: (id) => `/quiz/${id}`,
            RESPONDER: '/quiz/responder',
            HISTORICO: '/quiz/historico'
        },
        CONTATO: {
            BASE: '/contato',
            BY_ID: (id) => `/contato/${id}`,
            RESPONDER: (id) => `/contato/${id}/responder`
        },
        USUARIOS: {
            BASE: '/usuarios',
            BY_ID: (id) => `/usuarios/${id}`
        },
        EVOLUCAO: {
            PACIENTES: '/evolucao/pacientes',
            PACIENTE_EVOLUCAO: (id) => `/evolucao/paciente/${id}/evolucao`,
            EVOLUCAO_BY_ID: (id) => `/evolucao/evolucao/${id}`
        }
    },
    
    // Configurações de autenticação
    AUTH: {
        TOKEN_KEY: 'token',
        USER_KEY: 'user',
        REMEMBER_KEY: 'rememberUser'
    },
    
    // Mensagens padrão
    MESSAGES: {
        ERRORS: {
            NETWORK: 'Erro de conexão. Verifique sua internet.',
            UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
            FORBIDDEN: 'Acesso negado.',
            NOT_FOUND: 'Recurso não encontrado.',
            SERVER_ERROR: 'Erro interno do servidor.',
            VALIDATION: 'Dados inválidos. Verifique os campos.',
            GENERIC: 'Ocorreu um erro inesperado.'
        },
        SUCCESS: {
            LOGIN: 'Login realizado com sucesso!',
            REGISTRO: 'Conta criada com sucesso!',
            SAVE: 'Dados salvos com sucesso!',
            DELETE: 'Item excluído com sucesso!',
            UPDATE: 'Dados atualizados com sucesso!'
        }
    }
};

// Disponibilizar globalmente
window.CONFIG = CONFIG;