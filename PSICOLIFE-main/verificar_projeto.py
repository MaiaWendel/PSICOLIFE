#!/usr/bin/env python3
"""
Script de verificação completa do projeto PsicoLife
Verifica se tudo está configurado e funcionando para apresentação
"""

import sys
import os
import pymysql
from datetime import datetime

def verificar_dependencias():
    """Verifica se todas as dependências estão instaladas"""
    print("🔍 Verificando dependências...")
    
    try:
        import flask
        import flask_sqlalchemy
        import flask_jwt_extended
        import flask_cors
        import pymysql
        print("✅ Todas as dependências estão instaladas")
        return True
    except ImportError as e:
        print(f"❌ Dependência faltando: {e}")
        return False

def verificar_banco():
    """Verifica conexão com o banco de dados"""
    print("🔍 Verificando conexão com banco de dados...")
    
    try:
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='psicolife'
        )
        
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tabelas = cursor.fetchall()
        
        tabelas_esperadas = ['usuario', 'contato', 'entrada_diario', 'quiz', 'resposta_quiz', 'evolucao_paciente']
        tabelas_encontradas = [t[0] for t in tabelas]
        
        print(f"✅ Conexão com MySQL OK")
        print(f"✅ Banco 'psicolife' encontrado")
        print(f"✅ Tabelas encontradas: {len(tabelas_encontradas)}")
        
        for tabela in tabelas_esperadas:
            if tabela in tabelas_encontradas:
                print(f"  ✅ {tabela}")
            else:
                print(f"  ❌ {tabela} - FALTANDO")
        
        conn.close()
        return len(tabelas_encontradas) >= 6
        
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return False

def verificar_flask():
    """Verifica se o Flask está configurado corretamente"""
    print("🔍 Verificando configuração do Flask...")
    
    try:
        sys.path.append('./Backend')
        from App import create_app
        
        app = create_app()
        print("✅ Flask App criada com sucesso")
        print(f"✅ Configuração: {app.config['SQLALCHEMY_DATABASE_URI']}")
        return True
        
    except Exception as e:
        print(f"❌ Erro no Flask: {e}")
        return False

def verificar_arquivos():
    """Verifica se todos os arquivos essenciais existem"""
    print("🔍 Verificando arquivos do projeto...")
    
    arquivos_essenciais = [
        'Backend/App.py',
        'Backend/Config.py',
        'Backend/Init_DB.py',
        'assets/html/landing-page.html',
        'assets/html/signin.html',
        'assets/html/dashboard.html',
        'assets/js/config.js',
        'assets/css/main.css',
        'index.html'
    ]
    
    todos_ok = True
    for arquivo in arquivos_essenciais:
        if os.path.exists(arquivo):
            print(f"  ✅ {arquivo}")
        else:
            print(f"  ❌ {arquivo} - FALTANDO")
            todos_ok = False
    
    return todos_ok

def main():
    """Função principal de verificação"""
    print("=" * 60)
    print("🧠 PSICOLIFE - VERIFICAÇÃO COMPLETA DO PROJETO")
    print("=" * 60)
    print(f"📅 Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    print()
    
    resultados = []
    
    # Verificações
    resultados.append(("Dependências", verificar_dependencias()))
    resultados.append(("Arquivos", verificar_arquivos()))
    resultados.append(("Banco de Dados", verificar_banco()))
    resultados.append(("Flask", verificar_flask()))
    
    # Resumo
    print("\n" + "=" * 60)
    print("📊 RESUMO DA VERIFICAÇÃO")
    print("=" * 60)
    
    total_ok = 0
    for nome, status in resultados:
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {nome}: {'OK' if status else 'ERRO'}")
        if status:
            total_ok += 1
    
    print(f"\n🎯 Status Geral: {total_ok}/{len(resultados)} verificações OK")
    
    if total_ok == len(resultados):
        print("\n🎉 PROJETO PRONTO PARA APRESENTAÇÃO!")
        print("\n📋 PRÓXIMOS PASSOS:")
        print("1. Execute: python Backend/App.py")
        print("2. Abra: http://localhost:5000")
        print("3. Ou abra: index.html no navegador")
    else:
        print("\n⚠️  PROJETO PRECISA DE AJUSTES")
        print("Corrija os erros acima antes da apresentação")

if __name__ == "__main__":
    main()