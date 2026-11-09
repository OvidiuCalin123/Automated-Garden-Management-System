import express from "express";
import userRoutes from "./Presentation/Routes/userRoutes.js";
import { errorHandler } from "./Presentation/Middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Garden Management API is running",
  });
});

app.use("/api/users", userRoutes);
app.use(errorHandler);

export default app;
