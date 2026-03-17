const { Service } = require("../models");

async function findProvidersByCategory(categoryId) {
    const services = await Service.findAll({
        where: { categoryId }
    });
    const providerIds = [...new Set(
        services.map(service => service.providerId)
    )];
    return providerIds;
}

module.exports = {
    findProvidersByCategory
};