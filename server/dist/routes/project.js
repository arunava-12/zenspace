"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../prisma"));
const router = express_1.default.Router();
// CREATE PROJECT
router.post("/", async (req, res) => {
    try {
        const { name, description, leadId, priority, status, startDate, endDate, workspaceId, } = req.body;
        const project = await prisma_1.default.project.create({
            data: {
                name,
                description,
                leadId,
                priority,
                status,
                workspaceId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                users: {
                    create: {
                        userId: leadId,
                    },
                },
            },
        });
        res.json(project);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Project creation failed" });
    }
});
// GET PROJECTS
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const workspaceId = req.query.workspaceId;
    if (!userId || !workspaceId) {
        return res.status(400).json({ error: "Missing params" });
    }
    const projects = await prisma_1.default.project.findMany({
        where: {
            workspaceId: workspaceId,
            OR: [
                { leadId: userId },
                {
                    users: {
                        some: {
                            userId: userId,
                        },
                    },
                },
            ],
        },
    });
    res.json(projects);
});
// DELETE PROJECT
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await prisma_1.default.project.deleteMany({
            where: { id },
        });
        if (result.count === 0) {
            return res.status(200).json({ success: true });
            // already deleted — treat as success
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error("Delete project error:", err);
        res.status(500).json({ error: "Project deletion failed" });
    }
});
router.get("/test-delete", (_req, res) => {
    res.json({ ok: true });
});
exports.default = router;
