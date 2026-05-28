const express = require('express')
const { createWorkout, getWorkouts, getWorkout, updateWorkout, deleteWorkout } = require('../controllers/workout.controller')
const { createWorkoutSchema, updateWorkoutSchema } = require('../schemas/workout.schema')
const validate = require('../middlewares/validation.middleware')
const authMiddleware = require('../middlewares/auth.middleware.js')

const router = express.Router()

router.post('/workouts', validate(createWorkoutSchema), createWorkout)
router.get('/workouts', authMiddleware, getWorkouts)
router.get('/workouts/:id', authMiddleware, getWorkout)
router.put('/workouts/:id', authMiddleware, validate(updateWorkoutSchema), updateWorkout)
router.delete('/workouts/:id', deleteWorkout)



module.exports = router
