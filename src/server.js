const env = require('./config/env')
const app = require('./app')

const port = env.APP_PORT
app.listen(port, () => {
    console.log(` app está sendo executado na porta ${port} `)
})
