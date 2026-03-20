const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { sendError } = require("../utils/apiResponse");

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return sendError(res, 401, "Token não fornecido");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return sendError(res, 401, "Token inválido");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user || user.isBanned) {
            return sendError(res, 403, "Acesso não autorizado");
        }
        req.user = {
            id: user.id,
            role: user.role
        };
        next();
    } catch (error) {
        return sendError(res, 401, "Token inválido ou expirado");
    }
}

module.exports = authMiddleware;