const express = require('express')
const {
    createExercise,
    getExercises,
    getExercise,
    updateExercise,
    deleteExercise
} = require('../controllers/exercise.controller')

const authMiddleware = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validation.middleware')


const { createExerciseSchema, updateExerciseSchema } = require('../schemas/exercise.schema')
const router = express.Router()


router.post('/exercises', authMiddleware, validate(createExerciseSchema), createExercise)
router.get('/exercises', authMiddleware, getExercises)
router.get('/exercises/:id', authMiddleware, getExercise)
router.put('/exercises/:id', authMiddleware, validate(updateExerciseSchema), updateExercise)
router.delete('/exercises/:id', authMiddleware, deleteExercise)

module.exports = router