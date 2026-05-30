const pool = require('../config/database')

async function createExercise(data) {
    const { name, muscle_group, equipment } = data
    const result = await pool.query(
        'INSERT INTO exercises (name, muscle_group, equipment) VALUES  ($1, $2, $3) RETURNING id, name, muscle_group, equipment, is_active',
        [name, muscle_group, equipment]
    )

    return result.rows[0]
}

async function getAllExercises() {

    try {
        const result = await pool.query(`SELECT id, name, muscle_group, equipment 
        FROM exercises 
        WHERE is_active = true        
        ORDER BY id`
        )


        return result.rows
    } catch (err) {
        console.error('Erro ao buscar exercícios', err)
        throw new Error('Erro ao buscar exercícios no banco de dados')
    }
}

async function getExerciseById(id) {
    try {
        const result = await pool.query(
            `SELECT id, name, muscle_group, equipment
            FROM exercises
            WHERE id = $1 
            AND is_active = true`, [id])

        if (result.rows.length === 0) {
            return null
        }

        return result.rows[0]
    } catch (err) {
        console.error('Erro ao buscar exercício', err)
        throw new Error('Erro ao buscar exercício no banco de dados')
    }
}

async function updateExercise(id, data) {
    const { name, muscle_group, equipment } = data

    try {
        const result = await pool.query(
            `UPDATE exercises
            SET
                name = COALESCE($1, name),
                muscle_group = COALESCE($2, muscle_group),
                equipment = COALESCE($3, equipment),
                updated_at = NOW()
            WHERE id = $4
            AND is_active = true
            RETURNING id, name, muscle_group, equipment`,
            [name, muscle_group, equipment, id]
        )

        return result.rows[0] || null


    } catch (err) {
        console.error('Erro ao atualizar exercício', err)
        throw new Error('Erro ao atualizar exercício no banco de dados');  // Lança erro genérico
    }

}

async function deleteExercise(id) {
    try {
        const result = await pool.query(`
            UPDATE exercises
            SET is_active = false,
                deleted_at = NOW()
            WHERE id = $1
            AND is_active = true
            RETURNING id, name, muscle_group, equipment, deleted_at`,
            [id]
        )

        if (result.rows.length === 0) {
            return null
        }
        return result.rows[0] || null
    } catch (err) {
        console.error('Erro ao desativar exercício', err)
        throw new Error('Erro ao desativar exercício no banco de dados');  // Lança erro genérico
    }

}


module.exports = {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise
}