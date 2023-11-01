const express = require('express');

const { createCategory, fetchCategory } = require('../controllers/Category');

const router = express.Router();

router.get("/", fetchCategory);
router.post("/", createCategory);

module.exports = router;