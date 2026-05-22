# Trainer System API

API REST desenvolvida com **Node.js**, **Express** e **PostgreSQL** para gerenciamento básico de operações de um personal trainer.

O projeto faz parte de uma evolução acadêmica/backend, com foco em arquitetura limpa, separação de responsabilidades e construção gradual de um MVP sólido.

---

## Objetivo do Projeto

Construir uma API backend para gerenciar:

- Usuários do sistema
- Autenticação com JWT
- Alunos
- Exercícios
- Treinos
- Relacionamento entre alunos e treinos

O foco atual é entregar um **MVP funcional, organizado e arquiteturalmente consistente**.

---

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- Docker Compose
- bcrypt
- JWT
- Zod
- dotenv
- Nodemon

---

## Estado Atual do Projeto

O projeto já possui:

- Estrutura em camadas
- Repository Pattern
- Services
- Controllers
- Routes
- Middlewares
- Validação com Zod
- Middleware global de erros
- PostgreSQL via Docker
- Autenticação básica com JWT
- Soft delete em `users`
- Soft delete em `students`
- CRUD completo de `users`
- CRUD completo de `students`
- CRUD básico de `exercises`
- CRUD básico de `workouts`

---

## Arquitetura

Fluxo padrão da aplicação:

```plaintext
Request
↓
Route
↓
Validation Middleware
↓
Controller
↓
Service
↓
Repository
↓
Database
↓
Response
```

---

## Responsabilidade das Camadas

### Routes

Responsáveis por:

- Mapear endpoints
- Aplicar middlewares
- Encaminhar requisições para controllers

Não devem conter:

- SQL
- Regra de negócio
- Lógica de banco

---

### Controllers

Responsáveis por:

- Receber `req`
- Retornar `res`
- Definir status HTTP
- Encaminhar erros com `next(err)`

Não devem conter:

- SQL
- Regras de negócio complexas
- Acesso direto ao banco

---

### Services

Responsáveis por:

- Regras de negócio
- Coordenação entre repositories
- Validações de domínio

Exemplo:

```plaintext
Só pode criar workout se o student_id existir e estiver ativo.
```

---

### Repositories

Responsáveis por:

- SQL
- Persistência
- Comunicação com PostgreSQL

Não devem conter:

- `req`
- `res`
- Status HTTP
- Regras de controller

---

## Estrutura do Projeto

```plaintext
src/
├── app.js
├── server.js
├── config/
│   ├── database.js
│   └── env.js
├── constants/
├── controllers/
│   ├── auth.controller.js
│   ├── exercise.controller.js
│   ├── health.controller.js
│   ├── student.controller.js
│   ├── user.controller.js
│   └── workout.controller.js
├── errors/
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
├── repositories/
│   ├── exercise.repository.js
│   ├── student.repository.js
│   ├── user.repository.js
│   └── workout.repository.js
├── routes/
│   ├── auth.routes.js
│   ├── exercise.routes.js
│   ├── health.routes.js
│   ├── student.routes.js
│   ├── user.routes.js
│   └── workout.routes.js
├── schemas/
│   ├── student.schema.js
│   └── user.schema.js
├── services/
│   ├── auth.service.js
│   ├── exercise.service.js
│   ├── student.service.js
│   ├── user.service.js
│   └── workout.service.js
└── utils/
```

---

## Conceito Importante: User ≠ Student

Neste MVP, `User` e `Student` são entidades diferentes.

### User

Representa quem acessa o sistema.

Exemplos:

- Personal trainer
- Administrador
- Equipe interna

`users` possuem:

- Nome
- E-mail
- Senha
- Autenticação
- JWT

---

### Student

Representa o aluno cadastrado no sistema.

`students` possuem:

- Nome
- E-mail
- Telefone
- Altura
- Status ativo/inativo
- Treinos vinculados

O aluno **não faz login** neste MVP.

```plaintext
User = quem usa o sistema
Student = aluno cadastrado no sistema
```

No futuro, caso exista um portal do aluno, poderá ser criado um relacionamento entre `users` e `students`.

---

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
APP_PORT=3000

DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=trainer_system
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=sua_chave_secreta
```

> O arquivo `.env` não deve ser enviado ao Git.

---

## Arquivo `.env.example`

Recomenda-se manter um `.env.example` no projeto:

```env
APP_PORT=3000

DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=trainer_system
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=sua_chave_secreta
```

---

## Executando o Projeto

Instale as dependências:

```bash
npm install
```

Suba o PostgreSQL com Docker Compose:

```bash
docker compose up -d
```

Inicie a aplicação em modo desenvolvimento:

```bash
npm run dev
```

A API será executada em:

```plaintext
http://localhost:3000
```

---

## Docker Compose

O projeto utiliza PostgreSQL via Docker Compose:

```yaml
services:
  postgres:
    image: postgres:15
    restart: always
    env_file:
      - .env
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Banco de Dados

Atualmente as tabelas são criadas manualmente.

Tabelas usadas no MVP:

```plaintext
users
students
exercises
workouts
```

Futuramente o projeto deve utilizar migrations, preferencialmente com Knex.

---

## Entidades

## Users

Representa os usuários do sistema.

### Funcionalidades

- Criar usuário
- Listar usuários ativos
- Buscar usuário por ID
- Atualizar usuário
- Soft delete
- Autenticação via login

### Soft delete

```plaintext
DELETE /users/:id
↓
is_active = false
deleted_at = NOW()
```

---

## Auth

Responsável pela autenticação.

### Funcionalidades

- Login
- Validação de senha com bcrypt
- Geração de token JWT
- Middleware de autenticação

### Endpoint

```http
POST /auth/login
```

---

## Students

Representa os alunos cadastrados no sistema.

### Funcionalidades

- Criar aluno
- Listar alunos ativos
- Buscar aluno por ID
- Atualizar aluno
- Soft delete
- Validação com Zod

### Soft delete

```plaintext
DELETE /students/:id
↓
is_active = false
deleted_at = NOW()
```

---

## Exercises

Representa o catálogo global de exercícios.

### Conceito

Exercícios não pertencem diretamente a um usuário ou aluno.

Eles funcionam como um catálogo reutilizável.

Exemplos:

- Flexão de braço
- Agachamento
- Supino
- Alongamento

### Funcionalidades atuais

- Criar exercício
- Listar exercícios

---

## Workouts

Representa os treinos criados para alunos.

### Conceito

Um workout pertence a um student.

```plaintext
workouts.student_id → students.id
```

### Funcionalidades atuais

- Criar treino
- Listar treinos

### Regra de negócio importante

Antes de criar um treino, o sistema deve validar se o aluno existe e está ativo.

```plaintext
POST /workouts
↓
validar student_id
↓
buscar student ativo
↓
se não existir ou estiver inativo → erro
↓
se existir e estiver ativo → criar workout
```

---

## Endpoints

## Health

### Verificar status da API

```http
GET /health
```

Exemplo:

```bash
curl -i http://localhost:3000/health
```

---

## Users

### Criar usuário

```http
POST /users
```

```bash
curl -i -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{
  "name": "Rafael",
  "email": "rafael@email.com",
  "password": "123456"
}'
```

---

### Listar usuários

```http
GET /users
```

```bash
curl -i http://localhost:3000/users \
-H "Authorization: Bearer SEU_TOKEN"
```

---

### Buscar usuário por ID

```http
GET /users/:id
```

```bash
curl -i http://localhost:3000/users/1 \
-H "Authorization: Bearer SEU_TOKEN"
```

---

### Atualizar usuário

```http
PUT /users/:id
```

```bash
curl -i -X PUT http://localhost:3000/users/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN" \
-d '{
  "name": "Rafael Atualizado",
  "email": "rafael.atualizado@email.com"
}'
```

---

### Remover usuário

```http
DELETE /users/:id
```

```bash
curl -i -X DELETE http://localhost:3000/users/1 \
-H "Authorization: Bearer SEU_TOKEN"
```

---

## Auth

### Login

```http
POST /auth/login
```

```bash
curl -i -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "rafael@email.com",
  "password": "123456"
}'
```

Resposta esperada:

```json
{
  "token": "jwt_token"
}
```

---

## Students

### Criar aluno

