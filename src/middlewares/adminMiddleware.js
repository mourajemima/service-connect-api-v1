const { User } = require("../models");
const { sendError } = require("../utils/apiResponse");

async function adminMiddleware(req, res, next) {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user || user.role !== "ADMIN") {
            return sendError(res, 403, "Acesso permitido apenas para administradores");
        }
        req.admin = user;
        next();
    } catch (error) {
        return sendError(res, 500, "Erro ao validar administrador");
    }
}

module.exports = adminMiddleware;