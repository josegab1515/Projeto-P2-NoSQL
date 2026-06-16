from fastapi import FastAPI
from app.routers.clientes import router as clientes_router
from app.routers.pedidos import router as pedidos_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "API da Padaria DQ está funcionando!"}

app.include_router(clientes_router)
app.include_router(pedidos_router)