from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Models import db, Usuario, EvolucaoPaciente, EntradaDiario, RespostaQuiz
from datetime import datetime, timedelta
import json

evolucao_bp = Blueprint('evolucao', __name__)

@evolucao_bp.route('/pacientes', methods=['GET'])
@jwt_required()
def listar_pacientes():
    psicologo_id = get_jwt_identity()
    psicologo = Usuario.query.get(psicologo_id)
    
    # Verificar se é psicólogo
    if not psicologo or psicologo.tipo != 'psicologo':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    # Buscar pacientes do psicólogo
    pacientes = Usuario.query.filter_by(psicologo_id=psicologo_id, tipo='paciente').all()
    
    pacientes_data = []
    for paciente in pacientes:
        # Buscar última evolução
        ultima_evolucao = EvolucaoPaciente.query.filter_by(
            paciente_id=paciente.id,
            psicologo_id=psicologo_id
        ).order_by(EvolucaoPaciente.data_avaliacao.desc()).first()
        
        # Contar entradas do diário dos últimos 30 dias
        data_limite = datetime.utcnow() - timedelta(days=30)
        entradas_recentes = EntradaDiario.query.filter(
            EntradaDiario.usuario_id == paciente.id,
            EntradaDiario.data_criacao >= data_limite
        ).count()
        
        # Contar quizzes respondidos dos últimos 30 dias
        quizzes_recentes = RespostaQuiz.query.filter(
            RespostaQuiz.usuario_id == paciente.id,
            RespostaQuiz.data_criacao >= data_limite
        ).count()
        
        paciente_info = {
            'id': paciente.id,
            'nome': paciente.nome,
            'email': paciente.email,
            'telefone': paciente.telefone,
            'genero': paciente.genero,
            'data_cadastro': paciente.data_criacao.isoformat(),
            'ultima_evolucao': ultima_evolucao.to_dict() if ultima_evolucao else None,
            'atividade_recente': {
                'entradas_diario': entradas_recentes,
                'quizzes_respondidos': quizzes_recentes
            }
        }
        pacientes_data.append(paciente_info)
    
    return jsonify(pacientes_data), 200

@evolucao_bp.route('/paciente/<int:paciente_id>/evolucao', methods=['GET'])
@jwt_required()
def obter_evolucao_paciente(paciente_id):
    psicologo_id = get_jwt_identity()
    psicologo = Usuario.query.get(psicologo_id)
    
    # Verificar se é psicólogo
    if not psicologo or psicologo.tipo != 'psicologo':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    # Verificar se o paciente pertence ao psicólogo
    paciente = Usuario.query.filter_by(id=paciente_id, psicologo_id=psicologo_id).first()
    if not paciente:
        return jsonify({'mensagem': 'Paciente não encontrado'}), 404
    
    # Buscar evolução do paciente
    evolucoes = EvolucaoPaciente.query.filter_by(
        paciente_id=paciente_id,
        psicologo_id=psicologo_id
    ).order_by(EvolucaoPaciente.data_avaliacao.desc()).all()
    
    # Buscar entradas do diário dos últimos 90 dias
    data_limite = datetime.utcnow() - timedelta(days=90)
    entradas_diario = EntradaDiario.query.filter(
        EntradaDiario.usuario_id == paciente_id,
        EntradaDiario.data_criacao >= data_limite
    ).order_by(EntradaDiario.data_criacao.desc()).all()
    
    # Buscar respostas de quiz dos últimos 90 dias
    respostas_quiz = RespostaQuiz.query.filter(
        RespostaQuiz.usuario_id == paciente_id,
        RespostaQuiz.data_criacao >= data_limite
    ).order_by(RespostaQuiz.data_criacao.desc()).all()
    
    # Calcular estatísticas de humor
    humores = [entrada.humor for entrada in entradas_diario]
    humor_stats = calcular_estatisticas_humor(humores)
    
    return jsonify({
        'paciente': {
            'id': paciente.id,
            'nome': paciente.nome,
            'email': paciente.email,
            'telefone': paciente.telefone,
            'genero': paciente.genero
        },
        'evolucoes': [evolucao.to_dict() for evolucao in evolucoes],
        'entradas_diario': [entrada.to_dict() for entrada in entradas_diario],
        'respostas_quiz': [resposta.to_dict() for resposta in respostas_quiz],
        'estatisticas_humor': humor_stats
    }), 200

