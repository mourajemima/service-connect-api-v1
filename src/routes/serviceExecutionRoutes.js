const express = require("express");
const router = express.Router();

const serviceExecutionController = require("../controllers/serviceExecutionController");

const authMiddleware = require("../middlewares/authMiddleware");
const providerMiddleware = require("../middlewares/providerMiddleware");

router.patch(
    "/:executionId/schedule", 
    authMiddleware, 
    providerMiddleware, 
    serviceExecutionController.scheduleExecution
);

router.patch(
    "/:executionId/finish", 
    authMiddleware, 
    providerMiddleware, 
    serviceExecutionController.finishExecution
);

router.patch(
    "/:executionId/cancel", 
    authMiddleware, 
    providerMiddleware, 
    serviceExecutionController.cancelExecution
);

module.exports = router;

