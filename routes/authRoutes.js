const express = require('express');
const { signupController, loginController, forgetPasswordController, verifyResetCodeController, resetPasswordController } = require('../controllers/authController');
const { signupValidator, loginValidator, forgetPassValidator, verifyResetCodeValidator, resetPasswordValidator } = require('../validators/authValidator');

const router = express.Router();


router.post('/signup', signupValidator, signupController);
router.post('/login', loginValidator, loginController);
router.post('/forgetpass', forgetPassValidator, forgetPasswordController)
router.post('/verifycode', verifyResetCodeValidator, verifyResetCodeController)
router.put('/resetpass', resetPasswordValidator, resetPasswordController)

module.exports = router;