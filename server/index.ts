import express from "express";
import cors from "cors";
import authRoutes from "./auth";
import userRoutes from "./routes/user";
import projectRoutes from "./routes/project";
import workspaceRoutes from "./routes/workspace";

const app = express();

app.use(cors({
  origin: "*",
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workspaces", workspaceRoutes);

app.get("/", (req, res) => {
  res.send("ZenSpace API Running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
