const { z } = require('zod')

const createStudentSchema = z.object({
    name: z.string().min(1, 'name is required'),
    email: z.string().email('invalid email').optional(),
    phone: z.string().optional(),
    height: z.number().positive('height must be positive').optional()
})

const updateStudentSchema = z.object({
    name: z.string().min(1, 'name is required').optional(),
    email: z.string().email('invalid email').optional(),
    phone: z.string().optional(),
    height: z.number().positive('height must be positive').optional()
})

module.exports = {
    createStudentSchema,
    updateStudentSchema
}