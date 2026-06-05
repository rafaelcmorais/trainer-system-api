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

module.exports = {
    addExerciseToWorkout,
    getExercisesByWorkoutId
}