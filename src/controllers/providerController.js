const {
    RequestRecipient,
    ServiceRequest,
    Service,
    ServiceCategory,
    ProviderProfile,
    ServiceExecution,
    ClientProfile,
    User,
    Review
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

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes: ["id", "name", "email", "phone"],
            include: [
                {
                    model: ProviderProfile,
                    as: "providerProfile",
                    attributes: ["id", "bio", "averageRating", "totalReviews"]
                }
            ]
        });
        return sendSuccess(
            res,
            200,
            "Perfil do prestador",
            {
                ...user.toJSON(),
                ...user.providerProfile?.toJSON()
            }
        );
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar perfil", error.message);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { phone, bio } = req.body;
        const user = await User.findByPk(req.user.id);
        const providerProfile = req.providerProfile;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) providerProfile.bio = bio;
        await user.save();
        await providerProfile.save();
        return sendSuccess(res, 200, "Perfil atualizado com sucesso", {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            bio: providerProfile.bio,
            averageRating: providerProfile.averageRating,
            totalReviews: providerProfile.totalReviews
        });
    } catch (error) {
        return sendError(res, 500, "Erro ao atualizar perfil", error.message);
    }
};

exports.getProviderReviews = async (req, res) => {
    try {
        const providerId = req.params.providerId;
        const { page, limit, offset } = getPagination(
            req.query.page,
            req.query.limit
        );
        const data = await Review.findAndCountAll({
            where: { providerId },
            include: [
                {
                    model: ClientProfile,
                    as: "client",
                    include: [
                        {
                            model: User,
                            attributes: ["name"]
                        }
                    ]
                }
            ],
            attributes: ["id", "rating", "comment", "createdAt"],
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });
        const reviews = data.rows.map(r => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            clientName: r.client.User.name
        }));
        const meta = getPagingData(data, page, limit);
        const provider = await ProviderProfile.findByPk(providerId, {
            attributes: ["averageRating", "totalReviews"]
        });
        return sendSuccess(
            res,
            200,
            "Avaliações do prestador",
            reviews,
            {
                meta,
                averageRating: provider.averageRating,
                totalReviews: provider.totalReviews
            }
        );
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar avaliações", error.message);
    }
};