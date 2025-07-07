from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Models import db, Usuario

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/', methods=['GET'])
@jwt_required()
def listar_usuarios():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem ver todos os usuários
    if not usuario or usuario.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    usuarios = Usuario.query.all()
    
    return jsonify([u.to_dict() for u in usuarios]), 200

@usuarios_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def obter_usuario(id):
    usuario_id = get_jwt_identity()
    usuario_atual = Usuario.query.get(usuario_id)
    
    # Apenas o próprio usuário ou administradores podem ver detalhes
    if not usuario_atual or (usuario_atual.id != id and usuario_atual.tipo != 'admin'):
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    usuario = Usuario.query.get(id)
    
    if not usuario:
        return jsonify({'mensagem': 'Usuário não encontrado'}), 404
    
    return jsonify(usuario.to_dict()), 200

@usuarios_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_usuario(id):
    usuario_id = get_jwt_identity()
    usuario_atual = Usuario.query.get(usuario_id)
    
    # Apenas o próprio usuário ou administradores podem atualizar
    if not usuario_atual or (usuario_atual.id != id and usuario_atual.tipo != 'admin'):
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    usuario = Usuario.query.get(id)
    
    if not usuario:
        return jsonify({'mensagem': 'Usuário não encontrado'}), 404
    
    data = request.get_json()
    
    if data.get('nome'):
        usuario.nome = data['nome']
    if data.get('email'):
        # Verificar se o email já está em uso
        email_existente = Usuario.query.filter_by(email=data['email']).first()
        if email_existente and email_existente.id != id:
            return jsonify({'mensagem': 'Email já cadastrado'}), 409
        usuario.email = data['email']
    if data.get('senha'):
        usuario.set_senha(data['senha'])
    if data.get('tipo') and usuario_atual.tipo == 'admin':
        usuario.tipo = data['tipo']
    if data.get('ativo') is not None and usuario_atual.tipo == 'admin':
        usuario.ativo = data['ativo']
    
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Usuário atualizado com sucesso',
        'usuario': usuario.to_dict()
    }), 200

@usuarios_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def excluir_usuario(id):
    usuario_id = get_jwt_identity()
    usuario_atual = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem excluir usuários
    if not usuario_atual or usuario_atual.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    usuario = Usuario.query.get(id)
    
    if not usuario:
        return jsonify({'mensagem': 'Usuário não encontrado'}), 404
    
    db.session.delete(usuario)
    db.session.commit()
    
    return jsonify({'mensagem': 'Usuário excluído com sucesso'}), 200
