const express = require('express');
const { getBrandController, createBrandController, getBrandsController, updateBrandController, deleteBrandController } = require('../controllers/brandController');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../validators/brandValidator');
const { uploadBrand, resizeBrandImage } = require('../middlewares/uploadImageMiddleware')

const router = express.Router();

router.route('/')
    .get(getBrandsController)
    .post(uploadBrand, resizeBrandImage, createBrandValidator, createBrandController);
router
    .route('/:id')
    .get(getBrandValidator, getBrandController)
    .put(uploadBrand, resizeBrandImage, updateBrandValidator, updateBrandController)
    .delete(deleteBrandValidator, deleteBrandController);

module.exports = router;