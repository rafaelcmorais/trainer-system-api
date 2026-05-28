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
    const result = await pool.query(`SELECT id, name, description, student_id 
    FROM workouts 
    WHERE is_active = true 
    ORDER BY id`)
    return result.rows
}

async function getWorkoutById(id) {
    try {
        const result = await pool.query(
            `SELECT id, name, description, student_id
            FROM workouts
            WHERE id = $1 
            AND is_active = true`,
            [id]
        )
        if (result.rows.length === 0) {
            return null
        }

        return result.rows[0]

    } catch (err) {
        console.error('Erro buscar treino', err)
        throw new Error('Erro ao buscar treino no banco de dados')
    }

}

async function updateWorkout(id, data) {
    const { name, description } = data

    try {
        const result = await pool.query(
            `UPDATE workouts
            SET 
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                updated_at = NOW()
            WHERE id = $3 
            AND is_active = true
            RETURNING id, name, description, student_id`,
            [name, description, id]
        )
        return result.rows[0] || null


    } catch (err) {
        console.error('Erro ao atualizar treino', err)
        throw new Error('Erro ao atualizar treino no banco de dados')
    }

}

async function deleteWorkout(id) {
    try {
        const result = await pool.query(
            `UPDATE workouts
            SET is_active = false,
            deleted_at = NOW()
            WHERE id = $1 AND is_active = true
            RETURNING id, name, description, deleted_at`, [id]
        )

        if (result.rows.length === 0) {
            return null
        }

        return result.rows[0] || null

    } catch (err) {
        console.error('Erro ao desativar treino', err);
        throw new Error('Erro ao desativar treino no banco de dados');
    }
}

module.exports = {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout
}