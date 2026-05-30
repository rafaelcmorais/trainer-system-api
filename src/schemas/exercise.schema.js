const { z } = require('zod')

const createExerciseSchema = z.object({
    name: z.string().trim().min(1, 'name is required'),
    muscle_group: z.string().optional(),
    equipment: z.string().optional()
})
const updateExerciseSchema = z.object({
    name: z.string().optional(),
    muscle_group: z.string().optional(),
    equipment: z.string().optional()
})


module.exports = {
    createExerciseSchema,
    updateExerciseSchema
}