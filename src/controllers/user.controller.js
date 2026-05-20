const userService = require('../services/user.service')
// const { createUserSchema } = require('../schemas/user.schema')

async function createUser(req, res, next) {
    try {
        const user = await userService.createUser(req.body)

        return res.status(201).json({
            message: "user created",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

async function getUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers()
        return res.json(users)
    } catch (err) {
        next(err)
    }
}

async function getUser(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }


    try {
        const user = await userService.getUserById(id)

        if (!user) {
            const err = new Error("user not found")
            err.status = 404
            return next(err)
        }

        return res.json(user)
    } catch (err) {
        next(err)
    }

}


async function updateUser(req, res, next) {

    const id = Number(req.params.id)



    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {
        const user = await userService.updateUser(id, req.body)

        if (!user) {
            return res.status(404).json({
                error: "user not found"
            })
        }

        return res.json({
            message: "user updated",
            data: user
        })

    } catch (err) {

        next(err)
    }
}

async function deleteUser(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {

        const result = await userService.deleteUser(id)

        if (!result) {
            return res.status(404).json({
                error: "user not found"
            })
        }

        return res.status(204).send()

    } catch (err) {

        next(err)
    }
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}