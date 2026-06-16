from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel

# 1. IMPORTANTE: Certifique-se de importar a coleção de produtos aqui do seu database
from app.database import pedidos, produtos 
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
    # Transforma os dados do Pydantic em um dicionário Python comum
    dados_pedido = pedido.model_dump()
    
    # Busca a lista de itens do pedido. 
    # (Ajuste a chave "itens" caso o atributo no seu modelo PedidoCreate tenha outro nome, ex: "produtos")
    itens = dados_pedido.get("itens", [])

    # --- PASSO 1: VALIDAR SE HÁ ESTOQUE SUFICIENTE PARA TODOS OS ITENS ---
    for item in itens:
        prod_id = item.get("produto_id")
        qtd_comprada = item.get("quantidade")

        # Busca o produto atualizado direto no banco de dados
        produto_banco = produtos.find_one({"_id": get_object_id(prod_id)})
        
        if not produto_banco:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produto com ID {prod_id} não foi encontrado no sistema.",
            )
            
        # Verifica se o estoque real do banco comporta o pedido do cliente
        if produto_banco.get("estoque", 0) < qtd_comprada:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estoque insuficiente para o produto '{produto_banco.get('nome')}'. Disponível: {produto_banco.get('estoque')}.",
            )

    # --- PASSO 2: ATUALIZAR E DIMINUIR O ESTOQUE NO BANCO ---
    for item in itens:
        prod_id = item.get("produto_id")
        qtd_comprada = item.get("quantidade")

        # Usamos o operador $inc com valor negativo para subtrair a quantidade vendida
        produtos.update_one(
            {"_id": get_object_id(prod_id)},
            {"$inc": {"estoque": -int(qtd_comprada)}}
        )

    # --- PASSO 3: SALVAR E RETORNAR O PEDIDO CRIADO ---
    result = pedidos.insert_one(dados_pedido)
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


# Seu schema auxiliar do Pydantic se mantém aqui abaixo
class ItemPedido(BaseModel):
    produto_id: str
    quantidade: int
    preco_unitario: float