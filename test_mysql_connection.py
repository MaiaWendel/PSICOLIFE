#!/usr/bin/env python3
"""
Teste de conexão com MySQL
"""

import pymysql
import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

def test_pymysql_connection():
    """Teste direto com PyMySQL"""
    print("🔍 Testando conexão direta com PyMySQL...")
    
    try:
        connection = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',  # Altere se tiver senha
            database='psicolife',
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"✅ Conexão PyMySQL OK - MySQL {version[0]}")
            
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print(f"✅ Tabelas encontradas: {len(tables)}")
            for table in tables:
                print(f"   - {table[0]}")
                
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro PyMySQL: {e}")
        return False

def test_sqlalchemy_connection():
    """Teste com SQLAlchemy"""
    print("\n🔍 Testando conexão com SQLAlchemy...")
    
    try:
        # String de conexão
        db_url = 'mysql+pymysql://root:@localhost:3306/psicolife?charset=utf8mb4'
        
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=300,
            echo=False
        )
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT VERSION()"))
            version = result.fetchone()
            print(f"✅ Conexão SQLAlchemy OK - MySQL {version[0]}")
            
            result = connection.execute(text("SHOW TABLES"))
            tables = result.fetchall()
            print(f"✅ Tabelas via SQLAlchemy: {len(tables)}")
            
        return True
        
    except SQLAlchemyError as e:
        print(f"❌ Erro SQLAlchemy: {e}")
        return False
    except Exception as e:
        print(f"❌ Erro geral: {e}")
        return False

def test_flask_app_connection():
    """Teste com Flask App"""
    print("\n🔍 Testando conexão via Flask App...")
    
    try:
        from App import create_app
        from Models import db, Usuario
        
        app = create_app()
        
        with app.app_context():
            # Testar conexão (SQLAlchemy 2.0+ compatível)
            with db.engine.connect() as connection:
                result = connection.execute(text("SELECT 1"))
                print("✅ Conexão Flask App OK")
            
            # Contar usuários
            count = Usuario.query.count()
            print(f"✅ Usuários no banco: {count}")
            
            # Listar alguns usuários
            usuarios = Usuario.query.limit(5).all()
            for user in usuarios:
                print(f"   - {user.nome} ({user.email})")
                
        return True
        
    except Exception as e:
        print(f"❌ Erro Flask App: {e}")
        return False

def check_mysql_requirements():
    """Verificar dependências"""
    print("🔍 Verificando dependências...")
    
    try:
        import pymysql
        print(f"✅ PyMySQL: {pymysql.__version__}")
    except ImportError:
        print("❌ PyMySQL não instalado: pip install pymysql")
        return False
    
    try:
        import sqlalchemy
        print(f"✅ SQLAlchemy: {sqlalchemy.__version__}")
    except ImportError:
        print("❌ SQLAlchemy não instalado: pip install sqlalchemy")
        return False
    
    try:
        import flask
        print(f"✅ Flask: {flask.__version__}")
    except ImportError:
        print("❌ Flask não instalado: pip install flask")
        return False
    
    return True

def main():
    print("🧪 TESTE DE CONEXÃO MYSQL - PSICOLIFE")
    print("=" * 50)
    
    # Verificar dependências
    if not check_mysql_requirements():
        print("\n❌ Instale as dependências primeiro!")
        return
    
    print("\n" + "=" * 50)
    
    # Teste 1: PyMySQL direto
    pymysql_ok = test_pymysql_connection()
    
    # Teste 2: SQLAlchemy
    sqlalchemy_ok = test_sqlalchemy_connection()
    
    # Teste 3: Flask App
    flask_ok = test_flask_app_connection()
    
    # Resumo
    print("\n" + "=" * 50)
    print("📊 RESUMO DOS TESTES:")
    print(f"PyMySQL: {'✅ OK' if pymysql_ok else '❌ FALHOU'}")
    print(f"SQLAlchemy: {'✅ OK' if sqlalchemy_ok else '❌ FALHOU'}")
    print(f"Flask App: {'✅ OK' if flask_ok else '❌ FALHOU'}")
    
    if all([pymysql_ok, sqlalchemy_ok, flask_ok]):
        print("\n🎉 TODOS OS TESTES PASSARAM!")
        print("Conexão com MySQL está funcionando perfeitamente!")
    else:
        print("\n⚠️ ALGUNS TESTES FALHARAM!")
        print("Verifique:")
        print("1. MySQL está rodando?")
        print("2. Banco 'psicolife' existe?")
        print("3. Usuário/senha estão corretos?")
        print("4. Tabelas foram criadas?")

if __name__ == "__main__":
    main()