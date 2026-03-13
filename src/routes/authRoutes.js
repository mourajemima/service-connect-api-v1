const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// teste dos middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const clientMiddleware = require("../middlewares/clientMiddleware");
const providerMiddleware = require("../middlewares/providerMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

//para testar o funcionamento dos middlewares
router.get("/test", authMiddleware, (req, res) => {
    res.json({
        message: "Acesso permitido",
        user: req.user
    });
});
router.get("/test-client", authMiddleware, clientMiddleware, (req, res) => {
        res.json({ 
            message: "cliente autorizado" 
        });
});
router.get("/test-provider", authMiddleware, providerMiddleware, (req, res) => {
    res.json({ 
        message: "provider autorizado" 
    });
});

module.exports = router;