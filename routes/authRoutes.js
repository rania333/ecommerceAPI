const express = require('express');
const { signupController } = require('../controllers/authController');
const { signupValidator } = require('../validators/authValidator');

const router = express.Router();


router.post('/signup', signupValidator, signupController);

module.exports = router;