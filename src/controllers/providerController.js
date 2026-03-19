const {
    RequestRecipient,
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

exports.getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const providerProfile = await ProviderProfile.findOne({
            where: { userId }
        });
        if (!providerProfile) {
            return sendError(res, 404, "Perfil de prestador não encontrado");
        }
        const providerId = providerProfile.id;
        const recipients = await RequestRecipient.findAll({
            where: { providerId, status: "PENDING" },
            include: [
                {
                    model: ServiceRequest,
                    as: "request",
                    include: [
                        { model: Service, as: "service" },
                        { model: ServiceCategory, as: "category" }
                    ]
                }
            ],
            order: [
                [{ model: ServiceRequest, as: "request" }, "createdAt", "DESC"]
            ]
        });
        const direct = recipients
            .filter(r => r.request?.type === "DIRECT")
            .map(r => r.request);
        const broadcast = recipients
            .filter(r => r.request?.type === "BROADCAST")
            .map(r => r.request);
        return sendSuccess(res, 200, "Mural carregado", {
            direct,
            broadcast
        });
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar mural", error.message);
    }
};

exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const providerProfile = await ProviderProfile.findOne({
            where: { userId }
        });
        if (!providerProfile) {
            return sendError(res, 404, "Perfil de prestador não encontrado");
        }
        const providerId = providerProfile.id;
        const { page, limit, offset } = getPagination(
            req.query.page,
            req.query.limit
        );
        const data = await ServiceExecution.findAndCountAll({
            where: { providerId },
            include: [
                {
                    model: ServiceRequest,
                    as: "request",
                    include: [
                        { model: Service, as: "service" },
                        { model: ServiceCategory, as: "category" },
                        {
                            model: ClientProfile,
                            as: "client",
                            include: [
                                {
                                    model: User,
                                    attributes: ["id", "name", "email"]
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [["id", "DESC"]],
            limit,
            offset
        });
        const response = getPagingData(data, page, limit);
        return sendSuccess(res, 200, "Histórico do prestador", response);
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar histórico", error.message);
    }
};