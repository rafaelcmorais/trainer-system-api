const express = require('express')
const { healthController, healthDbController } = require('../controllers/health.controller')

const router = express.Router()

router.get('/health', healthController)
router.get('/health/db', healthDbController)

module.exports = router
