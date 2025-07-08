from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from Models import db, Usuario

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
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
        
    except Exception as e:
        return jsonify({'mensagem': 'Erro interno'}), 500

@auth_bp.route('/registro', methods=['POST'])
def registro():
    try:
        data = request.get_json()
        
        if not data or not data.get('nome') or not data.get('email') or not data.get('senha'):
            return jsonify({'mensagem': 'Dados incompletos'}), 400
        
        if Usuario.query.filter_by(email=data['email']).first():
            return jsonify({'mensagem': 'Email já cadastrado'}), 409
        
        novo_usuario = Usuario(
            nome=data['nome'],
            email=data['email'],
            tipo='paciente',
            usuario=data.get('usuario'),
            telefone=data.get('telefone'),
            genero=data.get('genero')
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
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'mensagem': 'Erro interno'}), 500

# ===== APIs SEM TOKEN =====

@auth_bp.route('/perfil/<email>', methods=['GET'])
def get_perfil(email):
    try:
        usuario = Usuario.query.filter_by(email=email).first()
        
        if not usuario:
            return jsonify({'mensagem': 'Usuário não encontrado'}), 404
        
        return jsonify(usuario.to_dict()), 200
        
    except Exception as e:
        return jsonify({'mensagem': 'Erro interno'}), 500

@auth_bp.route('/perfil/atualizar', methods=['PUT'])
def atualizar_perfil():
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'mensagem': 'Email obrigatório'}), 400
        
        usuario = Usuario.query.filter_by(email=data['email']).first()
        
        if not usuario:
            return jsonify({'mensagem': 'Usuário não encontrado'}), 404
        
        # Validar nome de usuário único
        if 'usuario' in data and data['usuario'] != usuario.usuario:
            if Usuario.query.filter_by(usuario=data['usuario']).first():
                return jsonify({'mensagem': 'Nome de usuário já existe'}), 409
        
        # Atualizar campos
        if 'nome' in data and data['nome'].strip():
            usuario.nome = data['nome'].strip()
        if 'usuario' in data and data['usuario'].strip():
            usuario.usuario = data['usuario'].strip()
        if 'genero' in data:
            usuario.genero = data['genero']
        if 'telefone' in data:
            usuario.telefone = data['telefone']
        
        db.session.commit()
        return jsonify({
            'mensagem': 'Perfil atualizado com sucesso',
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'mensagem': 'Erro interno'}), 500

@auth_bp.route('/email/atualizar', methods=['PUT'])
def atualizar_email():
    try:
        data = request.get_json()
        
        if not data or not data.get('email_atual') or not data.get('email_novo'):
            return jsonify({'mensagem': 'Emails obrigatórios'}), 400
        
        usuario = Usuario.query.filter_by(email=data['email_atual']).first()
        
        if not usuario:
            return jsonify({'mensagem': 'Usuário não encontrado'}), 404
        
        email_novo = data['email_novo'].strip()
        
        if not email_novo or '@' not in email_novo:
            return jsonify({'mensagem': 'Email inválido'}), 400
        
        if Usuario.query.filter_by(email=email_novo).first():
            return jsonify({'mensagem': 'Email já cadastrado'}), 409
        
        usuario.email = email_novo
        db.session.commit()
        
        return jsonify({'mensagem': 'Email atualizado com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'mensagem': 'Erro interno'}), 500

@auth_bp.route('/telefone/atualizar', methods=['PUT'])
def atualizar_telefone():
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'mensagem': 'Email obrigatório'}), 400
        
        usuario = Usuario.query.filter_by(email=data['email']).first()
        
        if not usuario:
            return jsonify({'mensagem': 'Usuário não encontrado'}), 404
        
        telefone = data.get('telefone', '').strip()
        usuario.telefone = telefone if telefone else None
        
        db.session.commit()
        
        return jsonify({'mensagem': 'Telefone atualizado com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'mensagem': 'Erro interno'}), 500

@auth_bp.route('/senha/atualizar', methods=['PUT'])
def atualizar_senha():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('senha_atual') or not data.get('nova_senha'):
            return jsonify({'mensagem': 'Dados obrigatórios'}), 400
        
        usuario = Usuario.query.filter_by(email=data['email']).first()
        
        if not usuario:
            return jsonify({'mensagem': 'Usuário não encontrado'}), 404
        
        senha_atual = data['senha_atual'].strip()
        nova_senha = data['nova_senha'].strip()
        
        if not usuario.verificar_senha(senha_atual):
            return jsonify({'mensagem': 'Senha atual incorreta'}), 401
        
        if len(nova_senha) < 3:
            return jsonify({'mensagem': 'Nova senha deve ter pelo menos 3 caracteres'}), 400
        
        usuario.set_senha(nova_senha)
        db.session.commit()
        
        return jsonify({'mensagem': 'Senha atualizada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'mensagem': 'Erro interno'}), 500

@auth_bp.route('/conta/excluir', methods=['DELETE'])
def excluir_conta():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('senha'):
            return jsonify({'mensagem': 'Email e senha obrigatórios'}), 400
        
        usuario = Usuario.query.filter_by(email=data['email']).first()
        
        if not usuario:
            return jsonify({'mensagem': 'Usuário não encontrado'}), 404
        
        senha = data['senha'].strip()
        
        if not usuario.verificar_senha(senha):
            return jsonify({'mensagem': 'Senha incorreta'}), 401
        
        # Limpar dependências
        Usuario.query.filter_by(psicologo_id=usuario.id).update(
            {'psicologo_id': None}, synchronize_session=False
        )
        
        # Excluir usuário
        db.session.delete(usuario)
        db.session.commit()
        
        return jsonify({'mensagem': 'Conta excluída com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'mensagem': 'Erro interno'}), 500

# ===== APIs ADMINISTRATIVAS =====

@auth_bp.route('/admin/usuarios', methods=['GET'])
def admin_usuarios():
    try:
        usuarios = Usuario.query.all()
        return jsonify([usuario.to_dict() for usuario in usuarios]), 200
    except Exception as e:
        return jsonify({'mensagem': 'Erro interno'}), 500

@auth_bp.route('/admin/psicologos', methods=['GET'])
def admin_psicologos():
    try:
        psicologos = Usuario.query.filter_by(tipo='psicologo').all()
        result = []
        for psicologo in psicologos:
            data = psicologo.to_dict()
            data['pacientes_count'] = Usuario.query.filter_by(psicologo_id=psicologo.id).count()
            result.append(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'mensagem': 'Erro interno'}), 500

@auth_bp.route('/admin/pacientes', methods=['GET'])
def admin_pacientes():
    try:
        pacientes = Usuario.query.filter_by(tipo='paciente').all()
        return jsonify([paciente.to_dict() for paciente in pacientes]), 200
    except Exception as e:
        return jsonify({'mensagem': 'Erro interno'}), 500