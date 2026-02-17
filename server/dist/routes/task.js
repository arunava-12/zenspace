"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma")); // Fixed: default import instead of named import
const router = (0, express_1.Router)();
// ============ GET ALL TASKS ============
// GET /api/tasks?projectId=xxx
router.get("/", async (req, res) => {
    try {
        const { projectId, userId } = req.query;
        const where = {};
        if (projectId)
            where.projectId = projectId;
        if (userId)
            where.assigneeId = userId;
        const tasks = await prisma_1.default.task.findMany({
            where,
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        // Transform to match frontend format
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description || "",
            status: task.status.replace(/_/g, " "), // Fixed: replace all underscores
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
            projectId: task.projectId,
            assigneeId: task.assigneeId,
            createdAt: task.createdAt.toISOString(),
        }));
        // 🔥 ADD: Prevent browser caching
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json(formattedTasks);
    }
    catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});
// ============ CREATE TASK ============
// POST /api/tasks
router.post("/", async (req, res) => {
    try {
        const { title, description, projectId, assigneeId, priority, type, status, dueDate, } = req.body;
        // Validate required fields
        if (!title || !projectId || !assigneeId) {
            return res.status(400).json({
                error: "Missing required fields: title, projectId, assigneeId",
            });
        }
        // Verify project exists
        const project = await prisma_1.default.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        // Verify assignee exists
        const assignee = await prisma_1.default.user.findUnique({
            where: { id: assigneeId },
        });
        if (!assignee) {
            return res.status(404).json({ error: "Assignee not found" });
        }
        // Transform status format: "In Progress" → "IN_PROGRESS"
        const dbStatus = status
            ? status.replace(/\s+/g, "_").toUpperCase()
            : "TODO";
        // Transform type format: "Task" → "TASK"
        const dbType = type
            ? type.toUpperCase()
            : "TASK";
        const task = await prisma_1.default.task.create({
            data: {
                title,
                description: description || "",
                projectId,
                assigneeId,
                priority: priority || "Medium",
                type: dbType,
                status: dbStatus,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        // Format response to match frontend expectations
        const formattedTask = {
            id: task.id,
            title: task.title,
            description: task.description || "",
            status: task.status.replace(/_/g, " "), // Fixed: replace all underscores
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
            projectId: task.projectId,
            assigneeId: task.assigneeId,
            createdAt: task.createdAt.toISOString(),
        };
        res.status(201).json(formattedTask);
    }
    catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});
// ============ UPDATE TASK ============
// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, type, priority, dueDate, assigneeId, } = req.body;
        // Check if task exists
        const existingTask = await prisma_1.default.task.findUnique({
            where: { id },
        });
        if (!existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        // Transform status format if provided
        const dbStatus = status
            ? status.replace(/\s+/g, "_").toUpperCase()
            : undefined;
        // Transform type format if provided: "Task" → "TASK"
        const dbType = type
            ? type.toUpperCase()
            : undefined;
        const task = await prisma_1.default.task.update({
            where: { id },
            data: {
                title,
                description,
                status: dbStatus,
                type: dbType,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                assigneeId,
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        // Format response
        const formattedTask = {
            id: task.id,
            title: task.title,
            description: task.description || "",
            status: task.status.replace(/_/g, " "), // Fixed: replace all underscores
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
            projectId: task.projectId,
            assigneeId: task.assigneeId,
            createdAt: task.createdAt.toISOString(),
        };
        res.json(formattedTask);
    }
    catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
});
// ============ DELETE TASK ============
// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Check if task exists
        const task = await prisma_1.default.task.findUnique({
            where: { id },
        });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        await prisma_1.default.task.delete({
            where: { id },
        });
        res.json({ success: true, message: "Task deleted" });
    }
    catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
});
exports.default = router;
