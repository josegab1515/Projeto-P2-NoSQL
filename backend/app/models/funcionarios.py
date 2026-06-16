from pydantic import BaseModel, ConfigDict, Field


class FuncionarioBase(BaseModel):
    usuario: str
    senha: str
    cargo: str


class FuncionarioCreate(FuncionarioBase):
    pass


class FuncionarioUpdate(BaseModel):
    usuario: str | None = None
    senha: str | None = None
    cargo: str | None = None


class Funcionario(FuncionarioBase):
    id: str = Field(alias="_id")

    model_config = ConfigDict(populate_by_name=True)
