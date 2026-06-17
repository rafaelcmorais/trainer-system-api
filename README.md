# Trainer System API

API backend para gerenciamento de usuários, alunos, exercícios, treinos e vínculos entre treinos e exercícios.

O projeto foi desenvolvido em **Node.js/Express** com **PostgreSQL**, **Docker**, **JWT**, **Zod**, **Prettier**, **Jest/Supertest** e arquitetura em camadas.

Além da execução local com Node.js, o projeto também pode ser executado com **Docker Compose**, subindo a **API** e o **PostgreSQL** em containers.

## Objetivo do projeto

O Trainer System API tem como objetivo apoiar a organização de treinos em um sistema de personal trainer ou academia.

A API permite:

- cadastrar usuários do sistema;
- autenticar usuários com JWT;
- cadastrar alunos;
- cadastrar exercícios em um catálogo reutilizável;
- criar treinos para alunos;
- vincular exercícios do catálogo a treinos;
- definir séries, repetições, carga, descanso, observações e ordem dos exercícios no treino.

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- Docker
- Docker Compose
- Dockerfile
- JWT
- bcrypt
- Zod
- dotenv
- Jest
- Supertest
- Prettier
- Nodemon

## Arquitetura

O projeto segue arquitetura em camadas:

```text
Route → Controller → Service → Repository → Database
```

Responsabilidades:

- **Routes**: definem endpoints e aplicam middlewares.
- **Controllers**: lidam apenas com `req`, `res` e `next`.
- **Services**: concentram regras de negócio.
- **Repositories**: concentram SQL e acesso ao banco.
- **Database**: representa a persistência em PostgreSQL.

Essa separação ajuda a manter o código organizado, testável e fácil de evoluir.

## Módulos implementados

Os módulos consolidados atualmente são:

- `users`
- `auth`
- `students`
- `exercises`
- `workouts`
- `workout_exercises`
- `health`

## Padrão de nomenclatura

### JavaScript

Funções e variáveis internas usam `camelCase`.

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

Campos de banco e JSON da API usam `snake_case`.

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

## Soft delete

O projeto utiliza soft delete nas principais entidades.

Padrão:

```text
is_active = false
deleted_at = NOW()
updated_at = NOW()
```

Quando um registro é removido pela API, ele não é apagado fisicamente do banco. Ele é marcado como inativo.

Entidades com soft delete:

- `users`
- `students`
- `exercises`
- `workouts`
- `workout_exercises`

## Banco de dados

O banco utilizado é PostgreSQL.

O schema versionado do banco está em:

```text
database/schema/schema.sql
```

Esse arquivo representa a estrutura atual do banco de dados.

Para gerar o schema via Docker:

```bash
docker exec -i trainer-system-api-postgres-1 pg_dump -U meu_user -d minha_api --schema-only --no-owner --no-privileges > database/schema/schema.sql
```

Caso seja necessário limpar final de linha ou espaços finais:

```bash
sed -i 's/\r$//' database/schema/schema.sql
sed -i 's/[[:blank:]]\+$//' database/schema/schema.sql
```

O `docker-compose.yaml` carrega o schema em bancos novos por meio do diretório:

```text
/database/schema → /docker-entrypoint-initdb.d
```

Observação: o PostgreSQL executa scripts em `/docker-entrypoint-initdb.d` apenas na primeira criação do volume do banco.

## Variáveis de ambiente

O projeto utiliza um arquivo `.env` local, que não deve ser versionado.

Exemplo de `.env`:

```env
APP_PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=minha_api

JWT_SECRET=sua_chave_secreta
```

Ajuste os valores conforme o ambiente local.

Ponto importante:

- para rodar a API localmente com `npm run dev`, use `DB_HOST=localhost`;
- para rodar a API dentro do Docker Compose, o `docker-compose.yaml` sobrescreve esse valor e usa `DB_HOST=postgres`.

Isso acontece porque, dentro da rede do Docker Compose, a API acessa o banco pelo nome do serviço `postgres`.

Não versionar o arquivo `.env`.

O arquivo `.env.example` fica versionado como referência segura, sem credenciais reais.

## Como iniciar o servidor e rodar os testes

Esta seção mostra os comandos principais para iniciar a API e validar o funcionamento do projeto.

### 1. Configurar o ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Para rodar localmente com `npm run dev`, use no `.env`:

```env
DB_HOST=localhost
```

Quando a API roda via Docker Compose, o próprio `docker-compose.yaml` usa:

```env
DB_HOST=postgres
```

### 2. Rodar localmente

Instale as dependências:

