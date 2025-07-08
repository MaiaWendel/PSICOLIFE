from . import db
from datetime import datetime
import json

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    categoria = db.Column(db.String(50))
    perguntas = db.Column(db.Text)  # JSON com as perguntas
    # ativo = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'categoria': self.categoria,
            'perguntas': json.loads(self.perguntas) if self.perguntas else []
            # 'ativo': self.ativo
        }

class RespostaQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    respostas = db.Column(db.Text)  # JSON com as respostas
    resultado = db.Column(db.Text)  # JSON com o resultado
    # pontuacao = db.Column(db.Integer)
    # nivel = db.Column(db.String(50))  # baixo, medio, alto
    # recomendacoes = db.Column(db.Text)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    # finalizado = db.Column(db.Boolean, default=False)
    
    # Relacionamento
    quiz = db.relationship('Quiz', backref='respostas', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'quiz_titulo': self.quiz.titulo if self.quiz else None,
            'usuario_id': self.usuario_id,
            'respostas': json.loads(self.respostas) if self.respostas else {},
            'resultado': json.loads(self.resultado) if self.resultado else {},
            # 'pontuacao': self.pontuacao,
            # 'nivel': self.nivel,
            # 'recomendacoes': self.recomendacoes,
            'data_criacao': self.data_criacao.isoformat()
            # 'finalizado': self.finalizado
        }