```http
POST /students
```

```bash
curl -i -X POST http://localhost:3000/students \
-H "Content-Type: application/json" \
-d '{
  "name": "Maria Oliveira",
  "email": "maria@email.com",
  "phone": "21988887777",
  "height": 1.68
}'
```

---

### Listar alunos

```http
GET /students
```

```bash
curl -i http://localhost:3000/students
```

---

### Buscar aluno por ID

```http
GET /students/:id
```

```bash
curl -i http://localhost:3000/students/1
```

---

### Atualizar aluno

```http
PUT /students/:id
```

```bash
curl -i -X PUT http://localhost:3000/students/1 \
-H "Content-Type: application/json" \
-d '{
  "name": "Maria Oliveira Atualizada",
  "phone": "21977776666",
  "height": 1.70
}'
```

---

### Remover aluno

```http
DELETE /students/:id
```

```bash
curl -i -X DELETE http://localhost:3000/students/1
```

---

## Exercises

### Criar exercício

```http
POST /exercises
```

```bash
curl -i -X POST http://localhost:3000/exercises \
-H "Content-Type: application/json" \
-d '{
  "name": "Flexão de braço",
  "muscle_group": "Peitoral",
  "equipment": "Peso corporal"
}'
```

---

### Listar exercícios

```http
GET /exercises
```

```bash
curl -i http://localhost:3000/exercises
```

---

## Workouts

### Criar treino

```http
POST /workouts
```

```bash
curl -i -X POST http://localhost:3000/workouts \
-H "Content-Type: application/json" \
-d '{
  "name": "Treino A",
  "description": "Treino inicial para membros superiores",
  "student_id": 1
}'
```

---

### Listar treinos

```http
GET /workouts
```

```bash
curl -i http://localhost:3000/workouts
```

---

## Testes Manuais Recomendados

### Health

```bash
curl -i http://localhost:3000/health
```

### Criar aluno

```bash
curl -i -X POST http://localhost:3000/students \
-H "Content-Type: application/json" \
-d '{
  "name": "Maria Oliveira",
  "email": "maria@email.com",
  "phone": "21988887777",
  "height": 1.68
}'
```

### Criar treino para aluno ativo

```bash
curl -i -X POST http://localhost:3000/workouts \
-H "Content-Type: application/json" \
-d '{
  "name": "Treino B",
  "description": "Treino para aluna ativa",
  "student_id": 1
}'
```

### Testar treino com aluno inexistente

```bash
curl -i -X POST http://localhost:3000/workouts \
-H "Content-Type: application/json" \
-d '{
  "name": "Treino Inválido",
  "description": "Aluno inexistente",
  "student_id": 9999
}'
```

---

## Git

O projeto utiliza `.gitignore` para evitar versionamento de arquivos locais e sensíveis.

Ignorados:

```plaintext
.env
node_modules/
rascunhos/
logs/
coverage/
dist/
build/
```

O `package-lock.json` deve ser versionado.

---

## Roadmap

## Concluído

- Estrutura em camadas
- PostgreSQL via Docker
- CRUD de users
- CRUD de students
- Soft delete em users
- Soft delete em students
- Auth JWT básico
- bcrypt
- Middleware global de erro
- Validação com Zod em users e students
- Repository Pattern
- CRUD básico de exercises
- CRUD básico de workouts
- `.gitignore`

---

## Em andamento

- Validação de aluno ativo antes da criação de workout
- Padronização das regras de negócio nos services
- Padronização das respostas da API
- Proteção das rotas com autenticação

---

## Próximos passos

1. Criar `workout.schema.js`
2. Consolidar CRUD completo de workouts
3. Criar `exercise.schema.js`
4. Consolidar CRUD completo de exercises
5. Criar tabela `workout_exercises`
6. Implementar relacionamento workouts ↔ exercises
7. Criar migrations
8. Criar seeds
9. Atualizar documentação final
10. Criar Swagger/OpenAPI básico

---

## Filosofia do Projeto

```plaintext
MVP bem estruturado agora.
Evolução avançada depois.
```

O foco atual é:

```plaintext
consistência
+
entrega funcional
+
arquitetura limpa
```
