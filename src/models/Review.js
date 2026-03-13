const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define("Review", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    executionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },

    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    providerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },

    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    timestamps: true
});

module.exports = Review;