#!/usr/bin/env bash

set -e

API_URL="${API_URL:-http://localhost:3000}"
UNIQUE="$(date +%s)"
RESPONSE=""

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

request() {
  local method="$1"
  local url="$2"
  local expected_status="$3"
  local body="${4:-}"
  local token="${5:-}"
  local tmp_file
  local status

  tmp_file="$(mktemp)"

  local curl_args=(-s -o "$tmp_file" -w "%{http_code}" -X "$method" "$url")

  if [ -n "$token" ]; then
    curl_args+=(-H "Authorization: Bearer $token")
  fi

  if [ -n "$body" ]; then
    curl_args+=(-H "Content-Type: application/json" -d "$body")
  fi

  status="$(curl "${curl_args[@]}")"
  RESPONSE="$(cat "$tmp_file")"
  rm -f "$tmp_file"

  echo "$RESPONSE"

  if [ "$status" != "$expected_status" ]; then
    echo ""
    echo "ERRO: $method $url retornou HTTP $status, esperado HTTP $expected_status"
    exit 1
  fi

  echo "STATUS OK: $status"
}

echo "===== HEALTH ====="
request "GET" "$API_URL/health" "200"

echo ""
echo "===== CREATE USER ====="
USER_EMAIL="smoke_${UNIQUE}@email.com"

USER_BODY=$(cat <<JSON
{
  "name": "Smoke Test",
  "email": "$USER_EMAIL",
  "password": "123456"
}
JSON
)

request "POST" "$API_URL/users" "201" "$USER_BODY"

echo ""
echo "===== LOGIN ====="

LOGIN_BODY=$(cat <<JSON
{
  "email": "$USER_EMAIL",
  "password": "123456"
}
JSON
)

request "POST" "$API_URL/auth/login" "200" "$LOGIN_BODY"

TOKEN=$(echo "$RESPONSE" | json_get "token")

if [ -z "$TOKEN" ]; then
  echo "ERRO: token vazio"
  exit 1
fi

echo ""
echo "TOKEN OK"

echo ""
echo "===== CREATE STUDENT ====="

STUDENT_BODY=$(cat <<JSON
{
  "name": "Aluno Smoke $UNIQUE",
  "email": "aluno_smoke_${UNIQUE}@email.com",
  "phone": "21999999999",
  "height": 1.75,
  "weight_kg": 80.50,
  "sex": "male"
}
JSON
)

request "POST" "$API_URL/students" "201" "$STUDENT_BODY" "$TOKEN"

STUDENT_ID=$(echo "$RESPONSE" | json_get "data.id")

if [ -z "$STUDENT_ID" ]; then
  echo "ERRO: student id vazio"
  exit 1
fi

echo ""
echo "STUDENT_ID=$STUDENT_ID"

echo ""
echo "===== CREATE EXERCISES ====="

EXERCISE_BODY_1=$(cat <<JSON
{
  "name": "Supino Smoke $UNIQUE",
  "muscle_group": "Peitoral",
  "equipment": "Barra"
}
JSON
)

request "POST" "$API_URL/exercises" "201" "$EXERCISE_BODY_1" "$TOKEN"
EXERCISE_ID_1=$(echo "$RESPONSE" | json_get "data.id")

EXERCISE_BODY_2=$(cat <<JSON
{
  "name": "Puxada Smoke $UNIQUE",
  "muscle_group": "Costas",
  "equipment": "Pulley"
}
JSON
)

request "POST" "$API_URL/exercises" "201" "$EXERCISE_BODY_2" "$TOKEN"
EXERCISE_ID_2=$(echo "$RESPONSE" | json_get "data.id")

EXERCISE_BODY_3=$(cat <<JSON
{
  "name": "Remada Smoke $UNIQUE",
  "muscle_group": "Costas",
  "equipment": "Maquina"
}
JSON
)

request "POST" "$API_URL/exercises" "201" "$EXERCISE_BODY_3" "$TOKEN"
EXERCISE_ID_3=$(echo "$RESPONSE" | json_get "data.id")

echo "EXERCISE_ID_1=$EXERCISE_ID_1"
echo "EXERCISE_ID_2=$EXERCISE_ID_2"
echo "EXERCISE_ID_3=$EXERCISE_ID_3"

if [ -z "$EXERCISE_ID_1" ] || [ -z "$EXERCISE_ID_2" ] || [ -z "$EXERCISE_ID_3" ]; then
  echo "ERRO: algum exercise id ficou vazio"
  exit 1
fi

echo ""
echo "===== CREATE WORKOUT ====="

WORKOUT_BODY=$(cat <<JSON
{
  "student_id": $STUDENT_ID,
  "name": "Treino Smoke $UNIQUE",
  "description": "Smoke test final da API"
}
JSON
)

request "POST" "$API_URL/workouts" "201" "$WORKOUT_BODY" "$TOKEN"

WORKOUT_ID=$(echo "$RESPONSE" | json_get "data.id")

if [ -z "$WORKOUT_ID" ]; then
  echo "ERRO: workout id vazio"
  exit 1
fi

echo ""
echo "WORKOUT_ID=$WORKOUT_ID"

echo ""
echo "===== ADD WORKOUT EXERCISES ====="

WORKOUT_EXERCISE_BODY_1=$(cat <<JSON
{
  "workout_id": $WORKOUT_ID,
  "exercise_id": $EXERCISE_ID_1,
  "sets": 4,
  "reps": 10,
  "load_kg": 40,
  "rest_time": 90,
  "notes": "Primeiro exercicio",
  "exercise_order": 1
}
JSON
)

request "POST" "$API_URL/workout-exercises" "201" "$WORKOUT_EXERCISE_BODY_1" "$TOKEN"

WORKOUT_EXERCISE_BODY_2=$(cat <<JSON
{
  "workout_id": $WORKOUT_ID,
  "exercise_id": $EXERCISE_ID_2,
  "sets": 3,
  "reps": 12,
  "load_kg": 45,
  "rest_time": 60,
  "notes": "Sem ordem deve ir para o final"
}
JSON
)

request "POST" "$API_URL/workout-exercises" "201" "$WORKOUT_EXERCISE_BODY_2" "$TOKEN"

WORKOUT_EXERCISE_BODY_3=$(cat <<JSON
{
  "workout_id": $WORKOUT_ID,
  "exercise_id": $EXERCISE_ID_3,
  "sets": 3,
  "reps": 12,
  "load_kg": 35,
  "rest_time": 60,
  "notes": "Inserido na posicao 1",
  "exercise_order": 1
}
JSON
)

request "POST" "$API_URL/workout-exercises" "201" "$WORKOUT_EXERCISE_BODY_3" "$TOKEN"

echo ""
echo "===== LIST ORDERED WORKOUT EXERCISES ====="
request "GET" "$API_URL/workouts/$WORKOUT_ID/exercises" "200" "" "$TOKEN"

echo ""
echo "===== BLOCK exercise_order ON PUT ====="

BLOCK_BODY=$(cat <<JSON
{
  "exercise_order": 1
}
JSON
)

request "PUT" "$API_URL/workout-exercises/1" "400" "$BLOCK_BODY" "$TOKEN"

echo ""
echo "===== SMOKE TEST FINISHED ====="
