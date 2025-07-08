from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Models import db, Quiz, RespostaQuiz, Usuario
import json

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/', methods=['GET'])
@jwt_required()
def listar_quizzes():
    quizzes = Quiz.query.all()
    
    return jsonify([quiz.to_dict() for quiz in quizzes]), 200

@quiz_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def obter_quiz(id):
    quiz = Quiz.query.get(id)
    
    if not quiz:
        return jsonify({'mensagem': 'Quiz não encontrado'}), 404
    
    return jsonify(quiz.to_dict()), 200

@quiz_bp.route('/', methods=['POST'])
@jwt_required()
def criar_quiz():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem criar quizzes
    if not usuario or usuario.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    data = request.get_json()
    
    if not data or not data.get('titulo') or not data.get('perguntas'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    novo_quiz = Quiz(
        titulo=data['titulo'],
        descricao=data.get('descricao', ''),
        categoria=data.get('categoria', ''),
        perguntas=json.dumps(data['perguntas'])
    )
    
    db.session.add(novo_quiz)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Quiz criado com sucesso',
        'quiz': novo_quiz.to_dict()
    }), 201

@quiz_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_quiz(id):
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem atualizar quizzes
    if not usuario or usuario.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    quiz = Quiz.query.get(id)
    
    if not quiz:
        return jsonify({'mensagem': 'Quiz não encontrado'}), 404
    
    data = request.get_json()
    
    if data.get('titulo'):
        quiz.titulo = data['titulo']
    if data.get('descricao'):
        quiz.descricao = data['descricao']
    if data.get('categoria'):
        quiz.categoria = data['categoria']
    if data.get('perguntas'):
        quiz.perguntas = json.dumps(data['perguntas'])
    
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Quiz atualizado com sucesso',
        'quiz': quiz.to_dict()
    }), 200

@quiz_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def excluir_quiz(id):
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    
    # Apenas administradores podem excluir quizzes
    if not usuario or usuario.tipo != 'admin':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    
    quiz = Quiz.query.get(id)
    
    if not quiz:
        return jsonify({'mensagem': 'Quiz não encontrado'}), 404
    
    db.session.delete(quiz)
    db.session.commit()
    
    return jsonify({'mensagem': 'Quiz excluído com sucesso'}), 200

@quiz_bp.route('/responder', methods=['POST'])
@jwt_required()
def responder_quiz():
    usuario_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('quiz_id') or not data.get('respostas'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    quiz = Quiz.query.get(data['quiz_id'])
    if not quiz:
        return jsonify({'mensagem': 'Quiz não encontrado'}), 404
    
    # Calcular resultado baseado nas respostas
    respostas = data['respostas']
    pontuacao_total = sum(respostas.values())
    num_perguntas = len(respostas)
    pontuacao_media = pontuacao_total / num_perguntas if num_perguntas > 0 else 0
    
    # Determinar nível baseado na pontuação
    if pontuacao_media <= 2:
        nivel = 'baixo'
        categoria = 'Bem-estar Emocional Bom'
        recomendacoes = 'Continue mantendo hábitos saudáveis e práticas de autocuidado.'
    elif pontuacao_media <= 3:
        nivel = 'medio'
        categoria = 'Atenção Necessária'
        recomendacoes = 'Considere práticas de relaxamento e converse com um profissional se necessário.'
    else:
        nivel = 'alto'
        categoria = 'Busque Ajuda Profissional'
        recomendacoes = 'Recomendamos buscar ajuda de um psicólogo para melhor acompanhamento.'
    
    resultado = {
        'pontuacao': int(pontuacao_total),
        'pontuacao_media': round(pontuacao_media, 2),
        'nivel': nivel,
        'categoria': categoria,
        'recomendacoes': recomendacoes
    }
    
    nova_resposta = RespostaQuiz(
        quiz_id=data['quiz_id'],
        usuario_id=usuario_id,
        respostas=json.dumps(respostas),
        resultado=json.dumps(resultado),
        pontuacao=int(pontuacao_total),
        nivel=nivel,
        recomendacoes=recomendacoes,
        finalizado=True
    )
    
    db.session.add(nova_resposta)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Quiz finalizado com sucesso',
        'resultado': resultado,
        'resposta_id': nova_resposta.id
    }), 201

@quiz_bp.route('/salvar-progresso', methods=['POST'])
@jwt_required()
def salvar_progresso():
    usuario_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('quiz_id'):
        return jsonify({'mensagem': 'Dados incompletos'}), 400
    
    # Verificar se já existe progresso salvo
    resposta_existente = RespostaQuiz.query.filter_by(
        quiz_id=data['quiz_id'],
        usuario_id=usuario_id,
        finalizado=False
    ).first()
    
    if resposta_existente:
        # Atualizar progresso existente
        resposta_existente.respostas = json.dumps(data.get('respostas', {}))
        db.session.commit()
        return jsonify({'mensagem': 'Progresso atualizado'}), 200
    else:
        # Criar novo progresso
        nova_resposta = RespostaQuiz(
            quiz_id=data['quiz_id'],
            usuario_id=usuario_id,
            respostas=json.dumps(data.get('respostas', {})),
            resultado=json.dumps({}),
            finalizado=False
        )
        db.session.add(nova_resposta)
        db.session.commit()
        return jsonify({'mensagem': 'Progresso salvo', 'resposta_id': nova_resposta.id}), 201

@quiz_bp.route('/historico', methods=['GET'])
@jwt_required()
def historico_quiz():
    usuario_id = get_jwt_identity()
    
    respostas = RespostaQuiz.query.filter_by(usuario_id=usuario_id).order_by(RespostaQuiz.data_criacao.desc()).all()
    
    return jsonify([resposta.to_dict() for resposta in respostas]), 200
