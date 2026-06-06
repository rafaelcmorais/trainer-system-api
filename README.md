# Trainer System API

API backend para gerenciamento de alunos, treinos, exercícios e montagem de treinos com múltiplos exercícios.

O projeto começou como uma API CRUD simples e evoluiu para uma aplicação backend estruturada em camadas, com autenticação JWT, validação com Zod, PostgreSQL, Docker e relacionamento real entre entidades.
# Trainer System API

API backend para gerenciamento de usuários, alunos, exercícios, treinos e associação de exercícios aos treinos.

O objetivo do projeto é permitir que usuários autenticados possam cadastrar alunos, criar treinos, manter um catálogo reutilizável de exercícios e montar treinos personalizados associando vários exercícios a um treino.

---

## Stack utilizada

- Node.js
- Express
- PostgreSQL
- Docker Compose
- JWT
- bcrypt
- Zod
- dotenv

---

## Arquitetura do projeto

O projeto segue arquitetura em camadas:

```text
Route
↓
Controller
↓
Service
↓
Repository
↓
Database
```

### Routes

Responsáveis por:

- mapear endpoints
- aplicar middlewares
- chamar controllers

### Controllers

Responsáveis por:

- receber `req`, `res` e `next`
- capturar parâmetros da URL
- capturar dados do body
- chamar services
- responder com status HTTP
- enviar erros para `next(err)`

Controllers não devem acessar banco de dados diretamente.

### Services

Responsáveis por:

- concentrar regras de negócio
- validar existência de registros ativos
- coordenar chamadas aos repositories
- tratar casos de erro de negócio

Services não devem lidar diretamente com `req` e `res`.

### Repositories

Responsáveis por:

- executar queries SQL
- acessar o banco de dados
- retornar dados persistidos

---

## Padrões do projeto

### JavaScript

Usar `camelCase`.

Exemplos:

```js
createWorkout
getWorkoutById
addExerciseToWorkout
getExercisesByWorkoutId
updateWorkoutExercise
deleteWorkoutExercise
```

### Banco de dados e JSON da API

Usar `snake_case`.

Exemplos:

```text
student_id
workout_id
exercise_id
muscle_group
rest_time
exercise_order
is_active
deleted_at
created_at
updated_at
```

---

## Soft delete

O projeto utiliza soft delete nas principais entidades.

Padrão:

```sql
is_active = false,
deleted_at = NOW()
```

O `DELETE` não remove fisicamente os registros principais do banco.

Entidades com soft delete:

- users
- students
- exercises
- workouts
- workout_exercises

---

## Autenticação

As rotas protegidas exigem token JWT no header:

```http
Authorization: Bearer TOKEN
```

Exemplo:

```bash
-H "Authorization: Bearer $TOKEN"
```

---

## Variáveis de ambiente

Exemplo de `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=minha_api
JWT_SECRET=sua_chave_secreta
```

Ajuste os valores conforme o ambiente local.

---

## Rodando o projeto

Instalar dependências:

```bash
npm install
```

Subir o banco com Docker Compose:

```bash
docker compose up -d
```

Rodar a aplicação em desenvolvimento:

```bash
npm run dev
```

A aplicação deve iniciar em:

```text
http://localhost:3000
```

---

## Health check

### GET /health

Verifica se a API está online.

```bash
curl -i http://localhost:3000/health
```

---

## Autenticação

### POST /auth/login

Realiza login e retorna um token JWT.

```bash
curl -i -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@teste.com",
  "password": "SUA_SENHA"
}'
```

Salvar o token em variável:

```bash
TOKEN="COLE_O_TOKEN_AQUI"
```

---

## Users

Status: consolidado.

Endpoints:

