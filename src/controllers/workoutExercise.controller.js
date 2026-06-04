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
module.exports = {
    addExerciseToWorkout
}