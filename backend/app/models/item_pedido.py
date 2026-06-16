from pydantic import BaseModel

class ItemPedido(BaseModel):
    produto_id: str
    quantidade: int
    preco_unitario: float