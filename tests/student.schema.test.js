const { createStudentSchema, updateStudentSchema } = require('../src/schemas/student.schema')

test('createStudentSchema should accept valid data', () => {
    const result = createStudentSchema.safeParse({
        name: 'Aluno Teste',
        email: 'aluno@teste.com',
        phone: '21999999999',
        height: 1.75,
        weight_kg: 80.5,
        sex: 'male'
    })

    expect(result.success).toBe(true)
})

test('createStudentSchema should reject invalid sex', () => {
    const result = createStudentSchema.safeParse({
        name: 'Aluno Teste',
        sex: 'invalid'
    })

    expect(result.success).toBe(false)
})

test('updateStudentSchema should reject empty body', () => {
    const result = updateStudentSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('At least one field must be provided')
})

test('updateStudentSchema should reject unknown fields', () => {
    const result = updateStudentSchema.safeParse({
        is_active: false
    })

    expect(result.success).toBe(false)
})

test('updateStudentSchema should reject negative weight_kg', () => {
    const result = updateStudentSchema.safeParse({
        weight_kg: -1
    })
    expect(result.success).toBe(false)
})

test('updateStudentSchema should reject negative height', () => {
    const result = updateStudentSchema.safeParse({
        height: -1
    })
    expect(result.success).toBe(false)
})
describe('student schema', () => {})