```bash
npm install
```

Suba apenas o banco PostgreSQL:

```bash
docker compose up -d postgres
```

Inicie a API em modo desenvolvimento:

```bash
npm run dev
```

Teste se a API e o banco estão respondendo:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/db
```

Respostas esperadas:

```json
{ "status": "ok" }
```

```json
{ "status": "ok", "database": "connected" }
```

### 3. Rodar com Docker Compose

Para subir API e PostgreSQL juntos:

```bash
docker compose up --build
```

Para parar os containers:

```bash
docker compose down
```

### 4. Rodar os testes

Com a API rodando, execute:

```bash
npm test
npm run smoke
```

O comando `npm test` executa os testes automatizados com Jest.

Resultado esperado:

```text
Test Suites: 2 passed, 2 total
Tests: 15 passed, 15 total
```

O comando `npm run smoke` valida o fluxo principal da API, incluindo health check, conexão com banco, login, criação de aluno, exercícios, treino e vínculo de exercícios ao treino.

Resultado esperado ao final:

```text
SMOKE TEST FINISHED
```

### Resumo rápido

Local:

```bash
npm install
docker compose up -d postgres
npm run dev
```

Docker completo:

```bash
docker compose up --build
```

Testes:

```bash
npm test
npm run smoke
```

Descrição:

- `npm run dev`: inicia a API com Nodemon.
- `npm test`: executa os testes automatizados com Jest.
- `npm run smoke`: executa o smoke test de ponta a ponta contra a API em execução.

## Docker Compose

O projeto possui ambiente containerizado com Docker Compose.

Serviços configurados:

```text
api
postgres
```

### Serviço api

O serviço `api` usa o `Dockerfile` da raiz do projeto.

Responsabilidades:

- construir a imagem Node.js da API;
- instalar dependências de produção com `npm ci --omit=dev`;
- copiar o código da aplicação;
- expor a porta `3000`;
- iniciar a API com `node src/server.js`.

Comando principal:

```bash
docker compose up --build
```

### Serviço postgres

O serviço `postgres` usa a imagem:

```text
postgres:15
```

Ele recebe:

- `POSTGRES_USER`;
- `POSTGRES_PASSWORD`;
- `POSTGRES_DB`.

O banco usa volume local:

```text
./postgres_data:/var/lib/postgresql/data
```

E carrega o schema inicial em bancos novos por meio de:

```text
./database/schema/:/docker-entrypoint-initdb.d:ro
```

Observação importante:

O PostgreSQL só executa scripts em `/docker-entrypoint-initdb.d` na primeira criação do volume do banco.

### Arquivos Docker

Arquivos relacionados:

```text
Dockerfile
.dockerignore
docker-compose.yaml
```

O `.dockerignore` evita copiar para a imagem arquivos como:

```text
node_modules
.git
.env
postgres_data
rascunhos
coverage
npm-debug.log
```

O `.env` não é copiado para a imagem Docker. Ele é lido em tempo de execução pelo Docker Compose.

### Validação do Compose

Para validar a configuração:

```bash
docker compose config
```

Atenção:

Esse comando mostra os valores resolvidos das variáveis de ambiente. Evite colar a saída completa em documentação pública, porque pode exibir senha do banco e `JWT_SECRET`.

## Health check

Endpoints públicos:

```http
GET /health
GET /health/db
```

### GET /health

Verifica se a API está online.

```bash
curl -i http://localhost:3000/health
```

Resposta esperada:

```json
{
    "status": "ok"
}
```

### GET /health/db

Verifica se a API consegue consultar o PostgreSQL.

```bash
curl -i http://localhost:3000/health/db
```

Resposta esperada:

```json
{
    "status": "ok",
    "database": "connected"
}
```

Fluxo implementado:

```text
Route → Controller → Service → Repository → Database
```

## Autenticação

A API utiliza autenticação com JWT.

Endpoint de login:

```http
POST /auth/login
```

Exemplo:

```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha"
  }'
```

Salvar o token em variável:

```bash
TOKEN="COLE_O_TOKEN_AQUI"
```

Usar o token:

```bash
curl -i http://localhost:3000/students \
  -H "Authorization: Bearer $TOKEN"
