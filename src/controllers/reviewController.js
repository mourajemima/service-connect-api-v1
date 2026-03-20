const { Review, ServiceExecution, ProviderProfile, sequelize } = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");

exports.createReview = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { executionId, rating, comment } = req.body;
        const clientId = req.clientId;
        const execution = await ServiceExecution.findByPk(executionId, {
            include: {
                association: "request"
            },
            transaction
        });
        if (execution.request.clientId !== clientId) {
            await transaction.rollback();
            return sendError(res, 403, "Apenas clientes autorizados podem avaliar");
        }
        if (!execution) {
            await transaction.rollback();
            return sendError(res, 404, "Execução não encontrada");
        }
        if (execution.status !== "FINISHED") {
            await transaction.rollback();
            return sendError(res, 400, "Só é possível avaliar serviços finalizados");
        }
        const existingReview = await Review.findOne({
            where: { executionId },
            transaction
        });
        if (existingReview) {
            await transaction.rollback();
            return sendError(res, 400, "Este serviço já foi avaliado");
        }
        const review = await Review.create({
            executionId,
            clientId,
            providerId: execution.providerId,
            rating,
            comment
        }, { transaction });
        const provider = await ProviderProfile.findByPk(execution.providerId, {
            transaction
        });
        if (!provider) {
            await transaction.rollback();
            return sendError(res, 404, "Prestador não encontrado");
        }
        const oldTotal = provider.totalReviews;
        const oldAverage = provider.averageRating;
        const newTotal = oldTotal + 1;
        const newAverage = ((oldAverage * oldTotal) + rating) / newTotal;
        await provider.update({
            totalReviews: newTotal,
            averageRating: newAverage
        }, { transaction });
        await transaction.commit();
        return sendSuccess(res, 201, "Avaliação criada com sucesso", review);
    } catch (error) {
        await transaction.rollback();
        return sendError(res, 500, "Erro ao criar avaliação", error.message);
    }
};