@evolucao_bp.route('/paciente/<int:paciente_id>/evolucao', methods=['POST'])
@jwt_required()
def criar_evolucao(paciente_id):
    psicologo_id = get_jwt_identity()
    psicologo = Usuario.query.get(psicologo_id)
    
    # Verificar se é psicólogo
    if not psicologo or psicologo.tipo != 'psicologo':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    # Verificar se o paciente pertence ao psicólogo
    paciente = Usuario.query.filter_by(id=paciente_id, psicologo_id=psicologo_id).first()
    if not paciente:
        return jsonify({'mensagem': 'Paciente não encontrado'}), 404
    
    data = request.get_json()
    
    nova_evolucao = EvolucaoPaciente(
        paciente_id=paciente_id,
        psicologo_id=psicologo_id,
        humor_geral=data.get('humor_geral'),
        ansiedade_nivel=data.get('ansiedade_nivel'),
        depressao_nivel=data.get('depressao_nivel'),
        sono_qualidade=data.get('sono_qualidade'),
        observacoes=data.get('observacoes'),
        objetivos_sessao=data.get('objetivos_sessao'),
        progresso_observado=data.get('progresso_observado'),
        proximos_passos=data.get('proximos_passos')
    )
    
    db.session.add(nova_evolucao)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Evolução registrada com sucesso',
        'evolucao': nova_evolucao.to_dict()
    }), 201

@evolucao_bp.route('/evolucao/<int:evolucao_id>', methods=['PUT'])
@jwt_required()
def atualizar_evolucao(evolucao_id):
    psicologo_id = get_jwt_identity()
    psicologo = Usuario.query.get(psicologo_id)
    
    # Verificar se é psicólogo
    if not psicologo or psicologo.tipo != 'psicologo':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    evolucao = EvolucaoPaciente.query.filter_by(id=evolucao_id, psicologo_id=psicologo_id).first()
    if not evolucao:
        return jsonify({'mensagem': 'Evolução não encontrada'}), 404
    
    data = request.get_json()
    
    if data.get('humor_geral'):
        evolucao.humor_geral = data['humor_geral']
    if data.get('ansiedade_nivel'):
        evolucao.ansiedade_nivel = data['ansiedade_nivel']
    if data.get('depressao_nivel'):
        evolucao.depressao_nivel = data['depressao_nivel']
    if data.get('sono_qualidade'):
        evolucao.sono_qualidade = data['sono_qualidade']
    if data.get('observacoes'):
        evolucao.observacoes = data['observacoes']
    if data.get('objetivos_sessao'):
        evolucao.objetivos_sessao = data['objetivos_sessao']
    if data.get('progresso_observado'):
        evolucao.progresso_observado = data['progresso_observado']
    if data.get('proximos_passos'):
        evolucao.proximos_passos = data['proximos_passos']
    
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Evolução atualizada com sucesso',
        'evolucao': evolucao.to_dict()
    }), 200

def calcular_estatisticas_humor(humores):
    if not humores:
        return {'media': 0, 'distribuicao': {}}
    
    # Mapear humores para valores numéricos
    humor_valores = {
        'feliz': 5,
        'animado': 4,
        'neutro': 3,
        'triste': 2,
        'irritado': 1,
        'ansioso': 1
    }
    
    valores = [humor_valores.get(humor.lower(), 3) for humor in humores]
    media = sum(valores) / len(valores)
    
    # Contar distribuição
    distribuicao = {}
    for humor in humores:
        distribuicao[humor] = distribuicao.get(humor, 0) + 1
    
    return {
        'media': round(media, 2),
        'distribuicao': distribuicao,
        'total_registros': len(humores)
    }