# Trainer System API

API backend para gerenciamento de alunos, treinos, exercícios e montagem de treinos com múltiplos exercícios.

O projeto começou como uma API CRUD simples e evoluiu para uma aplicação backend estruturada em camadas, com autenticação JWT, validação com Zod, PostgreSQL, Docker e relacionamento real entre entidades.

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
