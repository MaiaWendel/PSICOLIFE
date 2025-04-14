// signin.js
document.addEventListener('DOMContentLoaded', () => {
  // Alternar visibilidade da senha
  const togglePassword = document.querySelector('#togglePassword');
  const passwordInput = document.querySelector('#senha');

  togglePassword.addEventListener('click', () => {
      // Alternar tipo de input entre 'password' e 'text'
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;

      // Alternar ícone entre olho aberto e fechado
      togglePassword.classList.toggle('fa-eye-slash');
  });

  // Validação do botão "Entrar"
  const btnEntrar = document.querySelector('.btn-primary');
  btnEntrar.addEventListener('click', (e) => {
      e.preventDefault();
      validarLogin();
  });
});

// Função para validar login
function validarLogin() {
  const usuarioInput = document.querySelector('#usuario').value.trim();
  const senhaInput = document.querySelector('#senha').value.trim();
  const msgError = document.querySelector('#msgError');

  // Recuperar lista de usuários do localStorage
  const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');

  // Verificar se o usuário e senha existem na lista
  const userValid = listaUser.find(user => 
      user.usuario === usuarioInput && user.senha === senhaInput
  );

  if (userValid) {
      // Login bem-sucedido
      msgError.style.display = 'none';
      alert(`Bem-vindo, ${userValid.nome}!`);
      window.location.href = '../html/linding-page.html'; // Redireciona para a página inicial
  } else {
      // Falha no login
      msgError.style.display = 'block';
      msgError.textContent = 'Usuário ou senha incorretos. Tente novamente!';
      msgError.style.color = '#842029';
      msgError.style.backgroundColor = '#f8d7da';
      msgError.style.padding = '10px';
      msgError.style.borderRadius = '5px';
  }
}
