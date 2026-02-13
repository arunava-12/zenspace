import React, { useState, useEffect } from "react";
import { Priority, TaskType, ProjectStatus, TaskStatus } from "../types";
import ZenAIChat from "./ZenAIChat";

interface GlobalModalsProps {
  store: any;
}

const GlobalModals: React.FC<GlobalModalsProps> = ({ store }) => {
  const {
    isTaskModalOpen,
    editingTask,
    closeTaskModal,
    isProjectModalOpen,
    closeProjectModal,
    isWorkspaceModalOpen,
    workspaceModalType,
    closeWorkspaceModal,
    isChatbotOpen,
    closeChatbot,
    addTask,
    updateTask,
    addProject,
    createWorkspace,
    joinWorkspace,
    projects = [],
    currentUser,
  } = store;

  // ---------- SAFE FALLBACKS ----------
  const userId = currentUser?.id || "";

  // ---------- TASK FORM ----------
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "Medium" as Priority,
    type: "Task" as TaskType,
    status: "Todo" as TaskStatus,
    assigneeId: "",
    dueDate: new Date().toISOString().split("T")[0],
  });

  // ---------- PROJECT FORM ----------
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    priority: "Medium" as Priority,
    status: "Active" as ProjectStatus,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  // ---------- WORKSPACE FORM ----------
  const [wsForm, setWsForm] = useState({ name: "", joinCode: "" });
  const [activeWsTab, setActiveWsTab] = useState<"create" | "join">("create");

  // ---------- WORKSPACE TAB SYNC ----------
  useEffect(() => {
    if (workspaceModalType === "create" || workspaceModalType === "join") {
      setActiveWsTab(workspaceModalType);
    }
  }, [workspaceModalType]);

  // ---------- EDIT TASK POPULATION ----------
  useEffect(() => {
    if (!userId) return;

    if (editingTask) {
      setTaskForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        projectId: editingTask.projectId || "",
        priority: editingTask.priority || "Medium",
        type: editingTask.type || "Task",
        status: editingTask.status || "Todo",
        assigneeId: editingTask.assigneeId || userId,
        dueDate: editingTask.dueDate || new Date().toISOString().split("T")[0],
      });
    } else {
      setTaskForm((prev) => ({
        ...prev,
        assigneeId: userId,
        projectId: projects.length > 0 ? projects[0].id : "",
      }));
    }
  }, [editingTask, userId]); // fixed length, primitives only

  // ---------- HANDLERS ----------
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    if (editingTask) {
      updateTask({ ...editingTask, ...taskForm });
    } else {
      addTask({
        ...taskForm,
        id: `t-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
      });
    }

    closeTaskModal();
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const newProject = {
      ...projectForm,
      id: `p-${Math.random().toString(36).slice(2)}`,
      progress: 0,
      leadId: userId,
      memberIds: [userId],
    };

    addProject(newProject);

    // AUTO SELECT NEW PROJECT
    store.setActiveProjectId?.(newProject.id);

    setProjectForm({
      name: "",
      description: "",
      priority: "Medium",
      status: "Active",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    });

    closeProjectModal();
  };

  const handleWsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeWsTab === "create" && wsForm.name) {
      createWorkspace(wsForm.name);
      setWsForm({ name: "", joinCode: "" }); // ADD
      closeWorkspaceModal();
    }

    if (activeWsTab === "join" && wsForm.joinCode) {
      joinWorkspace(wsForm.joinCode);
      setWsForm({ name: "", joinCode: "" }); // ADD
      closeWorkspaceModal();
    }
  };

  return (
    <>
      {/* CHATBOT */}
      {currentUser && (
        <ZenAIChat
          isOpen={isChatbotOpen}
          onClose={closeChatbot}
          currentUser={currentUser}
        />
      )}

      {/* TASK MODAL */}
      {isTaskModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <form
            onSubmit={handleTaskSubmit}
            className="bg-white p-6 rounded-xl space-y-3"
          >
            <input
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              placeholder="Task title"
            />

            <select
              value={taskForm.projectId}
              onChange={(e) =>
                setTaskForm({ ...taskForm, projectId: e.target.value })
              }
            >
              {projects.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button type="submit">Save Task</button>
          </form>
        </div>
      )}

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <form
            onSubmit={handleProjectSubmit}
            className="bg-white p-6 rounded-xl space-y-3"
          >
            <input
              value={projectForm.name}
              onChange={(e) =>
                setProjectForm({ ...projectForm, name: e.target.value })
              }
              placeholder="Project name"
            />
            <button type="submit">Create</button>
          </form>
        </div>
      )}

      {/* WORKSPACE MODAL */}
      {isWorkspaceModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <form
            onSubmit={handleWsSubmit}
            className="bg-white p-6 rounded-xl space-y-3"
          >
            {activeWsTab === "create" ? (
              <input
                value={wsForm.name}
                onChange={(e) => setWsForm({ ...wsForm, name: e.target.value })}
                placeholder="Workspace name"
              />
            ) : (
              <input
                value={wsForm.joinCode}
                onChange={(e) =>
                  setWsForm({ ...wsForm, joinCode: e.target.value })
                }
                placeholder="Join code"
              />
            )}
            <button type="submit">Save</button>
          </form>
        </div>
      )}
    </>
  );
};

export default GlobalModals;
