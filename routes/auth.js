const express = require("express");

const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/signup", authController.signup, authMiddleware.generateAuthToken);

router.post("/login", authController.login, authMiddleware.generateAuthToken);

router.post("logout", authMiddleware.isAuthenticated, authController.logout);

router.post("/refresh", authController.refreshAccessToken);

module.exports = router;
