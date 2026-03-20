const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

const authMiddleware = require("../middlewares/authMiddleware");
const clientMiddleware = require("../middlewares/clientMiddleware");

router.post("/", authMiddleware, clientMiddleware, reviewController.createReview);

module.exports = router;