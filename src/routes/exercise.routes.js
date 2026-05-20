const express = require('express')
const { createExercise, getExercises } = require('../controllers/exercise.controller')
const router = express.Router()


router.post('/exercises', createExercise)
router.get('/exercises', getExercises)

module.exports = router