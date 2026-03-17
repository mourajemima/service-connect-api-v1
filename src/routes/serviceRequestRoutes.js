const express = require("express");
const router = express.Router();

const serviceRequestController = require("../controllers/serviceRequestController");

const authMiddleware = require("../middlewares/authMiddleware");
const clientMiddleware = require("../middlewares/clientMiddleware");

router.post("/", authMiddleware, clientMiddleware, serviceRequestController.createRequest);

module.exports = router;