```http
POST /users
GET /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

Observação:

```text
POST /users permanece público por enquanto.
As demais rotas de users são protegidas por JWT.
```

---

## Students

Status: consolidado.

Endpoints protegidos:

```http
POST /students
GET /students
GET /students/:id
PUT /students/:id
DELETE /students/:id
```

---

## Exercises

Status: consolidado.

Endpoints protegidos:

```http
POST /exercises
GET /exercises
GET /exercises/:id
PUT /exercises/:id
DELETE /exercises/:id
```

Regra importante:

```text
exercises é um catálogo global reutilizável.
Um exercício pode aparecer em vários treinos.
```

---

## Workouts

Status: consolidado.

Endpoints protegidos:

```http
POST /workouts
GET /workouts
GET /workouts/:id
PUT /workouts/:id
DELETE /workouts/:id
```

Regra importante:

```text
Um aluno pode ter vários treinos.
```

Exemplo:

```text
Aluno Maria
├── Treino A - Inferiores
├── Treino B - Superiores
└── Treino C - Full Body
```

---

## Workout Exercises

Status: consolidado com criação, listagem, atualização e remoção de vínculos.

A tabela `workout_exercises` representa o vínculo entre treinos e exercícios.

Ela permite:

```text
Um treino ter vários exercícios.
Um exercício ser reutilizado em vários treinos.
```

Campos principais:

```text
id
workout_id
exercise_id
sets
reps
rest_time
notes
exercise_order
is_active
deleted_at
created_at
updated_at
```

Regra importante:

```text
workout_exercises altera apenas o vínculo entre treino e exercício.
Não altera o treino em workouts.
Não altera o exercício do catálogo em exercises.
```

---

### POST /workout-exercises

Adiciona um exercício a um treino.

```bash
curl -i -X POST http://localhost:3000/workout-exercises \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "workout_id": 1,
  "exercise_id": 5,
  "sets": 4,
  "reps": 12,
  "rest_time": 60,
  "notes": "Controlar a execução",
  "exercise_order": 1
}'
```

Regras:

- só adiciona se o workout estiver ativo
- só adiciona se o exercise estiver ativo

Exemplo de retorno:

```json
{
  "message": "exercise added to workout",
  "data": {
    "id": 1,
    "workout_id": 1,
    "exercise_id": 5,
    "sets": 4,
    "reps": 12,
    "rest_time": 60,
    "notes": "Controlar a execução",
    "exercise_order": 1
  }
}
```

---

### GET /workouts/:id/exercises

Lista os exercícios ativos vinculados a um treino.

```bash
curl -i http://localhost:3000/workouts/1/exercises \
-H "Authorization: Bearer $TOKEN"
```

Exemplo de retorno:

```json
[
  {
    "id": 1,
    "workout_id": 1,
    "exercise_id": 5,
    "exercise_name": "Supino reto",
    "muscle_group": "Peitoral",
    "equipment": "Barra",
    "sets": 4,
    "reps": 12,
    "rest_time": 60,
    "notes": "Controlar a execução",
    "exercise_order": 1
  }
]
```

Observação:

```text
O campo id retornado é o id do vínculo em workout_exercises.
Ele não é o id do exercício do catálogo.
```

---

### PUT /workout-exercises/:id

Atualiza a configuração de um exercício dentro de um treino.

```bash
curl -i -X PUT http://localhost:3000/workout-exercises/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "sets": 5,
  "reps": 10,
  "rest_time": 90,
  "notes": "Aumentar carga progressivamente",
  "exercise_order": 2
}'
```

Campos permitidos:

```text
sets
reps
rest_time
notes
exercise_order
```

Campos não permitidos neste endpoint:

```text
workout_id
exercise_id
is_active
deleted_at
created_at
updated_at
```

Regra importante:

```text
Este endpoint atualiza apenas o vínculo em workout_exercises.
Ele não troca o treino.
Ele não troca o exercício do catálogo.
```

Exemplo de retorno:

```json
{
  "message": "workout exercise updated",
  "data": {
    "id": 1,
    "workout_id": 1,
    "exercise_id": 5,
    "sets": 5,
    "reps": 10,
    "rest_time": 90,
    "notes": "Aumentar carga progressivamente",
    "exercise_order": 2
  }
}
```

Validações:

- body vazio retorna erro `400`
- campos fora da lista permitida retornam erro `400`
- vínculo inexistente retorna erro `404`
- vínculo inativo não é atualizado

Exemplo de body inválido:

```json
{}
```

Exemplo de campo não permitido:

```json
{
  "workout_id": 99,
  "sets": 4
}
```

---

### DELETE /workout-exercises/:id

Remove o vínculo entre treino e exercício com soft delete.

```bash
curl -i -X DELETE http://localhost:3000/workout-exercises/1 \
-H "Authorization: Bearer $TOKEN"
```

Regra:

```text
Não apaga o treino.
Não apaga o exercício do catálogo.
Apenas inativa o vínculo em workout_exercises.
```

---

## Testes manuais úteis

### Testar PUT válido

```bash
curl -i -X PUT http://localhost:3000/workout-exercises/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "sets": 5,
  "reps": 10,
  "rest_time": 90,
  "notes": "Aumentar carga progressivamente",
  "exercise_order": 2
}'
```

Esperado:

```text
HTTP/1.1 200 OK
```

### Testar body vazio

```bash
curl -i -X PUT http://localhost:3000/workout-exercises/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{}'
```

Esperado:

```text
HTTP/1.1 400 Bad Request
```

### Testar campo proibido

```bash
curl -i -X PUT http://localhost:3000/workout-exercises/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "workout_id": 99,
  "sets": 4
}'
```

Esperado:

```text
HTTP/1.1 400 Bad Request
```

### Testar id inexistente

```bash
curl -i -X PUT http://localhost:3000/workout-exercises/999 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "sets": 4
}'
```

Esperado:

```text
HTTP/1.1 404 Not Found
```

---

## Status atual do projeto

```text
Users               ✅ Consolidado
Students            ✅ Consolidado
Exercises           ✅ Consolidado
Workouts            ✅ Consolidado
Workout Exercises   ✅ Consolidado com POST, GET, PUT e DELETE
```

---

## Próximas melhorias sugeridas

- evitar duplicidade do mesmo exercício no mesmo treino
- criar regra de reordenação de exercícios dentro do treino
- adicionar migrations
- adicionar seeds
- implementar roles/permissões
- documentar com Swagger/OpenAPI
- adicionar testes automatizados com Jest/Supertest

---

## Sugestão de commit da etapa atual

```bash
git add README.md src/controllers/workoutExercise.controller.js src/repositories/workoutExercise.repository.js src/routes/workoutExercise.routes.js src/schemas/workoutExercise.schema.js src/services/workoutExercise.service.js

