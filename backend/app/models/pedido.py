from pydantic import BaseModel
from typing import List
from .item_pedido import ItemPedido

class Pedido(BaseModel):
    cliente_id: str
    itens: List[ItemPedido]
    total: float
    pagamento: str
    status: str