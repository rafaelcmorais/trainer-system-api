const express = require('express')
const { createExercise, getExercises } = require('../controllers/exercise.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()


router.post('/exercises', authMiddleware, createExercise)
router.get('/exercises', authMiddleware, getExercises)

module.exports = router