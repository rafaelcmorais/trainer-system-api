const healthRoutes = require('./routes/health.routes')



const express = require ('express')
const router = require('./routes/health.routes')
const  app = express()
const port = 3000


app.get ('/', (req, res) => {
    res.send('Hello World!')
})

app.use(healthRoutes)

app.listen(port, () => {
    console.log(` app está sendo executado na porta ${port} `)
})