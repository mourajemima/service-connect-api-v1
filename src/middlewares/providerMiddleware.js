const { sendError } = require("../utils/apiResponse");
const { ProviderProfile } = require("../models");

async function providerMiddleware(req, res, next) {
    try {
        const userId = req.user.id;
        const providerProfile = await ProviderProfile.findOne({
            where: { userId }
        });
        if (!providerProfile) {
            return sendError(res, 404, "Perfil de prestador não encontrado");
        }
        req.providerProfile = providerProfile;
        req.providerId = providerProfile.id;
        next();
    } catch (error) {
        return sendError(res, 500, "Erro ao validar perfil de prestador");
    }
}

module.exports = providerMiddleware;