const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RequestRecipient = sequelize.define("RequestRecipient", {

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
            "REJECTED"
        ),
        allowNull: false,
        defaultValue: "PENDING"
    }

}, {
    timestamps: false,

    indexes: [
        {
            unique: true,
            fields: ["requestId", "providerId"]
        }
    ]
});

module.exports = RequestRecipient;