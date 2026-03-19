const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceRequest = sequelize.define("ServiceRequest", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    type: {
        type: DataTypes.ENUM("DIRECT", "BROADCAST"),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM(
            "OPEN",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "OPEN"
    },

}, {
    timestamps: true
});

module.exports = ServiceRequest;