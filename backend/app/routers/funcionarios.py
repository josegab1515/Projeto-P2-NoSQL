from fastapi import APIRouter, HTTPException, Response, status

from app.database import funcionarios
from app.models.funcionarios import Funcionario, FuncionarioCreate, FuncionarioUpdate
from app.utils import get_object_id, serialize_document, serialize_documents

router = APIRouter(prefix="/funcionarios", tags=["Funcionários"])


@router.get("/", response_model=list[Funcionario])
def listar_funcionarios():
    return serialize_documents(funcionarios.find())


@router.get("/{funcionario_id}", response_model=Funcionario)
def buscar_funcionario(funcionario_id: str):
    funcionario = serialize_document(
        funcionarios.find_one({"_id": get_object_id(funcionario_id)})
    )

    if funcionario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funcionário não encontrado",
        )

    return funcionario


@router.post("/", response_model=Funcionario, status_code=status.HTTP_201_CREATED)
def criar_funcionario(funcionario: FuncionarioCreate):
    result = funcionarios.insert_one(funcionario.model_dump())
    novo_funcionario = funcionarios.find_one({"_id": result.inserted_id})
    return serialize_document(novo_funcionario)


@router.put("/{funcionario_id}", response_model=Funcionario)
def atualizar_funcionario(funcionario_id: str, funcionario: FuncionarioUpdate):
    dados = funcionario.model_dump(exclude_unset=True)

    if not dados:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nenhum dado enviado para atualização",
        )

    result = funcionarios.update_one(
        {"_id": get_object_id(funcionario_id)}, {"$set": dados}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funcionário não encontrado",
        )

    funcionario_atualizado = funcionarios.find_one(
        {"_id": get_object_id(funcionario_id)}
    )
    return serialize_document(funcionario_atualizado)


@router.delete("/{funcionario_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_funcionario(funcionario_id: str):
    result = funcionarios.delete_one({"_id": get_object_id(funcionario_id)})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funcionário não encontrado",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
