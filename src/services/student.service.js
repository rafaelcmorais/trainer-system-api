const studentRepository = require('../repositories/student.repository')

async function createStudent(data) {
    const { name, email, phone, height } = data
    const is_active = true

    const student = await studentRepository.createStudent({
        name,
        email,
        phone,
        height,
        is_active
    })

    return student

}

async function getAllStudents() {
    const students = await studentRepository.getAllStudents()
    return students
}

async function getStudentById(id) {
    const studentById = await studentRepository.getStudentById(id)

    return studentById

}

async function updateStudent(id, data) {
    const updatedStudent = await studentRepository.updateStudent(id, data)

    return updatedStudent

}

async function deleteStudent(id) {
    const deletedStudent = await studentRepository.deleteStudent(id)
    return deletedStudent

}

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
}