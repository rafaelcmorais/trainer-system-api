const pool = require("../config/database")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')






async function login(data) {
    const { email, password } = data

    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )
    const user = result.rows[0]

    if (!user) return null

    const isValidPassword = await bcrypt.compare(
        password,
        user.password
    )

    if (!isValidPassword) return null


    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    return token
}

module.exports = {
    login
}