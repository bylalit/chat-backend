const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, index } = require('../controllers/messageController');


router.get('/', index);

// Get chat messages
router.get('/:senderId/:receiverId', getMessages);

// Send message
router.post('/', sendMessage);

module.exports = router;
