from pydantic import BaseModel

class Cliente(BaseModel):
    nome: str
    email: str
    telefone: str
    cep: str
    endereco: str
    bairro: str
    complemento: str