const { sendError } = require("../utils/apiResponse");
const { ClientProfile } = require("../models");

async function clientMiddleware(req, res, next) {
    try {
        const userId = req.user.id;
        const clientProfile = await ClientProfile.findOne({
            where: { userId }
        })
        if(!clientProfile) {
            return sendError(res, 404, "Perfil de cliente não encontrado");
        }
        req.clientProfile = clientProfile;
        req.clientId = clientProfile.id;
        next();
    } catch (error) {
        return sendError(res, 500, "Erro ao validar perfil de cliente");
    }
}

module.exports = clientMiddleware;