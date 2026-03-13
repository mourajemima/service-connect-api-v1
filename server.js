require("dotenv").config();

const app = require("./src/app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Banco de dados conectado");
    await sequelize.sync();
    console.log("Tabelas sincronizadas");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
}

startServer();