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

module.exports = {
    createExercise,
    getExercises
}