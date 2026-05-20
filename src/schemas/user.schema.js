const { z } = require('zod')

const createUserSchema = z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("invalid email"),
    password: z.string().min(6)
})

const updateUserSchema = z.object({
    name: z.string().min(1, "name is required").optional(),
    email: z.string().email("invalid email").optional(),
    password: z.string().min(6).optional()
})

module.exports = {
    createUserSchema,
    updateUserSchema
}