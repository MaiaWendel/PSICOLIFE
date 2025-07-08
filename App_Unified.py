from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os

# Configuração
class Config:
    SECRET_KEY = 'psicolife-secret-key-2025'
    JWT_SECRET_KEY = 'psicolife-jwt-secret-2025'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # MySQL
    DB_USER = 'root'
    DB_PASSWORD = ''
    DB_HOST = 'localhost'
    DB_PORT = '3306'
    DB_NAME = 'psicolife'
    
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Inicializar Flask
app = Flask(__name__, static_folder='../assets', static_url_path='/assets')
app.config.from_object(Config)

# Extensões
CORS(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)

# =====================================================
# MODELOS
# =====================================================

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255))
    tipo = db.Column(db.String(20), default='paciente')
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    usuario = db.Column(db.String(50), unique=True)
    telefone = db.Column(db.String(20))
    genero = db.Column(db.String(20))
    psicologo_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    
    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)
        
    def verificar_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'usuario': self.usuario,
            'telefone': self.telefone,
            'genero': self.genero,
            'tipo': self.tipo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'ativo': self.ativo
        }

class EntradaDiario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    conteudo = db.Column(db.Text, nullable=False)
    humor = db.Column(db.String(20), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    reflexao_positiva = db.Column(db.Text)
    reflexao_aprendizado = db.Column(db.Text)
    reflexao_melhoria = db.Column(db.Text)
    tags = db.Column(db.String(200))
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'conteudo': self.conteudo,
            'humor': self.humor,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'reflexao_positiva': self.reflexao_positiva,
            'reflexao_aprendizado': self.reflexao_aprendizado,
            'reflexao_melhoria': self.reflexao_melhoria,
            'tags': self.tags.split(',') if self.tags else []
        }

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
            'data_consulta': self.data_consulta.isoformat() if self.data_consulta else None,
            'status': self.status,
            'observacoes': self.observacoes
        }

# =====================================================
# ROTAS UNIFICADAS
# =====================================================

# Servir arquivos estáticos
@app.route('/')
def index():
    return send_from_directory('..', 'index.html')

@app.route('/html/<path:filename>')
def serve_html(filename):
    return send_from_directory('../assets/html', filename)

# =====================================================
# API AUTENTICAÇÃO
# =====================================================

@app.route('/api/auth/login', methods=['POST'])
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

@app.route('/api/auth/registro', methods=['POST'])
def registro():
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

@app.route('/api/auth/perfil', methods=['GET'])
@jwt_required()
def perfil():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({'mensagem': 'Usuário não encontrado'}), 404
    
    return jsonify(usuario.to_dict()), 200

@app.route('/api/auth/excluir', methods=['DELETE'])
@jwt_required()
def excluir_conta():
    try:
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)
        
        if not usuario:
            return jsonify({'mensagem': 'Usuário não encontrado'}), 404
        
        data = request.get_json()
        if not data or not data.get('senha'):
            return jsonify({'mensagem': 'Senha obrigatória'}), 400
        
        if not usuario.verificar_senha(data['senha']):
            return jsonify({'mensagem': 'Senha incorreta'}), 401
        
        # Excluir consultas relacionadas
        Consulta.query.filter(
            (Consulta.paciente_id == usuario_id) | 
            (Consulta.psicologo_id == usuario_id)
        ).delete()
        
        # Desvincular pacientes
        Usuario.query.filter_by(psicologo_id=usuario_id).update({'psicologo_id': None})
        
        # Excluir usuário
        db.session.delete(usuario)
        db.session.commit()
        
        return jsonify({'mensagem': 'Conta excluída com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'mensagem': f'Erro: {str(e)}'}), 500

# =====================================================
# API DIÁRIO
# =====================================================

@app.route('/api/diario', methods=['GET'])
@jwt_required()
def listar_diario():
    usuario_id = get_jwt_identity()
    entradas = EntradaDiario.query.filter_by(usuario_id=usuario_id).order_by(EntradaDiario.data_criacao.desc()).all()
    return jsonify([entrada.to_dict() for entrada in entradas]), 200

@app.route('/api/diario', methods=['POST'])
@jwt_required()
def criar_entrada():
    usuario_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('titulo') or not data.get('conteudo') or not data.get('humor'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    entrada = EntradaDiario(
        titulo=data['titulo'],
        conteudo=data['conteudo'],
        humor=data['humor'],
        usuario_id=usuario_id,
        reflexao_positiva=data.get('reflexao_positiva'),
        reflexao_aprendizado=data.get('reflexao_aprendizado'),
        reflexao_melhoria=data.get('reflexao_melhoria'),
        tags=','.join(data.get('tags', []))
    )
    
    db.session.add(entrada)
    db.session.commit()
    
    return jsonify(entrada.to_dict()), 201

@app.route('/api/diario/<int:id>', methods=['DELETE'])
@jwt_required()
def excluir_entrada(id):
    usuario_id = get_jwt_identity()
    entrada = EntradaDiario.query.filter_by(id=id, usuario_id=usuario_id).first()
    
    if not entrada:
        return jsonify({'mensagem': 'Entrada não encontrada'}), 404
    
    db.session.delete(entrada)
    db.session.commit()
    
    return jsonify({'mensagem': 'Entrada excluída com sucesso'}), 200

# =====================================================
# API CONSULTAS
# =====================================================

@app.route('/api/consultas', methods=['GET'])
@jwt_required()
def listar_consultas():
    usuario_id = get_jwt_identity()
    consultas = Consulta.query.filter_by(paciente_id=usuario_id).order_by(Consulta.data_consulta.desc()).all()
    return jsonify([consulta.to_dict() for consulta in consultas]), 200

# =====================================================
# INICIALIZAÇÃO
# =====================================================

def init_db():
    """Inicializar banco de dados"""
    with app.app_context():
        db.create_all()
        print("✅ Tabelas criadas com sucesso!")

if __name__ == '__main__':
    init_db()
    print("🚀 Servidor PsicoLife iniciado!")
    print("📍 Acesse: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)