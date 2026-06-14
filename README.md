# Trainer System API

API backend para gerenciamento de alunos, exercícios, treinos e vínculos entre treinos e exercícios.

O projeto foi desenvolvido em Node.js/Express com PostgreSQL, Docker, JWT, Zod, Prettier e arquitetura em camadas.

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
- JWT
- Zod
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
- **Controllers**: lidam com `req`, `res` e `next`.
- **Services**: concentram regras de negócio.
- **Repositories**: concentram SQL e acesso ao banco.
- **Database**: persistência em PostgreSQL.

Essa separação ajuda a manter o código organizado, testável e fácil de evoluir.

## Módulos implementados

Os módulos consolidados atualmente são:

- `users`
- `auth`
- `students`
- `exercises`
- `workouts`
- `workout_exercises`

## Autenticação

A API utiliza autenticação com JWT.

Endpoint de login:

```http
POST /auth/login
```

Exemplo de body:

```json
{
    "email": "usuario@email.com",
    "password": "senha"
}
```

As rotas principais são protegidas com `authMiddleware`.

Exemplo de uso do token:

```bash
curl http://localhost:3000/students \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Validação

As validações de entrada são feitas com Zod.

O projeto utiliza:

- `.strict()` para bloquear campos não permitidos;
- validação de tipos;
- validação de campos obrigatórios;
- validações numéricas;
- enums;
- bloqueio de body vazio em updates.

As validações acontecem antes dos dados chegarem aos controllers, services, repositories e banco de dados.

## Soft delete

O projeto utiliza soft delete.

O padrão adotado é:

```text
is_active = false
deleted_at = NOW()
updated_at = NOW()
```

Quando um registro é removido pela API, ele não é apagado fisicamente do banco. Ele é marcado como inativo.

Esse padrão foi aplicado aos módulos principais, incluindo:

- users;
- students;
- exercises;
- workouts;
- workout_exercises.

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

Para limpar possíveis problemas de final de linha e espaços em branco:

```bash
sed -i 's/\r$//' database/schema/schema.sql
sed -i 's/[[:blank:]]\+$//' database/schema/schema.sql
```

## Entidades principais

## Users

Representa usuários do sistema.

Campos principais:

- `id`
- `name`
- `email`
- `password`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

Endpoints:

```http
POST /users
GET /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

## Students

Representa alunos cadastrados no sistema.

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

Endpoints:

```http
POST /students
GET /students
GET /students/:id
PUT /students/:id
DELETE /students/:id
```

Regras principais:

- `GET /students` lista apenas alunos ativos.
- `GET /students/:id` retorna apenas aluno ativo.
- `PUT /students/:id` atualiza apenas campos permitidos.
- `DELETE /students/:id` usa soft delete.
- `weight_kg` é opcional e positivo.
- `height` é opcional e positivo.
- `sex` é opcional e validado por enum.

Valores aceitos para `sex`:

```text
male
female
other
not_informed
```

Campos permitidos no `PUT /students/:id`:

- `name`
- `email`
- `phone`
- `height`
- `weight_kg`
- `sex`

Campos que não devem ser atualizados diretamente:

- `id`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

## Exercises

Representa o catálogo reutilizável de exercícios.

Campos principais:

- `id`
- `name`
- `muscle_group`
- `equipment`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

Endpoints:

```http
POST /exercises
GET /exercises
GET /exercises/:id
PUT /exercises/:id
DELETE /exercises/:id
```

O catálogo permite cadastrar exercícios como:

- supino reto;
- puxada frontal;
- flexão de braços;
- alongamento de quadril;
- alongamento de pernas.

Esses exercícios podem ser reutilizados em vários treinos.

## Workouts

Representa treinos vinculados a alunos.

Campos principais:

- `id`
- `student_id`
- `name`
- `description`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

Endpoints:

```http
POST /workouts
GET /workouts
GET /workouts/:id
PUT /workouts/:id
DELETE /workouts/:id
```

Regras principais:

- um treino pertence a um aluno;
- apenas treinos ativos são retornados nas consultas principais;
- exclusão usa soft delete.

## Workout Exercises

Representa o vínculo entre um treino e um exercício do catálogo.

Essa tabela resolve a relação entre `workouts` e `exercises`.

Um treino pode ter vários exercícios, e um exercício do catálogo pode aparecer em vários treinos.

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

Endpoints:

```http
POST /workout-exercises
GET /workouts/:id/exercises
PUT /workout-exercises/:id
DELETE /workout-exercises/:id
```

