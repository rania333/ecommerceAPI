const express = require('express');
const { resizeUserImage, uploadUser } = require('../middlewares/uploadImageMiddleware');
const { createUserController, getUserController, updateUserController, deactiveUserController, getUsersController, updatePasswordController, getLoggedUserController, updateLoggedUserPasswordController, updateLoggedUserDataController, deleteLoggedUserDataController } = require('../controllers/userController');
const { getUserValidator, updateUserValidator, deleteUserValidator, createUserValidator, updateLoggedUserValidator } = require('../validators/userValidator');
const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticatedUser)
router.get('/me', getLoggedUserController, getUserController)
router.put('/updatemypass', updateLoggedUserPasswordController);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserDataController);
router.delete('/deleteme', deleteLoggedUserDataController, deactiveUserController)

router.use(allowedTo('admin', 'manager'))

router.put('/updatepass/:id', updatePasswordController)
router.route('/')
    .get(getUsersController)
    .post(uploadUser, resizeUserImage, createUserValidator, createUserController);
router
    .route('/:id')
    .get(getUserValidator, getUserController)
    .put(uploadUser, resizeUserImage, updateUserValidator, updateUserController)
    .delete(deleteUserValidator, deactiveUserController);

module.exports = router;