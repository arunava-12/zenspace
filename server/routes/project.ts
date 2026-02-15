import express from "express";
import prisma from "../prisma";

const router = express.Router();

// CREATE PROJECT
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      leadId,
      priority,
      status,
      startDate,
      endDate,
      workspaceId,
    } = req.body;

    const project = await prisma.project.create({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Project creation failed" });
  }
});

// GET PROJECTS
router.get("/", async (req, res) => {
  const userId = req.query.userId as string;
  const workspaceId = req.query.workspaceId as string;

  if (!userId || !workspaceId) {
    return res.status(400).json({ error: "Missing params" });
  }

  const projects = await prisma.project.findMany({
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

    const result = await prisma.project.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      return res.status(200).json({ success: true }); 
      // already deleted — treat as success
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Project deletion failed" });
  }
});

export default router;
