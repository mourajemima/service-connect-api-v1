function clientMiddleware(req, res, next) {
    if (req.user.role !== "CLIENT") {
        return res.status(403).json({
            message: "Acesso permitido apenas para clientes"
        });
    }
    next();
}

module.exports = clientMiddleware;