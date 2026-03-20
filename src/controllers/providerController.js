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
        const providerId = req.providerId;
        const recipients = await RequestRecipient.findAll({
            where: { providerId, status: "PENDING" },
            include: [
                {
                    model: ServiceRequest,
                    as: "request",
                    where: {
                        status: ["OPEN"]
                    },
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
        const providerId = req.providerId;
        const { page, limit, offset } = getPagination(
            req.query.page,
            req.query.limit
        );
        const { status } = req.query;
        const where = { providerId };
        if (status) {
            where.status = status;
        }
        const data = await ServiceExecution.findAndCountAll({
            where,
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
        const { rows } = data;
        const meta= getPagingData(data, page, limit);
        return sendSuccess(res, 200, "Histórico do prestador", rows, { meta });
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar histórico", error.message);
    }
};