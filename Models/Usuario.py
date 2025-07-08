from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255))
    tipo = db.Column(db.String(20), default='paciente')  # paciente, psicologo, admin
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    
    # Campos do perfil
    usuario = db.Column(db.String(50), unique=True)
    telefone = db.Column(db.String(20))
    genero = db.Column(db.String(20))
    psicologo_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    
    # Campos de verificação (removidos temporariamente)
    # email_verificado = db.Column(db.Boolean, default=False)
    # telefone_verificado = db.Column(db.Boolean, default=False)
    
    # Relacionamento psicólogo-paciente
    psicologo = db.relationship('Usuario', remote_side=[id], backref='pacientes')
    
    # Relacionamentos
    entradas_diario = db.relationship('EntradaDiario', backref='usuario', lazy=True, cascade='all, delete-orphan')
    respostas_quiz = db.relationship('RespostaQuiz', backref='usuario', lazy=True, cascade='all, delete-orphan')
    # consultas = db.relationship('Consulta', foreign_keys='Consulta.paciente_id', backref='paciente', lazy=True, cascade='all, delete-orphan')
    
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
            'psicologo_id': self.psicologo_id,
            'psicologo_nome': self.psicologo.nome if self.psicologo else None
            # 'email_verificado': self.email_verificado,
            # 'telefone_verificado': self.telefone_verificado
        }

# class Consulta(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     paciente_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
#     psicologo_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
#     data_consulta = db.Column(db.DateTime, nullable=False)
#     status = db.Column(db.String(20), default='agendada')  # agendada, cancelada, realizada
#     observacoes = db.Column(db.Text)
#     data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
#     
#     # Relacionamentos explícitos
#     psicologo = db.relationship('Usuario', foreign_keys=[psicologo_id], backref='consultas_como_psicologo')
#     
#     def to_dict(self):
#         return {
#             'id': self.id,
#             'paciente_id': self.paciente_id,
#             'psicologo_id': self.psicologo_id,
#             'psicologo_nome': self.psicologo.nome if self.psicologo else None,
#             'data_consulta': self.data_consulta.isoformat(),
#             'status': self.status,
#             'observacoes': self.observacoes,
#             'data_criacao': self.data_criacao.isoformat()
#         }