import express from "express";
import prisma from "../prisma";

const router = express.Router();


// ==========================
// CREATE PROJECT
// ==========================
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Project creation failed" });
  }
});


// ==========================
// GET ALL PROJECTS FOR USER
// ==========================
router.get("/", async (req, res) => {
  try {
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
  } catch (err) {
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

    const project = await prisma.project.findUnique({
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
  } catch (err) {
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

    const result = await prisma.project.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      return res.status(200).json({ success: true });
    }

    res.json({ success: true });
  } catch (err) {
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

export default router;
