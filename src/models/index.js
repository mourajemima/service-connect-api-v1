const sequelize = require("../config/database");

const User = require("./User");
const ClientProfile = require("./ClientProfile");
const ProviderProfile = require("./ProviderProfile");
const ServiceCategory = require("./ServiceCategory");
const Service = require("./Service");
const ServiceRequest = require("./ServiceRequest");
const RequestRecipient = require("./RequestRecipient");
const ServiceExecution = require("./ServiceExecution");
const Review = require("./Review");


User.hasOne(ClientProfile, { foreignKey: "userId", as: "clientProfile" });
ClientProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(ProviderProfile, { foreignKey: "userId", as: "providerProfile" });
ProviderProfile.belongsTo(User, { foreignKey: "userId" });


ProviderProfile.hasMany(Service, { foreignKey: "providerId", as: "services" });
Service.belongsTo(ProviderProfile, { foreignKey: "providerId", as: "provider" });


ServiceCategory.hasMany(Service, { foreignKey: "categoryId", as: "services" });
Service.belongsTo(ServiceCategory, { foreignKey: "categoryId", as: "category" });


ClientProfile.hasMany(ServiceRequest, { foreignKey: "clientId", as: "requests" });
ServiceRequest.belongsTo(ClientProfile, { foreignKey: "clientId", as: "client" });


Service.hasMany(ServiceRequest, { foreignKey: "serviceId", as: "requests" });
ServiceRequest.belongsTo(Service, { foreignKey: "serviceId", as: "service" });


ServiceRequest.hasMany(RequestRecipient, { foreignKey: "requestId", as: "recipients" });
RequestRecipient.belongsTo(ServiceRequest, { foreignKey: "requestId", as: "request" });


ProviderProfile.hasMany(RequestRecipient, { foreignKey: "providerId", as: "receivedRequests" });
RequestRecipient.belongsTo(ProviderProfile, { foreignKey: "providerId", as: "provider" });


ServiceRequest.hasOne(ServiceExecution, { foreignKey: "requestId", as: "execution" });
ServiceExecution.belongsTo(ServiceRequest, { foreignKey: "requestId", as: "request" });


ProviderProfile.hasMany(ServiceExecution, { foreignKey: "providerId", as: "executions" });
ServiceExecution.belongsTo(ProviderProfile, { foreignKey: "providerId", as: "provider" });


ServiceExecution.hasOne(Review, { foreignKey: "executionId", as: "review" });
Review.belongsTo(ServiceExecution, { foreignKey: "executionId", as: "execution" });


module.exports = {
    sequelize,
    User,
    ClientProfile,
    ProviderProfile,
    ServiceCategory,
    Service,
    ServiceRequest,
    RequestRecipient,
    ServiceExecution,
    Review
};