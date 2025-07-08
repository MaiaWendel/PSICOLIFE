import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'chave-secreta-temporaria'
    
    # Configuração SQLite (mais simples para testar)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///psicolife.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-chave-secreta-temporaria'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)