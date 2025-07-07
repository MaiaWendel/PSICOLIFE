from App import create_app
from Models import db, Usuario, Quiz
import json

app = create_app()

with app.app_context():
    # Criar tabelas
    db.create_all()
    
    # Verificar se já existe um usuário admin
    admin = Usuario.query.filter_by(email='admin@psicolife.com').first()
    if not admin:
        # Criar usuário admin
        admin = Usuario(
            nome='Administrador',
            email='admin@psicolife.com',
            tipo='admin',
            ativo=True
        )
        admin.set_senha('admin123')
        db.session.add(admin)
        print('Usuário administrador criado')
    
    # Verificar se já existe um quiz
    quiz = Quiz.query.first()
    if not quiz:
        # Criar quiz de exemplo
        perguntas = [
            {
                "id": 1,
                "texto": "Com que frequência você se sente nervoso ou ansioso?",
                "categoria": "ansiedade"
            },
            {
                "id": 2,
                "texto": "Com que frequência você tem dificuldade para dormir?",
                "categoria": "sono"
            },
            {
                "id": 3,
                "texto": "Com que frequência você se sente triste ou deprimido?",
                "categoria": "depressao"
            },
            {
                "id": 4,
                "texto": "Com que frequência você se sente irritado ou com raiva?",
                "categoria": "humor"
            },
            {
                "id": 5,
                "texto": "Com que frequência você tem dificuldade para se concentrar?",
                "categoria": "concentracao"
            }
        ]
        
        quiz = Quiz(
            titulo='Avaliação de Saúde Mental',
            descricao='Um quiz para avaliar seu estado emocional atual',
            categoria='saude_mental',
            perguntas=json.dumps(perguntas)
        )
        db.session.add(quiz)
        print('Quiz de exemplo criado')
    
    # Criar psicólogos de exemplo
    psicologos = [
        {'nome': 'Dra. Ana Silva', 'email': 'anasilva@psicolife.com', 'usuario': 'anasilva'},
        {'nome': 'Dr. Carlos Mendes', 'email': 'carlosmendes@psicolife.com', 'usuario': 'carlosmendes'},
        {'nome': 'Dra. Juliana Alves', 'email': 'julianaalves@psicolife.com', 'usuario': 'julianaalves'},
        {'nome': 'Dr. Ricardo Santos', 'email': 'ricardosantos@psicolife.com', 'usuario': 'ricardosantos'}
    ]
    
    for psi_data in psicologos:
        psicologo = Usuario.query.filter_by(email=psi_data['email']).first()
        if not psicologo:
            psicologo = Usuario(
                nome=psi_data['nome'],
                email=psi_data['email'],
                usuario=psi_data['usuario'],
                tipo='psicologo',
                ativo=True
            )
            psicologo.set_senha('psicologo123')
            db.session.add(psicologo)
            print(f'Psicólogo {psi_data["nome"]} criado')
    
    # Commit das alterações
    db.session.commit()
    
    print('Banco de dados inicializado com sucesso!')
    print('\nUsuários criados:')
    print('Admin: admin@psicolife.com / admin123')
    print('Psicólogos:')
    print('- anasilva@psicolife.com / psicologo123')
    print('- carlosmendes@psicolife.com / psicologo123')
    print('- julianaalves@psicolife.com / psicologo123')
    print('- ricardosantos@psicolife.com / psicologo123')