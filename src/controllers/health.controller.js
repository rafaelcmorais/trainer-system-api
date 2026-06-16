const healthService = require('../services/health.service')

function healthController(req, res) {
    res.json({ status: 'ok' })
}

async function healthDbController(req, res) {
    try {
        const health = await healthService.checkDatabaseHealth()

        return res.json(health)
    } catch (err) {
        return res.status(503).json({
            status: 'error',
            database: 'disconnected'
        })
    }
}

module.exports = {
    healthController,
    healthDbController
}
