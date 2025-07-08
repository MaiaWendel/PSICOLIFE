from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Models import db, Contato, Usuario

contato_bp = Blueprint('contato', __name__)

@contato_bp.route('/', methods=['POST'])
def enviar_mensagem():
    data = request.get_json()
    
    if not data or not data.get('nome') or not data.get('email') or not data.get('assunto') or not data.get('mensagem'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    nova_mensagem = Contato(
        nome=data['nome'],
        email=data['email'],
        assunto=data['assunto'],
        mensagem=data['mensagem']
    )
    
    db.session.add(nova_mensagem)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Mensagem enviada com sucesso',
        'contato': nova_mensagem.to_dict()
    }), 201

@contato_bp.route('/', methods=['GET'])
@jwt_required()
def listar_mensagens():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem ver todas as mensagens
    if not usuario or usuario.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    mensagens = Contato.query.order_by(Contato.data_envio.desc()).all()
    
    return jsonify([mensagem.to_dict() for mensagem in mensagens]), 200

@contato_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def obter_mensagem(id):
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem ver mensagens
    if not usuario or usuario.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    mensagem = Contato.query.get(id)
    
    if not mensagem:
        return jsonify({'mensagem': 'Mensagem não encontrada'}), 404
    
    return jsonify(mensagem.to_dict()), 200

@contato_bp.route('/<int:id>/responder', methods=['PUT'])
@jwt_required()
def marcar_respondido(id):
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem marcar mensagens como respondidas
    if not usuario or usuario.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    mensagem = Contato.query.get(id)
    
    if not mensagem:
        return jsonify({'mensagem': 'Mensagem não encontrada'}), 404
    
    mensagem.respondido = True
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Mensagem marcada como respondida',
        'contato': mensagem.to_dict()
    }), 200

@contato_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def excluir_mensagem(id):
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem excluir mensagens
    if not usuario or usuario.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    mensagem = Contato.query.get(id)
    
    if not mensagem:
        return jsonify({'mensagem': 'Mensagem não encontrada'}), 404
    
    db.session.delete(mensagem)
    db.session.commit()
    
    return jsonify({'mensagem': 'Mensagem excluída com sucesso'}), 200
