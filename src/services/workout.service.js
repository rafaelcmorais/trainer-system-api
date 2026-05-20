const workoutRepository = require('../repositories/workout.repository')

async function createWorkout(data) {
    const { name, description, student_id } = data

    const workout = await workoutRepository.createWorkout({
        name,
        description,
        student_id
    })
    return workout
}

async function getAllWorkouts() {
    const workouts = await workoutRepository.getAllWorkouts()
    return workouts
}

module.exports = {
    createWorkout,
    getAllWorkouts
}
