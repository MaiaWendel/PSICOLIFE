from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from Models import db, Usuario

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('senha'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    usuario = Usuario.query.filter_by(email=data['email']).first()
    
    if not usuario or not usuario.verificar_senha(data['senha']):
        return jsonify({'mensagem': 'Email ou senha incorretos'}), 401
    
    if not usuario.ativo:
        return jsonify({'mensagem': 'Conta desativada'}), 403
    
    access_token = create_access_token(identity=usuario.id)
    
    return jsonify({
        'token': access_token,
        'usuario': usuario.to_dict()
    }), 200

@auth_bp.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()
    
    if not data or not data.get('nome') or not data.get('email') or not data.get('senha'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'mensagem': 'Email já cadastrado'}), 409
    
    if 'usuario' in data and data.get('usuario') and Usuario.query.filter_by(usuario=data['usuario']).first():
        return jsonify({'mensagem': 'Nome de usuário já cadastrado'}), 409
    
    novo_usuario = Usuario(
        nome=data['nome'],
        email=data['email'],
        tipo='paciente',
        usuario=data.get('usuario'),
        telefone=data.get('telefone'),
        genero=data.get('genero'),
        psicologo_id=data.get('psicologo')
    )
    novo_usuario.set_senha(data['senha'])
    
    db.session.add(novo_usuario)
    db.session.commit()
    
    access_token = create_access_token(identity=novo_usuario.id)
    
    return jsonify({
        'mensagem': 'Usuário registrado com sucesso',
        'token': access_token,
        'usuario': novo_usuario.to_dict()
    }), 201

@auth_bp.route('/perfil', methods=['GET'])
@jwt_required()
def perfil():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({'mensagem': 'Usuário não encontrado'}), 404
    
    return jsonify(usuario.to_dict()), 200