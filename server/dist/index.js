"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./routes/user"));
const project_1 = __importDefault(require("./routes/project"));
const workspace_1 = __importDefault(require("./routes/workspace"));
const task_1 = __importDefault(require("./routes/task")); // 🔥 ADD THIS
const ai_1 = __importDefault(require("./routes/ai"));
// Catch unexpected crashes so Railway logs show real error
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err);
});
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
// 🔍 LOG ALL REQUESTS
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/user", user_1.default);
app.use("/api/projects", project_1.default);
app.use("/api/workspaces", workspace_1.default);
app.use("/api/tasks", task_1.default); // 🔥 ADD THIS
app.use("/api/ai", ai_1.default);
// Health / Root Route
app.get("/", (_req, res) => {
    res.status(200).send("ZenSpace API Running");
});
// Port Handling (Railway Safe)
const PORT = Number(process.env.PORT) || 4000;
console.log("ENV PORT:", process.env.PORT);
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
