const pool = require('../config/database')
async function createExercise(data) {
    const { name, muscle_group, equipment } = data
    const result = await pool.query(
        'INSERT INTO exercises (name, muscle_group, equipment) VALUES  ($1, $2, $3) RETURNING id, name, muscle_group, equipment',
        [name, muscle_group, equipment]
    )

    return result.rows[0]
}

async function getAllExercises() {

    const result = await pool.query('SELECT id, name, muscle_group, equipment FROM exercises ORDER BY id')
    return result.rows
}

module.exports = {
    createExercise,
    getAllExercises
}