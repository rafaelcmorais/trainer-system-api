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

module.exports = {
    createExercise,
    getAllExercises
}