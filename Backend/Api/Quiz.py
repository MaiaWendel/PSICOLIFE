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
    
    # Aqui você implementaria a lógica para calcular o resultado com base nas respostas
    # Por simplicidade, vamos apenas armazenar as respostas e um resultado fictício
    
    resultado = {
        'pontuacao': 80,
        'categoria': 'Ansiedade Leve',
        'pontuacoes': {
            'ansiedade': 60,
            'depressao': 30,
            'estresse': 45
        },
        'recomendacoes': [
            'Pratique técnicas de respiração',
            'Mantenha um diário de gratidão',
            'Praticar atividade física regularmente'
        ]
    }
    
    nova_resposta = RespostaQuiz(
        quiz_id=data['quiz_id'],
        usuario_id=usuario_id,
        respostas=json.dumps(data['respostas']),
        resultado=json.dumps(resultado)
    )
    
    db.session.add(nova_resposta)
    db.session.commit()
    
    return jsonify({
        'mensagem': 'Quiz respondido com sucesso',
        'resultado': resultado
    }), 201

@quiz_bp.route('/historico', methods=['GET'])
@jwt_required()
def historico_quiz():
    usuario_id = get_jwt_identity()
    
    respostas = RespostaQuiz.query.filter_by(usuario_id=usuario_id).order_by(RespostaQuiz.data_criacao.desc()).all()
    
    return jsonify([resposta.to_dict() for resposta in respostas]), 200
