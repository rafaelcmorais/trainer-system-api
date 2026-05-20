const express = require('express')
const { createWorkout, getWorkouts } = require('../controllers/workout.controller')
const router = express.Router()

router.post('/workouts', createWorkout)
router.get('/workouts', getWorkouts)

module.exports = router
