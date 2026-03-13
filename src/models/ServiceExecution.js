const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceExecution = sequelize.define("ServiceExecution", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    providerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM(
            "PENDING",
            "ACCEPTED",
            "SCHEDULED",
            "FINISHED",
            "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "PENDING"
    },

    scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true
    },

    finishedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    timestamps: false,

    indexes: [
        {
            unique: true,
            fields: ["requestId"]
        }
    ]
});

module.exports = ServiceExecution;