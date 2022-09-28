const express = require('express');
const { getBrandController, createBrandController, getBrandsController, updateBrandController, deleteBrandController } = require('../controllers/brandController');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../validators/brandValidator');
const { uploadBrand, resizeBrandImage } = require('../middlewares/uploadImageMiddleware')
const { authenticatedUser, allowedTo } = require('../middlewares/authMiddleware')

const router = express.Router();

router.route('/')
    .get(getBrandsController)
    .post(authenticatedUser, allowedTo('admin', 'manager'), uploadBrand, resizeBrandImage, createBrandValidator, createBrandController);
router
    .route('/:id')
    .get(getBrandValidator, getBrandController)
    .put(authenticatedUser, allowedTo('admin', 'manager'), uploadBrand, resizeBrandImage, updateBrandValidator, updateBrandController)
    .delete(authenticatedUser, allowedTo('admin'), deleteBrandValidator, deleteBrandController);

module.exports = router;