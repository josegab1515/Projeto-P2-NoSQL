# Padaria DQ - Backend API

API desenvolvida com FastAPI e MongoDB para o gerenciamento da Padaria DQ.

## Tecnologias
- [FastAPI](https://fastapi.tiangolo.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Pydantic v2](https://docs.pydantic.dev/latest/)
- [Uvicorn](https://www.uvicorn.org/)

## Instalação e Execução

1. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar Variáveis de Ambiente:**
   Crie um arquivo \`.env\` na pasta \`backend\` com:
   ```env
   MONGO_URI=sua_uri_do_mongodb
   DATABASE_NAME=padaria
   ```

3. **Rodar o servidor:**
   ```bash
   uvicorn app.main:app --reload
   ```

## Endpoints Principais

A documentação interativa completa (Swagger) está disponível em:
[http://localhost:8000/docs](http://localhost:8000/docs)

### Clientes (`/clientes`)
- `GET /`: Lista todos os clientes.
- `POST /`: Cadastra um novo cliente.
- `GET /{id}`: Busca cliente por ID.
- `PUT /{id}`: Atualiza dados do cliente.
- `DELETE /{id}`: Remove um cliente.

### Pedidos (`/pedidos`)
- `GET /`: Lista todos os pedidos.
- `POST /`: Registra um novo pedido.
- `GET /{id}`: Detalhes de um pedido específico.
- `PUT /{id}`: Atualiza status ou dados do pedido.
- `DELETE /{id}`: Cancela/Remove um pedido.

### Produtos (`/produtos`)
- `GET /`: Lista todos os produtos.
- `POST /`: Cadastra um novo produto.
- `GET /{produto_id}`: Busca produto por ID.
- `PUT /{produto_id}`: Atualiza dados do produto.
- `DELETE /{produto_id}`: Remove um produto.

### Funcionários (`/funcionarios`)
- `GET /`: Lista todos os funcionários.
- `POST /`: Cadastra um novo funcionário.
- `GET /{funcionario_id}`: Busca funcionário por ID.
- `PUT /{funcionario_id}`: Atualiza dados do funcionário.
- `DELETE /{funcionario_id}`: Remove um funcionário.

