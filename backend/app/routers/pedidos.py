from fastapi import APIRouter, HTTPException
from app.database import pedidos
from app.models.pedido import Pedido
from bson import ObjectId

router= APIRouter(prefix="/pedidos", tags=["Pedidos"])

@router.post("/")
def criar_pedido(pedido: Pedido):

    resultado = pedidos.insert_one(pedido.dict())

    return {
        "id": str(resultado.inserted_id)
    }

@router.get("/")
def listar_pedidos():

    lista = []

    for pedido in pedidos.find():
        pedido["_id"] = str(pedido["_id"])
        lista.append(pedido)

    return lista

@router.get("/{id}")
def buscar_pedido(id: str):

    pedido = pedidos.find_one({
        "_id": ObjectId(id)
    })

    if not pedido:
        raise HTTPException(
            status_code=404,
            detail="Pedido não encontrado"
        )

    pedido["_id"] = str(pedido["_id"])

    return pedido

@router.put("/{id}")
def atualizar_pedido(id: str, pedido: Pedido):

    resultado = pedidos.update_one(
        {"_id": ObjectId(id)},
        {"$set": pedido.dict()}
    )

    if resultado.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Pedido não encontrado"
        )

    return {
        "message": "Pedido atualizado com sucesso!"
    }

@router.delete("/{id}")
def deletar_pedido(id: str):

    resultado = pedidos.delete_one(
        {"_id": ObjectId(id)}
    )

    if resultado.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Pedido não encontrado"
        )

    return {
        "message": "Pedido removido com sucesso!"
    }