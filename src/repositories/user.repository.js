const pool = require('../config/database')



async function createUser(data) {

    const { name, email, password } = data


    const result = await pool.query(
        'INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email',
        [name, email, password]
    )
    return result.rows[0]
}

async function getAllUsers() {
    const result = await pool.query('SELECT id, name, email FROM users WHERE is_active = true ORDER BY id ')
    return result.rows
}

async function getUserById(id) {

    try {

        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE id = $1 AND is_active = true',
            [id]
        )
        //verificar se algum usuário foi encontrado
        if (result.rows.length === 0) {
            return null
        }
        return result.rows[0]
    } catch (err) {
        console.error('Erro ao buscar usuário', err)
        throw new Error('Erro ao buscar usário no banco de dados')

    }

}

async function updateUser(id, data) {
    const { name, email } = data

    try {


        const result = await pool.query(
            `UPDATE users
            SET name = COALESCE($1, name),
            email = COALESCE($2, email)
            WHERE id = $3 AND is_active = true
            RETURNING id, name, email`,
            [name, email, id]
        )

        return result.rows[0] || null
    } catch (err) {
        console.error('Erro ao atualizar usuário', err)
        throw new Error('Erro ao atualizar usuário no banco de dados');  // Lança erro genérico

    }

}

async function deleteUser(id) {
    try {

        const result = await pool.query(
            `UPDATE users
            SET is_active = false,
            deleted_at = NOW()
            WHERE id = $1 AND is_active = true
            RETURNING id, name, email, deleted_at`, [id]
        );

        if (result.rows.length === 0) {
            return null
        }

        return result.rows[0] || null


    } catch (err) {
        console.error('Erro ao desativar usuário', err);
        throw new Error('Erro ao desativar usuário no banco de dados');

    }


}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}