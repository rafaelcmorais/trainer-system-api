const pool = require('../config/database')

async function createStudent(data) {
    const { name, email, phone, height, is_active } = data

    const result = await pool.query(
        'INSERT INTO students (name, email, phone, height, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, height, is_active',
        [name, email, phone, height, is_active]
    );

    return result.rows[0]
}

async function getAllStudents() {
    const result = await pool.query(`SELECT id, name, email, phone, height 
        FROM students 
        WHERE is_active = true 
        ORDER BY id`)
    return result.rows
}

async function getStudentById(id) {
    try {
        const result = await pool.query(`SELECT id, name, email, phone, height 
            FROM students 
            WHERE id = $1 
            AND is_active = true`,
            [id]
        )

        if (result.rows.length === 0) {
            return null
        }
        return result.rows[0]

    } catch (err) {
        console.error('Erro ao buscar aluno', err)
        throw new Error('Erro ao buscar aluno no banco de dados')
    }


}

async function updateStudent(id, data) {
    const { name, email, phone, height } = data

    try {


        const result = await pool.query(
            `UPDATE students
            SET 
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                phone = COALESCE($3, phone),
                height = COALESCE($4, height),
                updated_at = NOW()
            WHERE id = $5 
            AND is_active = true
            RETURNING id, name, email, phone, height`,
            [name, email, phone, height, id]
        )

        return result.rows[0] || null
    } catch (err) {
        console.error('Erro ao atualizar aluno', err)
        throw new Error('Erro ao atualizar aluno no banco de dados');  // Lança erro genérico
    }

}

async function deleteStudent(id) {
    try {

        const result = await pool.query(
            `UPDATE students
            SET is_active = false,
            deleted_at = NOW()
            WHERE id = $1 AND is_active = true
            RETURNING id, name, email, phone, height, deleted_at`, [id]
        );

        if (result.rows.length === 0) {
            return null
        }

        return result.rows[0] || null


    } catch (err) {
        console.error('Erro ao desativar aluno', err);
        throw new Error('Erro ao desativar aluno no banco de dados');
    }
}

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
}