const { z, object } = require('zod')

const createWorkoutSchema = z.object({
    name: z.string().min(1, 'name is required'),
    description: z.string().optional(),
    student_id: z.number().int().positive('student_id must be positive')

})

const updateWorkoutSchema = z.object({
    name: z.string().min(1, 'name is required').optional(),
    description: z.string().optional(),

})

module.exports = {
    createWorkoutSchema,
    updateWorkoutSchema
}