// Script para criar usuários locais para teste
function setupLocalUsers() {
    const usuarios = [
        {
            id: 1,
            nome: 'Administrador',
            nomeCompleto: 'Administrador',
            usuario: 'admin',
            email: 'admin@psicolife.com',
            senha: 'admin123',
            tipo: 'admin',
            dataCadastro: new Date().toISOString()
        },
        {
            id: 2,
            nome: 'Dra. Ana Silva',
            nomeCompleto: 'Dra. Ana Silva',
            usuario: 'anasilva',
            email: 'anasilva@psicolife.com',
            senha: 'psicologo123',
            tipo: 'psicologo',
            dataCadastro: new Date().toISOString()
        },
        {
            id: 3,
            nome: 'Dr. Carlos Mendes',
            nomeCompleto: 'Dr. Carlos Mendes',
            usuario: 'carlosmendes',
            email: 'carlosmendes@psicolife.com',
            senha: 'psicologo123',
            tipo: 'psicologo',
            dataCadastro: new Date().toISOString()
        },
        {
            id: 4,
            nome: 'Paciente Teste',
            nomeCompleto: 'Paciente Teste',
            usuario: 'paciente',
            email: 'paciente@teste.com',
            senha: '123456',
            tipo: 'paciente',
            dataCadastro: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('listaUser', JSON.stringify(usuarios));
    console.log('Usuários locais criados com sucesso!');
}

// Executar automaticamente
setupLocalUsers();