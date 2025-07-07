from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from Config import Config
from Models import db, migrate

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Inicializar extensões
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    
    # Registrar blueprints
    from Api import register_blueprints
    register_blueprints(app)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)