git commit -m "feat: add update workout exercise endpoint"
```

---

## Estado atual

Entidades consolidadas:

- `users`
- `students`
- `exercises`
- `workouts`
- `workout_exercises`

Recursos implementados:

- Estrutura em camadas
- Repository Pattern
- Middleware global de erros
- Autenticação JWT
- Validação com Zod
- PostgreSQL via Docker
- Soft delete
- Rotas protegidas com token
- Relacionamento entre treinos e exercícios

---

## Arquitetura

Fluxo padrão:

```text
Route
↓
Controller
↓
Service
↓
Repository
↓
Database
```

### Routes

Responsável por mapear endpoints, aplicar middlewares e ligar a rota ao controller.

### Controllers

Responsável por `req`, `res`, status HTTP e `next(err)`.

Não deve acessar banco diretamente nem conter SQL.

### Services

Responsável por regras de negócio, validações entre entidades e coordenação entre repositories.

Não deve lidar diretamente com HTTP nem conter SQL.

### Repositories

Responsável por SQL, acesso ao banco e persistência de dados.

---

## Estrutura de diretórios

```text
src/
├── app.js
├── server.js
├── config/
│   ├── database.js
│   └── env.js
├── controllers/
│   ├── auth.controller.js
│   ├── exercise.controller.js
│   ├── health.controller.js
│   ├── student.controller.js
│   ├── user.controller.js
│   ├── workout.controller.js
│   └── workoutExercise.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
├── repositories/
│   ├── exercise.repository.js
│   ├── student.repository.js
│   ├── user.repository.js
│   ├── workout.repository.js
│   └── workoutExercise.repository.js
├── routes/
│   ├── auth.routes.js
│   ├── exercise.routes.js
│   ├── health.routes.js
│   ├── student.routes.js
│   ├── user.routes.js
│   ├── workout.routes.js
│   └── workoutExercise.routes.js
├── schemas/
│   ├── exercise.schema.js
│   ├── student.schema.js
│   ├── user.schema.js
│   ├── workout.schema.js
│   └── workoutExercise.schema.js
└── services/
    ├── auth.service.js
    ├── exercise.service.js
    ├── student.service.js
    ├── user.service.js
    ├── workout.service.js
    └── workoutExercise.service.js
