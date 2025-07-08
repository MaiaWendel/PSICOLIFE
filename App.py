from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import NoAuthorizationError
from Config import Config
from Models import db, migrate
import os
import logging

def create_app(config_class=Config):
    app = Flask(__name__, 
                static_folder='../assets',
                static_url_path='/assets')
    app.config.from_object(config_class)
    
    # Configurar logging
    logging.basicConfig(level=logging.INFO)
    
    # Inicializar extensões
    CORS(app, 
         origins=['http://localhost:5000', 'http://127.0.0.1:5000'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'])
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)
    
    # Registrar blueprints com tratamento de erro
    try:
        from Api import register_blueprints
        register_blueprints(app)
    except Exception as e:
        app.logger.error(f'Erro ao registrar blueprints: {e}')
    
    # Rotas para servir arquivos
    @app.route('/')
    def index():
        try:
            return send_from_directory('..', 'index.html')
        except FileNotFoundError:
            return jsonify({'erro': 'Arquivo index.html não encontrado'}), 404
    
    @app.route('/html/<path:filename>')
    def serve_html(filename):
        try:
            return send_from_directory('../assets/html', filename)
        except FileNotFoundError:
            return jsonify({'erro': f'Arquivo {filename} não encontrado'}), 404
    
    # Handler de erro global
    @app.errorhandler(500)
    def internal_error(error):
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({'erro': 'Erro interno do servidor'}), 500
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'erro': 'Recurso não encontrado'}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'erro': 'Método não permitido'}), 405
    
    @app.errorhandler(NoAuthorizationError)
    def handle_no_auth(e):
        return jsonify({'erro': 'Token ausente ou inválido'}), 401
    
    return app

def init_database():
    """Inicializar banco de dados"""
    app = create_app()
    with app.app_context():
        try:
            db.create_all()
            print("✅ Banco de dados inicializado")
        except Exception as e:
            print(f"❌ Erro ao inicializar banco: {e}")

app = create_app()

if __name__ == '__main__':
    init_database()
    print("🚀 Servidor PsicoLife iniciado em http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)