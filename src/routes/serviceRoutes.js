const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/serviceController");

const authMiddleware = require("../middlewares/authMiddleware");
const providerMiddleware = require("../middlewares/providerMiddleware");

router.get("/", serviceController.getAllServices);

router.get("/:id", serviceController.getServiceById);

router.post(
    "/",
    authMiddleware,
    providerMiddleware,
    serviceController.createService
);

router.put(
    "/:id",
    authMiddleware,
    providerMiddleware,
    serviceController.updateService
);

router.delete(
    "/:id",
    authMiddleware,
    providerMiddleware,
    serviceController.deleteService
);

module.exports = router;