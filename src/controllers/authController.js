const bcrypt = require("bcrypt");
const { User, ClientProfile, ProviderProfile } = require("../models");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (role === "ADMIN") {
            return res.status(403).json({
                message: "Não é permitido criar administrador"
            });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "Email já cadastrado"
            });
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
        res.status(201).json({
            message: "Usuário criado com sucesso",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar usuário",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Senha inválida"
            });
        }
        const token = generateToken(user);
        res.json({
            message: "Login realizado com sucesso",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro no login",
            error: error.message
        });
    }
};