const { z } = require('zod')

const createStudentSchema = z
    .object({
        name: z.string().min(1, 'name is required'),
        email: z.string().email('invalid email').optional(),
        phone: z.string().optional(),
        height: z.number().positive('height must be positive').optional(),
        weight_kg: z.number().positive('weight_kg must be positive').optional(),
        sex: z.enum(['male', 'female', 'other', 'not_informed']).optional()
    })
    .strict()

const updateStudentSchema = z
    .object({
        name: z.string().min(1, 'name is required').optional(),
        email: z.string().email('invalid email').optional(),
        phone: z.string().optional(),
        height: z.number().positive('height must be positive').optional(),
        weight_kg: z.number().positive('weight_kg must be positive').optional(),
        sex: z.enum(['male', 'female', 'other', 'not_informed']).optional()
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided'
    })

module.exports = {
    createStudentSchema,
    updateStudentSchema
}
