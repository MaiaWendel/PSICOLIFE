from App import create_app
from Models import db, Usuario

app = create_app()

with app.app_context():
    # Usuários adicionais para apresentação
    novos_usuarios = [
        # CLÍNICA
        {
            'nome': 'Andreia Monteiro',
            'email': 'andreia@clinicaandreiamonteiro.com',
            'usuario': 'andreia',
            'senha': 'clinica123',
            'tipo': 'admin'
        },
        {
            'nome': 'Admin Clínica',
            'email': 'admin@clinicaandreiamonteiro.com',
            'usuario': 'clinica',
            'senha': 'atibaia123',
            'tipo': 'admin'
        },
        # DESENVOLVEDORES
        {
            'nome': 'Dev Master',
            'email': 'dev@psicolife.com',
            'usuario': 'developer',
            'senha': 'dev123',
            'tipo': 'admin'
        },
        {
            'nome': 'Pedro Dev',
            'email': 'pedro.dev@psicolife.com',
            'usuario': 'pedro',
            'senha': 'pedro123',
            'tipo': 'admin'
        }
    ]
    
    for user_data in novos_usuarios:
        # Verificar se já existe
        existe = Usuario.query.filter_by(email=user_data['email']).first()
        if not existe:
            usuario = Usuario(
                nome=user_data['nome'],
                email=user_data['email'],
                usuario=user_data['usuario'],
                tipo=user_data['tipo'],
                ativo=True
            )
            usuario.set_senha(user_data['senha'])
            db.session.add(usuario)
            print(f"Criado: {user_data['nome']}")
        else:
            print(f"Já existe: {user_data['nome']}")
    
    db.session.commit()
    print("Usuários adicionais criados!")