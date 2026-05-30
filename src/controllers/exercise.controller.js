const exerciseService = require('../services/exercise.service')

async function createExercise(req, res, next) {
    try {
        const exercise = await exerciseService.createExercise(req.body)
        return res.status(201).json({
            message: 'Exercício criado com sucesso',
            data: exercise
        })
    } catch (err) {
        next(err)
    }
}
async function getExercises(req, res, next) {
    try {
        const exercises = await exerciseService.getAllExercises()
        return res.json(exercises)
    } catch (err) {
        next(err)
    }
}

async function getExercise(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {
        const exercise = await exerciseService.getExerciseById(id)
        if (!exercise) {
            const err = new Error("exercise not found")
            err.status = 404
            return next(err)
        }
        return res.json(exercise)

    } catch (err) {
        next(err)

    }
}

async function updateExercise(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {
        const exercise = await exerciseService.updateExercise(id, req.body)

        if (!exercise) {
            const err = new Error("exercise not found")
            err.status = 404
            return next(err)
        }

        return res.json({
            message: "exercise updated",
            data: exercise
        })

    } catch (err) {
        next(err)

    }

}

async function deleteExercise(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }
    try {
        const result = await exerciseService.deleteExercise(id)
        if (!result) {
            const err = new Error("exercise not found")
            err.status = 404
            return next(err)
        }
        return res.status(204).send()


    } catch (err) {
        next(err)

    }


}

module.exports = {
    createExercise,
    getExercises,
    getExercise,
    updateExercise,
    deleteExercise
}