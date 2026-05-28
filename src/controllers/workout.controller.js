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

async function getWorkout(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {
        const workout = await workoutService.getWorkoutById(id)
        if (!workout) {
            const err = new Error("workout not found")
            err.status = 404
            return next(err)
        }
        return res.json(workout)
    } catch (err) {
        next(err)
    }
}

async function updateWorkout(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {
        const workout = await workoutService.updateWorkout(id, req.body)

        if (!workout) {
            const err = new Error("workout not found")
            err.status = 404
            return next(err)
        }
        return res.json({
            message: "workout updated",
            data: workout
        })

    } catch (err) {
        next(err)
    }

}

async function deleteWorkout(req, res, next) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {

        const result = await workoutService.deleteWorkout(id)

        if (!result) {
            const err = new Error("workout not found")
            err.status = 404
            return next(err)
        }
        return res.status(204).send()

    } catch (err) {
        next(err)

    }
}

module.exports = {
    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout
}