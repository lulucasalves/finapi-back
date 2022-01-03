const express = require('express')
const router = express.Router()
const UsersController = require('./controllers/UsersController')
const ExtractController = require('./controllers/ExtractController')
const { authenticate } = require('./middleware')

router.post('/', UsersController.signup)
router.get('/user/:idusers', authenticate, UsersController.user)
router.post('/update/:idusers', authenticate, UsersController.update)
router.delete('/delete/:idusers', authenticate, UsersController.delete)
router.get('/balance/:idusers', authenticate, UsersController.balance)
router.post('/login', UsersController.login)

router.post('/deposit', authenticate, ExtractController.deposit)
router.post('/withdraw', authenticate, ExtractController.withdraw)
router.get('/extract', authenticate, ExtractController.extract)
router.post('/extractByDate', authenticate, ExtractController.extractByDate)

module.exports = router
