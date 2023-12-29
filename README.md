# CRUD de Cadastro de Usuários - Reserva BP

Neste desafio, você deve criar um CRUD de cadastro de usuários, onde os usuários podem ser Corretores de Seguro ou Clientes.
A aplicação utiliza Nodejs e banco de dados PostegreSql.

### 1 - Tecnologias e Bibliotecas Utilizadas

- Node.js
- NestJS
- Prisma
- Postgresql
- JWT
- Bcrypt
- Jsonwebtoken
- Cors
- Swagger
- Jest
- Docker

### 2 - Configuração e Instalação
A Api precisa do Env para funcionar, por isso copie o .env.example e renome ele para .env.

A API e o Banco de dados está em Docker, para iniciar ele, basta rodar o comando:

```bash
  docker-compose up -D
```


A API estará disponível no endereço [localhost:3000](http://localhost:3000).

### 5 - Documentação

Para acessar a documentação da API, acesse o endereço [localhost:3000/api](http://localhost:3000/api)

### 6 - Testes

Para executar os testes, execute o seguinte comando no terminal:

```bash
  jest --watch
```
