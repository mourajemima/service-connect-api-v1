const {
    ServiceRequest,
    Service,
    ServiceCategory,
    ProviderProfile,
    ServiceExecution,
    ClientProfile,
    User
} = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { getPagination, getPagingData } = require("../utils/pagination");

exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const clientProfile = await ClientProfile.findOne({
            where: { userId }
        });
        if (!clientProfile) {
            return sendError(res, 404, "Perfil de cliente não encontrado");
        }
        const clientId = clientProfile.id;
        const { page, limit, offset } = getPagination(
            req.query.page,
            req.query.limit
        );
        const data = await ServiceRequest.findAndCountAll({
            where: { clientId },
            include: [
                {
                    model: ServiceExecution,
                    as: "execution",
                    include: [
                        {
                            model: ProviderProfile,
                            as: "provider",
                            include: [
                                {
                                    model: User,
                                    attributes: ["id", "name", "email"]
                                }
                            ]
                        }
                    ]
                },
                { model: Service, as: "service" },
                { model: ServiceCategory, as: "category" }
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });
        const response = getPagingData(data, page, limit);
        return sendSuccess(res, 200, "Histórico do cliente", response);
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar histórico", error.message);
    }
};