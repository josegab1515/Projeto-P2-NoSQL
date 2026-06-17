from fastapi import APIRouter, HTTPException, Response, status

from app.database import produtos
from app.models.produto import Produto, ProdutoCreate, ProdutoUpdate
from app.utils import get_object_id, serialize_document, serialize_documents

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.get("/", response_model=list[Produto])
def listar_produtos():
    return serialize_documents(produtos.find())


@router.get("/{produto_id}", response_model=Produto)
def buscar_produto(produto_id: str):
    produto = serialize_document(produtos.find_one({"_id": get_object_id(produto_id)}))

    if produto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado",
        )

    return produto


@router.post("/", response_model=Produto, status_code=status.HTTP_201_CREATED)
def criar_produto(produto: ProdutoCreate):
    result = produtos.insert_one(produto.model_dump())
    novo_produto = produtos.find_one({"_id": result.inserted_id})
    return serialize_document(novo_produto)


@router.put("/{produto_id}", response_model=Produto)
def atualizar_produto(produto_id: str, produto: ProdutoUpdate):
    dados = produto.model_dump(exclude_unset=True)

    if not dados:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nenhum dado enviado para atualização",
        )

    result = produtos.update_one({"_id": get_object_id(produto_id)}, {"$set": dados})

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado",
        )

    produto_atualizado = produtos.find_one({"_id": get_object_id(produto_id)})
    return serialize_document(produto_atualizado)


@router.delete("/{produto_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_produto(produto_id: str):
    result = produtos.delete_one({"_id": get_object_id(produto_id)})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
