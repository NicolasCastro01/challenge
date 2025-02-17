<p align="center" margin-top="25px" >
  <img src="https://img.shields.io/badge/Status-Development-yellow" alt="Status: Development" />
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/nicolascastro01/challenge?color=yellow">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/nicolascastro01/challenge?color=yellow">
</p>

## 📈 Análise do código fonte

Antes de dar início no código, foi necessário realizar uma análise do código fonte por completo.

E, com isso, foi identificado alguns problemas de segurança, a necessidade de refatoração para a melhora do código no quesito escalabilidade e também foi implementado o provisionamento para o tipo texto.

Toda a análise de forma descritiva de cada etapa se encontra em [Análise](https://docs.google.com/document/d/1A5yAtCUf_rU6EElN5Afj2QeMsnL0TScFHfNoiGxk4OQ/edit?usp=sharing).

🚨 P.S: algumas modificações no docker compose e também como é instalado a aplicação foi feita para a facilidade para os desenvolvedores.

## Setup do projeto de backend

### Pré-requisitos

O que você precisa para configurar o projeto:

- [NPM](https://www.npmjs.com/)
- [Node](https://nodejs.org/en/) `>=22.13.1` (Instale usando [NVM](https://github.com/nvm-sh/nvm))
- [Docker Compose](https://docs.docker.com/compose/)

---

🚨 **Aviso**

Para dar início a instalação do projeto, é importante criar o arquivo **.env** baseado no arquivo **.env.example**.

O processo de instalação possuem dependências que foram centralizadas nas variáveis de ambiente com relação ao versionamento e credenciais.

É importante salientar, que caso altere o valor de **DATABASE_HOST**, coloque o mesmo valor no nome do container com relação ao serviço **db** dentro do arquivo **docker-compose.yml**.

Utilize as seguintes credenciais para facilitar a instalação:

```env
# Application
APP_PORT=3000
APP_NODE_VERSION='22.13.1'
TOKEN_VALID='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMThjMzdjZTItY2QzNC00MzA1LTljYTQtYzE1ZmM3MzZiZWFjIn0.pqWRiyQuvWRVQgIzKvQ85RrBwSF5KxeGZrkFvKt2CG8'

# Redis
REDIS_PORT=6379

# Database
DATABASE_HOST='provisioner-db'
DATABASE_PORT=5432
DATABASE_USERNAME='postgres'
DATABASE_PASSWORD='postgres'
DATABASE_NAME='challenge'

# Authorization
JWT_SECRET='370378e1fa51e79552b137683a319e9520bd4a3303983e29ff3431f2111176f4'
```

**Atenção:**
Lembre que se for instalar no windows para rodar o make é recomendado usar o mingw32, instalado com o msys2(baixe no site oficial), abrindo o programa e rodando o:

```bash
pacman -Syu
pacman -Su
pacman -S mingw-w64-x86_64-toolchain
export PATH=$PATH:/c/msys64/mingw64/bin
mingw32-make install
```

### Instalando o projeto com Makefile

1. **Instale o Docker e o Docker Compose**, caso ainda não tenha.
2. Clone o projeto
   ```bash
   git clone https://github.com/NicolasCastro01/challenge.git
   ```
3. Entre na pasta do projeto
   ```bash
   cd challenge
   ```
4. Rode o seguinte comando para inicializar os serviços do docker compose:
   ```bash
   make build
   ```
   Esse comando fará as seguintes ações:
   - Irá construir todos os serviços necessários;
   - Limpar o cache de build do docker;
5. Instale as dependências do projeto:
   ```bash
   make install
   ```
   Esse comando fará as seguintes ações:
   - Irá instalar todas as dependências do projeto;
   - Rodará as migrations;
   - Rodará os seeders;
6. Inicie o servidor:
   ```bash
   make run
   ```
7. Acesse o **Playground do GraphQL**:
   - 👉 [http://localhost:3000/graphql](http://localhost:3000/graphql)

### Sobre os comandos Make

🚨 Veja quais comandos estão disponíveis para facilitar a comunicação com o container do docker, rodando:

```bash
   make help
```

### Tests com o Makefile

Para rodar os testes:

```bash
make test
```

### Instalando o projeto sem o Makefile

1. **Instale o Docker e o Docker Compose**, caso ainda não tenha.
2. Clone o projeto
   ```bash
   git clone https://github.com/NicolasCastro01/challenge.git
   ```
3. Entre na pasta do projeto
   ```bash
   cd challenge
   ```
4. Crie o arquivo **.env** e cole as seguintes variáveis:

```env
# Application
APP_PORT=3000
APP_NODE_VERSION='22.13.1'
TOKEN_VALID='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMThjMzdjZTItY2QzNC00MzA1LTljYTQtYzE1ZmM3MzZiZWFjIn0.pqWRiyQuvWRVQgIzKvQ85RrBwSF5KxeGZrkFvKt2CG8'

# Redis
REDIS_PORT=6379

# Database
DATABASE_HOST='provisioner-db'
DATABASE_PORT=5432
DATABASE_USERNAME='postgres'
DATABASE_PASSWORD='postgres'
DATABASE_NAME='challenge'

# Authorization
JWT_SECRET='370378e1fa51e79552b137683a319e9520bd4a3303983e29ff3431f2111176f4'
```

5. Rode o seguinte comando para inicializar os serviços do docker compose:
   ```bash
   docker compose up -d --build && docker buildx prune -f
   ```
   Esse comando fará as seguintes ações:
   - Irá construir todos os serviços necessários;
   - Limpar o cache de build do docker;
6. Instale as dependências do projeto:
   ```bash
   docker exec -it provisioner npm install
   ```
7. Rode as migrações:
   ```bash
   docker exec -it provisioner npm run db:migrate
   ```
8. Rode os seeders:
   ```bash
   docker exec -it provisioner npm run db:seed
   ```
9. Inicie o servidor:
   ```bash
   docker exec -it provisioner npm run start:dev -- --host 0.0.0.0
   ```
10. Acesse o **Playground do GraphQL**:

- 👉 [http://localhost:3000/graphql](http://localhost:3000/graphql)

### Tests sem o Makefile

Para rodar os testes:

```bash
docker exec -it provisioner npm run test
```

### Migrations

Caso precise criar novas migrations, utilize o comando:

```bash
docker exec -it provisioner npm run db:create_migration --name=create-xpto-table
```

## Documentação da API

#### Retorna um conteúdo provisionado

```http
  POST /graphql
```

| Cabeçalho da requisição | Tipo     | Descrição                                |
| :---------------------- | :------- | :--------------------------------------- |
| `Authorization`         | `string` | **Obrigatório**. O token de autorização. |

| Corpo da requisição | Tipo     | Descrição                                                     |
| :------------------ | :------- | :------------------------------------------------------------ |
| `content_id`        | `string` | **Obrigatório**. O UUID do conteúdo que você quer visualizar. |

#### Exemplo

Para essa requisição foi utilizado o token de autorização:

```
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMThjMzdjZTItY2QzNC00MzA1LTljYTQtYzE1ZmM3MzZiZWFjIn0.pqWRiyQuvWRVQgIzKvQ85RrBwSF5KxeGZrkFvKt2CG8"
```

### Exemplo do corpo da requisição

```graphql
{
  provision(content_id: "a3f8d5e6-4c2b-47d1-8e9a-1f0c23bfa5d3") {
    id
    title
    description
    url
  }
}
```

### Exemplo de Resposta

```json
{
  "data": {
    "provision": {
      "id": "a3f8d5e6-4c2b-47d1-8e9a-1f0c23bfa5d3",
      "title": "A inteligência artificial e o futuro do trabalho com a sua otimização",
      "description": "Acesse este link se quer aprender mais sobre o futuro da programação com a inteligência artificial.",
      "url": "http://localhost:3000/uploads/text-uol.txt?expires=1739676226&signature=w1bqsr"
    }
  }
}
```
