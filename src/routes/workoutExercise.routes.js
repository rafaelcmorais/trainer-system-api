const express = require('express')
const { addExerciseToWorkout, getExercisesByWorkoutId } = require('../controllers/workoutExercise.controller')
const validate = require('../middlewares/validation.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const { addExerciseToWorkoutSchema } = require('../schemas/workoutExercise.schema')




const router = express.Router()

router.post('/workout-exercises', authMiddleware, validate(addExerciseToWorkoutSchema), addExerciseToWorkout)

router.get('/workouts/:id/exercises', authMiddleware, getExercisesByWorkoutId)



module.exports = router