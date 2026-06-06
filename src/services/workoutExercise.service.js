const workoutExerciseRepository = require('../repositories/workoutExercise.repository')
const workoutRepository = require('../repositories/workout.repository')
const exerciseRepository = require('../repositories/exercise.repository')

async function addExerciseToWorkout(data) {
    const { workout_id, exercise_id, sets, reps, rest_time, notes, exercise_order } = data

    const parsedWorkoutId = Number(workout_id)
    const parsedExerciseId = Number(exercise_id)

    if (
        !Number.isInteger(parsedExerciseId) ||
        !Number.isInteger(parsedWorkoutId) ||
        parsedExerciseId <= 0 ||
        parsedWorkoutId <= 0
    ) {
        const err = new Error('invalid workout_id or exercise_id')
        err.status = 400
        throw err
    }

    const workout = await workoutRepository.getWorkoutById(parsedWorkoutId)

    if (!workout) {
        const err = new Error('workout not found or inactive')
        err.status = 404
        throw err
    }

    const exercise = await exerciseRepository.getExerciseById(parsedExerciseId)

    if (!exercise) {
        const err = new Error('exercise not found or inactive')
        err.status = 404
        throw err
    }

    const workoutExercise = await workoutExerciseRepository.addExerciseToWorkout({
        workout_id: parsedWorkoutId,
        exercise_id: parsedExerciseId,
        sets,
        reps,
        rest_time,
        notes,
        exercise_order
    })
    return workoutExercise
}

async function getExercisesByWorkoutId(workoutId) {
    const parsedWorkoutId = Number(workoutId)

    if (!Number.isInteger(parsedWorkoutId) || parsedWorkoutId <= 0) {
        const err = new Error('invalid workout_id')
        err.status = 400
        throw err
    }

    const workout = await workoutRepository.getWorkoutById(parsedWorkoutId)

    if (!workout) {
        const err = new Error('workout not found or inactive')
        err.status = 404
        throw err
    }

    const exercises = await workoutExerciseRepository.getExercisesByWorkoutId(parsedWorkoutId)

    return exercises
}

async function deleteWorkoutExercise(id) {
    const deletedWorkoutExercise = await workoutExerciseRepository.deleteWorkoutExercise(id)

    return deletedWorkoutExercise
}

async function updateWorkoutExercise(id, data) {
    const updatedWorkoutExercise = await workoutExerciseRepository.updateWorkoutExercise(id, data)

    return updatedWorkoutExercise

}


module.exports = {
    addExerciseToWorkout,
    getExercisesByWorkoutId,
    deleteWorkoutExercise,
    updateWorkoutExercise
}