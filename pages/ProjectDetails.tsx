import React, { useState, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  History,
  Sparkles,
  Upload,
  Download,
  Trash2,
  X,
  Check,
  FileIcon,
  Loader2,
  Send,
  PlusCircle,
  Clock,
  Briefcase,
  PlayCircle,
  PauseCircle,
  XCircle,
  Edit3,
  ExternalLink,
  Tag,
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { FileAsset, Comment, Task } from "../types.ts";

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

interface ProjectDetailsProps {
  store: any;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ store }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    tasks,
    files,
    comments,
    users,
    currentUser,
    addTask,
    deleteProject,
    addProjectMember,
    addFile,
    deleteFile,
    addComment,
    openTaskModal,
  } = store;

  const project = projects.find((p: any) => p.id === id);

  if (!project) {
    navigate("/projects");
    return null;
  }
  const projectTasks = tasks.filter((t: any) => t.projectId === id);
  const projectFiles = files.filter((f: any) => f.projectId === id);
  const projectComments = comments.filter((c: any) => c.projectId === id);

  const [activeTab, setActiveTab] = useState("tasks");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const discussionEndRef = useRef<HTMLDivElement>(null);

  const lead = users.find((u: any) => u.id === project?.leadId);

  // Status mapping for visual pills
  const statusConfig = {
    Active: {
      icon: PlayCircle,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    Planning: {
      icon: Edit3,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    Completed: {
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    "On Hold": {
      icon: PauseCircle,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    Cancelled: {
      icon: XCircle,
      color: "text-zinc-600",
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/20",
    },
  };

  const currentStatus =
    statusConfig[project.status as keyof typeof statusConfig] ||
    statusConfig.Active;

  // Deriving timeline events from store data
  const timelineEvents = useMemo(() => {
    const events: any[] = [
      {
        type: "project_created",
        content: `Project "${project.name}" was launched.`,
        time: project.startDate,
        icon: Briefcase,
        color: "blue",
      },
    ];

    projectTasks.forEach((t: any) => {
      events.push({
        type: "task_created",
        content: `New task: "${t.title}" was added.`,
        time: t.createdAt,
        icon: PlusCircle,
        color: "indigo",
      });
      if (t.status === "Done") {
        events.push({
          type: "task_completed",
          content: `Task "${t.title}" was completed by ${users.find((u: any) => u.id === t.assigneeId)?.name || "someone"}.`,
          time: t.dueDate,
          icon: CheckCircle2,
          color: "emerald",
        });
      }
    });

    projectFiles.forEach((f: any) => {
      events.push({
        type: "file_uploaded",
        content: `File "${f.name}" was uploaded.`,
        time: f.createdAt,
        icon: FileText,
        color: "purple",
      });
    });

    return events.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );
  }, [project, projectTasks, projectFiles, users]);

  const handleAISuggestTasks = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 specific actionable project tasks for a project named "${project.name}" with the description: "${project.description}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: {
                  type: Type.STRING,
                  description: "Low, Medium, or High",
                },
                type: {
                  type: Type.STRING,
                  description: "Task, Bug, Feature, or Improvement",
                },
              },
              required: ["title", "description", "priority", "type"],
            },
          },
        },
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      const suggestedTasks = JSON.parse(text);
      suggestedTasks.forEach((st: any) => {
        const newTask = {
          id: `t-ai-${Math.random().toString(36).substr(2, 9)}`,
          projectId: project.id,
          title: st.title,
          description: st.description,
          status: "Todo" as const,
          type: st.type as any,
          priority:
            st.priority === "High"
              ? "HIGH"
              : st.priority === "Medium"
                ? "MEDIUM"
                : "LOW",
          assigneeId: project.leadId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          createdAt: new Date().toISOString(),
        };
        addTask(newTask);
      });
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate AI tasks. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      await deleteProject(project.id);
      navigate("/projects");
    }
  };

  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const newFile: FileAsset = {
        id: `f-${Math.random().toString(36).substr(2, 9)}`,
        projectId: project.id,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.name.split(".").pop() || "file",
        uploadedBy: currentUser?.id || "",
        createdAt: new Date().toLocaleDateString(),
        url: URL.createObjectURL(file),
      };
      addFile(newFile);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newComment: Comment = {
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      projectId: project.id,
      userId: currentUser?.id || "",
      content: message,
      createdAt: new Date().toISOString(),
    };
    addComment(newComment);
    setMessage("");
    setTimeout(
      () => discussionEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const memberIds = project.memberIds || [];

  const availableUsersToAdd = users.filter(
    (u: any) => !memberIds.includes(u.id),
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-blue-500 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tighter">
              {project.name}
            </h1>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border} shadow-sm`}
            >
              <currentStatus.icon size={12} />
              {project.status}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleAISuggestTasks}
            disabled={isGenerating}
            className="glass-card hover:bg-white/40 dark:hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-sm border-blue-500/20"
          >
            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            {isGenerating ? "AI Thinking..." : "AI Suggest Tasks"}
          </button>
          <button
            onClick={() => openTaskModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className={`p-2 glass-card hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors ${showOptionsMenu ? "ring-2 ring-blue-500/50" : ""}`}
            >
              <MoreHorizontal size={20} />
            </button>
            {showOptionsMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                <button className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">
                  Edit Project
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-[2rem] shadow-sm space-y-6 border-zinc-200 dark:border-white/5">
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-2">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                {project.description}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                {
                  label: "Project Lead",
                  value: lead?.name,
                  icon: UserIcon,
                  color: "blue",
                },
                {
                  label: "Timeline",
                  value: `${formatDate(project.startDate)} — ${formatDate(project.endDate)}`,
                  icon: Calendar,
                  color: "emerald",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className={`p-2 glass-inset rounded-xl text-${item.color}-600 dark:text-${item.color}-400`}
                  >
                    <item.icon size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-zinc-500">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-white/5">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-4">
                Team Members
              </h3>
              <div className="flex flex-wrap gap-2">
                {(project.memberIds || []).map((mid: string) => {
                  const m = users.find((u: any) => u.id === mid);
                  return (
                    <img
                      key={mid}
                      src={m?.avatar}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm"
                      title={m?.name}
                    />
                  );
                })}
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-blue-500 hover:border-blue-500 transition-all hover:scale-110 active:scale-95"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <div className="glass-card !bg-opacity-20 p-1.5 rounded-2xl border-white/20 inline-flex shadow-inner w-fit">
            {[
              { id: "tasks", name: "Tasks", icon: CheckCircle2 },
              { id: "files", name: "Files", icon: FileText },
              { id: "discussion", name: "Discussion", icon: MessageSquare },
              { id: "history", name: "Timeline", icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "glass-inset !bg-white dark:!bg-white/10 text-zinc-900 dark:text-white shadow-md"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col min-h-[500px]">
            {activeTab === "tasks" && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-64 group">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="w-full glass-inset !border-transparent py-2.5 pl-9 pr-4 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center gap-2 px-4 py-2.5 glass-card hover:bg-white/40 dark:hover:bg-white/10 rounded-2xl text-sm font-bold transition-all">
                      <Filter size={16} /> Filter
                    </button>
                  </div>
                </div>

                <div className="glass-card rounded-[2.5rem] overflow-hidden border-zinc-200 dark:border-white/5 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="glass-inset !bg-zinc-50/50 dark:!bg-black/20 text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Title</th>
                        <th className="px-8 py-5">Assignee</th>
                        <th className="px-8 py-5 text-center">Priority</th>
                        <th className="px-8 py-5">Due Date</th>
                        <th className="px-8 py-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                      {projectTasks.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-8 py-20 text-center text-zinc-500 font-medium"
                          >
                            No tasks created yet. Try the AI Suggest button!
                          </td>
                        </tr>
                      ) : (
                        projectTasks.map((task: any) => {
                          const assignee = users.find(
                            (u: any) => u.id === task.assigneeId,
                          );
                          return (
                            <tr
                              key={task.id}
                              onClick={() => setSelectedTask(task)}
                              className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] glass-inset ${
                                      task.type === "Bug"
                                        ? "text-rose-600 dark:text-rose-400"
                                        : task.type === "Feature"
                                          ? "text-blue-600 dark:text-blue-400"
                                          : "text-zinc-600 dark:text-zinc-400"
                                    }`}
                                  >
                                    {task.type.charAt(0)}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold tracking-tight">
                                      {task.title}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase">
                                      {task.type}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={assignee?.avatar}
                                    className="w-7 h-7 rounded-full border border-white dark:border-zinc-800 shadow-sm"
                                    alt=""
                                  />
                                  <span className="text-xs font-bold">
                                    {assignee?.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-5 text-center">
                                <span
                                  className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                                    task.priority?.toLowerCase() === "high"
                                      ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                      : task.priority?.toLowerCase() ===
                                          "medium"
                                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                        : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                  }`}
                                >
                                  {task.priority?.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-xs text-zinc-500 font-bold tracking-widest">
                                {task.dueDate}
                              </td>
                              <td className="px-8 py-5 text-right">
                                <span
                                  className={`text-[10px] font-black px-3 py-1.5 rounded-full glass-inset shadow-sm uppercase tracking-widest`}
                                >
                                  {task.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "files" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div className="relative group">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Search files..."
                      className="glass-inset !border-transparent py-2.5 pl-9 pr-4 rounded-2xl text-sm outline-none w-64 font-medium"
                    />
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                      <span>
                        {isUploading ? "Uploading..." : "Upload File"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {projectFiles.length === 0 ? (
                    <div className="py-32 text-center glass-card rounded-[2rem] border-dashed border-2 border-zinc-200 dark:border-white/10">
                      <FileText
                        size={48}
                        className="mx-auto text-zinc-200 dark:text-zinc-800 mb-4"
                      />
                      <p className="text-zinc-500 font-bold">
                        No documents uploaded yet.
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        Upload PDFs, DOCX or DOC files for this project.
                      </p>
                    </div>
                  ) : (
                    projectFiles.map((file: FileAsset) => {
                      const uploader = users.find(
                        (u: any) => u.id === file.uploadedBy,
                      );
                      return (
                        <div
                          key={file.id}
                          className="glass-card p-4 rounded-2xl border border-zinc-200 dark:border-white/5 flex items-center justify-between group hover:shadow-lg transition-all hover:bg-white dark:hover:bg-white/[0.02]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                              <FileIcon size={24} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold tracking-tight">
                                {file.name}
                              </h4>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                                {file.size} • {file.type.toUpperCase()} •{" "}
                                {file.createdAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-2">
                              <img
                                src={uploader?.avatar}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-xs font-bold text-zinc-500">
                                {uploader?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={file.url}
                                download={file.name}
                                className="p-2.5 hover:bg-blue-500/10 text-blue-600 rounded-xl transition-colors"
                                title="Download"
                              >
                                <Download size={18} />
                              </a>
                              <button
                                onClick={() => deleteFile(file.id)}
                                className="p-2.5 hover:bg-rose-500/10 text-rose-600 rounded-xl transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === "discussion" && (
              <div className="flex-1 flex flex-col glass-card rounded-[2rem] border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden animate-in fade-in duration-500 h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar max-h-[500px]">
                  {projectComments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4 opacity-50">
                      <MessageSquare size={48} />
                      <p className="font-bold">Start the conversation</p>
                    </div>
                  ) : (
                    projectComments.map((comment: any) => {
                      const sender = users.find(
                        (u: any) => u.id === comment.userId,
                      );
                      const isMe = sender?.id === currentUser?.id;
                      return (
                        <div
                          key={comment.id}
                          className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                        >
                          <img
                            src={sender?.avatar}
                            className="w-8 h-8 rounded-full flex-shrink-0 mt-1 shadow-sm"
                            alt=""
                          />
                          <div
                            className={`space-y-1 max-w-[80%] ${isMe ? "text-right" : ""}`}
                          >
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {sender?.name}
                              </span>
                              <span className="text-[10px] font-medium text-zinc-400 uppercase">
                                {new Date(comment.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            </div>
                            <div
                              className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-tl-none font-medium"}`}
                            >
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={discussionEndRef} />
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 bg-zinc-50 dark:bg-black/20 border-t border-zinc-100 dark:border-white/5"
                >
                  <div className="relative group">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full glass-inset !bg-white dark:!bg-white/5 p-4 pr-14 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "history" && (
              <div className="glass-card rounded-[2rem] border-zinc-200 dark:border-white/5 shadow-sm p-8 animate-in fade-in duration-500 overflow-y-auto max-h-[500px]">
                <div className="space-y-8 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800"></div>

                  {timelineEvents.map((event, i) => (
                    <div key={i} className="relative pl-12 group">
                      <div
                        className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-zinc-50 dark:border-zinc-950 flex items-center justify-center z-10 ${colorMap[event.color]} shadow-sm`}
                      >
                        <event.icon size={14} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                            <Clock size={10} />
                            {formatDate(event.time)}
                          </span>
                        </div>
                        <p className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                          {event.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Slide-over / Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-xl rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in duration-500">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${
                        selectedTask.type === "Bug"
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          : selectedTask.type === "Feature"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                      }`}
                    >
                      {selectedTask.type}
                    </span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      ID: {selectedTask.id}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter leading-none">
                    {selectedTask.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 py-6 border-y border-zinc-100 dark:border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Assignee
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        users.find((u: any) => u.id === selectedTask.assigneeId)
                          ?.avatar
                      }
                      className="w-10 h-10 rounded-xl shadow-md"
                    />
                    <div>
                      <p className="text-sm font-bold">
                        {
                          users.find(
                            (u: any) => u.id === selectedTask.assigneeId,
                          )?.name
                        }
                      </p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase">
                        Member
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedTask.status === "Done"
                          ? "bg-emerald-500"
                          : selectedTask.status === "In Progress"
                            ? "bg-blue-500 animate-pulse"
                            : "bg-zinc-300 dark:bg-zinc-600"
                      }`}
                    />
                    <span className="text-sm font-bold">
                      {selectedTask.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Priority
                  </p>
                  <div className="flex items-center gap-2">
                    <Tag
                      size={14}
                      className={
                        selectedTask.priority === "High"
                          ? "text-rose-600"
                          : selectedTask.priority === "Medium"
                            ? "text-amber-600"
                            : "text-zinc-500"
                      }
                    />
                    <span className="text-sm font-bold">
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Due Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-zinc-400" />
                    <span className="text-sm font-bold">
                      {selectedTask.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Description
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                  {selectedTask.description ||
                    "No description provided for this task."}
                </p>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  onClick={() => navigate("/tasks")}
                  className="flex-1 py-4 glass-card hover:bg-white/40 dark:hover:bg-white/10 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ExternalLink size={16} /> Open full view
                </button>
                <button
                  onClick={() => {
                    openTaskModal(selectedTask);
                    setSelectedTask(null);
                  }}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  Update Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md rounded-[2.5rem] border border-zinc-200 dark:border-white/10 shadow-2xl p-10 space-y-8 animate-in zoom-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter">
                Add Member
              </h2>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {availableUsersToAdd.length === 0 ? (
                <p className="text-center text-zinc-500 text-sm py-4 font-bold">
                  All workspace members are in the project.
                </p>
              ) : (
                availableUsersToAdd.map((u: any) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      addProjectMember(project.id, u.id);
                      setShowAddMemberModal(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-blue-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-10 h-10 rounded-xl" />
                      <div className="text-left">
                        <p className="text-sm font-bold tracking-tight">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-black uppercase">
                          {u.role}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check size={14} />
                    </div>
                  </button>
                ))
              )}
            </div>

            <button
              onClick={() => setShowAddMemberModal(false)}
              className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black transition-all hover:opacity-90 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
