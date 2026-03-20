const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");

const authMiddleware = require("../middlewares/authMiddleware");
const clientMiddleware = require("../middlewares/clientMiddleware");

router.get("/history", authMiddleware, clientMiddleware, clientController.getHistory);

router.get("/profile", authMiddleware, clientMiddleware, clientController.getProfile);


module.exports = router;