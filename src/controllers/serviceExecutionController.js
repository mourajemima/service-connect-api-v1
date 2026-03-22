const {
    ServiceExecution,
    ServiceRequest,
    sequelize
} = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");

exports.scheduleExecution = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const providerId = req.providerId;
        const { executionId } = req.params;
        const { scheduledAt } = req.body;
        if (!scheduledAt) {
            await transaction.rollback();
            return sendError(res, 400, "Data de agendamento é obrigatória");
        }
        const date = new Date(scheduledAt);
        if (isNaN(date.getTime())) {
            await transaction.rollback();
            return sendError(res, 400, "Data inválida");
        }
        const execution = await ServiceExecution.findByPk(executionId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!execution) {
            await transaction.rollback();
            return sendError(res, 404, "Execução não encontrada");
        }
        if (execution.providerId !== providerId) {
            await transaction.rollback();
            return sendError(res, 403, "Sem permissão para fazer agendamento");
        }
        if (["SCHEDULED", "FINISHED", "CANCELLED"].includes(execution.status)) {
            await transaction.rollback();
            return sendError(res, 400, "Execução não pode ser agendada");
        }
        await execution.update({
            status: "SCHEDULED",
            scheduledAt: date
        }, { transaction });
        await transaction.commit();
        return sendSuccess(res, 200, "Execução agendada", execution);
    } catch (error) {
        await transaction.rollback();
        return sendError(res, 500, "Erro ao agendar execução", error.message);
    }
};

exports.finishExecution = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const providerId = req.providerId;
        const { executionId } = req.params;
        const execution = await ServiceExecution.findByPk(executionId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!execution) {
            await transaction.rollback();
            return sendError(res, 404, "Execução não encontrada");
        }
        if (execution.providerId !== providerId) {
            await transaction.rollback();
            return sendError(res, 403, "Sem permissão paara finalizar");
        }
        if (execution.status !== "SCHEDULED") {
            await transaction.rollback();
            return sendError(res, 400, "Execução precisa estar agendada para finalizar");
        }
        await execution.update({
            status: "FINISHED",
            finishedAt: new Date()
        }, { transaction });
        await ServiceRequest.update(
            { status: "COMPLETED" },
            { where: { id: execution.requestId }, transaction }
        );
        await transaction.commit();
        return sendSuccess(res, 200, "Serviço finalizado com sucesso", execution);
    } catch (error) {
        await transaction.rollback();
        return sendError(res, 500, "Erro ao finalizar execução", error.message);
    }
};

exports.cancelExecution = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const providerId = req.providerId;
        const { executionId } = req.params;
        const execution = await ServiceExecution.findByPk(executionId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!execution) {
            await transaction.rollback();
            return sendError(res, 404, "Execução não encontrada");
        }
        if (execution.providerId !== providerId) {
            await transaction.rollback();
            return sendError(res, 403, "Sem permissão");
        }
        if (execution.status !== "ACCEPTED") {
            await transaction.rollback();
            return sendError(
                res,
                400,
                "A execução só pode ser cancelada enquanto estiver com o status ACEITA"
            );
        }
        await execution.update({
            status: "CANCELLED"
        }, { transaction });
        await ServiceRequest.update(
            { status: "CANCELLED" },
            { where: { id: execution.requestId }, transaction }
        );
        await transaction.commit();
        return sendSuccess(res, 200, "Serviço cancelado com sucesso", execution);
    } catch (error) {
        await transaction.rollback();
        return sendError(res, 500, "Erro ao cancelar execução", error.message);
    }
};