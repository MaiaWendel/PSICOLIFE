from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Models import db, EntradaDiario, Usuario

diario_bp = Blueprint('diario', __name__)

@diario_bp.route('/', methods=['GET'])
@jwt_required()
def listar_entradas():
    usuario_id = get_jwt_identity()
    
    entradas = EntradaDiario.query.filter_by(usuario_id=usuario_id).order_by(EntradaDiario.data_criacao.desc()).all()
    
    return jsonify([entrada.to_dict() for entrada in entradas]), 200

@diario_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def obter_entrada(id):
    usuario_id = get_jwt_identity()
    
    entrada = EntradaDiario.query.filter_by(id=id, usuario_id=usuario_id).first()
    
    if not entrada:
        return jsonify({'mensagem': 'Entrada não encontrada'}), 404
    
    return jsonify(entrada.to_dict()), 200

@diario_bp.route('/', methods=['POST'])
@jwt_required()
def criar_entrada():
    usuario_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('titulo') or not data.get('conteudo') or not data.get('humor'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    nova_entrada = EntradaDiario(
        titulo=data['titulo'],
        conteudo=data['conteudo'],
        humor=data['humor'],
        usuario_id=usuario_id,
        reflexao_positiva=data.get('reflexao_positiva'),
        reflexao_aprendizado=data.get('reflexao_aprendizado'),
        reflexao_melhoria=data.get('reflexao_melhoria'),
        tags=','.join(data.get('tags', []))
    )
    
    db.session.add(nova_entrada)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Entrada criada com sucesso',
        'entrada': nova_entrada.to_dict()
    }), 201

@diario_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_entrada(id):
    usuario_id = get_jwt_identity()
    data = request.get_json()
    
    entrada = EntradaDiario.query.filter_by(id=id, usuario_id=usuario_id).first()
    
    if not entrada:
        return jsonify({'mensagem': 'Entrada não encontrada'}), 404
    
    if data.get('titulo'):
        entrada.titulo = data['titulo']
    if data.get('conteudo'):
        entrada.conteudo = data['conteudo']
    if data.get('humor'):
        entrada.humor = data['humor']
    if data.get('reflexao_positiva'):
        entrada.reflexao_positiva = data['reflexao_positiva']
    if data.get('reflexao_aprendizado'):
        entrada.reflexao_aprendizado = data['reflexao_aprendizado']
    if data.get('reflexao_melhoria'):
        entrada.reflexao_melhoria = data['reflexao_melhoria']
    if data.get('tags'):
        entrada.tags = ','.join(data['tags'])
    
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Entrada atualizada com sucesso',
        'entrada': entrada.to_dict()
    }), 200

@diario_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def excluir_entrada(id):
    usuario_id = get_jwt_identity()
    
    entrada = EntradaDiario.query.filter_by(id=id, usuario_id=usuario_id).first()
    
    if not entrada:
        return jsonify({'mensagem': 'Entrada não encontrada'}), 404
    
    db.session.delete(entrada)
    db.session.commit()
    
    return jsonify({'mensagem': 'Entrada excluída com sucesso'}), 200
