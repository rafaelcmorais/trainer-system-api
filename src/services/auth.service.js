const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authRepository = require('../repositories/auth.repository')
const env = require('../config/env')

async function login(data) {
    const { email, password } = data

    const user = await authRepository.findUserByEmail(email)

    if (!user) return null

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) return null

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1h' })

    return token
}

module.exports = {
    login
}
