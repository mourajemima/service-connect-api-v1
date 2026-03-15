const { ServiceCategory } = require("../models");

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await ServiceCategory.create({ name });
        return res.status(201).json({
            success: true,
            message: "Recurso criado com sucesso",
            data: category
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                success: false,
                message: "Categoria já existe"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Erro ao criar categoria",
            error: error.message
        });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await ServiceCategory.findAll({
            order: [["name", "ASC"]]
        });
        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar categorias",
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await ServiceCategory.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoria não encontrada"
            });
        }
        return res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar categoria",
            error: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await ServiceCategory.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoria não encontrada"
            });
        }
        category.name = name;
        await category.save();
        return res.status(200).json({
            success: true,
            message: "Categoria atualizada com sucesso",
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar categoria",
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await ServiceCategory.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoria não encontrada"
            });
        }
        await category.destroy();
        return res.status(200).json({
            success: true,
            message: "Recurso removido com sucesso"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao remover categoria",
            error: error.message
        });
    }
};