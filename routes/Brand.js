const express = require('express');

const { fetchBrands, createBrands } = require('../controllers/Brand');

const router = express.Router();

router.get("/", fetchBrands);
router.post("/create", createBrands);

module.exports = router;