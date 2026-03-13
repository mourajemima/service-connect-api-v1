function providerMiddleware(req, res, next) {
    if (req.user.role !== "PROVIDER") {
        return res.status(403).json({
            message: "Acesso permitido apenas para prestadores"
        });
    }
    next();
}

module.exports = providerMiddleware;