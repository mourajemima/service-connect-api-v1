const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    adminController.getAllUsers
)

router.patch(
    "/users/:id/ban",
    authMiddleware,
    adminMiddleware,
    adminController.banUser
)

module.exports = router;