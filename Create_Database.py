import pymysql
import os

def create_database():
    # Configurações de conexão (sem especificar o banco)
    DB_USER = os.environ.get('DB_USER') or 'root'
    DB_PASSWORD = input("Digite a senha do MySQL: ")  # Pede a senha
    DB_HOST = os.environ.get('DB_HOST') or 'localhost'
    DB_PORT = int(os.environ.get('DB_PORT') or '3306')
    
    try:
        # Conecta ao MySQL sem especificar banco
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Cria o banco de dados
        cursor.execute("CREATE DATABASE IF NOT EXISTS psicolife CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        print("✅ Banco de dados 'psicolife' criado com sucesso!")
        
        # Atualiza o arquivo Config.py com a senha
        update_config_password(DB_PASSWORD)
        
        cursor.close()
        connection.close()
        
    except Exception as e:
        print(f"❌ Erro ao criar banco de dados: {e}")
        return False
    
    return True

def update_config_password(password):
    """Atualiza a senha no arquivo Config.py"""
    config_path = "Config.py"
    
    with open(config_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Substitui a linha da senha
    content = content.replace(
        "DB_PASSWORD = os.environ.get('DB_PASSWORD') or 'sua_senha'",
        f"DB_PASSWORD = os.environ.get('DB_PASSWORD') or '{password}'"
    )
    
    with open(config_path, 'w', encoding='utf-8') as file:
        file.write(content)
    
    print("✅ Arquivo Config.py atualizado com a senha!")

if __name__ == "__main__":
    print("🔧 Criando banco de dados PsicoLife...")
    if create_database():
        print("\n🎉 Configuração concluída! Agora execute:")
        print("python Init_DB.py")