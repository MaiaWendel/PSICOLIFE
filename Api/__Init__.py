from flask import Blueprint

def register_blueprints(app):
    from .Auth import auth_bp
    from .Diario import diario_bp
    from .Quiz import quiz_bp
    from .Contato import contato_bp
    from .Usuario import usuarios_bp
    from .Evolucao import evolucao_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(diario_bp, url_prefix='/api/diario')
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
    app.register_blueprint(contato_bp, url_prefix='/api/contato')
    app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')
    app.register_blueprint(evolucao_bp, url_prefix='/api/evolucao')