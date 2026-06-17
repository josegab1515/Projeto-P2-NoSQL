from pydantic import BaseModel, ConfigDict, Field


class ProdutoBase(BaseModel):
    nome: str
    preco: float
    descricao: str
    categoria: str
    estoque: int
    imagem: str


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoUpdate(BaseModel):
    nome: str | None = None
    preco: float | None = None
    descricao: str | None = None
    categoria: str | None = None
    estoque: int | None = None
    imagem: str | None = None


class Produto(ProdutoBase):
    id: str = Field(alias="_id")

    model_config = ConfigDict(populate_by_name=True)
