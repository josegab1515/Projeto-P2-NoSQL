from pydantic import BaseModel, ConfigDict, Field
from .item_pedido import ItemPedido


class PedidoBase(BaseModel):
    cliente_id: str
    itens: list[ItemPedido]
    total: float
    pagamento: str
    status: str


class PedidoCreate(PedidoBase):
    pass


class PedidoUpdate(BaseModel):
    cliente_id: str | None = None
    itens: list[ItemPedido] | None = None
    total: float | None = None
    pagamento: str | None = None
    status: str | None = None


class Pedido(PedidoBase):
    id: str = Field(alias="_id")

    model_config = ConfigDict(populate_by_name=True)

