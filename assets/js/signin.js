document.addEventListener('DOMContentLoaded', () => {
    // Alternar visibilidade da senha
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#senha');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            // Alternar tipo de input entre 'password' e 'text'
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;

            // Alternar ícone entre olho aberto e fechado
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Validação do formulário de login
    const loginForm = document.querySelector('#loginForm');
    const msgError = document.querySelector('#msgError');
    const msgSuccess = document.querySelector('#msgSuccess');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Limpar mensagens anteriores
            if (msgError) msgError.style.display = 'none';
            if (msgSuccess) msgSuccess.style.display = 'none';
            
            const email = document.querySelector('#email').value.trim();
            const senha = document.querySelector('#senha').value.trim();
            
            if (!email || !senha) {
                showError('Preencha todos os campos');
                return;
            }
            
            try {
                // Usar a API para fazer login
                if (window.API && window.API.auth) {
                    const usuario = await window.API.auth.login(email, senha);
                    showSuccess('Login realizado com sucesso! Redirecionando...');
                    
                    setTimeout(() => {
                        window.location.href = './dashboard.html';
                    }, 1500);
                } else {
                    // Fallback para o sistema antigo se a API não estiver disponível
                    validarLoginLocal(email, senha);
                }
            } catch (error) {
                showError(error.message || 'Erro ao fazer login. Tente novamente.');
            }
        });
    }
    
    function showError(message) {
        if (msgError) {
            msgError.textContent = message;
            msgError.style.display = 'block';
        }
    }
    
    function showSuccess(message) {
        if (msgSuccess) {
            msgSuccess.textContent = message;
            msgSuccess.style.display = 'block';
        }
    }
    
    // Função de fallback para login local
    function validarLoginLocal(email, senha) {
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
            
            showSuccess('Login realizado com sucesso! Redirecionando...');
            
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 1500);
        } else {
            showError('Email ou senha incorretos. Tente novamente!');
        }
    }
});