const { Service, ServiceCategory, ProviderProfile } = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");

exports.createService = async (req, res) => {
    try {
        const { title, description, price, categoryId } = req.body;
        const providerProfile = await ProviderProfile.findOne({
            where: { userId: req.user.id }
        });
        if (!providerProfile) {
            return sendError(res, 403, "Apenas prestadores podem criar serviços");
        }
        const category = await ServiceCategory.findByPk(categoryId);
        if (!category) {
            return sendError(res, 404, "Categoria não encontrada");
        }
        const service = await Service.create({
            title,
            description,
            price,
            categoryId,
            providerId: providerProfile.id
        });
        return sendSuccess(res, 201, "Serviço criado com sucesso", service);
    } catch (error) {
        return sendError(res, 500, "Erro ao criar serviço");
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const { categoryId } = req.query;
        const where = {};
        if (categoryId) {
            where.categoryId = categoryId;
        }
        const services = await Service.findAll({
            where,
            include: [
                {
                    model: ServiceCategory,
                    as: "category",
                    attributes: ["id", "name"]
                },
                {
                    model: ProviderProfile,
                    as: "provider",
                    attributes: ["id", "averageRating"]
                }
            ],
            order: [["title", "ASC"]]
        });
        return sendSuccess(res, 200, "Serviços encontrados", services);
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar serviços");
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id, {
            include: [
                {
                    model: ServiceCategory,
                    as: "category",
                    attributes: ["id", "name"]
                },
                {
                    model: ProviderProfile,
                    as: "provider",
                    attributes: ["id", "averageRating"]
                }
            ]
        });
        if (!service) {
            return sendError(res, 404, "Serviço não encontrado");
        }
        return sendSuccess(res, 200, "Serviço encontrado", service);
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar serviço");
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, categoryId } = req.body;
        const service = await Service.findByPk(id);
        if (!service) {
            return sendError(res, 404, "Serviço não encontrado");
        }
        const providerProfile = await ProviderProfile.findOne({
            where: { userId: req.user.id }
        });
        if (!providerProfile || service.providerId !== providerProfile.id) {
            return sendError(res, 403, "Você não tem permissão para editar este serviço");
        }
        service.title = title ?? service.title;
        service.description = description ?? service.description;
        service.price = price ?? service.price;
        service.categoryId = categoryId ?? service.categoryId;
        await service.save();
        return sendSuccess(res, 200, "Serviço atualizado com sucesso", service);
    } catch (error) {
        return sendError(res, 500, "Erro ao atualizar serviço");
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);
        if (!service) {
            return sendError(res, 404, "Serviço não encontrado");
        }
        const providerProfile = await ProviderProfile.findOne({
            where: { userId: req.user.id }
        });
        if (!providerProfile || service.providerId !== providerProfile.id) {
            return sendError(res, 403, "Você não tem permissão para remover este serviço");
        }
        await service.destroy();
        return sendSuccess(res, 204, "Serviço removido com sucesso");
    } catch (error) {
        return sendError(res, 500, "Erro ao remover serviço");
    }
};