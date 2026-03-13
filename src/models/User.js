const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },

    role: {
        type: DataTypes.ENUM("CLIENT", "PROVIDER", "ADMIN"),
        allowNull: false
    },

    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    timestamps: true
});

module.exports = User;