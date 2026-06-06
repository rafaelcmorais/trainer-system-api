const express = require('express')
const { addExerciseToWorkout, getExercisesByWorkoutId, deleteWorkoutExercise, updateWorkoutExercise } = require('../controllers/workoutExercise.controller')
const validate = require('../middlewares/validation.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const { addExerciseToWorkoutSchema, updateWorkoutExerciseSchema } = require('../schemas/workoutExercise.schema')




const router = express.Router()

router.post('/workout-exercises', authMiddleware, validate(addExerciseToWorkoutSchema), addExerciseToWorkout)

router.get('/workouts/:id/exercises', authMiddleware, getExercisesByWorkoutId)

router.delete('/workout-exercises/:id', authMiddleware, deleteWorkoutExercise)

router.put('/workout-exercises/:id', authMiddleware, validate(updateWorkoutExerciseSchema), updateWorkoutExercise)



module.exports = router