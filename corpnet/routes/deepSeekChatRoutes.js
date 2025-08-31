const express = require('express');
const router = express.Router();
const chatController = require('../controllers/deepSeekChatController');

console.log('✅ deepSeekChatRoutes loaded');
router.post('/', chatController.chat);

module.exports = router;
