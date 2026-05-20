const express = require('express')
const { createUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller.js')
const validate = require('../middlewares/validation.middleware')
const { createUserSchema, updateUserSchema } = require('../schemas/user.schema')
const authMiddleware = require('../middlewares/auth.middleware.js')

const router = express.Router()

router.post('/users', validate(createUserSchema), createUser)
router.get('/users', authMiddleware, getUsers)
router.get('/users/:id', authMiddleware, getUser)
router.put('/users/:id', validate(updateUserSchema), updateUser)
router.delete('/users/:id', deleteUser)

module.exports = router