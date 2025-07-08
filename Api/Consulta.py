from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Models import db, Usuario
from datetime import datetime

# Modelo Consulta simples
class Consulta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    psicologo_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    data_consulta = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='agendada')
    observacoes = db.Column(db.Text)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        psicologo = Usuario.query.get(self.psicologo_id)
        return {
            'id': self.id,
            'paciente_id': self.paciente_id,
            'psicologo_id': self.psicologo_id,
            'psicologo_nome': psicologo.nome if psicologo else None,
            'data_consulta': self.data_consulta.isoformat(),
            'status': self.status,
            'observacoes': self.observacoes,
            'data_criacao': self.data_criacao.isoformat()
        }

consulta_bp = Blueprint('consulta', __name__)

@consulta_bp.route('/', methods=['GET'])
@jwt_required()
def listar_consultas():
    usuario_id = get_jwt_identity()
    
    consultas = Consulta.query.filter_by(paciente_id=usuario_id).order_by(Consulta.data_consulta.desc()).all()
    
    return jsonify([consulta.to_dict() for consulta in consultas]), 200

@consulta_bp.route('/', methods=['POST'])
@jwt_required()
def agendar_consulta():
    usuario_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('psicologo_id') or not data.get('data_consulta'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    try:
        data_consulta = datetime.fromisoformat(data['data_consulta'].replace('Z', '+00:00'))
    except:
        return jsonify({'mensagem': 'Data inválida'}), 400
    
    # Verificar se psicólogo existe
    psicologo = Usuario.query.filter_by(id=data['psicologo_id'], tipo='psicologo').first()
    if not psicologo:
        return jsonify({'mensagem': 'Psicólogo não encontrado'}), 404
    
    nova_consulta = Consulta(
        paciente_id=usuario_id,
        psicologo_id=data['psicologo_id'],
        data_consulta=data_consulta,
        observacoes=data.get('observacoes')
    )
    
    db.session.add(nova_consulta)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Consulta agendada com sucesso',
        'consulta': nova_consulta.to_dict()
    }), 201

@consulta_bp.route('/<int:id>/reagendar', methods=['PUT'])
@jwt_required()
def reagendar_consulta(id):
    usuario_id = get_jwt_identity()
    data = request.get_json()
    
    consulta = Consulta.query.filter_by(id=id, paciente_id=usuario_id).first()
    
    if not consulta:
        return jsonify({'mensagem': 'Consulta não encontrada'}), 404
    
    if consulta.status != 'agendada':
        return jsonify({'mensagem': 'Consulta não pode ser reagendada'}), 400
    
    if not data.get('data_consulta'):
        return jsonify({'mensagem': 'Nova data não fornecida'}), 400
    
    try:
        nova_data = datetime.fromisoformat(data['data_consulta'].replace('Z', '+00:00'))
    except:
        return jsonify({'mensagem': 'Data inválida'}), 400
    
    consulta.data_consulta = nova_data
    if 'observacoes' in data:
        consulta.observacoes = data['observacoes']
    
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Consulta reagendada com sucesso',
        'consulta': consulta.to_dict()
    }), 200

@consulta_bp.route('/<int:id>/cancelar', methods=['PUT'])
@jwt_required()
def cancelar_consulta(id):
    usuario_id = get_jwt_identity()
    
    consulta = Consulta.query.filter_by(id=id, paciente_id=usuario_id).first()
    
    if not consulta:
        return jsonify({'mensagem': 'Consulta não encontrada'}), 404
    
    if consulta.status != 'agendada':
        return jsonify({'mensagem': 'Consulta não pode ser cancelada'}), 400
    
    consulta.status = 'cancelada'
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Consulta cancelada com sucesso',
        'consulta': consulta.to_dict()
    }), 200

@consulta_bp.route('/psicologos', methods=['GET'])
@jwt_required()
def listar_psicologos():
    psicologos = Usuario.query.filter_by(tipo='psicologo', ativo=True).all()
    
    return jsonify([{
        'id': p.id,
        'nome': p.nome,
        'email': p.email
    } for p in psicologos]), 200