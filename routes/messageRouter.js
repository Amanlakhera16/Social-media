const router = require('express').Router()
const messageCtrl = require('../controllers/messageCtrl')
const auth = require('../middleware/auth')

router.post('/message', auth, messageCtrl.createMessage)

router.get('/conversations', auth, messageCtrl.getConversations)

router.get('/message/:id', auth, messageCtrl.getMessages)

router.post('/delete_message', auth, messageCtrl.deleteMessages)

router.post('/delete_conversation', auth, messageCtrl.deleteConversation)

module.exports = router
