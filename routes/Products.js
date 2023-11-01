const express = require('express');
const { 
    createProduct,
    fetchAllProducts,
    fetchProductById,
    updateProduct
} = require('../controllers/Product');
const { protect } = require("../controllers/User")

const router = express.Router();

router.post('/', createProduct)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductById)
      .patch('/:id', updateProduct);

module.exports = router;