const express = require('express');
const { singup, login, updateProfile, checkAuth } = require('../controllers/userController');
const protectRoute = require('../middleware/auth');
const upload = require('../middleware/multer');
const router = express.Router();

router.post('/signup', singup);
router.post('/login', login);
router.put('/update-profile', protectRoute, upload.single('image'), updateProfile);
router.get('/check', protectRoute, checkAuth);

module.exports = router