```

As rotas principais são protegidas com `authMiddleware`.

O módulo de autenticação segue o padrão em camadas:

```text
Route → Controller → Service → Repository → Database
```

O `auth.service` concentra a regra de negócio, como comparação de senha com bcrypt e geração do JWT.

O `auth.repository` concentra a consulta ao banco para buscar usuário ativo por email.

## Rotas públicas

```http
GET /health
GET /health/db
POST /auth/login
POST /users
```

Observação: `POST /users` permanece público neste momento. Futuramente pode ser protegido com roles/permissões.

## Rotas protegidas

As demais rotas principais exigem:

```http
Authorization: Bearer TOKEN
```

## Validação com Zod

As validações de entrada são feitas com Zod.

O projeto utiliza:

- `.strict()` para bloquear campos não permitidos;
- validação de tipos;
- validação de campos obrigatórios;
- validações numéricas;
- enums;
- bloqueio de body vazio em updates.

As validações acontecem antes dos dados chegarem aos controllers, services, repositories e banco de dados.

## Users

Responsável pelos usuários que acessam o sistema.

Endpoints:

```http
POST /users
GET /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

Recursos:

- CRUD;
- soft delete;
- validação com Zod;
- senha com bcrypt;
- autenticação JWT no login.

Status:

```text
Users ✅ Consolidado
```

## Students

Responsável pelos alunos.

Endpoints protegidos:

```http
POST /students
GET /students
GET /students/:id
PUT /students/:id
DELETE /students/:id
```

Campos principais:

- `id`
- `name`
- `email`
- `phone`
- `height`
- `weight_kg`
- `sex`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

Campos permitidos no `PUT /students/:id`:

- `name`
- `email`
- `phone`
- `height`
- `weight_kg`
- `sex`

Valores aceitos para `sex`:

- `male`
- `female`
- `other`
- `not_informed`

Regras:

- `GET /students` lista apenas alunos ativos.
- `GET /students/:id` retorna apenas aluno ativo.
- `PUT /students/:id` atualiza apenas campos permitidos.
- `DELETE /students/:id` usa soft delete.
- `weight_kg` é opcional e positivo.
- `sex` é opcional e validado por enum no Zod.

Exemplo de criação:

```bash
curl -i -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Maria Oliveira",
    "email": "maria@email.com",
    "phone": "21988887777",
    "height": 1.68,
    "weight_kg": 70.5,
    "sex": "female"
  }'
```

Status:

```text
Students ✅ Consolidado
```

## Exercises

Responsável pelo catálogo global de exercícios reutilizáveis.

Endpoints protegidos:

```http
POST /exercises
GET /exercises
GET /exercises/:id
PUT /exercises/:id
DELETE /exercises/:id
```

Campos principais:

- `id`
- `name`
- `muscle_group`
- `equipment`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

Regra importante:

```text
exercises é um catálogo global reutilizável.
Um exercício pode aparecer em vários treinos.
```

Exemplo de criação:

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

Status:

```text
Exercises ✅ Consolidado
```

## Workouts

Responsável pelos treinos associados aos alunos.

Endpoints protegidos:

```http
POST /workouts
GET /workouts
GET /workouts/:id
PUT /workouts/:id
DELETE /workouts/:id
```

Campos principais:

- `id`
- `student_id`
- `name`
- `description`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

Regras:

- Um aluno pode ter vários treinos.
- Antes de criar um treino, a API valida se o `student_id` existe e está ativo.
- Apenas treinos ativos são retornados nas consultas principais.
- Exclusão usa soft delete.

Exemplo de criação:

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

Status:

```text
Workouts ✅ Consolidado
```

## Workout Exercises

Representa o vínculo entre um treino e um exercício do catálogo.

Essa entidade resolve a relação entre `workouts` e `exercises`.

Ela permite:

```text
um treino ter vários exercícios
um exercício ser reutilizado em vários treinos
cada vínculo ter dados próprios, como séries, repetições, carga e descanso
```

Campos principais:

- `id`
- `workout_id`
- `exercise_id`
- `sets`
- `reps`
- `load_kg`
- `rest_time`
- `notes`
- `exercise_order`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

Endpoints protegidos:

```http
POST /workout-exercises
GET /workouts/:id/exercises
PUT /workout-exercises/:id
DELETE /workout-exercises/:id
```

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
    "load_kg": 45,
    "rest_time": 60,
    "notes": "Controlar a execução",
    "exercise_order": 1
  }'
