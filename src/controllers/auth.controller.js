const authService = require('../services/auth.service')

async function login(req, res, next) {
    try {
        const token = await authService.login(req.body)

        if (!token) {
            const error = new Error('invalid credential')
            error.status = 401

            return next(error)
        }
        return res.json({
            token
        })

    } catch (err) {
        next(err)
    }

}
module.exports = {
    login
}