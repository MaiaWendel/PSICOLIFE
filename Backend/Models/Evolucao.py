from . import db
from datetime import datetime

class EvolucaoPaciente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    psicologo_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    data_avaliacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Campos de avaliação
    humor_geral = db.Column(db.Integer)  # 1-10
    ansiedade_nivel = db.Column(db.Integer)  # 1-10
    depressao_nivel = db.Column(db.Integer)  # 1-10
    sono_qualidade = db.Column(db.Integer)  # 1-10
    
    # Observações
    observacoes = db.Column(db.Text)
    objetivos_sessao = db.Column(db.Text)
    progresso_observado = db.Column(db.Text)
    proximos_passos = db.Column(db.Text)
    
    # Relacionamentos
    paciente = db.relationship('Usuario', foreign_keys=[paciente_id], backref='evolucoes_como_paciente')
    psicologo = db.relationship('Usuario', foreign_keys=[psicologo_id], backref='evolucoes_como_psicologo')
    
    def to_dict(self):
        return {
            'id': self.id,
            'paciente_id': self.paciente_id,
            'psicologo_id': self.psicologo_id,
            'data_avaliacao': self.data_avaliacao.isoformat(),
            'humor_geral': self.humor_geral,
            'ansiedade_nivel': self.ansiedade_nivel,
            'depressao_nivel': self.depressao_nivel,
            'sono_qualidade': self.sono_qualidade,
            'observacoes': self.observacoes,
            'objetivos_sessao': self.objetivos_sessao,
            'progresso_observado': self.progresso_observado,
            'proximos_passos': self.proximos_passos,
            'paciente_nome': self.paciente.nome if self.paciente else None
        }