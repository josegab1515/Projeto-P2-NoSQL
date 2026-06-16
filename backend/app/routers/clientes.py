from fastapi import APIRouter, HTTPException
from app.database import clientes
from app.models.cliente import Cliente
from bson import ObjectId

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.post("/")
def criar_cliente(cliente: Cliente):

    resultado = clientes.insert_one(cliente.dict())

    return {
        "id": str(resultado.inserted_id),
        "message": "Cliente criado com sucesso!"
    }

@router.get("/")
def listar_clientes():

    lista= []

    for cliente in clientes.find():
        cliente["_id"] = str(cliente["_id"])
        lista.append(cliente)

    return lista

@router.get("/{id}")
def buscar_cliente(id: str):

    cliente = clientes.find_one({
        "_id": ObjectId(id)
    })

    if not cliente:
        raise HTTPException(
            status_code=404,
            detail="Cliente não encontrado"
        )

    cliente["_id"] = str(cliente["_id"])

    return cliente

@router.put("/{id}")
def atualizar_cliente(id: str, cliente: Cliente):

    resultado = clientes.update_one(
        {"_id": ObjectId(id)},
        {"$set": cliente.dict()}
    )

    if resultado.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Cliente não encontrado"
        )

    return {
        "message": "Cliente atualizado com sucesso!"
    }

@router.delete("/{id}")
def deletar_cliente(id: str):

    resultado = clientes.delete_one(
        {"_id": ObjectId(id)}
    )

    if resultado.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Cliente não encontrado"
        )

    return {
        "message": "Cliente removido com sucesso!"
    }