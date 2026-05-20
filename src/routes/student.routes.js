const express = require('express')
const {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/student.controller')

const validate = require('../middlewares/validation.middleware')
const {
    createStudentSchema,
    updateStudentSchema

} = require('../schemas/student.schema')

const router = express.Router()

router.post('/students', validate(createStudentSchema), createStudent)
router.get('/students', getStudents)
router.get('/students/:id', getStudent)
router.put('/students/:id', validate(updateStudentSchema), updateStudent)
router.delete('/students/:id', deleteStudent)

module.exports = router