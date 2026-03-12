import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB, isDatabaseReady } from "./config/db.js";
import productsRouter from "./routes/products.js";
import reviewsRouter from "./routes/reviews.js";
import routinesRouter from "./routes/routines.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8080);

const rawOrigin = process.env.CLIENT_ORIGIN || "*";
const allowedOrigins = rawOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = allowedOrigins.includes("*")
  ? { origin: "*" }
  : {
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      }
    };

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    database: isDatabaseReady() ? "connected" : "mock-mode"
  });
});

app.use("/api/products", productsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/routines", routinesRouter);
app.use("/api/users", usersRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error"
  });
});

connectDB().finally(() => {
  app.listen(port, () => {
    console.log(`SkinMatch API listening on port ${port}`);
  });
});
