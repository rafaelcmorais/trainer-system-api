const pool = require('../config/database')

async function addExerciseToWorkout(data) {
    const {
        workout_id,
        exercise_id,
        sets,
        reps,
        rest_time,
        notes,
        exercise_order
    } = data

    const result = await pool.query(
        `INSERT INTO workout_exercises
        (workout_id, exercise_id, sets, reps, rest_time, notes, exercise_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, workout_id, exercise_id, sets, reps, rest_time, notes, exercise_order, is_active`,
        [workout_id, exercise_id, sets, reps, rest_time, notes, exercise_order]
    )
    return result.rows[0]

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
                deleted_at = NOW()
                WHERE id = $1 AND is_active = true
            RETURNING id, workout_id, exercise_id, deleted_at` ,
            [id])

        if (result.rows.length === 0) {
            return null
        }
        return result.rows[0] || null
    } catch (err) {

        console.error('Erro ao remover exercício do treino', err);
        throw new Error('Erro ao desativar vínculo treino-exercício');

    }

}

async function updateWorkoutExercise(id, data) {

    const { sets, reps, rest_time, notes, exercise_order } = data

    try {
        const result = await pool.query(`
        UPDATE workout_exercises
        SET
            sets = COALESCE($1, sets),
            reps = COALESCE($2, reps),
            rest_time = COALESCE($3, rest_time),
            notes = COALESCE($4, notes),
            exercise_order = COALESCE($5, exercise_order),
            updated_at = NOW()
            WHERE id = $6
            AND is_active = true
            RETURNING
                id,
                workout_id,
                exercise_id,
                sets,
                reps,
                rest_time,
                notes,
                exercise_order`,
            [sets, reps, rest_time, notes, exercise_order, id]
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