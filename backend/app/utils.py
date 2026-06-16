from bson import ObjectId
from fastapi import HTTPException, status


def get_object_id(id: str) -> ObjectId:
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID inválido",
        )

    return ObjectId(id)


def serialize_document(document: dict | None) -> dict | None:
    if document is None:
        return None

    document["_id"] = str(document["_id"])
    return document


def serialize_documents(documents) -> list[dict]:
    return [
        document
        for document in (serialize_document(document) for document in documents)
        if document is not None
    ]
