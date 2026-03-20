const {
    ServiceRequest,
    Service,
    ServiceCategory,
    ProviderProfile,
    ServiceExecution,
    User
} = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { getPagination, getPagingData } = require("../utils/pagination");

exports.getHistory = async (req, res) => {
    try {
        const clientId = req.clientId;
        const { page, limit, offset } = getPagination(
            req.query.page,
            req.query.limit
        );
        const { status } = req.query;
        const data = await ServiceRequest.findAndCountAll({
            where: { clientId },
            include: [
                {
                    model: ServiceExecution,
                    as: "execution",
                    where: status ? { status } : undefined,
                    required: false,
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
        const { rows } = data;
        const meta = getPagingData(data, page, limit);
        return sendSuccess(res, 200, "Histórico do cliente", rows, { meta });
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar histórico", error.message);
    }
};