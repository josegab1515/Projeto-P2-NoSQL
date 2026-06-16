from fastapi import APIRouter, HTTPException, Response, status

from app.database import pedidos
from app.models.pedido import Pedido, PedidoCreate, PedidoUpdate
from app.utils import get_object_id, serialize_document, serialize_documents

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.get("/", response_model=list[Pedido])
def listar_pedidos():
    return serialize_documents(pedidos.find())


@router.get("/{id}", response_model=Pedido)
def buscar_pedido(id: str):
    pedido = serialize_document(pedidos.find_one({"_id": get_object_id(id)}))

    if pedido is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido não encontrado",
        )

    return pedido


@router.post("/", response_model=Pedido, status_code=status.HTTP_201_CREATED)
def criar_pedido(pedido: PedidoCreate):
    result = pedidos.insert_one(pedido.model_dump())
    novo_pedido = pedidos.find_one({"_id": result.inserted_id})
    return serialize_document(novo_pedido)


@router.put("/{id}", response_model=Pedido)
def atualizar_pedido(id: str, pedido: PedidoUpdate):
    dados = pedido.model_dump(exclude_unset=True)

    if not dados:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nenhum dado enviado para atualização",
        )

    result = pedidos.update_one({"_id": get_object_id(id)}, {"$set": dados})

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido não encontrado",
        )

    pedido_atualizado = pedidos.find_one({"_id": get_object_id(id)})
    return serialize_document(pedido_atualizado)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_pedido(id: str):
    result = pedidos.delete_one({"_id": get_object_id(id)})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido não encontrado",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)

