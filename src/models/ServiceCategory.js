const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceCategory = sequelize.define("ServiceCategory", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }

}, {
    timestamps: false
});

module.exports = ServiceCategory;