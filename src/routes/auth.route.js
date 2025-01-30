const express = require('express')
const { signup, login, logout, authenticate} = require('../controllers/authController')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.get('/authenticate', authenticate)



module.exports = router;