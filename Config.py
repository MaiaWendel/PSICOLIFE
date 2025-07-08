import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'psicolife-secret-key-2025'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'psicolife-jwt-secret-2025'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)  # Token válido por 7 dias
    
    # Configuração do banco de dados
    if os.environ.get('USE_SQLITE') == '1':
        SQLALCHEMY_DATABASE_URI = 'sqlite:///instance/psicolife.db'
    else:
        DB_USER = os.environ.get('DB_USER') or 'root'
        DB_PASSWORD = os.environ.get('DB_PASSWORD') or ''
        DB_HOST = os.environ.get('DB_HOST') or 'localhost'
        DB_PORT = os.environ.get('DB_PORT') or '3306'
        DB_NAME = os.environ.get('DB_NAME') or 'psicolife'
        
        SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4'
    
    # Configurações SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_timeout': 20,
        'echo': False
    }
    
    # Configurações de segurança
    WTF_CSRF_ENABLED = True
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
