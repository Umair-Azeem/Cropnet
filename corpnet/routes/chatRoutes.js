// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

console.log('✅ chatRoutes loaded');
router.post('/', chatController.chat);

module.exports = router;
