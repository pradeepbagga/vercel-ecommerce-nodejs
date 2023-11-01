const express = require('express');

const { fetchBrands, createBrands } = require('../controllers/Brand');

const router = express.Router();

router.get("/", fetchBrands);
router.post("/", createBrands);

module.exports = router;