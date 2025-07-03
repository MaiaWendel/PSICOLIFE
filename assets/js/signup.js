document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const msgError = document.getElementById('msgError');
    const msgSuccess = document.getElementById('msgSuccess');
    
    // Configurar visualização de senha
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const senhaInput = document.getElementById('senha');
    const confirmSenhaInput = document.getElementById('confirmSenha');
    
    togglePassword.addEventListener('click', function() {
        togglePasswordVisibility(senhaInput, this);
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        togglePasswordVisibility(confirmSenhaInput, this);
    });
    
    function togglePasswordVisibility(input, icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = '(' + value;
            if (value.length > 3) {
                value = value.substring(0, 3) + ') ' + value.substring(3);
            }
            if (value.length > 10) {
                value = value.substring(0, 10) + '-' + value.substring(10, 14);
            }
        }
        this.value = value;
    });
    
    // Envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Limpar mensagens anteriores
        msgError.style.display = 'none';
        msgSuccess.style.display = 'none';
        
        // Validar formulário
        const nomeCompleto = document.getElementById('nomeCompleto').value;
        const usuario = document.getElementById('usuario').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const senha = document.getElementById('senha').value;
        const confirmSenha = document.getElementById('confirmSenha').value;
        const generoSelecionado = document.querySelector('input[name="sexo"]:checked');
        const psicologo = document.getElementById('psicologo').value;
        const termos = document.getElementById('termos').checked;
        
        // Validações
        if (!nomeCompleto || !usuario || !email || !telefone || !senha || !confirmSenha) {
            showError('Preencha todos os campos obrigatórios');
            return;
        }
        
        if (!generoSelecionado) {
            showError('Selecione um gênero');
            return;
        }
        
        if (!psicologo) {
            showError('Selecione um psicólogo');
            return;
        }
        
        if (!termos) {
            showError('Você precisa aceitar os termos e condições');
            return;
        }
        
        if (senha !== confirmSenha) {
            showError('As senhas não coincidem');
            return;
        }
        
        if (senha.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        
        // Preparar dados para envio
        const userData = {
            nome: nomeCompleto,
            usuario: usuario,
            email: email,
            telefone: telefone,
            senha: senha,
            genero: generoSelecionado.value,
            psicologo: psicologo
        };
        
        try {
            // Enviar dados para a API
            await window.API.auth.registro(userData);
            
            // Mostrar mensagem de sucesso
            showSuccess('Conta criada com sucesso! Redirecionando...');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 2000);
            
        } catch (error) {
            showError(error.message || 'Erro ao criar conta. Tente novamente.');
        }
    });
    
    function showError(message) {
        msgError.textContent = message;
        msgError.style.display = 'block';
    }
    
    function showSuccess(message) {
        msgSuccess.textContent = message;
        msgSuccess.style.display = 'block';
    }
});