```

Regras:

- O service valida se o treino existe e está ativo.
- O service valida se o exercício existe e está ativo.
- Não pode existir vínculo ativo duplicado com o mesmo `workout_id` e `exercise_id`.
- Duplicidade ativa retorna `409 Conflict`.
- Histórico inativo duplicado é permitido por causa do soft delete.

Mensagem para duplicidade ativa:

```text
exercise already added to this workout
```

### Regra de ordenação no POST

A ordem dos exercícios é definida no `POST /workout-exercises`.

Regras:

- Se `exercise_order` não for informado, o exercício é inserido ao final do treino.
- Se `exercise_order` for informado, o exercício é inserido na posição solicitada.
- Se a posição já estiver ocupada, os exercícios ativos daquela posição em diante são empurrados para baixo.
- Se `exercise_order` for maior que a próxima posição disponível, o exercício entra no final.
- Antes da inserção, as ordens ativas do treino são normalizadas.

Exemplo validado no smoke test:

```text
1. Supino entra na ordem 1
2. Puxada entra sem ordem e vai para ordem 2
3. Remada entra na ordem 1

Resultado final:
1. Remada
2. Supino
3. Puxada
```

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
        "load_kg": "45.00",
        "rest_time": 60,
        "notes": "Controlar a execução",
        "exercise_order": 1
    }
]
```

Observações:

- O campo `id` retornado é o id do vínculo em `workout_exercises`.
- O campo `id` não é o id do exercício do catálogo.
- Se o treino existir, mas não tiver exercícios ativos, retorna `200 OK` com array vazio.
- Se o treino não existir ou estiver inativo, retorna `404 Not Found`.

Mensagem para treino inexistente ou inativo:

```text
workout not found or inactive
```

### PUT /workout-exercises/:id

Atualiza apenas a configuração de um exercício dentro de um treino.

```bash
curl -i -X PUT http://localhost:3000/workout-exercises/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "sets": 5,
    "reps": 10,
    "load_kg": 50,
    "rest_time": 90,
    "notes": "Aumentar carga progressivamente"
  }'
```

Campos permitidos no `PUT /workout-exercises/:id`:

- `sets`
- `reps`
- `load_kg`
- `rest_time`
- `notes`

O campo `exercise_order` não pode ser atualizado pelo `PUT /workout-exercises/:id`.

Campos que não podem ser alterados no PUT:

- `workout_id`
- `exercise_id`
- `exercise_order`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`
- dados do treino
- dados do exercício do catálogo

Validações:

- body vazio retorna `400 Bad Request`.
- campos fora da lista permitida retornam `400 Bad Request`.
- vínculo inexistente retorna `404 Not Found`.
- vínculo inativo não é atualizado.

Exemplo de `exercise_order` bloqueado no PUT:

```bash
curl -i -X PUT http://localhost:3000/workout-exercises/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "exercise_order": 2
  }'
