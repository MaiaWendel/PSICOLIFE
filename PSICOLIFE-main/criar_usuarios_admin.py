#!/usr/bin/env python3
"""
Script para criar usuários administrativos do PsicoLife
Cria acessos para: Devs, Clínica, Psicólogos
"""

import sys
import os
sys.path.append('./Backend')

from App import create_app
from Models import db, Usuario
from werkzeug.security import generate_password_hash

def criar_usuarios_admin():
    """Cria usuários administrativos para apresentação"""
    
    app = create_app()
    
    with app.app_context():
        # Limpar usuários existentes (opcional)
        print("🔄 Limpando usuários existentes...")
        Usuario.query.delete()
        db.session.commit()
        
        usuarios = [
            # ADMINISTRADORES SISTEMA
            {
                'nome': 'Admin Sistema',
                'email': 'admin@psicolife.com',
                'usuario': 'admin',
                'senha': 'admin123',
                'tipo': 'admin'
            },
            
            # DESENVOLVEDORES
            {
                'nome': 'Dev Master',
                'email': 'dev@psicolife.com',
                'usuario': 'developer',
                'senha': 'dev123',
                'tipo': 'admin'
            },
            {
                'nome': 'Pedro Desenvolvedor',
                'email': 'pedro.dev@psicolife.com',
                'usuario': 'pedro',
                'senha': 'pedro123',
                'tipo': 'admin'
            },
            
            # CLÍNICA ANDREIA MONTEIRO
            {
                'nome': 'Andreia Monteiro',
                'email': 'andreia@clinicaandreiamonteiro.com',
                'usuario': 'andreia',
                'senha': 'clinica123',
                'tipo': 'admin'
            },
            {
                'nome': 'Administração Clínica',
                'email': 'admin@clinicaandreiamonteiro.com',
                'usuario': 'clinica',
                'senha': 'atibaia123',
                'tipo': 'admin'
            },
            
            # PSICÓLOGOS
            {
                'nome': 'Dra. Ana Silva',
                'email': 'ana.silva@psicolife.com',
                'usuario': 'anasilva',
                'senha': 'psi123',
                'tipo': 'psicologo'
            },
            {
                'nome': 'Dr. Carlos Mendes',
                'email': 'carlos.mendes@psicolife.com',
                'usuario': 'carlosmendes',
                'senha': 'psi123',
                'tipo': 'psicologo'
            },
            {
                'nome': 'Dra. Juliana Alves',
                'email': 'juliana.alves@psicolife.com',
                'usuario': 'julianaalves',
                'senha': 'psi123',
                'tipo': 'psicologo'
            },
            {
                'nome': 'Dr. Ricardo Santos',
                'email': 'ricardo.santos@psicolife.com',
                'usuario': 'ricardosantos',
                'senha': 'psi123',
                'tipo': 'psicologo'
            },
            
            # PACIENTES DEMO
            {
                'nome': 'Maria Silva',
                'email': 'maria@email.com',
                'usuario': 'maria',
                'senha': 'demo123',
                'tipo': 'paciente'
            },
            {
                'nome': 'João Santos',
                'email': 'joao@email.com',
                'usuario': 'joao',
                'senha': 'demo123',
                'tipo': 'paciente'
            }
        ]
        
        print("👥 Criando usuários...")
        
        for user_data in usuarios:
            usuario = Usuario(
                nome=user_data['nome'],
                email=user_data['email'],
                usuario=user_data['usuario'],
                tipo=user_data['tipo'],
                ativo=True
            )
            usuario.set_senha(user_data['senha'])
            
            db.session.add(usuario)
            print(f"  ✅ {user_data['nome']} ({user_data['tipo']})")
        
        db.session.commit()
        print("\n🎉 Usuários criados com sucesso!")
        
        # Exibir lista de acessos
        print("\n" + "="*60)
        print("🔑 LISTA DE ACESSOS PARA APRESENTAÇÃO")
        print("="*60)
        
        print("\n👨‍💻 ADMINISTRADORES:")
        print("• admin@psicolife.com / admin123")
        print("• dev@psicolife.com / dev123")
        print("• pedro.dev@psicolife.com / pedro123")
        
        print("\n🏥 CLÍNICA ANDREIA MONTEIRO:")
        print("• andreia@clinicaandreiamonteiro.com / clinica123")
        print("• admin@clinicaandreiamonteiro.com / atibaia123")
        
        print("\n👩‍⚕️ PSICÓLOGOS:")
        print("• ana.silva@psicolife.com / psi123")
        print("• carlos.mendes@psicolife.com / psi123")
        print("• juliana.alves@psicolife.com / psi123")
        print("• ricardo.santos@psicolife.com / psi123")
        
        print("\n👤 PACIENTES DEMO:")
        print("• maria@email.com / demo123")
        print("• joao@email.com / demo123")
        
        print("\n📋 ACESSO ADMIN: http://localhost:5000/admin")
        print("📋 ACESSO SITE: index.html")

if __name__ == "__main__":
    criar_usuarios_admin()