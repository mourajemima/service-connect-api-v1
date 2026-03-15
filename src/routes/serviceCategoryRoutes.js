const express = require("express");
const router = express.Router();

const serviceCategoryController = require("../controllers/serviceCategoryController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", serviceCategoryController.getAllCategories);

router.get("/:id", serviceCategoryController.getCategoryById);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    serviceCategoryController.createCategory
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    serviceCategoryController.updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    serviceCategoryController.deleteCategory
);

module.exports = router;