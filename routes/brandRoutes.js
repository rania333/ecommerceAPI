const express = require('express');
const { getBrandController, createBrandController, getBrandsController, updateBrandController, deleteBrandController } = require('../controllers/brandController');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../validators/brandValidator');

const router = express.Router();

router.route('/')
    .get(getBrandsController).post(createBrandValidator, createBrandController);
router
    .route('/:id')
    .get(getBrandValidator, getBrandController)
    .put(updateBrandValidator, updateBrandController)
    .delete(deleteBrandValidator, deleteBrandController);

module.exports = router;