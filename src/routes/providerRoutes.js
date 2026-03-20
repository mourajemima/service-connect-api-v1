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

router.get(
    "/history", 
    authMiddleware, 
    providerMiddleware, 
    providerController.getHistory
);

router.get(
    "/profile", 
    authMiddleware, 
    providerMiddleware, 
    providerController.getProfile
);

router.patch(
    "/profile", 
    authMiddleware, 
    providerMiddleware, 
    providerController.updateProfile
);

router.get(
    "/:providerId/reviews", 
    providerController.getProviderReviews
);


module.exports = router;