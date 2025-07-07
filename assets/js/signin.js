document.addEventListener('DOMContentLoaded', () => {
    // Criar usuários locais se não existirem
    if (!localStorage.getItem('listaUser')) {
        const usuarios = [
            {
                id: 1,
                nome: 'Administrador',
                email: 'admin@psicolife.com',
                senha: 'admin123',
                tipo: 'admin'
            },
            {
                id: 2,
                nome: 'Dra. Ana Silva',
                email: 'anasilva@psicolife.com',
                senha: 'psicologo123',
                tipo: 'psicologo'
            },
            {
                id: 3,
                nome: 'Paciente Teste',
                email: 'paciente@teste.com',
                senha: '123456',
                tipo: 'paciente'
            }
        ];
        localStorage.setItem('listaUser', JSON.stringify(usuarios));
    }
    
    // Alternar visibilidade da senha
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#senha');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Validação do formulário de login
    const loginForm = document.querySelector('#loginForm');
    const msgError = document.querySelector('#msgError');
    const msgSuccess = document.querySelector('#msgSuccess');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (msgError) msgError.style.display = 'none';
            if (msgSuccess) msgSuccess.style.display = 'none';
            
            const email = document.querySelector('#email').value.trim();
            const senha = document.querySelector('#senha').value.trim();
            
            if (!email || !senha) {
                showError('Preencha todos os campos');
                return;
            }
            
            validarLogin(email, senha);
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
    
    async function validarLogin(email, senha) {
        try {
            // Tentar login no backend
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Login bem-sucedido
                const userLoggedObj = {
                    id: result.usuario.id,
                    nome: result.usuario.nome,
                    email: result.usuario.email,
                    tipo: result.usuario.tipo,
                    usuario: result.usuario.usuario
                };
                
                localStorage.setItem('userLogged', JSON.stringify(userLoggedObj));
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('token', result.token);
                
                console.log('Token salvo:', result.token); // Debug
                
                showSuccess('Login realizado com sucesso! Redirecionando...');
                
                setTimeout(() => {
                    window.location.href = './dashboard.html';
                }, 1500);
            } else {
                showError(result.mensagem || 'Email ou senha incorretos!');
            }
        } catch (error) {
            console.error('Erro:', error);
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        }
    }
    
    // Função de fallback para localStorage
    function validarLoginLocal(email, senha) {
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        
        const userValid = listaUser.find(user => 
            user.email === email && user.senha === senha
        );
        
        if (userValid) {
            const userLoggedObj = {
                nome: userValid.nome,
                email: userValid.email,
                tipo: userValid.tipo,
                usuario: userValid.usuario
            };
            
            localStorage.setItem('userLogged', JSON.stringify(userLoggedObj));
            localStorage.setItem('userLoggedIn', 'true');
            
            showSuccess('Login realizado com sucesso! Redirecionando...');
            
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 1500);
        } else {
            showError('Email ou senha incorretos!');
        }
    }
});