const workoutRepository = require('../repositories/workout.repository')
const studentRepository = require('../repositories/student.repository')

async function createWorkout(data) {
    const { name, description, student_id } = data
    const parsedStudentId = Number(student_id)

    if (!Number.isInteger(parsedStudentId) || parsedStudentId <= 0) {
        const err = new Error('invalid student_id')
        err.status = 400
        throw err
    }
    const student = await studentRepository.getStudentById(parsedStudentId)

    if (!student) {
        const err = new Error('student not found or inactive')
        err.status = 404
        throw err
    }

    const workout = await workoutRepository.createWorkout({
        name,
        description,
        student_id: parsedStudentId
    })
    return workout
}

async function getAllWorkouts() {
    const workouts = await workoutRepository.getAllWorkouts()
    return workouts
}

async function getWorkoutById(id) {
    const workout = await workoutRepository.getWorkoutById(id)

    return workout
}

async function updateWorkout(id, data) {
    const updatedWorkout = await workoutRepository.updateWorkout(id, data)

    return updatedWorkout
}
async function deleteWorkout(id) {
    const deletedWorkout = await workoutRepository.deleteWorkout(id)

    return deletedWorkout
}

module.exports = {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout
}
