import React, { useState, useEffect } from "react";
import { X, Globe, UserPlus, ArrowRight, Zap } from "lucide-react";
import { Priority, TaskType, ProjectStatus, TaskStatus } from "../types.ts";
import ZenAIChat from "./ZenAIChat.tsx";

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
    projects,
    currentUser,
  } = store;

  // Task Form State
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    projectId: projects[0]?.id || "",
    priority: "Medium" as Priority,
    type: "Task" as TaskType,
    status: "Todo" as TaskStatus,
    assigneeId: currentUser.id,
    dueDate: new Date().toISOString().split("T")[0],
  });

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    priority: "Medium" as Priority,
    status: "Active" as ProjectStatus,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  // Workspace Form State
  const [wsForm, setWsForm] = useState({
    name: "",
    joinCode: "",
  });
  const [activeWsTab, setActiveWsTab] = useState<"create" | "join">(
    workspaceModalType || "create",
  );

  useEffect(() => {
    setActiveWsTab(workspaceModalType);
  }, [workspaceModalType]);

  // Populate task form when editing
  useEffect(() => {
    if (editingTask) {
      setTaskForm({
        title: editingTask.title,
        description: editingTask.description,
        projectId: editingTask.projectId,
        priority: editingTask.priority,
        type: editingTask.type,
        status: editingTask.status,
        assigneeId: editingTask.assigneeId,
        dueDate: editingTask.dueDate,
      });
    } else {
      setTaskForm({
        title: "",
        description: "",
        projectId: projects[0]?.id || "",
        priority: "Medium",
        type: "Task",
        status: "Todo",
        assigneeId: currentUser.id,
        dueDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingTask, projects, currentUser.id]);

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask({
        ...editingTask,
        ...taskForm,
      });
    } else {
      addTask({
        ...taskForm,
        id: `t-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      });
    }
    closeTaskModal();
  };

  // 🔥 FIXED: Now just passes the project data to the store function
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ Call the store's addProject function which handles the API call
      await addProject({
        name: projectForm.name,
        description: projectForm.description,
        priority: projectForm.priority,
        status: projectForm.status,
        startDate: projectForm.startDate,
        endDate: projectForm.endDate,
        leadId: currentUser.id,
      });

      // Reset form and close modal
      setProjectForm({
        name: "",
        description: "",
        priority: "Medium",
        status: "Active",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
      closeProjectModal();
    } catch (err) {
      console.error(err);
      alert("Project creation failed");
    }
  };

  const handleWsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeWsTab === "create") {
      if (wsForm.name) {
        createWorkspace(wsForm.name);
        setWsForm({ ...wsForm, name: "" });
        closeWorkspaceModal();
      }
    } else {
      if (wsForm.joinCode) {
        if (joinWorkspace(wsForm.joinCode)) {
          setWsForm({ ...wsForm, joinCode: "" });
          closeWorkspaceModal();
        } else {
          alert("Could not find a workspace with that code.");
        }
      }
    }
  };

  return (
    <>
      {/* ZenAI Chatbot */}
      <ZenAIChat
        isOpen={isChatbotOpen}
        onClose={closeChatbot}
        currentUser={currentUser}
      />

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl p-10 space-y-8 animate-in zoom-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter">
                {editingTask ? "Edit Task" : "New Task"}
              </h2>
              <button
                onClick={closeTaskModal}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleTaskSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                    Title
                  </label>
                  <input
                    required
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                    placeholder="What needs to be done?"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    placeholder="Details..."
                    rows={3}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                      Project
                    </label>
                    <select
                      value={taskForm.projectId}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, projectId: e.target.value })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3.5 rounded-2xl text-xs font-bold appearance-none bg-transparent"
                    >
                      {projects.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          priority: e.target.value as Priority,
                        })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3.5 rounded-2xl text-xs font-bold appearance-none bg-transparent"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                {editingTask && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                      Status
                    </label>
                    <select
                      value={taskForm.status}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          status: e.target.value as TaskStatus,
                        })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3.5 rounded-2xl text-xs font-bold appearance-none bg-transparent"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-[0.98]"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl p-10 space-y-8 animate-in zoom-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter">
                New Project
              </h2>
              <button
                onClick={closeProjectModal}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProjectSubmit} className="space-y-6">
              <div className="space-y-4">
                <input
                  required
                  value={projectForm.name}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, name: e.target.value })
                  }
                  placeholder="Project Name"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                />
                <textarea
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Vision & Goals"
                  rows={3}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={projectForm.priority}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        priority: e.target.value as Priority,
                      })
                    }
                    className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3.5 rounded-2xl text-xs font-bold appearance-none bg-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        endDate: e.target.value,
                      })
                    }
                    className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3.5 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black shadow-xl transition-all"
              >
                Launch Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Workspace Management Modal */}
      {isWorkspaceModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl p-10 space-y-8 animate-in zoom-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter">
                Workspaces
              </h2>
              <button
                onClick={closeWorkspaceModal}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex p-1.5 glass-inset rounded-2xl mb-2">
              <button
                onClick={() => setActiveWsTab("create")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${activeWsTab === "create" ? "bg-white dark:bg-zinc-800 text-blue-600 shadow-sm" : "text-zinc-500"}`}
              >
                <Zap size={14} />
                Create
              </button>
              <button
                onClick={() => setActiveWsTab("join")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${activeWsTab === "join" ? "bg-white dark:bg-zinc-800 text-blue-600 shadow-sm" : "text-zinc-500"}`}
              >
                <UserPlus size={14} />
                Join
              </button>
            </div>

            <form onSubmit={handleWsSubmit} className="space-y-6">
              {activeWsTab === "create" ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-center space-y-2">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Launch a new space for your team.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                      Workspace Name
                    </label>
                    <input
                      required
                      autoFocus
                      value={wsForm.name}
                      onChange={(e) =>
                        setWsForm({ ...wsForm, name: e.target.value })
                      }
                      placeholder="e.g. Design Squad, Engineering, Marketing"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center space-y-2">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Enter a code to join an existing workspace.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                      Workspace Code
                    </label>
                    <input
                      required
                      autoFocus
                      value={wsForm.joinCode}
                      onChange={(e) =>
                        setWsForm({ ...wsForm, joinCode: e.target.value })
                      }
                      placeholder="Enter join code"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-center tracking-widest uppercase"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <span>
                  {activeWsTab === "create"
                    ? "Launch Workspace"
                    : "Join Workspace"}
                </span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalModals;
