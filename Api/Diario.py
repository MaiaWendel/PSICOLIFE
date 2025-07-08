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
        tags=','.join(data.get('tags', [])) if data.get('tags') else None
        # categoria=data.get('categoria'),
        # privado=data.get('privado', True)
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
    
    # Atualizar campos fornecidos
    if 'titulo' in data:
        entrada.titulo = data['titulo']
    if 'conteudo' in data:
        entrada.conteudo = data['conteudo']
    if 'humor' in data:
        entrada.humor = data['humor']
    if 'reflexao_positiva' in data:
        entrada.reflexao_positiva = data['reflexao_positiva']
    if 'reflexao_aprendizado' in data:
        entrada.reflexao_aprendizado = data['reflexao_aprendizado']
    if 'reflexao_melhoria' in data:
        entrada.reflexao_melhoria = data['reflexao_melhoria']
    if 'tags' in data:
        entrada.tags = ','.join(data['tags']) if data['tags'] else None
    # if 'categoria' in data:
    #     entrada.categoria = data['categoria']
    # if 'privado' in data:
    #     entrada.privado = data['privado']
    
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