```

---

## Tecnologias

- Node.js
- Express
- PostgreSQL
- Docker Compose
- JWT
- bcrypt
- Zod
- dotenv

---

## Modelo de dados

```text
users
students
exercises
workouts
workout_exercises
```

Relacionamento principal:

```text
Aluno → vários treinos
Treino → vários exercícios
Exercício → reutilizável em vários treinos
```

---

## Padrão de nomenclatura

### JavaScript

Usar `camelCase` para funções e variáveis internas:

```js
createWorkout
getWorkoutById
addExerciseToWorkout
getExercisesByWorkoutId
deleteWorkoutExercise
parsedWorkoutId
parsedExerciseId
```

### Banco e JSON da API

Usar `snake_case` para campos de banco e body da API:

```text
student_id
workout_id
exercise_id
muscle_group
rest_time
exercise_order
is_active
deleted_at
created_at
updated_at
```

---

## Autenticação

A API usa JWT.

### Login

```http
POST /auth/login
```

Exemplo:

```bash
curl -i -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@teste.com",
  "password": "SUA_SENHA"
}'
```

Salvar token:

```bash
TOKEN="COLE_O_TOKEN_AQUI"
```

Usar token:

```bash
curl -i http://localhost:3000/students \
-H "Authorization: Bearer $TOKEN"
```

---

## Rotas públicas

```http
GET /health
POST /auth/login
POST /users
```

`POST /users` permanece público temporariamente. Futuramente poderá ser protegido com roles/permissões.

---

## Rotas protegidas

Exigem:

```http
Authorization: Bearer TOKEN
```

---

# Users

Responsável pelos usuários que acessam o sistema.

## Endpoints

```http
POST /users
GET /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

## Status

```text
Users ✅ Consolidado
```

Recursos:

- CRUD
- Soft delete
- Validação com Zod
- bcrypt
- JWT

---

# Students

Responsável pelos alunos.

## Endpoints

```http
POST /students
GET /students
GET /students/:id
PUT /students/:id
DELETE /students/:id
```

## Exemplo

```bash
curl -i -X POST http://localhost:3000/students \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "name": "Maria Oliveira",
  "email": "maria@email.com",
  "phone": "21988887777",
  "height": 1.68
}'
```

## Status

```text
Students ✅ Consolidado
```

Recursos:

- CRUD completo
- Soft delete
- Validação com Zod
- JWT

---

# Exercises

Catálogo global de exercícios reutilizáveis.

## Endpoints

```http
POST /exercises
GET /exercises
GET /exercises/:id
PUT /exercises/:id
DELETE /exercises/:id
```

## Exemplo de criação

```bash
curl -i -X POST http://localhost:3000/exercises \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "name": "Supino reto",
  "muscle_group": "Peitoral",
  "equipment": "Barra"
}'
```

## Status

```text
Exercises ✅ Consolidado
```

Recursos:

- CRUD completo
- Soft delete
- Validação com Zod
- JWT

---

# Workouts

Treinos associados aos alunos.

Um aluno pode ter vários treinos.

## Endpoints

```http
POST /workouts
GET /workouts
GET /workouts/:id
PUT /workouts/:id
DELETE /workouts/:id
```

