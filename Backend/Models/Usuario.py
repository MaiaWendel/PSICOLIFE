from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128))
    tipo = db.Column(db.String(20), default='paciente')  # paciente, psicologo, admin
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    
    # Campos adicionais
    usuario = db.Column(db.String(50), unique=True)
    telefone = db.Column(db.String(20))
    genero = db.Column(db.String(20))
    psicologo_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    
    # Relacionamento psicólogo-paciente
    psicologo = db.relationship('Usuario', remote_side=[id], backref='pacientes')
    
    # Relacionamentos
    entradas_diario = db.relationship('EntradaDiario', backref='usuario', lazy=True)
    respostas_quiz = db.relationship('RespostaQuiz', backref='usuario', lazy=True)
    
    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)
        
    def verificar_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'usuario': self.usuario,
            'telefone': self.telefone,
            'genero': self.genero,
            'tipo': self.tipo,
            'data_criacao': self.data_criacao.isoformat(),
            'ativo': self.ativo,
            'psicologo_id': self.psicologo_id
        }