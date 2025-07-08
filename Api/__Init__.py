from flask import Blueprint, jsonify

# Health check endpoint
health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'PsicoLife API está funcionando',
        'version': '1.0.0'
    }), 200

def register_blueprints(app):
    try:
        from .Auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
    except ImportError as e:
        print(f'Erro ao importar Auth: {e}')
    
    try:
        from .Diario import diario_bp
        app.register_blueprint(diario_bp, url_prefix='/api/diario')
    except ImportError:
        pass
    
    try:
        from .Quiz import quiz_bp
        app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
    except ImportError:
        pass
    
    try:
        from .Contato import contato_bp
        app.register_blueprint(contato_bp, url_prefix='/api/contato')
    except ImportError:
        pass
    
    try:
        from .Usuario import usuarios_bp
        app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')
    except ImportError:
        pass
    
    try:
        from .Evolucao import evolucao_bp
        app.register_blueprint(evolucao_bp, url_prefix='/api/evolucao')
    except ImportError:
        pass
    
    try:
        from .Consulta import consulta_bp
        app.register_blueprint(consulta_bp, url_prefix='/api/consultas')
    except ImportError:
        pass
    
    app.register_blueprint(health_bp, url_prefix='/api')