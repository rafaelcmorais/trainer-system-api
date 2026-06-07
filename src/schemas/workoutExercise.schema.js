const { z } = require('zod')

const addExerciseToWorkoutSchema = z.object({
    workout_id: z.number().int().positive('workout_id must be positive'),
    exercise_id: z.number().int().positive('exercise_id must be positive'),
    sets: z.number().int().positive('sets must be positive').optional(),
    reps: z.number().int().positive('reps must be positive').optional(),
    load_kg: z.number().min(0).optional(),
    rest_time: z.number().int().nonnegative('rest_time must be zero or positive').optional(),
    notes: z.string().optional(),
    exercise_order: z.number().int().positive('exercise_order must be positive').optional()
}).strict()

const updateWorkoutExerciseSchema = z.object({

    sets: z.number().int().positive('sets must be positive').optional(),
    reps: z.number().int().positive('reps must be positive').optional(),
    load_kg: z.number().min(0).optional(),
    rest_time: z.number().int().nonnegative('rest_time must be positive').optional(),
    notes: z.string().optional(),
    exercise_order: z.number().int().positive('exercise_order must be positive').optional()
})
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided'
    })


module.exports = {
    addExerciseToWorkoutSchema,
    updateWorkoutExerciseSchema
}