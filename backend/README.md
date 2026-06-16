# Backend - Pessoa 1

Parte do back-end responsável por conexão com MongoDB e pelas collections de `produtos` e `funcionarios`.

## Estrutura

```txt
app/
├── database.py
├── main.py
├── models/
│   ├── produto.py
│   └── funcionarios.py
└── routers/
    ├── produtos.py
    └── funcionarios.py
```

## Configuração

1. Crie e ative um ambiente virtual.
2. Instale as dependências:

```bash
pip install -r requirements.txt
```

3. Crie um arquivo `.env` na pasta `backend` usando o `.env.example` como base:

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=dom_quixote
```

## Rodando a API

Na pasta `backend`, execute:

```bash
uvicorn app.main:app --reload
```

Ou:

```bash
python -m uvicorn app.main:app --reload
```

A documentação interativa fica em:

- `http://127.0.0.1:8000/docs`

## Endpoints da Pessoa 1

### Produtos

- `GET /produtos/`
- `POST /produtos/`
- `GET /produtos/{produto_id}`
- `PUT /produtos/{produto_id}`
- `DELETE /produtos/{produto_id}`

### Funcionários

- `GET /funcionarios/`
- `POST /funcionarios/`
- `GET /funcionarios/{funcionario_id}`
- `PUT /funcionarios/{funcionario_id}`
- `DELETE /funcionarios/{funcionario_id}`
