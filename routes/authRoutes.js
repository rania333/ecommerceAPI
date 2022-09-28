const express = require('express');
const { signupController, loginController } = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../validators/authValidator');

const router = express.Router();


router.post('/signup', signupValidator, signupController);
router.post('/login', loginValidator, loginController);

module.exports = router;