const express = require('express');
const { 
    createProduct,
    fetchAllProducts
} = require('../controllers/Product');

const router = express.Router();

router.post('/create', createProduct);
router.get('/all', fetchAllProducts);

module.exports = router;