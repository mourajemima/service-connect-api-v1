const express = require("express");
const router = express.Router();

const providerController = require("../controllers/providerController");

const authMiddleware = require("../middlewares/authMiddleware");
const providerMiddleware = require("../middlewares/providerMiddleware");

router.get(
    "/my-requests", 
    authMiddleware, 
    providerMiddleware, 
    providerController.getMyRequests
);

router.post(
    "/:requestId/accept",
    authMiddleware,
    providerMiddleware,
    providerController.acceptRequest
);

router.post(
    "/:requestId/reject",
    authMiddleware,
    providerMiddleware,
    providerController.rejectRequest
);

module.exports = router;