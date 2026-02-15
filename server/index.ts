import express from "express";
import cors from "cors";

import authRoutes from "./auth";
import userRoutes from "./routes/user";
import projectRoutes from "./routes/project";
import workspaceRoutes from "./routes/workspace";

// Catch unexpected crashes so Railway logs show real error
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workspaces", workspaceRoutes);

// Health / Root Route
app.get("/", (_req, res) => {
  res.status(200).send("ZenSpace API Running");
});

// Port Handling (Railway Safe)
const PORT = Number(process.env.PORT) || 4000;

console.log("ENV PORT:", process.env.PORT);

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
