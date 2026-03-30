const router = require('express').Router();
const auth = require('../middleware/auth');
const aiCtrl = require('../controllers/aiCtrl');

router.post('/ai/enhance', auth, aiCtrl.enhanceCaption);
router.post('/ai/generate', auth, aiCtrl.generateCaption);

module.exports = router;
