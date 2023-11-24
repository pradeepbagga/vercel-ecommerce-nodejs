const express = require('express');
const { createUser, login, emailVerify, profile, protect, logout } = require('../controllers/User');

const router = express.Router();

router.post("/signup",createUser);
router.post("/login",login);
router.post("/verify/:token",emailVerify);
router.get("/profile",protect,profile);
router.get("/logout",logout);

module.exports = router;