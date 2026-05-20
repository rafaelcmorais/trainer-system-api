const express = require('express')
const errorHandler = require('./middlewares/error.middleware')

const app = express()

const healthRoutes = require('./routes/health.routes')
const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const exerciseRoutes = require('./routes/exercise.routes')
const workoutRoutes = require('./routes/workout.routes')
const studentRoutes = require('./routes/student.routes')

app.use(express.json())

app.use(healthRoutes)

app.use(userRoutes)

app.use(authRoutes)

app.use(exerciseRoutes)

app.use(workoutRoutes)

app.use(studentRoutes)





app.use(errorHandler)

module.exports = app 