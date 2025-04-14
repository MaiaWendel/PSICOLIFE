// signup.js
document.addEventListener('DOMContentLoaded', () => {
  // Função para alternar visibilidade das senhas
  const togglePasswordVisibility = (toggleButtonId, inputId) => {
      const toggleButton = document.querySelector(`#${toggleButtonId}`);
      const inputField = document.querySelector(`#${inputId}`);

      toggleButton.addEventListener('click', () => {
          const type = inputField.type === 'password' ? 'text' : 'password';
          inputField.type = type;
          toggleButton.classList.toggle('fa-eye-slash');
      });
  };

  // Configurar alternância de visibilidade das senhas
  togglePasswordVisibility('togglePassword', 'senha');
  togglePasswordVisibility('toggleConfirmPassword', 'confirmSenha');

  // Manipular envio do formulário
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

// Função para validar os campos do formulário
function validateForm() {
  const fields = [
      { id: 'nome', minLength: 3, errorMsg: 'Insira pelo menos 3 caracteres.' },
      { id: 'usuario', minLength: 5, errorMsg: 'Insira pelo menos 5 caracteres.' },
      { id: 'senha', minLength: 6, errorMsg: 'Insira pelo menos 6 caracteres.' },
      { id: 'psicologo', required: true, errorMsg: 'Escolha um psicólogo.' }
  ];

  const confirmSenha = document.querySelector('#confirmSenha');
  const senha = document.querySelector('#senha');
  const isConfirmSenhaValid = senha.value === confirmSenha.value;
  confirmSenha.nextElementSibling.textContent = isConfirmSenhaValid ? '' : 'As senhas não coincidem.';

  return fields.every((field) => {
      const input = document.querySelector(`#${field.id}`);
      const isValid = field.required
          ? input.value.trim().length >= (field.minLength || 1)
          : input.value.trim().length >= field.minLength;

      input.nextElementSibling.textContent = isValid ? '' : field.errorMsg;
      return isValid;
  }) && isConfirmSenhaValid;
}

// Função para salvar os dados do usuário no localStorage
function saveUserData() {
  const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
  listaUser.push({
      nome: document.querySelector('#nome').value,
      usuario: document.querySelector('#usuario').value,
      senha: document.querySelector('#senha').value,
      psicologo: document.querySelector('#psicologo').value
  });
  localStorage.setItem('listaUser', JSON.stringify(listaUser));
}

// Função para exibir mensagens (sucesso ou erro)
function displayMessage(element, message, isSuccess) {
  element.textContent = message;
  element.style.display = 'block';
  element.style.backgroundColor = isSuccess ? '#d4edda' : '#f8d7da';
  element.style.color = isSuccess ? '#155724' : '#842029';
}
