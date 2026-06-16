const pool = require('../config/database')
const healthRepository = require('../config/database')

async function checkDatabaseConnecition() {
    const result = await pool.query('SELECT 1 AS OK')
    return result.rows[0].ok === 1
}

module.exports = { checkDatabaseConnecition }