```

Resposta esperada:

```json
{
    "error": {
        "_errors": ["Unrecognized key: \"exercise_order\""]
    }
}
```

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

Soft delete aplicado:

```text
is_active = false
deleted_at = NOW()
updated_at = NOW()
```

Status:

```text
Workout Exercises ✅ Consolidado
```

## Regras de carga

O campo `load_kg` representa a carga total prescrita ou utilizada no exercício.

Exemplo:

```json
{
    "load_kg": 45
}
```

Observações como “20 kg de cada lado” devem ficar em `notes`.

Uma modelagem mais detalhada para carga por lado, halteres, máquina ou peso corporal pode ser implementada futuramente.

## Integridade no banco de dados

Além das validações com Zod, o banco possui reforços de integridade.

### Índice único parcial em workout_exercises

Impede duplicidade ativa do mesmo exercício no mesmo treino.

```text
unique_active_workout_exercise
```

Regra:

```text
workout_id + exercise_id é único apenas quando is_active = true
```

Isso permite manter histórico inativo duplicado por causa do soft delete.

### Constraints em students

Regras reforçadas no banco:

- `sex` deve ser `NULL` ou um dos valores aceitos.
- `height` deve ser `NULL` ou maior que zero.
- `weight_kg` deve ser `NULL` ou maior que zero.

Constraints:

- `students_sex_check`
- `students_height_check`
- `students_weight_kg_check`

### Constraints em workout_exercises

Regras reforçadas no banco:

- `sets` deve ser `NULL` ou maior que zero.
- `reps` deve ser `NULL` ou maior que zero.
- `load_kg` deve ser `NULL` ou maior ou igual a zero.
- `rest_time` deve ser `NULL` ou maior ou igual a zero.
- `exercise_order` deve ser `NULL` ou maior que zero.

Constraints:

- `workout_exercises_sets_check`
- `workout_exercises_reps_check`
- `workout_exercises_load_kg_check`
- `workout_exercises_rest_time_check`
- `workout_exercises_exercise_order_check`

## Observação sobre NUMERIC no PostgreSQL

Campos `NUMERIC` podem retornar como string na API.

Exemplos:

```json
{
    "height": "1.75",
    "weight_kg": "80.50",
    "load_kg": "45.00"
}
```

Esse comportamento é esperado por conta do PostgreSQL.

## Testes automatizados

O projeto possui testes com Jest.

Comando:

```bash
npm test
```

Resultado atual confirmado:

```text
Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
```

Os testes atuais validam diretamente os schemas Zod e não dependem do PostgreSQL.

### Students

Arquivo:

```text
tests/student.schema.test.js
```

Valida:

- criação de aluno com dados válidos;
- rejeição de `sex` inválido;
- rejeição de body vazio no update;
- rejeição de campos desconhecidos como `is_active`;
- rejeição de `weight_kg` negativo;
- rejeição de `height` negativo.

### Workout Exercises

Arquivo:

```text
tests/workoutExercise.schema.test.js
```

Valida:

- criação de vínculo com dados válidos;
- rejeição de `sets = 0`;
- rejeição de `reps = 0`;
- aceitação de `load_kg = 0`;
- rejeição de `load_kg` negativo;
- rejeição de `rest_time` negativo;
- rejeição de `exercise_order` no `PUT /workout-exercises/:id`;
- rejeição de body vazio no update.

## Smoke test

Além dos testes automatizados com Jest, o projeto possui um smoke test de ponta a ponta.

Comando:

```bash
npm run smoke
```

O smoke test valida:

- `GET /health` com status `200`;
- `GET /health/db` com status `200`;
- `POST /users` com status `201`;
- `POST /auth/login` com status `200`;
- `POST /students` com status `201`;
- `POST /exercises` com status `201`;
- `POST /workouts` com status `201`;
- `POST /workout-exercises` com status `201`;
- `GET /workouts/:id/exercises` com status `200`;
- ordenação correta dos exercícios no treino;
- `GET /workouts/:id/exercises` com treino inexistente retornando `404`;
- bloqueio de `exercise_order` no `PUT /workout-exercises/:id` com status `400`.

Esse teste ajuda a confirmar que a API está funcionando de ponta a ponta com banco de dados, autenticação e regras principais.

## Testes manuais úteis

### Health do banco

```bash
curl -i http://localhost:3000/health/db
```

Esperado:

```text
HTTP/1.1 200 OK
```

### Listar exercícios de treino inexistente

```bash
curl -i http://localhost:3000/workouts/999999/exercises \
  -H "Authorization: Bearer $TOKEN"
```

Esperado:

```text
HTTP/1.1 404 Not Found
```

### Testar PUT válido em workout_exercises

```bash
curl -i -X PUT http://localhost:3000/workout-exercises/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "sets": 5,
    "reps": 10,
    "load_kg": 50,
    "rest_time": 90,
    "notes": "Aumentar carga progressivamente"
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
    "exercise_order": 2
  }'
```

Esperado:

```text
HTTP/1.1 400 Bad Request
```

## Estrutura geral do projeto

Estrutura resumida:

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
│   ├── auth.repository.js
│   ├── exercise.repository.js
│   ├── health.repository.js
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
    ├── health.service.js
    ├── student.service.js
    ├── user.service.js
    ├── workout.service.js
    └── workoutExercise.service.js
```

Também existem:

```text
Dockerfile
.dockerignore
docker-compose.yaml
database/schema/schema.sql
scripts/smoke-test.sh
tests/student.schema.test.js
tests/workoutExercise.schema.test.js
```

## Status atual do projeto

```text
Users               ✅ Consolidado
Students            ✅ Consolidado
Exercises           ✅ Consolidado
Workouts            ✅ Consolidado
Workout Exercises   ✅ Consolidado
Health              ✅ Consolidado com /health e /health/db
Testes              ✅ Jest + smoke test
Docker              ✅ API + PostgreSQL via Docker Compose
```

## Diagnóstico técnico

O projeto já representa uma aplicação backend estruturada para gerenciamento de treinos.

A modelagem atual permite:

```text
Aluno → vários treinos
Treino → vários exercícios
Exercício → reutilizável em vários treinos
```

Como projeto de extensão web backend, a entrega apresenta boa maturidade técnica porque possui:

- arquitetura em camadas;
- autenticação JWT;
- validação com Zod;
- soft delete;
- PostgreSQL com integridade reforçada;
- schema versionado;
- módulos principais consolidados;
- regras de negócio no service;
- SQL isolado nos repositories;
- health check da API e do banco;
- testes automatizados;
- smoke test de ponta a ponta;
- Docker Compose subindo API e PostgreSQL;
- commits organizados.
