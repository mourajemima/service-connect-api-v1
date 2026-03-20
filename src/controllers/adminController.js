const { User } = require("../models");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { getPagination, getPagingData } = require("../utils/pagination");

exports.getAllUsers = async (req, res) => {
    try {
        const { page, limit, offset } = getPagination(
            req.query.page,
            req.query.limit
        );
        const { role, isBanned } = req.query;
        const where = {};
        if (role) where.role = role;
        if (isBanned !== undefined) {
            where.isBanned = isBanned === "true";
        }
        const data = await User.findAndCountAll({
            where,
            attributes: ["id", "name", "email", "role", "isBanned", "createdAt"],
            order: [["role", "ASC"]],
            limit,
            offset
        });
        const meta = getPagingData(data, page, limit);
        return sendSuccess(res, 200, "Lista de usuários", data.rows, { meta });
    } catch (error) {
        return sendError(res, 500, "Erro ao listar usuários", error.message);
    }
};

exports.banUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return sendError(res, 404, "Usuário não encontrado");
        }
        user.isBanned = true;
        await user.save();
        return sendSuccess(res, 200, "Usuário banido com sucesso");
    } catch (error) {
        return sendError(res, 500, "Erro ao banir usuário", error.message);
    }
};