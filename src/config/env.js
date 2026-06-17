require('dotenv').config()

function getRequiredEnv(name) {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value
}

const env = {
    APP_PORT: process.env.APP_PORT || 3000,
    DB_USER: getRequiredEnv('DB_USER'),
    DB_HOST: getRequiredEnv('DB_HOST'),
    DB_NAME: getRequiredEnv('DB_NAME'),
    DB_PASSWORD: getRequiredEnv('DB_PASSWORD'),
    DB_PORT: Number(getRequiredEnv('DB_PORT')),
    JWT_SECRET: getRequiredEnv('JWT_SECRET')
}

module.exports = env
