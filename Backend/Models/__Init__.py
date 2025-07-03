from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

# Importar modelos
from .Usuario import Usuario
from .Diario import EntradaDiario
from .Quiz import Quiz, RespostaQuiz
from .Contato import Contato
from .Evolucao import EvolucaoPaciente