from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
# Importa a sua conexão com o MongoDB (ajuste para o seu arquivo, ex: app.database)
from app.database import db 

router = APIRouter(prefix="/auth", tags=["Autenticação"])

class LoginRequest(BaseModel):
    usuario: str
    senha: str

@router.post("/login")
def login(dados: LoginRequest):
    # Busca o usuário na coleção do MongoDB (ajuste o nome se for 'funcionarios')
    user_banco = db["funcionarios"].find_one({"usuario": dados.usuario})
    
    # Se o usuário não existir ou a senha estiver errada, retorna o mesmo erro por segurança
    if not user_banco or user_banco["senha"] != dados.senha:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos."
        )
        
    return {"status": "sucesso", "usuario": user_banco["usuario"]}