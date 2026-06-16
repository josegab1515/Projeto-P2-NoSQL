from fastapi import APIRouter, HTTPException, Response, status

from app.database import clientes
from app.models.cliente import Cliente, ClienteCreate, ClienteUpdate
from app.utils import get_object_id, serialize_document, serialize_documents

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("/", response_model=list[Cliente])
def listar_clientes():
    return serialize_documents(clientes.find())


@router.get("/{id}", response_model=Cliente)
def buscar_cliente(id: str):
    cliente = serialize_document(clientes.find_one({"_id": get_object_id(id)}))

    if cliente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado",
        )

    return cliente


@router.post("/", response_model=Cliente, status_code=status.HTTP_201_CREATED)
def criar_cliente(cliente: ClienteCreate):
    result = clientes.insert_one(cliente.model_dump())
    novo_cliente = clientes.find_one({"_id": result.inserted_id})
    return serialize_document(novo_cliente)


@router.put("/{id}", response_model=Cliente)
def atualizar_cliente(id: str, cliente: ClienteUpdate):
    dados = cliente.model_dump(exclude_unset=True)

    if not dados:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nenhum dado enviado para atualização",
        )

    result = clientes.update_one({"_id": get_object_id(id)}, {"$set": dados})

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado",
        )

    cliente_atualizado = clientes.find_one({"_id": get_object_id(id)})
    return serialize_document(cliente_atualizado)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_cliente(id: str):
    result = clientes.delete_one({"_id": get_object_id(id)})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)

