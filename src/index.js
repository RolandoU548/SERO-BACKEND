import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authenticationRoutes from "./routes/authenticationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import spreadsheetRoutes from "./routes/spreadsheetRoutes.js";

import { authenticateToken } from "./middleware/authenticateTokenMiddleware.js";
import { errorHandler } from "./middleware/errorHandlerMiddleware.js";

dotenv.config();

const DB_URI = process.env.DB_URI;
if (!DB_URI) throw new Error("DB_URI must be defined");

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(DB_URI, clientOptions)
  .then((db) =>
    console.log("Connected to MongoDB with Mongoose to", db.connection.host)
  )
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
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(errorHandler);

// Registrar rutas
app.use("/auth", authenticationRoutes);
app.use("/users", userRoutes);

//Rutas protegidas por authenticateToken
app.use(authenticateToken);
app.use("/clients", clientRoutes);
app.use("/tasks", taskRoutes);
app.use("/spreadsheets", spreadsheetRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
