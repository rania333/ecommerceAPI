const express = require('express');
const { addAddress, getLoggedUserAddresses, removeAddress } = require('../controllers/addressController');

const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware')


const router = express.Router();
router.use(authenticatedUser, allowedTo('user'))

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;