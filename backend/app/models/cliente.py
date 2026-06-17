from pydantic import BaseModel, ConfigDict, Field


class ClienteBase(BaseModel):
    nome: str
    email: str
    telefone: str
    cep: str
    endereco: str
    bairro: str
    complemento: str


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nome: str | None = None
    email: str | None = None
    telefone: str | None = None
    cep: str | None = None
    endereco: str | None = None
    bairro: str | None = None
    complemento: str | None = None


class Cliente(ClienteBase):
    id: str = Field(alias="_id")

    model_config = ConfigDict(populate_by_name=True)