## Exemplo

```bash
curl -i -X POST http://localhost:3000/workouts \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "name": "Treino A - Inferiores",
  "description": "Treino focado em pernas e glúteos",
  "student_id": 3
}'
```

## Regra

Antes de criar um treino, a API valida se o `student_id` existe e está ativo.

## Status

```text
Workouts ✅ Consolidado
```

Recursos:

- CRUD completo
- Soft delete
- Validação com Zod
- JWT
- Validação de aluno ativo

---

# Workout Exercises

Entidade intermediária entre `workouts` e `exercises`.

Permite:

```text
um treino ter vários exercícios
um exercício ser reutilizado em vários treinos
```

## Estrutura da tabela

```text
workout_exercises
├── id
├── workout_id
├── exercise_id
├── sets
├── reps
├── rest_time
├── notes
├── exercise_order
├── is_active
├── deleted_at
├── created_at
└── updated_at
```

## Endpoints

```http
POST /workout-exercises
GET /workouts/:id/exercises
DELETE /workout-exercises/:id
```

## Adicionar exercício ao treino

```bash
curl -i -X POST http://localhost:3000/workout-exercises \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "workout_id": 1,
  "exercise_id": 5,
  "sets": 4,
  "reps": 12,
  "rest_time": 60,
  "notes": "Controlar a execução",
  "exercise_order": 1
}'
```

## Listar exercícios de um treino

```bash
curl -i http://localhost:3000/workouts/1/exercises \
-H "Authorization: Bearer $TOKEN"
```

Resposta esperada:

```json
[
  {
    "id": 1,
    "workout_id": 1,
    "exercise_id": 5,
    "exercise_name": "Supino reto",
    "muscle_group": "Peitoral",
    "equipment": "Barra",
    "sets": 4,
    "reps": 12,
    "rest_time": 60,
    "notes": "Controlar a execução",
    "exercise_order": 1
  }
]
```

## Remover exercício do treino

```bash
curl -i -X DELETE http://localhost:3000/workout-exercises/1 \
-H "Authorization: Bearer $TOKEN"
```

Esse endpoint remove apenas o vínculo entre treino e exercício.

Não apaga:

- o treino
- o exercício do catálogo

Apenas marca o vínculo como inativo:

```text
is_active = false
deleted_at = NOW()
```

## Regras implementadas

- Só adiciona exercício a treino ativo.
- Só adiciona exercício ativo.
- Remove vínculo com soft delete.
- Lista apenas vínculos ativos.
- Exercícios inativos não aparecem na listagem do treino.

## Status

```text
Workout Exercises ✅ Primeira fase implementada
```

Recursos:

- POST
- GET por workout
- DELETE
- Soft delete
- Validação com Zod
- Validação de treino ativo
- Validação de exercício ativo
- JWT

---

## Soft delete

Entidades com soft delete:

- users
- students
- exercises
- workouts
- workout_exercises

Padrão:

```text
is_active = false
deleted_at = NOW()
```

---

## Status geral

```text
Users               ✅ Consolidado
Students            ✅ Consolidado
Exercises           ✅ Consolidado
Workouts            ✅ Consolidado
Workout Exercises   ✅ Primeira fase implementada
```

---

## Próximos passos

### Workout Exercises

- `PUT /workout-exercises/:id`
- Atualizar `sets`, `reps`, `rest_time`, `notes`, `exercise_order`
- Evitar duplicidade do mesmo exercício no mesmo treino
- Reordenar exercícios dentro do treino

### Banco de dados

- migrations
- seeds
- versionamento formal do schema

### Segurança

- roles/permissões
- admin vs usuário comum
- refresh token

### Documentação

- Swagger/OpenAPI

### Testes

- Jest
- Supertest

---

## Diagnóstico

O projeto já representa uma aplicação backend estruturada para gerenciamento de treinos.

A modelagem atual permite:

```text
Aluno → vários treinos
Treino → vários exercícios
Exercício → reutilizável em vários treinos
```