Regras principais:

- `POST /workout-exercises` adiciona um exercício a um treino.
- O service valida se o treino existe e está ativo.
- O service valida se o exercício existe e está ativo.
- Não pode existir vínculo ativo duplicado com o mesmo `workout_id` e `exercise_id`.
- Duplicidade ativa retorna `409 Conflict`.
- Histórico inativo duplicado é permitido por causa do soft delete.
- `GET /workouts/:id/exercises` lista apenas vínculos ativos.
- No GET, o campo `id` retornado é o id do vínculo em `workout_exercises`, não o id do exercício do catálogo.
- `PUT /workout-exercises/:id` atualiza apenas dados do vínculo.
- `DELETE /workout-exercises/:id` remove apenas o vínculo com soft delete.

Campos permitidos no `PUT /workout-exercises/:id`:

- `sets`
- `reps`
- `load_kg`
- `rest_time`
- `notes`
- `exercise_order`

Campos que não podem ser alterados no PUT:

- `workout_id`
- `exercise_id`
- dados do treino;
- dados do exercício do catálogo.

## Regras de carga

O campo `load_kg` representa a carga total prescrita ou utilizada no exercício.

Exemplo:

```json
{
    "load_kg": 45
}
```

Observações específicas, como “20 kg de cada lado”, devem ser registradas no campo `notes`.

Exemplo:

```json
{
    "load_kg": 40,
    "notes": "20 kg de cada lado"
}
```

Uma modelagem mais detalhada de carga pode ser criada futuramente, considerando:

- carga por lado;
- halteres;
- máquinas;
- peso corporal;
- carga total;
- unidade de medida.

## Duplicidade ativa em workout_exercises

A API bloqueia duplicidade ativa em `workout_exercises`.

Não pode existir mais de um vínculo ativo com:

- mesmo `workout_id`;
- mesmo `exercise_id`;
- `is_active = true`.

Essa regra é aplicada em duas camadas:

```text
Service + Database
```

No banco, existe um índice único parcial:

```sql
CREATE UNIQUE INDEX unique_active_workout_exercise
ON public.workout_exercises USING btree (workout_id, exercise_id)
WHERE (is_active = true);
```

Isso impede duplicidade ativa e permite manter histórico inativo.

## Constraints no banco

Além das validações com Zod, o banco também possui constraints para reforçar a integridade dos dados.

## Constraints em students

Constraints implementadas:

- `students_sex_check`
- `students_height_check`
- `students_weight_kg_check`

Regras:

- `sex` deve ser `NULL` ou um dos valores permitidos;
- `height` deve ser `NULL` ou maior que zero;
- `weight_kg` deve ser `NULL` ou maior que zero.

## Constraints em workout_exercises

Constraints implementadas:

- `workout_exercises_sets_check`
- `workout_exercises_reps_check`
- `workout_exercises_load_kg_check`
- `workout_exercises_rest_time_check`
- `workout_exercises_exercise_order_check`

Regras:

- `sets` deve ser `NULL` ou maior que zero;
- `reps` deve ser `NULL` ou maior que zero;
- `load_kg` deve ser `NULL` ou maior ou igual a zero;
- `rest_time` deve ser `NULL` ou maior ou igual a zero;
- `exercise_order` deve ser `NULL` ou maior que zero.

## Observação sobre campos NUMERIC

Campos PostgreSQL do tipo `NUMERIC` podem ser retornados como string pela API.

Exemplo:

```json
{
    "weight_kg": "80.20",
    "load_kg": "45.00"
}
```

Esse comportamento é esperado no driver PostgreSQL.

## Testes automatizados

O projeto possui uma primeira camada de testes automatizados com Jest.

Os testes atuais cobrem validações dos schemas Zod, garantindo que regras importantes sejam verificadas automaticamente antes dos dados chegarem aos controllers, services, repositories e banco de dados.

## Como executar os testes

```bash
npm test
```

O script executado é:

```bash
jest --runInBand
```

## Cobertura atual dos testes

Arquivos de teste:

```text
tests/student.schema.test.js
tests/workoutExercise.schema.test.js
```

## Students

O arquivo `tests/student.schema.test.js` valida:

- criação de aluno com dados válidos;
- rejeição de `sex` inválido;
- rejeição de body vazio no update;
- rejeição de campos desconhecidos, como `is_active`;
- rejeição de `weight_kg` negativo;
- rejeição de `height` negativo.

Total:

```text
6 testes
```

## Workout Exercises

O arquivo `tests/workoutExercise.schema.test.js` valida:

