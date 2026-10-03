import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import webRoutes from "./routes/web.routes.js";
import seedAdmin from "./utils/seedAdmin.js";
import seedRoles from "./utils/seedRoles.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, service: "express-mongo-auth" });
});

app.use("/api", (req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

app.use(webRoutes);

app.use((req, res) => {
  res.status(404).render("404", { requestedUrl: req.originalUrl });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error?.code === 11000) {
    return res.status(400).json({ message: "El correo ya se encuentra en uso" });
  }

  if (error?.name === "ValidationError") {
    const details = Object.values(error.errors).map(({ message }) => message);
    return res.status(400).json({ message: "Datos no válidos", details });
  }

  return res.status(error.status || 500).json({
    message: error.message || "Error interno del servidor",
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });
    console.log("MongoDB conectado");

    await seedRoles();
    await seedAdmin();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor disponible en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
}

startServer();

export default app;
