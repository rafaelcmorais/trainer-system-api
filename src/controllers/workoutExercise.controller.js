const workoutExerciseService = require('../services/workoutExercise.service')


async function addExerciseToWorkout(req, res, next) {
    try {
        const workoutExercise = await workoutExerciseService.addExerciseToWorkout(req.body)
        return res.status(201).json({
            message: 'exercício adicionado ao treino',
            data: workoutExercise
        })
    } catch (err) {
        next(err)
    }

}

async function getExercisesByWorkoutId(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {
        const workoutExercises = await workoutExerciseService.getExercisesByWorkoutId(id)
        // if (!workoutExercises) {
        //     const err = new Error("workout not found or inactive")
        //     err.status = 404
        //     return next(err)
        // }
        return res.json(workoutExercises)
    } catch (err) {
        next(err)
    }

}

async function deleteWorkoutExercise(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("id invalid")
        err.status = 400
        return next(err)
    }

    try {
        const result = await workoutExerciseService.deleteWorkoutExercise(id)

        if (!result) {
            const err = new Error("workout exercise relation not found")
            err.status = 404
            return next(err)
        }
        return res.status(204).send()

    } catch (err) {
        next(err)
    }
}


module.exports = {
    addExerciseToWorkout,
    getExercisesByWorkoutId,
    deleteWorkoutExercise
}