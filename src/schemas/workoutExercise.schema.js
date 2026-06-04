const { z } = require('zod')

const addExerciseToWorkoutSchema = z.object({
    workout_id: z.number().int().positive('workout_id must be positive'),
    exercise_id: z.number().int().positive('exercise_id must be positive'),
    sets: z.number().int().positive('sets must be positive').optional(),
    reps: z.number().int().positive('reps must be positive').optional(),
    rest_time: z.number().int().positive('rest_time must be positive').optional(),
    notes: z.string().optional(),
    exercise_order: z.number().int().positive().optional()

})

module.exports = {
    addExerciseToWorkoutSchema
}