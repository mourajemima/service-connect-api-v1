const { ServiceRequest, RequestRecipient, Service, sequelize } = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { findProvidersByCategory } = require("../services/requestService");

exports.createRequest = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { description, serviceId, categoryId, type } = req.body;
        const clientId = req.clientId;
        if (!description || !type) {
            await transaction.rollback();
            return sendError(res, 400, "Descrição e tipo são obrigatórios");
        }
        if (type === "DIRECT" && !serviceId) {
            await transaction.rollback();
            return sendError(res, 400, "serviceId é obrigatório para DIRECT");
        }
        if (type === "BROADCAST" && !categoryId) {
            await transaction.rollback();
            return sendError(res, 400, "categoryId é obrigatório para BROADCAST");
        }
        const request = await ServiceRequest.create({
            description,
            clientId,
            serviceId,
            categoryId,
            type
        }, { transaction });
        let recipients = [];
        if (type === "DIRECT") {
            const service = await Service.findByPk(serviceId);
            recipients.push({
                requestId: request.id,
                providerId: service.providerId
            });
        }
        if (type === "BROADCAST") {
            const providerIds = await findProvidersByCategory(categoryId);
            recipients = providerIds.map(providerId => ({
                requestId: request.id,
                providerId
            }));
        }
        if (recipients.length > 0) {
            await RequestRecipient.bulkCreate(recipients, { transaction });
        }
        await transaction.commit();
        return sendSuccess(
            res,
            201,
            "Solicitação criada com sucesso",
            request
        );
    } catch (error) {
        await transaction.rollback();
        return sendError(
            res,
            500,
            "Erro ao criar solicitação",
            error.message
        );
    }
};