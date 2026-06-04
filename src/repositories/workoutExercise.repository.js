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

module.exports = {
    addExerciseToWorkout
}