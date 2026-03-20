const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const serviceCategoryRoutes = require("./routes/serviceCategoryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const requestRecipientRoutes = require("./routes/requestRecipientRoutes");
const providerRoutes = require("./routes/providerRoutes");
const serviceExecutionRoutes = require("./routes/serviceExecutionRoutes");
const clientRoutes = require("./routes/clientRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/categories", serviceCategoryRoutes);
app.use("/services", serviceRoutes);
app.use("/requests", serviceRequestRoutes);
app.use("/request-recipients", requestRecipientRoutes);
app.use("/provider", providerRoutes);
app.use("/executions", serviceExecutionRoutes);
app.use("/client", clientRoutes);
app.use("/reviews", reviewRoutes);

module.exports = app;