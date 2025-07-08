#!/usr/bin/env python3
"""
Teste de conexão MySQL simplificado
"""

def test_mysql_basic():
    """Teste básico MySQL"""
    try:
        import pymysql
        
        connection = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='psicolife',
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM usuario")
            count = cursor.fetchone()[0]
            print(f"✅ MySQL OK - {count} usuários encontrados")
            
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro MySQL: {e}")
        return False

def test_flask_unified():
    """Teste com App unificado"""
    try:
        from App_Unified import app, db, Usuario
        
        with app.app_context():
            count = Usuario.query.count()
            print(f"✅ Flask Unificado OK - {count} usuários")
            
            # Listar usuários
            usuarios = Usuario.query.limit(3).all()
            for user in usuarios:
                print(f"   - {user.nome} ({user.email})")
                
        return True
        
    except Exception as e:
        print(f"❌ Erro Flask: {e}")
        return False

def main():
    print("🧪 TESTE SIMPLIFICADO - PSICOLIFE")
    print("=" * 40)
    
    # Teste MySQL
    mysql_ok = test_mysql_basic()
    
    # Teste Flask
    flask_ok = test_flask_unified()
    
    print("\n" + "=" * 40)
    print("📊 RESULTADO:")
    print(f"MySQL: {'✅ OK' if mysql_ok else '❌ FALHOU'}")
    print(f"Flask: {'✅ OK' if flask_ok else '❌ FALHOU'}")
    
    if mysql_ok and flask_ok:
        print("\n🎉 TUDO FUNCIONANDO!")
    else:
        print("\n⚠️ Verifique:")
        print("1. MySQL rodando?")
        print("2. Banco 'psicolife' criado?")
        print("3. Tabelas criadas?")

if __name__ == "__main__":
    main()