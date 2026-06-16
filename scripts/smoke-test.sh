#!/usr/bin/env bash

set -e

API_URL="${API_URL:-http://localhost:3000}"
UNIQUE="$(date +%s)"

json_get() {
  node -e '
    let input = "";
    process.stdin.on("data", chunk => input += chunk);
    process.stdin.on("end", () => {
      try {
        const obj = JSON.parse(input);
        const path = process.argv[1].split(".");
        let value = obj;

        for (const key of path) {
          value = value?.[key];
        }

        console.log(value ?? "");
      } catch (err) {
        console.error("Erro ao ler JSON:", err.message);
        process.exit(1);
      }
    });
  ' "$1"
}

echo "===== HEALTH ====="
curl -i "$API_URL/health"

echo ""
echo "===== CREATE USER ====="
USER_EMAIL="smoke_${UNIQUE}@email.com"

USER_RESPONSE=$(curl -s -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Smoke Test\",
    \"email\": \"$USER_EMAIL\",
    \"password\": \"123456\"
  }")

echo "$USER_RESPONSE"

echo ""
echo "===== LOGIN ====="
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$USER_EMAIL\",
    \"password\": \"123456\"
  }")

echo "$LOGIN_RESPONSE"

TOKEN=$(echo "$LOGIN_RESPONSE" | json_get "token")

if [ -z "$TOKEN" ]; then
  echo "ERRO: token vazio"
  exit 1
fi

echo ""
echo "TOKEN OK"

echo ""
echo "===== CREATE STUDENT ====="
STUDENT_RESPONSE=$(curl -s -X POST "$API_URL/students" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Aluno Smoke $UNIQUE\",
    \"email\": \"aluno_smoke_${UNIQUE}@email.com\",
    \"phone\": \"21999999999\",
    \"height\": 1.75,
    \"weight_kg\": 80.50,
    \"sex\": \"male\"
  }")

echo "$STUDENT_RESPONSE"

STUDENT_ID=$(echo "$STUDENT_RESPONSE" | json_get "data.id")

if [ -z "$STUDENT_ID" ]; then
  echo "ERRO: student id vazio"
  exit 1
fi

echo ""
echo "STUDENT_ID=$STUDENT_ID"

echo ""
echo "===== CREATE EXERCISES ====="

EXERCISE_RESPONSE_1=$(curl -s -X POST "$API_URL/exercises" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Supino Smoke $UNIQUE\",
    \"muscle_group\": \"Peitoral\",
    \"equipment\": \"Barra\"
  }")

EXERCISE_RESPONSE_2=$(curl -s -X POST "$API_URL/exercises" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Puxada Smoke $UNIQUE\",
    \"muscle_group\": \"Costas\",
    \"equipment\": \"Pulley\"
  }")

EXERCISE_RESPONSE_3=$(curl -s -X POST "$API_URL/exercises" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Remada Smoke $UNIQUE\",
    \"muscle_group\": \"Costas\",
    \"equipment\": \"Maquina\"
  }")

EXERCISE_ID_1=$(echo "$EXERCISE_RESPONSE_1" | json_get "data.id")
EXERCISE_ID_2=$(echo "$EXERCISE_RESPONSE_2" | json_get "data.id")
EXERCISE_ID_3=$(echo "$EXERCISE_RESPONSE_3" | json_get "data.id")

echo "EXERCISE_ID_1=$EXERCISE_ID_1"
echo "EXERCISE_ID_2=$EXERCISE_ID_2"
echo "EXERCISE_ID_3=$EXERCISE_ID_3"

if [ -z "$EXERCISE_ID_1" ] || [ -z "$EXERCISE_ID_2" ] || [ -z "$EXERCISE_ID_3" ]; then
  echo "ERRO: algum exercise id ficou vazio"
  exit 1
fi

echo ""
echo "===== CREATE WORKOUT ====="
WORKOUT_RESPONSE=$(curl -s -X POST "$API_URL/workouts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"student_id\": $STUDENT_ID,
    \"name\": \"Treino Smoke $UNIQUE\",
    \"description\": \"Smoke test final da API\"
  }")

echo "$WORKOUT_RESPONSE"

WORKOUT_ID=$(echo "$WORKOUT_RESPONSE" | json_get "data.id")

if [ -z "$WORKOUT_ID" ]; then
  echo "ERRO: workout id vazio"
  exit 1
fi

echo ""
echo "WORKOUT_ID=$WORKOUT_ID"

echo ""
echo "===== ADD WORKOUT EXERCISES ====="

curl -s -X POST "$API_URL/workout-exercises" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"workout_id\": $WORKOUT_ID,
    \"exercise_id\": $EXERCISE_ID_1,
    \"sets\": 4,
    \"reps\": 10,
    \"load_kg\": 40,
    \"rest_time\": 90,
    \"notes\": \"Primeiro exercicio\",
    \"exercise_order\": 1
  }"

echo ""

curl -s -X POST "$API_URL/workout-exercises" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"workout_id\": $WORKOUT_ID,
    \"exercise_id\": $EXERCISE_ID_2,
    \"sets\": 3,
    \"reps\": 12,
    \"load_kg\": 45,
    \"rest_time\": 60,
    \"notes\": \"Sem ordem deve ir para o final\"
  }"

echo ""

curl -s -X POST "$API_URL/workout-exercises" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"workout_id\": $WORKOUT_ID,
    \"exercise_id\": $EXERCISE_ID_3,
    \"sets\": 3,
    \"reps\": 12,
    \"load_kg\": 35,
    \"rest_time\": 60,
    \"notes\": \"Inserido na posicao 1\",
    \"exercise_order\": 1
  }"

echo ""

echo ""
echo "===== LIST ORDERED WORKOUT EXERCISES ====="
curl -s "$API_URL/workouts/$WORKOUT_ID/exercises" \
  -H "Authorization: Bearer $TOKEN"

echo ""
echo ""
echo "===== BLOCK exercise_order ON PUT ====="
BLOCK_RESPONSE=$(curl -s -X PUT "$API_URL/workout-exercises/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "exercise_order": 1
  }')

echo "$BLOCK_RESPONSE"

echo ""
echo "===== SMOKE TEST FINISHED ====="
