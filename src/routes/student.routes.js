const express = require('express')
const {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/student.controller')
const authMiddleware = require('../middlewares/auth.middleware')


const validate = require('../middlewares/validation.middleware')
const {
    createStudentSchema,
    updateStudentSchema

} = require('../schemas/student.schema')

const router = express.Router()

router.post('/students', validate(createStudentSchema), authMiddleware, createStudent)
router.get('/students', authMiddleware, getStudents)
router.get('/students/:id', authMiddleware, getStudent)
router.put('/students/:id', validate(updateStudentSchema), authMiddleware, updateStudent)
router.delete('/students/:id', authMiddleware, deleteStudent)

module.exports = router