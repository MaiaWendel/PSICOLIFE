// Função para verificar se o usuário está logado
function checkUserLogin() {
    const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    // Se não estiver logado, redirecionar para a página de login
    if (!isLoggedIn) {
        window.location.href = '../html/signin.html';
        return;
    }
    
    // Atualizar nome do usuário na interface
    const userNameElement = document.getElementById('user-name');
    
    if (userNameElement && userLogged.nome) {
        // Pegar apenas o primeiro nome
        const firstName = userLogged.nome.split(' ')[0];
        userNameElement.textContent = firstName;
    }
    
    // Preencher os campos do formulário com os dados do usuário
    fillProfileForm(userLogged);
}

// Função para preencher o formulário com os dados do usuário
function fillProfileForm(userData) {
    // Buscar o usuário completo na lista de usuários
    const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
    const userFull = listaUser.find(user => user.usuario === userData.usuario) || userData;
    
    // Preencher os campos
    document.getElementById('nome').value = userFull.nomeCompleto || userFull.nome || '';
    document.getElementById('usuario').value = userFull.usuario || '';
    document.getElementById('email').value = userFull.email || '';
    document.getElementById('telefone').value = userFull.telefone || '';
    document.getElementById('sexo').value = userFull.sexo || '';
    
    // Converter o valor do psicólogo para um nome mais amigável
    let psicologoNome = userFull.psicologo || '';
    if (psicologoNome === 'psico1') psicologoNome = 'Dra. Ana Silva';
    if (psicologoNome === 'psico2') psicologoNome = 'Dr. Carlos Mendes';
    if (psicologoNome === 'psico3') psicologoNome = 'Dra. Juliana Alves';
    if (psicologoNome === 'psico4') psicologoNome = 'Dr. Ricardo Santos';
    
    document.getElementById('psicologo').value = psicologoNome;
    
    // Formatar e exibir a data de cadastro
    if (userFull.dataCadastro) {
        const dataCadastro = new Date(userFull.dataCadastro);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        document.getElementById('data-cadastro').value = dataCadastro.toLocaleDateString('pt-BR', options);
    }
}

// Função para alternar o tema
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// Função para verificar o tema salvo
function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// Função para alternar entre as seções do perfil
function setupProfileNavigation() {
    const menuLinks = document.querySelectorAll('.profile-menu a');
    const sections = document.querySelectorAll('.profile-section');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe ativa de todos os links e seções
            menuLinks.forEach(item => item.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Adicionar classe ativa ao link clicado
            this.classList.add('active');
            
            // Mostrar a seção correspondente
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Função para habilitar a edição do perfil
function setupProfileEditing() {
    const btnEdit = document.getElementById('btn-edit');
    const btnSave = document.getElementById('btn-save');
    const btnCancel = document.getElementById('btn-cancel');
    const form = document.getElementById('profile-form');
    
    // Campos que podem ser editados
    const editableFields = ['nome', 'telefone', 'email'];
    
    btnEdit.addEventListener('click', function() {
        // Habilitar campos editáveis
        editableFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.removeAttribute('readonly');
            field.style.backgroundColor = '#fff';
        });
        
        // Mostrar botões de salvar e cancelar
        btnEdit.style.display = 'none';
        btnSave.style.display = 'flex';
        btnCancel.style.display = 'flex';
    });
    
    btnCancel.addEventListener('click', function() {
        // Recarregar os dados originais
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        fillProfileForm(userLogged);
        
        // Desabilitar campos editáveis
        editableFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.setAttribute('readonly', true);
            field.style.backgroundColor = '#f9f9f9';
        });
        
        // Mostrar botão de editar
        btnEdit.style.display = 'flex';
        btnSave.style.display = 'none';
        btnCancel.style.display = 'none';
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores atualizados
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
        
        // Validar campos
        if (!nome || !telefone || !email) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Atualizar dados no localStorage
        const userLogged = JSON.parse(localStorage.getItem('userLogged') || '{}');
        const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        
        // Encontrar e atualizar o usuário na lista
        const userIndex = listaUser.findIndex(user => user.usuario === userLogged.usuario);
        
        if (userIndex !== -1) {
            listaUser[userIndex].nomeCompleto = nome;
            listaUser[userIndex].telefone = telefone;
            listaUser[userIndex].email = email;
            
            // Atualizar localStorage
            localStorage.setItem('listaUser', JSON.stringify(listaUser));
            
            // Atualizar dados do usuário logado
            userLogged.nome = nome;
            userLogged.email = email;
            localStorage.setItem('userLogged', JSON.stringify(userLogged));
            
            // Atualizar nome exibido no cabeçalho
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                const firstName = nome.split(' ')[0];
                userNameElement.textContent = firstName;
            }
            
            alert('Perfil atualizado com sucesso!');
        }
        
        // Desabilitar campos editáveis
        editableFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.setAttribute('readonly', true);
            field.style.backgroundColor = '#f9f9f9';
        });
        
        // Mostrar botão de editar
        btnEdit.style.display = 'flex';
        btnSave.style.display = 'none';
        btnCancel.style.display = 'none';
    });
}

// Função para configurar o upload de foto de perfil
function setupPhotoUpload() {
    const photoUpload = document.getElementById('photo-upload');
    const profileImage = document.getElementById('profile-image');
    
    photoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Verificar se é uma imagem
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione um arquivo de imagem válido.');
                return;
            }
            
            // Ler o arquivo como URL de dados
            const reader = new FileReader();
            reader.onload = function(event) {
                profileImage.src = event.target.result;
                
                // Salvar a imagem no localStorage
                localStorage.setItem('userProfileImage', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Carregar imagem salva, se existir
    const savedImage = localStorage.getItem('userProfileImage');
    if (savedImage) {
        profileImage.src = savedImage;
    }
}



// Inicializar todas as funções quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar login do usuário
    checkUserLogin();
    
    // Adicionar evento ao botão de alternar tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Verificar tema salvo
    checkSavedTheme();
    
    // Configurar navegação do perfil
    setupProfileNavigation();
    
    // Configurar edição do perfil
    setupProfileEditing();
    
    // Configurar upload de foto
    setupPhotoUpload();
    

});