const {
    addExerciseToWorkoutSchema,
    updateWorkoutExerciseSchema
} = require('../src/schemas/workoutExercise.schema')

describe('workout exercise schemas should accept valid data', () => {
    test('addExerciseToWorkoutSchema', () => {
        const result = addExerciseToWorkoutSchema.safeParse({
            workout_id: 1,
            exercise_id: 2,
            sets: 3,
            reps: 12,
            load_kg: 45,
            rest_time: 60,
            notes: 'carga moderada',
            exercise_order: 1
        })

        expect(result.success).toBe(true)
    })

    test('updateWorkoutExerciseSchema should reject zero sets', () => {
        const result = updateWorkoutExerciseSchema.safeParse({
            sets: 0
        })

        expect(result.success).toBe(false)
    })

    test('updateWorkoutExerciseSchema should reject zero reps', () => {
        const result = updateWorkoutExerciseSchema.safeParse({
            reps: 0
        })

        expect(result.success).toBe(false)
    })

    test('updateWorkoutExerciseSchema should accept zero load_kg', () => {
        const result = updateWorkoutExerciseSchema.safeParse({
            load_kg: 0
        })
        expect(result.success).toBe(true)
    })

    test('updateWorkoutExerciseSchema should reject negative load_kg', () => {
        const result = updateWorkoutExerciseSchema.safeParse({
            load_kg: -1
        })
        expect(result.success).toBe(false)
    })

    test('updateWorkoutExerciseSchema should reject negative rest_time', () => {
        const result = updateWorkoutExerciseSchema.safeParse({
            rest_time: -1
        })
        expect(result.success).toBe(false)
    })

    test('updateWorkoutExerciseSchema should reject zero exercise_order', () => {
        const result = updateWorkoutExerciseSchema.safeParse({
            exercise_order: 0
        })

        expect(result.success).toBe(false)
    })

    test('updateWorkoutExerciseSchema should reject empty body', () => {
        const result = updateWorkoutExerciseSchema.safeParse({})

        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toBe('At least one field must be provided')
    })
})
