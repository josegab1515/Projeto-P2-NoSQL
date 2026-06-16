Instalar as dependências:
pip install -r requirements.txt

Rodar no terminal:
uvicorn app.main:app --reload

A Documentação da API está disponível em:
http://localhost:8000/docs

A API está disponível em:
http://localhost:8000

### Endpoints

#### Clientes

| Método | Endpoint       |
|--------|----------------|
| POST   | /clientes      |
| GET    | /clientes      |
| GET    | /clientes/{id} |
| PUT    | /clientes/{id} |
| DELETE | /clientes/{id} |

#### Pedidos

| Método | Endpoint      |
|--------|---------------|
| POST   | /pedidos      |
| GET    | /pedidos      |
| GET    | /pedidos/{id} |
| PUT    | /pedidos/{id} |
| DELETE | /pedidos/{id} |