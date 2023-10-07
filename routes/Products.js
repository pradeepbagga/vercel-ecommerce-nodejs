const express = require('express');
const { 
    createProduct,
    fetchAllProducts,
    fetchProductById
} = require('../controllers/Product');

const router = express.Router();

router.post('/create', createProduct);
router.get('/all', fetchAllProducts);
router.get('/:id', fetchProductById);

module.exports = router;