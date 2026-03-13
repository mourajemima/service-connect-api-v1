const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ClientProfile = sequelize.define("ClientProfile", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }

}, {
    timestamps: false
});

module.exports = ClientProfile;