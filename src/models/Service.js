const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Service = sequelize.define("Service", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: true
    },

    providerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    timestamps: true
});

module.exports = Service;