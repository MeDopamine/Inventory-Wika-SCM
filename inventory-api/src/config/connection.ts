import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import databaseConfig from "./database"; // Import konfigurasi database dari berkas databases.js

dotenv.config();

const dbConnection = new Sequelize({
  dialect: "mysql",
  host: databaseConfig.development.host,
  username: databaseConfig.development.username,
  password: databaseConfig.development.password,
  database: databaseConfig.development.database,
});

export default dbConnection;
