import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
const DB_HOST = process.env.DB_HOST;
if (!DB_HOST) throw new Error("DB_HOST must be defined");

mongoose
  .connect(DB_HOST)
  .then(() => console.log("Conectado a MongoDB con Mongoose"))
  .catch((err) => {
    console.error(err);
    throw new Error("Connection database failed");
  });

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Registrar rutas
app.use("/users", userRoutes);
app.use("/clients", clientRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
