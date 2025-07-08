#!/usr/bin/env python3
"""
Teste específico para atualização de senha
"""

from App import create_app
from Models import db, Usuario

def test_senha():
    app = create_app()
    
    with app.app_context():
        # Buscar usuário de teste
        usuario = Usuario.query.filter_by(email='paciente@teste.com').first()
        
        if not usuario:
            print("❌ Usuário não encontrado")
            return
        
        print(f"✅ Usuário encontrado: {usuario.nome}")
        print(f"📧 Email: {usuario.email}")
        print(f"🔑 Hash atual: {usuario.senha_hash[:50]}...")
        
        # Testar senha atual
        senha_atual = '123456'
        if usuario.verificar_senha(senha_atual):
            print("✅ Senha atual correta")
        else:
            print("❌ Senha atual incorreta")
            return
        
        # Testar nova senha
        nova_senha = 'nova123'
        print(f"🔄 Alterando senha para: {nova_senha}")
        
        try:
            usuario.set_senha(nova_senha)
            db.session.commit()
            print("✅ Senha alterada no banco")
            
            # Verificar nova senha
            if usuario.verificar_senha(nova_senha):
                print("✅ Nova senha funciona")
            else:
                print("❌ Nova senha não funciona")
                
            # Voltar senha original
            usuario.set_senha(senha_atual)
            db.session.commit()
            print("🔄 Senha restaurada")
            
        except Exception as e:
            print(f"❌ Erro: {e}")
            db.session.rollback()

if __name__ == "__main__":
    test_senha()