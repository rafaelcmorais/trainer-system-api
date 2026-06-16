const pool = require('../config/database')

async function addExerciseToWorkout(data) {
    const { workout_id, exercise_id, sets, reps, load_kg, rest_time, notes, exercise_order } = data

    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        await client.query(
            `WITH ordered AS (
                SELECT
                    id,
                    ROW_NUMBER() OVER (
                        ORDER BY COALESCE(exercise_order,999999), id
                    ) AS new_order
                FROM workout_exercises
                WHERE workout_id = $1
                AND is_active = true
            )
            UPDATE workout_exercises we
            SET exercise_order = ordered.new_order,
                updated_at = NOW()
            FROM ordered
            WHERE we.id = ordered.id
            AND we.exercise_order IS DISTINCT FROM ordered.new_order`,
            [workout_id]
        )

        const maxOrderResult = await client.query(
            `SELECT COALESCE(MAX(exercise_order), 0) AS max_order
            FROM workout_exercises
            WHERE workout_id = $1
            AND is_active = true`,
            [workout_id]
        )

        const maxOrder = Number(maxOrderResult.rows[0]?.max_order ?? 0)
        const requestedOrder = Number(exercise_order)

        let targetOrder = maxOrder + 1

        if (Number.isInteger(requestedOrder) && requestedOrder > 0) {
            targetOrder = requestedOrder
        }

        if (targetOrder > maxOrder + 1) {
            targetOrder = maxOrder + 1
        }

        await client.query(
            `UPDATE workout_exercises
            SET exercise_order = exercise_order + 1,
                updated_at = NOW()
            WHERE workout_id = $1
            AND is_active = true
            AND exercise_order >= $2`,
            [workout_id, targetOrder]
        )

        const result = await client.query(
            `INSERT INTO workout_exercises
            (workout_id, exercise_id, sets, reps, load_kg, rest_time, notes, exercise_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING
                id,
                workout_id,
                exercise_id,
                sets,
                reps,
                load_kg,
                rest_time,
                notes,
                exercise_order,
                is_active`,
            [workout_id, exercise_id, sets, reps, load_kg, rest_time, notes, targetOrder]
        )

        await client.query('COMMIT')

        return result.rows[0]
    } catch (err) {
        await client.query('ROLLBACK')
        console.error('Erro ao adicionar exercício ao treino', err)
        throw new Error('Erro ao adicionar exercício ao treino no banco de dados')
    } finally {
        client.release()
    }
}

async function getExercisesByWorkoutId(workoutId) {
    const result = await pool.query(
        `SELECT
            we.id,
            we.workout_id,
            we.exercise_id,
            e.name AS exercise_name,
            e.muscle_group,
            e.equipment,
            we.sets,
            we.reps,
            we.load_kg,
            we.rest_time,
            we.notes,
            we.exercise_order
        FROM workout_exercises we
        JOIN exercises e ON e.id = we.exercise_id
        WHERE we.workout_id = $1
        AND we.is_active = true
        AND e.is_active = true
        ORDER BY we.exercise_order, we.id`,
        [workoutId]
    )
    return result.rows
}

async function deleteWorkoutExercise(id) {
    try {
        const result = await pool.query(
            `UPDATE workout_exercises
            SET is_active = false,
                deleted_at = NOW(),
                updated_at = NOW()
            WHERE id = $1 AND is_active = true
            RETURNING id, workout_id, exercise_id, deleted_at`,
            [id]
        )

        if (result.rows.length === 0) {
            return null
        }
        return result.rows[0] || null
    } catch (err) {
        console.error('Erro ao remover exercício do treino', err)
        throw new Error('Erro ao desativar vínculo treino-exercício')
    }
}

async function updateWorkoutExercise(id, data) {
    const { sets, reps, load_kg, rest_time, notes } = data

    try {
        const result = await pool.query(
            `
        UPDATE workout_exercises
        SET
            sets = COALESCE($1, sets),
            reps = COALESCE($2, reps),
            load_kg = COALESCE($3, load_kg),
            rest_time = COALESCE($4, rest_time),
            notes = COALESCE($5, notes),
            updated_at = NOW()
            WHERE id = $6
            AND is_active = true
            RETURNING
                id,
                workout_id,
                exercise_id,
                sets,
                reps,
                load_kg,
                rest_time,
                notes`,
            [sets, reps, load_kg, rest_time, notes, id]
        )

        return result.rows[0] || null
    } catch (err) {
        console.error('Erro ao atualizar exercício do treino', err)
        throw new Error('Erro ao atualizar exercicio do treino no banco de dados')
    }
}

async function findActiveWorkoutExercise(workoutId, exerciseId) {
    const result = await pool.query(
        `SELECT id
        FROM workout_exercises
        WHERE workout_id = $1
        AND exercise_id = $2
        AND is_active = true
        LIMIT 1`,
        [workoutId, exerciseId]
    )
    return result.rows[0] || null
}

module.exports = {
    addExerciseToWorkout,
    getExercisesByWorkoutId,
    deleteWorkoutExercise,
    updateWorkoutExercise,
    findActiveWorkoutExercise
}
