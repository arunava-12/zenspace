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
  res.status(200).send("ZenSpace API Running");
});

console.log("ENV PORT:", process.env.PORT);

const PORT = process.env.PORT ?? "4000";

app.listen(+PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
