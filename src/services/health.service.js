const healthRepository = require('../repositories/health.repository')

async function checkDatabaseHealth() {
    await healthRepository.checkDatabaseConnecition()

    return {
        status: 'ok',
        database: 'connected'
    }
}

module.exports = {
    checkDatabaseHealth
}
