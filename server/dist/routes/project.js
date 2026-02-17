"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../prisma"));
const router = express_1.default.Router();
// ==========================
// CREATE PROJECT
// ==========================
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
                // Add creator as team member
                users: {
                    create: {
                        userId: leadId,
                    },
                },
            },
            include: {
                lead: true,
                users: {
                    include: {
                        user: true,
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
// ==========================
// GET ALL PROJECTS FOR USER
// ==========================
router.get("/", async (req, res) => {
    try {
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
            include: {
                lead: true,
                users: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(projects);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});
// ==========================
// GET SINGLE PROJECT DETAILS
// ==========================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma_1.default.project.findUnique({
            where: { id },
            include: {
                lead: true,
                users: {
                    include: {
                        user: true,
                    },
                },
                workspace: true,
                tasks: true,
                files: true,
                comments: true,
            },
        });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json(project);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch project" });
    }
});
// ==========================
// DELETE PROJECT
// ==========================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await prisma_1.default.project.deleteMany({
            where: { id },
        });
        if (result.count === 0) {
            return res.status(200).json({ success: true });
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error("Delete project error:", err);
        res.status(500).json({ error: "Project deletion failed" });
    }
});
// ==========================
// TEST ROUTE
// ==========================
router.get("/test-delete", (_req, res) => {
    res.json({ ok: true });
});
exports.default = router;
