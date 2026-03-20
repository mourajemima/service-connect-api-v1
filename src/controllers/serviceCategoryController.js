const { ServiceCategory } = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { getPagination, getPagingData } = require("../utils/pagination");

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await ServiceCategory.create({ name });
        return sendSuccess(res, 201, "Recurso criado com sucesso", category);
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return sendError(res, 400, "Categoria já existe");
        }
        return sendError(res, 500, "Erro ao criar categoria");
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
        const data = await ServiceCategory.findAndCountAll({
            limit,
            offset,
            order: [["name", "ASC"]]
        });
        const { rows } = data;
        const meta = getPagingData(data, page, limit);
        return sendSuccess(res, 200, "Categorias retornadas", rows, { meta });
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar categorias");
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await ServiceCategory.findByPk(id);
        if (!category) {
            return sendError(res, 404, "Categoria não encontrada");
        }
        return sendSuccess(res, 200, "Categoria retornada", category);
    } catch (error) {
        return sendError(res, 500, "Erro ao buscar categoria");
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await ServiceCategory.findByPk(id);
        if (!category) {
            return sendError(res, 404, "Categoria não encontrada");
        }
        category.name = name;
        await category.save();
        return sendSuccess(res, 200, "Categoria atualizada com sucesso", category);
    } catch (error) {
        return sendError(res, 500, "Erro ao atualizar categoria");
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await ServiceCategory.findByPk(id);
        if (!category) {
            return sendError(res, 404, "Categoria não encontrada");
        }
        await category.destroy();
        return sendSuccess(res, 200, "Categoria removido com sucesso");
    } catch (error) {
        return sendError(res, 500, "Erro ao remover categoria");
    }
};