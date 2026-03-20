const {
    RequestRecipient,
    ServiceRequest,
    ServiceExecution,
    sequelize
} = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");

exports.acceptRequest = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const providerId = req.providerId;
        const { requestId } = req.params;
        const request = await ServiceRequest.findByPk(requestId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!request) {
            await transaction.rollback();
            return sendError(res, 404, "Solicitação não encontrada");
        }
        if (request.status === "ACCEPTED") {
            await transaction.rollback();
            return sendError(res, 400, "Solicitação já foi aceita");
        }
        const recipient = await RequestRecipient.findOne({
            where: { requestId, providerId },
            transaction
        });
        if (!recipient) {
            await transaction.rollback();
            return sendError(res, 403, "Sem permissão para aceitar");
        }
        const execution = await ServiceExecution.create({
            requestId,
            providerId,
            status: "ACCEPTED"
        }, { transaction });
        await request.update({
            status: "IN_PROGRESS"
        }, { transaction });
        await RequestRecipient.update(
            { status: "REJECTED" },
            { where: { requestId }, transaction }
        );
        await RequestRecipient.update(
            { status: "ACCEPTED" },
            { where: { requestId, providerId }, transaction }
        );
        await transaction.commit();
        return sendSuccess(res, 200, "Solicitação aceita", execution);
    } catch (error) {
        await transaction.rollback();
        if (error.name === "SequelizeUniqueConstraintError") {
            return sendError(res, 400, "Solicitação já foi aceita");
        }
        return sendError(res, 500, "Erro ao aceitar solicitação", error.message);
    }
};

exports.rejectRequest = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const providerId = req.providerId;
        const { requestId } = req.params;
        const request = await ServiceRequest.findByPk(requestId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!request) {
            await transaction.rollback();
            return sendError(res, 404, "Solicitação não encontrada");
        }
        if (request.status === "IN_PROGRESS") {
            await transaction.rollback();
            return sendError(res, 400, "Solicitação já está em andamento");
        }
        const recipient = await RequestRecipient.findOne({
            where: { requestId, providerId },
            transaction
        });
        if (!recipient) {
            await transaction.rollback();
            return sendError(res, 403, "Sem permissão para rejeitar");
        }
        if (recipient.status === "REJECTED") {
            await transaction.rollback();
            return sendError(res, 400, "Solicitação já foi rejeitada");
        }
        await recipient.update(
            { status: "REJECTED" },
            { transaction }
        );
        const pendingRecipients = await RequestRecipient.count({
            where: {
                requestId,
                status: "PENDING"
            },
            transaction
        });
        if (pendingRecipients === 0) {
            await request.update(
                { status: "CANCELLED" },
                { transaction }
            );
        }
        await transaction.commit();
        return sendSuccess(res, 200, "Solicitação rejeitada");
    } catch (error) {
        await transaction.rollback();
        return sendError(res, 500, "Erro ao rejeitar solicitação", error.message);
    }
};