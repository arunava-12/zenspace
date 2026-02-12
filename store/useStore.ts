
import { useState, useEffect, useCallback } from 'react';
import { Project, Task, User, Workspace, FileAsset, Comment } from '../types.ts';
import { 
  authAPI, 
  userAPI, 
  workspaceAPI, 
  projectAPI, 
  taskAPI,
  APIError 
} from '../api/index.ts';

export function useStore() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return authAPI.isAuthenticated();
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    return localStorage.getItem('zenspace_active_ws') || '';
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [files, setFiles] = useState<FileAsset[]>([]);

  const [comments, setComments] = useState<Comment[]>([]);
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('zenspace_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Global UI Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [workspaceModalType, setWorkspaceModalType] = useState<'create' | 'join'>('create');

  // Initialize user data on app load
  useEffect(() => {
    const initializeUser = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          setIsLoading(true);
          const user = await userAPI.getCurrentUser();
          setCurrentUser(user);
          
          const userWorkspaces = await workspaceAPI.getUserWorkspaces();
          setWorkspaces(userWorkspaces);
          
          if (userWorkspaces.length > 0) {
            const wsId = localStorage.getItem('zenspace_active_ws') || userWorkspaces[0].id;
            setActiveWorkspaceId(wsId);
          }

          setIsAuthenticated(true);
        } catch (err) {
          setError(err instanceof APIError ? err.message : 'Failed to initialize user');
          setIsAuthenticated(false);
          authAPI.logout();
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializeUser();
  }, []);

  // Fetch projects when workspace changes
  useEffect(() => {
    const fetchProjects = async () => {
      if (activeWorkspaceId && isAuthenticated) {
        try {
          const projectList = await projectAPI.getProjects(activeWorkspaceId);
          setProjects(projectList);
        } catch (err) {
          setError(err instanceof APIError ? err.message : 'Failed to fetch projects');
        }
      }
    };
    
    fetchProjects();
  }, [activeWorkspaceId, isAuthenticated]);

  // Fetch tasks when projects change
  useEffect(() => {
    const fetchTasks = async () => {
      if (isAuthenticated) {
        try {
          const taskList = await taskAPI.getTasks();
          setTasks(taskList);
        } catch (err) {
          setError(err instanceof APIError ? err.message : 'Failed to fetch tasks');
        }
      }
    };
    
    fetchTasks();
  }, [isAuthenticated]);

  // Persist workspace selection
  useEffect(() => {
    if (activeWorkspaceId) {
      localStorage.setItem('zenspace_active_ws', activeWorkspaceId);
    }
  }, [activeWorkspaceId]);

  // Persist theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenspace_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenspace_theme', 'light');
    }
  }, [darkMode]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  const login = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user } = await authAPI.login(email);
      setCurrentUser(user);
      
      const userWorkspaces = await workspaceAPI.getUserWorkspaces();
      setWorkspaces(userWorkspaces);
      
      if (userWorkspaces.length > 0) {
        setActiveWorkspaceId(userWorkspaces[0].id);
      }
      
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string = '') => {
    try {
      setIsLoading(true);
      setError(null);
      const { user } = await authAPI.signup(name, email, password);
      setCurrentUser(user);
      
      const userWorkspaces = await workspaceAPI.getUserWorkspaces();
      setWorkspaces(userWorkspaces);
      
      if (userWorkspaces.length > 0) {
        setActiveWorkspaceId(userWorkspaces[0].id);
      }
      
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setWorkspaces([]);
      setProjects([]);
      setTasks([]);
      setActiveWorkspaceId('');
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Logout failed';
      setError(errorMessage);
    }
  }, []);

  const addProject = useCallback(async (project: Omit<Project, 'id'>) => {
    try {
      const newProject = await projectAPI.createProject(project);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    try {
      const updated = await projectAPI.updateProject(projectId, updates);
      setProjects(prev => prev.map(p => p.id === projectId ? updated : p));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      // Add deleteProject to API if needed
      setProjects(prev => prev.filter(p => p.id !== id));
      setTasks(prev => prev.filter(t => t.projectId !== id));
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const addProjectMember = useCallback((projectId: string, userId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && !p.memberIds.includes(userId)) {
        return { ...p, memberIds: [...p.memberIds, userId] };
      }
      return p;
    }));
  }, []);

  const removeProjectMember = useCallback((projectId: string, userId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, memberIds: p.memberIds.filter(id => id !== userId) };
      }
      return p;
    }));
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await taskAPI.createTask(task);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const updated = await taskAPI.updateTask(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const addFile = useCallback((file: FileAsset) => {
    setFiles(prev => [...prev, file]);
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const addComment = useCallback((comment: Comment) => {
    setComments(prev => [...prev, comment]);
  }, []);

  const updateProfile = useCallback(async (name: string, email: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name, email };
    setCurrentUser(updatedUser);
  }, [currentUser]);

  const updateAvatar = useCallback((avatar: string) => {
    const updatedUser = { ...currentUser, avatar };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  }, [currentUser]);

  const createWorkspace = useCallback(async (name: string) => {
    try {
      const newWs = await workspaceAPI.createWorkspace(name);
      setWorkspaces(prev => [...prev, newWs]);
      setActiveWorkspaceId(newWs.id);
      return newWs;
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Failed to create workspace';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateWorkspace = useCallback((id: string, name: string) => {
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, name } : w));
  }, []);

  const joinWorkspace = useCallback((code: string) => {
    const found = workspaces.find(w => w.id === code || w.name.toLowerCase() === code.toLowerCase());
    if (found) {
      setActiveWorkspaceId(found.id);
      return true;
    }
    return false;
  }, [workspaces]);

  const addMember = useCallback(async (email: string) => {
    try {
      const users = await userAPI.getUsers();
      const exists = users.find(u => u.email === email);
      if (exists) {
        addProjectMember(activeWorkspaceId, exists.id);
      }
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Failed to add member';
      setError(errorMessage);
    }
  }, [activeWorkspaceId, addProjectMember]);

  const openTaskModal = useCallback((task?: Task) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  }, []);
  
  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const openProjectModal = useCallback(() => setIsProjectModalOpen(true), []);
  const closeProjectModal = useCallback(() => setIsProjectModalOpen(false), []);

  const openWorkspaceModal = useCallback((type: 'create' | 'join' = 'create') => {
    setWorkspaceModalType(type);
    setIsWorkspaceModalOpen(true);
  }, []);
  const closeWorkspaceModal = useCallback(() => setIsWorkspaceModalOpen(false), []);

  const openChatbot = useCallback(() => setIsChatbotOpen(true), []);
  const closeChatbot = useCallback(() => setIsChatbotOpen(false), []);

  return {
    isAuthenticated,
    login,
    signup,
    logout,
    currentUser,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    activeWorkspace,
    projects,
    tasks,
    files,
    comments,
    users,
    darkMode,
    setDarkMode,
    addProject,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
    addTask,
    updateTask,
    deleteTask,
    addFile,
    deleteFile,
    addComment,
    updateProfile,
    updateAvatar,
    updateWorkspace,
    createWorkspace,
    joinWorkspace,
    addMember,
    isTaskModalOpen,
    editingTask,
    isProjectModalOpen,
    openTaskModal,
    closeTaskModal,
    openProjectModal,
    closeProjectModal,
    isWorkspaceModalOpen,
    workspaceModalType,
    openWorkspaceModal,
    closeWorkspaceModal,
    isChatbotOpen,
    openChatbot,
    closeChatbot,
    isLoading,
    error,
    setError
  };
}
