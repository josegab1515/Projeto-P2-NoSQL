from pydantic import BaseModel, ConfigDict, Field


class ProdutoBase(BaseModel):
    nome: str
    preco: str
    descricao: str
    categoria: str
    estoque: str
    imagem: str


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoUpdate(BaseModel):
    nome: str | None = None
    preco: str | None = None
    descricao: str | None = None
    categoria: str | None = None
    estoque: str | None = None
    imagem: str | None = None


class Produto(ProdutoBase):
    id: str = Field(alias="_id")

    model_config = ConfigDict(populate_by_name=True)
