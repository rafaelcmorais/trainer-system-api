const pool = require('../config/database')

async function findUserByEmail(email) {
    const result = await pool.query(
        `SELECT id, name, email, password
        FROM users
        WHERE email = $1
        AND is_active = true
        LIMIT 1`,
        [email]
    )

    return result.rows[0] || null


}

module.exports = {
    findUserByEmail
}