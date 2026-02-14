import express from "express";
import prisma from "../prisma";

const router = express.Router();

// CREATE WORKSPACE
router.post("/", async (req, res) => {
  try {
    const { name, ownerId } = req.body;

    const ws = await prisma.workspace.create({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Workspace create failed" });
  }
});

// GET ALL WORKSPACES
router.get("/", async (req, res) => {
  const userId = req.query.userId as string;

  if (!userId) return res.status(400).json({ error: "userId required" });

  const workspaces = await prisma.workspace.findMany({
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
    await prisma.workspace.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
