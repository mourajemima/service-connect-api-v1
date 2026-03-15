const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const serviceCategoryRoutes = require("./routes/serviceCategoryRoutes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/categories", serviceCategoryRoutes);

module.exports = app;