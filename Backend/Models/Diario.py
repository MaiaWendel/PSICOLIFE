from . import db
from datetime import datetime

class EntradaDiario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    conteudo = db.Column(db.Text, nullable=False)
    humor = db.Column(db.String(20), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    
    # Campos de reflexão
    reflexao_positiva = db.Column(db.Text)
    reflexao_aprendizado = db.Column(db.Text)
    reflexao_melhoria = db.Column(db.Text)
    
    # Tags
    tags = db.Column(db.String(200))
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'conteudo': self.conteudo,
            'humor': self.humor,
            'data_criacao': self.data_criacao.isoformat(),
            'reflexao_positiva': self.reflexao_positiva,
            'reflexao_aprendizado': self.reflexao_aprendizado,
            'reflexao_melhoria': self.reflexao_melhoria,
            'tags': self.tags.split(',') if self.tags else []
        }
