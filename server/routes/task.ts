import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// ---------------------------------------------------------------------------
// Helpers — safely map frontend values to Prisma enum values
// ---------------------------------------------------------------------------

const VALID_TASK_TYPES = ["TASK", "BUG", "FEATURE", "IMPROVEMENT"] as const;
type TaskType = (typeof VALID_TASK_TYPES)[number];

const VALID_PRIORITIES = ["Low", "Medium", "High"] as const;
type Priority = (typeof VALID_PRIORITIES)[number];

/** "feature" | "FEATURE" | "Feature" → "FEATURE", unknown → "TASK" */
function toDbType(raw?: string): TaskType {
  if (!raw) return "TASK";
  const upper = raw.toUpperCase() as TaskType;
  return VALID_TASK_TYPES.includes(upper) ? upper : "TASK";
}

/** "low" | "LOW" | "Low" → "Low", unknown → "Medium" */
function toDbPriority(raw?: string): Priority {
  if (!raw) return "Medium";
  const titleCase = (raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()) as Priority;
  return VALID_PRIORITIES.includes(titleCase) ? titleCase : "Medium";
}

/** "In Progress" | "in_progress" | "IN_PROGRESS" → "IN_PROGRESS" */
function toDbStatus(raw?: string) {
  if (!raw) return "TODO";
  return raw.replace(/\s+/g, "_").toUpperCase() as any;
}

// ---------------------------------------------------------------------------
// GET /api/tasks
// ---------------------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { projectId, userId } = req.query;

    const where: any = {};
    if (projectId) where.projectId = projectId as string;
    if (userId) where.assigneeId = userId as string;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        project:  { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedTasks = tasks.map((task: any) => ({
      id:         task.id,
      title:      task.title,
      description: task.description || "",
      status:     task.status.replace(/_/g, " "),
      type:       task.type,
      priority:   task.priority,
      dueDate:    task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
      projectId:  task.projectId,
      assigneeId: task.assigneeId,
      createdAt:  task.createdAt.toISOString(),
    }));

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.json(formattedTasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ---------------------------------------------------------------------------
// POST /api/tasks
// ---------------------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assigneeId,
      priority,
      type,
      status,
      dueDate,
    } = req.body;

    // Validate required fields
    if (!title || !projectId || !assigneeId) {
      return res.status(400).json({
        error: "Missing required fields: title, projectId, assigneeId",
      });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Verify assignee exists
    const assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
    if (!assignee) return res.status(404).json({ error: "Assignee not found" });

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        projectId,
        assigneeId,
        status:   toDbStatus(status),
        type:     toDbType(type),       // ✅ "research" → "TASK" (safe fallback)
        priority: toDbPriority(priority), // ✅ "LOW" → "Low"
        dueDate:  dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        project:  { select: { id: true, name: true } },
      },
    });

    const formattedTask = {
      id:          task.id,
      title:       task.title,
      description: task.description || "",
      status:      task.status.replace(/_/g, " "),
      type:        task.type,
      priority:    task.priority,
      dueDate:     task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
      projectId:   task.projectId,
      assigneeId:  task.assigneeId,
      createdAt:   task.createdAt.toISOString(),
    };

    res.status(201).json(formattedTask);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/tasks/:id
// ---------------------------------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, type, priority, dueDate, assigneeId } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ error: "Task not found" });

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status:     status     ? toDbStatus(status)       : undefined,
        type:       type       ? toDbType(type)           : undefined,
        priority:   priority   ? toDbPriority(priority)   : undefined,
        dueDate:    dueDate    ? new Date(dueDate)         : null,
        assigneeId,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        project:  { select: { id: true, name: true } },
      },
    });

    const formattedTask = {
      id:          task.id,
      title:       task.title,
      description: task.description || "",
      status:      task.status.replace(/_/g, " "),
      type:        task.type,
      priority:    task.priority,
      dueDate:     task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
      projectId:   task.projectId,
      assigneeId:  task.assigneeId,
      createdAt:   task.createdAt.toISOString(),
    };

    res.json(formattedTask);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/tasks/:id
// ---------------------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: "Task not found" });

    await prisma.task.delete({ where: { id } });
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;