const pool = require('../config/database')

async function createWorkout(data) {

    const { name, description, student_id } = data

    const result = await pool.query(
        'INSERT INTO workouts (name, description, student_id) VALUES ($1, $2, $3 ) RETURNING id, name, description, student_id',
        [name, description, student_id]
    )

    return result.rows[0]
}

async function getAllWorkouts() {
    const result = await pool.query('SELECT id, name, description FROM workouts ORDER BY id')
    return result.rows
}

module.exports = {
    createWorkout,
    getAllWorkouts
}