const bcrypt = require("bcrypt");
const { User, ClientProfile, ProviderProfile } = require("../models");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/apiResponse");

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (role === "ADMIN") {
            return sendError(response, 403, "Não é permitido criar administrador");
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return sendError(res, 400, "Email já cadastrado");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });
        if (role === "CLIENT") {
            await ClientProfile.create({
                userId: user.id
            });
        }
        if (role === "PROVIDER") {
            await ProviderProfile.create({
                userId: user.id
            });
        }
        const token = generateToken(user);
        return sendSuccess(
            res,
            201,
            "Usuário criado com sucesso",
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            },
            { token }
        );
    } catch (error) {
        return sendError(res, 500, "Erro ao criar usuário");
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return sendError(res, 404, "Usuário não encontrado");
        }
        if (user.isBanned) {
            return sendError(res, 403, "Acesso não autorizado");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return sendError(res, 401, "Senha inválida");
        }
        const token = generateToken(user);
        return sendSuccess(
            res,
            200,
            "Login realizado com sucesso",
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            },
            { token }
        );
    } catch (error) {
        return sendError(res, 500, "Erro no login");
    }
};