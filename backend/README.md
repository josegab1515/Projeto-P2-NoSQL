# Padaria DQ - Backend API

API desenvolvida com FastAPI e MongoDB para o gerenciamento da Padaria DQ.

## ?? Tecnologias
- [FastAPI](https://fastapi.tiangolo.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Pydantic v2](https://docs.pydantic.dev/latest/)
- [Uvicorn](https://www.uvicorn.org/)

## ??? Instala��o e Execu��o

1. **Instalar depend�ncias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar Vari�veis de Ambiente:**
   Crie um arquivo \`.env\` na pasta \`backend\` com:
   ```env
   MONGO_URI=sua_uri_do_mongodb
   DATABASE_NAME=padaria
   ```

3. **Rodar o servidor:**
   ```bash
   uvicorn app.main:app --reload
   ```

## ?? Endpoints Principais

A documenta��o interativa completa (Swagger) est� dispon�vel em:
[http://localhost:8000/docs](http://localhost:8000/docs)

### ?? Clientes (`/clientes`)
- `GET /`: Lista todos os clientes.
- `POST /`: Cadastra um novo cliente.
- `GET /{id}`: Busca cliente por ID.
- `PUT /{id}`: Atualiza dados do cliente.
- `DELETE /{id}`: Remove um cliente.

### ?? Pedidos (`/pedidos`)
- `GET /`: Lista todos os pedidos.
- `POST /`: Registra um novo pedido.
- `GET /{id}`: Detalhes de um pedido espec�fico.
- `PUT /{id}`: Atualiza status ou dados do pedido.
- `DELETE /{id}`: Cancela/Remove um pedido.

### ?? Produtos (`/produtos`)
- `GET /`: Lista todos os produtos.
- `POST /`: Cadastra um novo produto.
- `GET /{produto_id}`: Busca produto por ID.
- `PUT /{produto_id}`: Atualiza dados do produto.
- `DELETE /{produto_id}`: Remove um produto.

### ?? Funcion�rios (`/funcionarios`)
- `GET /`: Lista todos os funcion�rios.
- `POST /`: Cadastra um novo funcion�rio.
- `GET /{funcionario_id}`: Busca funcion�rio por ID.
- `PUT /{funcionario_id}`: Atualiza dados do funcion�rio.
- `DELETE /{funcionario_id}`: Remove um funcion�rio.

