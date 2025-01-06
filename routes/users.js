const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const { isAuthenticated } = require("../middleware/auth");

router.get("/:id", isAuthenticated, userController.getUserById);

module.exports = router;
