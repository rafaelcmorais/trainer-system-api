const studentService = require('../services/student.service')

async function createStudent(req, res, next) {
    try {
        const student = await studentService.createStudent(req.body)

        return res.status(201).json({
            message: 'Aluno criado com sucesso',
            data: student
        })
    } catch (err) {
        next(err)
    }
}

async function getStudents(req, res, next) {
    try {

        const students = await studentService.getAllStudents()

        return res.json(students)
    } catch (err) {

        next(err)
    }

}

async function getStudent(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }
    try {
        const student = await studentService.getStudentById(id)
        if (!student) {
            const err = new Error("student not found")
            err.status = 404
            return next(err)
        }
        return res.json(student)
    } catch (err) {
        next(err)

    }

}

async function updateStudent(req, res, next) {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)
    }

    try {
        const student = await studentService.updateStudent(id, req.body)

        if (!student) {
            const err = new Error("student not found")
            err.status = 404
            return next(err)
        }

        return res.json({
            message: "student updated",
            data: student
        })

    } catch (err) {
        next(err)
    }

}

async function deleteStudent(req, res, next) {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        const err = new Error("invalid id")
        err.status = 400
        return next(err)

    }

    try {
        const result = await studentService.deleteStudent(id)

        if (!result) {
            const err = new Error("student not found")
            err.status = 404
            return next(err)
        }
        return res.status(204).send()

    } catch (err) {
        next(err)

    }

}



module.exports = {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent,
}