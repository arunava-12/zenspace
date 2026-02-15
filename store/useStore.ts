import { useState, useEffect, useCallback } from "react";
import { User } from "../types";

class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

const API_BASE = "https://zenspace-backend-hsfl.onrender.com/api";

export function useStore() {
  // Authentication is bootstrapped from the server. Start as `false` and set
  // `bootstrapped` once the initial fetch completes so UI components that
  // depend on `currentUser` won't crash during the async load.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("userId");
  });

  const [bootstrapped, setBootstrapped] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("zenspace_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const updateProfile = (name: string, email: string) => {
    setCurrentUser((prev) => (prev ? { ...prev, name, email } : prev));
  };

  const updateAvatar = (avatar: string) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, avatar };
      localStorage.setItem("zenspace_user", JSON.stringify(updated));
      return updated;
    });
  };

  // Workspaces
  const [workspaces, setWorkspaces] = useState<Array<any>>(() => {
    // basic default workspace for new installs
    const defaultWs = {
      id: "demo-workspace",
      name: "Demo's Workspace",
      ownerId: "",
    };
    return [defaultWs];
  });

  const [activeWorkspace, setActiveWorkspace] = useState<any>(() => {
    const saved = localStorage.getItem("activeWorkspace");

    if (saved) {
      return JSON.parse(saved);
    }

    return { id: "demo-workspace", name: "Demo's Workspace" };
  });

  const setActiveWorkspaceId = (id: string) => {
    const ws = workspaces.find((w) => w.id === id);
    if (ws) {
      setActiveWorkspace(ws);
      localStorage.setItem("activeWorkspace", JSON.stringify(ws));
    }
  };

  const updateWorkspace = (id: string, name: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === id ? { ...ws, name } : ws)),
    );
    if (activeWorkspace?.id === id)
      setActiveWorkspace((aw: any) => ({ ...aw, name }));
  };

  // Simple in-memory collections used across the UI
  const [projects, setProjects] = useState<Array<any>>([]);
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [users, setUsers] = useState<Array<User>>(() =>
    currentUser ? [currentUser] : [],
  );
  // Keep users array in sync with logged-in user
  useEffect(() => {
    if (currentUser) {
      setUsers((prev) => {
        if (!currentUser) return prev;
        return prev.some((u) => u.id === currentUser.id)
          ? prev
          : [currentUser, ...prev];
      });
    }
  }, [currentUser]);
  const [files, setFiles] = useState<Array<any>>([]);
  const [comments, setComments] = useState<Array<any>>([]);

  // Modals / UI state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceModalType, setWorkspaceModalType] = useState<
    "create" | "join" | undefined
  >(undefined);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  const openWorkspaceModal = (type: "create" | "join" = "create") => {
    setWorkspaceModalType(type);
    setIsWorkspaceModalOpen(true);
  };
  const closeWorkspaceModal = () => setIsWorkspaceModalOpen(false);

  const openTaskModal = (task?: any) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  };
  const closeTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const openProjectModal = () => setIsProjectModalOpen(true);
  const closeProjectModal = () => setIsProjectModalOpen(false);
  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);

  // CRUD helpers
  const addTask = (t: any) => setTasks((prev) => [t, ...prev]);
  const updateTask = (t: any) =>
    setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x)));
  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const addProject = async (project: any) => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...project,
          workspaceId: activeWorkspace.id, // IMPORTANT
        }),
      });

      const data = await res.json();
      setProjects((prev) => [data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Server delete failed");
      }

      // update UI only after server success
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTasks((prev) => prev.filter((t) => t.projectId !== id));
    } catch (err) {
      console.error("Delete project failed", err);
      alert("Failed to delete project from server");
    }
  };

  const addProjectMember = (projectId: string, userId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              memberIds: Array.from(new Set([...(p.memberIds || []), userId])),
            }
          : p,
      ),
    );
  };

  const addFile = (f: any) => setFiles((prev) => [f, ...prev]);
  const deleteFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const addComment = (c: any) => setComments((prev) => [c, ...prev]);

  const createWorkspace = async (name: string) => {
    try {
      const res = await fetch(
        "https://zenspace-backend-hsfl.onrender.com/api/workspaces",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            ownerId: currentUser.id,
          }),
        },
      );

      const data = await res.json();

      setWorkspaces((prev) => [data, ...prev]);
      setActiveWorkspace(data);
      localStorage.setItem("activeWorkspace", JSON.stringify(data));

      return data;
    } catch (err) {
      console.error("Workspace create failed", err);
    }
  };

  const joinWorkspace = (joinCode: string) => {
    // simple fake join that creates a workspace with the provided code
    const ws = createWorkspace(joinCode);
    return ws;
  };

  // ---------------- THEME ----------------
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("zenspace_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("zenspace_theme", "light");
    }
  }, [darkMode]);

  // ---------------- FETCH CURRENT USER ----------------
  useEffect(() => {
    // 1️⃣ FIRST: Try localStorage
    const savedUser = localStorage.getItem("zenspace_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setBootstrapped(true);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me/${userId}`);
        if (!res.ok) {
          localStorage.removeItem("userId");
          setBootstrapped(true);
          return;
        }

        const data = await res.json();

        // 2️⃣ THEN: Override with server data
        setCurrentUser(data.user);

        // Optional but recommended → keep localStorage updated
        localStorage.setItem("zenspace_user", JSON.stringify(data.user));

        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
      } finally {
        setBootstrapped(true);
      }
    };

    fetchUser();
  }, []);

  // ---------------- FETCH PROJECTS ----------------
  useEffect(() => {
    const fetchProjects = async () => {
      if (!activeWorkspace?.id || !currentUser?.id) return;

      const res = await fetch(
        `${API_BASE}/projects?userId=${currentUser.id}&workspaceId=${activeWorkspace.id}`,
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]); // safety
      }
    };

    fetchProjects();
  }, [activeWorkspace, currentUser]);

  // ---------------- FETCH WORKSPACES ----------------
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!currentUser?.id) return;

      try {
        const res = await fetch(
          `${API_BASE}/workspaces?userId=${currentUser.id}`,
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setWorkspaces(data);
        } else {
          setWorkspaces([]);
        }
      } catch (err) {
        console.error("Fetch workspaces failed");
      }
    };

    fetchWorkspaces();
  }, [currentUser]);

  const deleteWorkspace = async (id: string) => {
    await fetch(`${API_BASE}/workspaces/${id}`, {
      method: "DELETE",
    });

    setActiveWorkspace((prev) => {
      const remaining = workspaces.filter((w) => w.id !== id);
      return remaining[0] || null;
    });

    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
  };

  // ---------------- LOGIN ----------------
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new APIError(err.error || "Request failed");
      }
      const data = await res.json();

      localStorage.setItem("userId", data.user.id);
      setCurrentUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---------------- SIGNUP ----------------
  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new APIError(data.error);

        localStorage.setItem("userId", data.user.id);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Signup failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ---------------- LOGOUT ----------------
  const logout = useCallback(() => {
    localStorage.removeItem("userId");
    setCurrentUser(null);
    setUsers([]); // <-- ADD THIS LINE
    setIsAuthenticated(false);
  }, []);

  return {
    // -------- AUTH --------
    isAuthenticated,
    bootstrapped,
    login,
    signup,
    logout,
    currentUser,

    // -------- THEME --------
    darkMode,
    setDarkMode,

    // -------- PROFILE --------
    updateProfile,
    updateAvatar,

    // -------- WORKSPACES --------
    workspaces,
    activeWorkspace,
    setActiveWorkspaceId,
    updateWorkspace,
    createWorkspace,
    joinWorkspace,
    deleteWorkspace,

    // -------- PROJECTS --------
    projects,
    addProject,
    deleteProject,
    addProjectMember,

    // -------- TASKS --------
    tasks,
    addTask,
    updateTask,
    deleteTask,

    // -------- USERS --------
    users,

    // -------- FILES / COMMENTS --------
    files,
    addFile,
    deleteFile,
    comments,
    addComment,

    // -------- MODALS --------
    isTaskModalOpen,
    openTaskModal,
    closeTaskModal,

    isProjectModalOpen,
    openProjectModal,
    closeProjectModal,

    isWorkspaceModalOpen,
    openWorkspaceModal,
    closeWorkspaceModal,
    workspaceModalType,

    isChatbotOpen,
    openChatbot,
    closeChatbot,

    // -------- LOADING / ERROR --------
    isLoading,
    error,
    setError,
  };
}
