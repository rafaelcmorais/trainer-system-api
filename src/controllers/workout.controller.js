const workoutService = require('../services/workout.service')

async function createWorkout(req, res, next) {
    try {
        const workout = await workoutService.createWorkout(req.body)
        return res.status(201).json({
            message: 'Treino criado com sucesso',
            data: workout
        })
    } catch (err) {
        next(err)
    }
}

async function getWorkouts(req, res, next) {
    try {
        const workouts = await workoutService.getAllWorkouts()
        return res.json(workouts)

    } catch (err) {
        next(err)
    }
}

module.exports = {
    createWorkout,
    getWorkouts
}