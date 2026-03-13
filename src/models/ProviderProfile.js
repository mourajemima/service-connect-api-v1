const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProviderProfile = sequelize.define("ProviderProfile", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },

    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    averageRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

}, {
    timestamps: false
});

module.exports = ProviderProfile;