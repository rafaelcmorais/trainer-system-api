const exerciseRepository = require('../repositories/exercise.repository')

async function createExercise(data) {
    const { name, muscle_group, equipment } = data

    const exercise = await exerciseRepository.createExercise({
        name,
        muscle_group,
        equipment
    })
    return exercise
}

async function getAllExercises() {
    const exercises = await exerciseRepository.getAllExercises()
    return exercises
}

async function getExerciseById(id) {
    const exercise = await exerciseRepository.getExerciseById(id)
    return exercise

}

async function updateExercise(id, data) {
    const updatedExercise = await exerciseRepository.updateExercise(id, data)

    return updatedExercise
}

async function deleteExercise(id) {
    const deletedExercise = await exerciseRepository.deleteExercise(id)

    return deletedExercise

}

module.exports = {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise
}