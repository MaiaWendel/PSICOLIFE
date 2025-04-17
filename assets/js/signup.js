document.querySelector("#telefone").addEventListener("input", function() {
    let inputValue = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (inputValue.length > 11) {
        inputValue = inputValue.slice(0, 11); // Limita a 11 dígitos
    }

    // Aplica a máscara (XX) XXXXX-XXXX automaticamente
    if (inputValue.length >= 3) {
        inputValue = `(${inputValue.slice(0,2)}) ${inputValue.slice(2,7)}-${inputValue.slice(7,11)}`;
    }

    this.value = inputValue;
});


document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordVisibility = (toggleButtonId, inputId) => {
        const toggleButton = document.querySelector(`#${toggleButtonId}`);
        const inputField = document.querySelector(`#${inputId}`);

        toggleButton.addEventListener('click', () => {
            const type = inputField.type === 'password' ? 'text' : 'password';
            inputField.type = type;
            toggleButton.classList.toggle('fa-eye-slash');
        });
    };

    togglePasswordVisibility('togglePassword', 'senha');
    togglePasswordVisibility('toggleConfirmPassword', 'confirmSenha');

    const form = document.querySelector('#signupForm');
    const msgError = document.querySelector('#msgError');
    const msgSuccess = document.querySelector('#msgSuccess');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            saveUserData();
            displayMessage(msgSuccess, 'Usuário cadastrado com sucesso!', true);
            setTimeout(() => {
                window.location.href = '../html/signin.html';
            }, 2000);
        } else {
            displayMessage(msgError, 'Preencha todos os campos corretamente!', false);
        }
    });
});

function validateForm() {
    const fields = ['nomeCompleto', 'usuario', 'email', 'telefone', 'senha', 'psicologo'];
    const confirmSenha = document.querySelector('#confirmSenha');
    const senha = document.querySelector('#senha');
    const sexoSelecionado = document.querySelector('input[name="sexo"]:checked');

    return fields.every(id => document.querySelector(`#${id}`).value.trim().length > 0) &&
           senha.value === confirmSenha.value &&
           sexoSelecionado;
}

function saveUserData() {
    const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
    listaUser.push({
        nomeCompleto: document.querySelector('#nomeCompleto').value,
        usuario: document.querySelector('#usuario').value,
        email: document.querySelector('#email').value,
        telefone: document.querySelector('#telefone').value,
        senha: document.querySelector('#senha').value,
        sexo: document.querySelector('input[name="sexo"]:checked').value,
        psicologo: document.querySelector('#psicologo').value
    });
    localStorage.setItem('listaUser', JSON.stringify(listaUser));
}

function displayMessage(element, message, isSuccess) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.backgroundColor = isSuccess ? '#d4edda' : '#f8d7da';
    element.style.color = isSuccess ? '#155724' : '#842029';
}
