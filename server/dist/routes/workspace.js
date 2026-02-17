"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../prisma"));
const router = express_1.default.Router();
// CREATE WORKSPACE
router.post("/", async (req, res) => {
    try {
        const { name, ownerId } = req.body;
        const ws = await prisma_1.default.workspace.create({
            data: {
                name,
                ownerId,
                users: {
                    create: {
                        userId: ownerId,
                    },
                },
            },
        });
        res.json(ws);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Workspace create failed" });
    }
});
// GET ALL WORKSPACES
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    if (!userId)
        return res.status(400).json({ error: "userId required" });
    const workspaces = await prisma_1.default.workspace.findMany({
        where: {
            OR: [
                { ownerId: userId },
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
    res.json(workspaces);
});
// DELETE WORKSPACE (AUTO CASCADE)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.workspace.delete({
            where: { id },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
});
exports.default = router;
