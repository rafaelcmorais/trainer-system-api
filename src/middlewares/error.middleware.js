function errorHandler(err, req, res, next) {
    console.error(err) // log do erro (muito importante)

    // erro de email duplicado (Postgres)
    if (err.code === '23505') {
        return res.status(400).json({
            error: "email already exists"
        })
    }

    if (err.status) {
        return res.status(err.status).json({
            error: err.message
        })
    }
    // erro padrão
    return res.status(500).json({
        error: "internal server error"
    })
}

module.exports = errorHandler