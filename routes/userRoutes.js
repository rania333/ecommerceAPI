const express = require('express');
const { resizeUserImage, uploadUser } = require('../middlewares/uploadImageMiddleware');
const { createUserController, getUserController, updateUserController, deactiveUserController, getUsersController } = require('../controllers/userController');
const { getUserValidator, updateUserValidator, deleteUserValidator, createUserValidator } = require('../validators/userValidator');

const router = express.Router();

router.route('/')
    .get(getUsersController)
    .post(uploadUser, resizeUserImage, createUserValidator, createUserController);
router
    .route('/:id')
    .get(getUserValidator, getUserController)
    .put(uploadUser, resizeUserImage, updateUserValidator, updateUserController)
    .delete(deleteUserValidator, deactiveUserController);

module.exports = router;