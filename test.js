const pool = require('./src/config/database')

async function test() {
    const res = await pool.query('SELECT NOW()')
    console.log(res.rows)
}

test()