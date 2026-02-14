import express from "express";
import cors from "cors";
import authRoutes from "./auth";
import userRoutes from "./routes/user";
import projectRoutes from "./routes/project";
import workspaceRoutes from "./routes/workspace";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workspaces", workspaceRoutes);

app.get("/", (req, res) => {
  res.send("ZenSpace API Running");
});

app.use("/api/auth", authRoutes);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});

