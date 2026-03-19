const express = require("express");
const router = express.Router();

const requestRecipientController = require("../controllers/requestRecipientController");

const authMiddleware = require("../middlewares/authMiddleware");
const providerMiddleware = require("../middlewares/providerMiddleware");

router.post(
    "/:requestId/accept",
    authMiddleware,
    providerMiddleware,
    requestRecipientController.acceptRequest
);

router.post(
    "/:requestId/reject",
    authMiddleware,
    providerMiddleware,
    requestRecipientController.rejectRequest
);

module.exports = router;