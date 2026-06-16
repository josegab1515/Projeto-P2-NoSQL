from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, funcionarios, produtos, clientes, pedidos

app = FastAPI(
    title="Dom Quixote Padaria API",
    description="API para e-commerce de padaria usando FastAPI e MongoDB.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:4200",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4200",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "API Dom Quixote Padaria"}


app.include_router(auth.router)
app.include_router(funcionarios.router)
app.include_router(produtos.router)
app.include_router(clientes.router)
app.include_router(pedidos.router)
