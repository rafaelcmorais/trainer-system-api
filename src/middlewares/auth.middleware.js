const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        const error = new Error('token missing')
        error.status = 401

        return next(error)
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded

        next()
    } catch (err) {

        const error = new Error('invalid token')
        error.status = 401

        next(error)
    }

}

module.exports = authMiddleware