- criação de vínculo com dados válidos;
- rejeição de `sets = 0`;
- rejeição de `reps = 0`;
- aceitação de `load_kg = 0`;
- rejeição de `load_kg` negativo;
- rejeição de `rest_time` negativo;
- rejeição de `exercise_order = 0`;
- rejeição de body vazio no update.

Total:

```text
8 testes
```

## Resultado atual

```text
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
```

Os testes atuais não dependem do PostgreSQL. Eles validam diretamente os schemas Zod.

O Supertest está instalado como dependência de desenvolvimento para futura criação de testes de endpoints.

## Instalação e execução

Instale as dependências:

```bash
npm install
```

Execute o projeto em modo desenvolvimento:

```bash
npm run dev
```

Execute os testes automatizados:

```bash
npm test
```

## Variáveis de ambiente

O projeto utiliza variáveis de ambiente para conexão com banco de dados, autenticação e porta da aplicação.

As variáveis devem ser configuradas em arquivo `.env`, conforme leitura feita nos arquivos de configuração do projeto.

Exemplo de informações necessárias:

```text
PORT
DATABASE_HOST
DATABASE_PORT
DATABASE_USER
DATABASE_PASSWORD
DATABASE_NAME
JWT_SECRET
```

Ajuste os nomes conforme a configuração existente em `src/config/env.js`.

## Exemplos de uso com curl

## Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha"
  }'
```

## Listar alunos

```bash
curl http://localhost:3000/students \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Criar aluno

```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Aluno Teste",
    "email": "aluno@teste.com",
    "phone": "21999999999",
    "height": 1.75,
    "weight_kg": 80.5,
    "sex": "male"
  }'
```

## Criar exercício

```bash
curl -X POST http://localhost:3000/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Supino reto",
    "muscle_group": "Peitoral",
    "equipment": "Barra"
  }'
```

## Criar treino

```bash
curl -X POST http://localhost:3000/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "student_id": 1,
    "name": "Treino A",
    "description": "Treino de membros superiores"
  }'
```

## Adicionar exercício ao treino

```bash
curl -X POST http://localhost:3000/workout-exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "workout_id": 1,
    "exercise_id": 1,
    "sets": 3,
    "reps": 12,
    "load_kg": 45,
    "rest_time": 60,
    "notes": "Carga moderada",
    "exercise_order": 1
  }'
```

## Listar exercícios de um treino

```bash
curl http://localhost:3000/workouts/1/exercises \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Atualizar vínculo entre treino e exercício

```bash
curl -X PUT http://localhost:3000/workout-exercises/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "sets": 4,
    "reps": 10,
    "load_kg": 50,
    "rest_time": 90,
    "notes": "Aumentar carga progressivamente",
    "exercise_order": 2
  }'
```

## Remover exercício do treino

```bash
curl -X DELETE http://localhost:3000/workout-exercises/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Estrutura geral do projeto

Estrutura resumida:

```text
src/
  config/
  controllers/
  middlewares/
  repositories/
  routes/
  schemas/
  services/
  app.js
  server.js

database/
  schema/
    schema.sql

tests/
  student.schema.test.js
  workoutExercise.schema.test.js
```

## Qualidade e validações antes de commit

Antes de realizar commits técnicos, recomenda-se executar:

```bash
git status
git diff --check
git diff --stat
npm test
```

Para arquivos JavaScript alterados, recomenda-se também:

```bash
node --check caminho/do/arquivo.js
```

Para validar todos os arquivos JavaScript:

```bash
find src tests -name "*.js" -print -exec node --check {} \;
```

## Status atual

Status técnico atual:

- usuários consolidados;
- autenticação JWT implementada;
- alunos consolidados;
- exercícios consolidados;
- treinos consolidados;
- vínculos entre treinos e exercícios consolidados;
- soft delete aplicado;
- validações com Zod implementadas;
- constraints de banco adicionadas;
- schema versionado em `database/schema/schema.sql`;
- testes automatizados de schemas adicionados com Jest.

## Melhorias futuras

Possíveis melhorias futuras:

- ampliar testes automatizados para endpoints com Supertest;
- criar testes de services e repositories;
- implementar migrations;
- criar histórico corporal com `student_body_metrics`;
- implementar clonagem de treinos;
- padronizar a ordem dos middlewares nas rotas;
- revisar e expandir documentação de deploy;
- criar seed de dados para ambiente de desenvolvimento;
- adicionar pipeline de CI para executar `npm test` automaticamente.
