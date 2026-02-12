import { User, Project, Task, Workspace } from '../types.ts';

// Simulated database - replace with real API endpoints
const simulatedDB = {
  users: new Map<string, User>(),
  projects: new Map<string, Project>(),
  tasks: new Map<string, Task>(),
  workspaces: new Map<string, Workspace>(),
  userWorkspaces: new Map<string, string[]>(), // userId -> workspaceIds
};

// API configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Error handling
export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

// Authentication API
export const authAPI = {
  async login(email: string): Promise<{ user: User; token: string }> {
    try {
      // Replace with real API call:
      // const response = await fetch(`${API_BASE_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();
      
      // Simulated login
      let user = Array.from(simulatedDB.users.values()).find(u => u.email === email);
      if (!user) {
        throw new APIError('User not found', 404);
      }
      
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('zenspace_token', token);
      localStorage.setItem('zenspace_current_user_id', user.id);
      
      return { user, token };
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Login failed');
    }
  },

  async signup(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // Replace with real API call:
      // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password }),
      // });
      // const data = await response.json();

      // Simulated signup
      const existingUser = Array.from(simulatedDB.users.values()).find(u => u.email === email);
      if (existingUser) {
        throw new APIError('Email already exists', 409);
      }

      const userId = `u_${Date.now()}`;
      const newUser: User = {
        id: userId,
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'Member',
      };

      simulatedDB.users.set(userId, newUser);

      // Create default workspace
      const workspaceId = `w_${Date.now()}`;
      const workspace: Workspace = {
        id: workspaceId,
        name: `${name}'s Workspace`,
        ownerId: userId,
      };
      simulatedDB.workspaces.set(workspaceId, workspace);
      simulatedDB.userWorkspaces.set(userId, [workspaceId]);

      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('zenspace_token', token);
      localStorage.setItem('zenspace_current_user_id', userId);

      return { user: newUser, token };
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Signup failed');
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('zenspace_token');
    localStorage.removeItem('zenspace_current_user_id');
  },

  getCurrentToken(): string | null {
    return localStorage.getItem('zenspace_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('zenspace_token');
  },
};

// User API
export const userAPI = {
  async getCurrentUser(): Promise<User> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const user = simulatedDB.users.get(userId);
      if (!user) throw new APIError('User not found', 404);

      return user;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  },

  async getUser(userId: string): Promise<User> {
    try {
      const user = simulatedDB.users.get(userId);
      if (!user) throw new APIError('User not found', 404);
      return user;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  },

  async getUsers(): Promise<User[]> {
    return Array.from(simulatedDB.users.values());
  },
};

// Workspace API
export const workspaceAPI = {
  async getUserWorkspaces(): Promise<Workspace[]> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const workspaceIds = simulatedDB.userWorkspaces.get(userId) || [];
      return workspaceIds
        .map(id => simulatedDB.workspaces.get(id))
        .filter((w): w is Workspace => !!w);
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch workspaces');
    }
  },

  async createWorkspace(name: string): Promise<Workspace> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const workspaceId = `w_${Date.now()}`;
      const workspace: Workspace = {
        id: workspaceId,
        name,
        ownerId: userId,
      };

      simulatedDB.workspaces.set(workspaceId, workspace);
      const userWorkspaces = simulatedDB.userWorkspaces.get(userId) || [];
      simulatedDB.userWorkspaces.set(userId, [...userWorkspaces, workspaceId]);

      return workspace;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to create workspace');
    }
  },
};

// Project API
export const projectAPI = {
  async getProjects(workspaceId: string): Promise<Project[]> {
    try {
      return Array.from(simulatedDB.projects.values()).filter(p => 
        // Filter by workspace - you may need to add workspaceId to Project type
        true
      );
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch projects');
    }
  },

  async getProject(projectId: string): Promise<Project> {
    try {
      const project = simulatedDB.projects.get(projectId);
      if (!project) throw new APIError('Project not found', 404);
      return project;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch project');
    }
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const projectId = `p_${Date.now()}`;
      const newProject: Project = {
        ...project,
        id: projectId,
      };

      simulatedDB.projects.set(projectId, newProject);
      return newProject;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to create project');
    }
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    try {
      const project = simulatedDB.projects.get(projectId);
      if (!project) throw new APIError('Project not found', 404);

      const updated = { ...project, ...updates };
      simulatedDB.projects.set(projectId, updated);
      return updated;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to update project');
    }
  },
};

// Task API
export const taskAPI = {
  async getTasks(projectId?: string): Promise<Task[]> {
    try {
      const tasks = Array.from(simulatedDB.tasks.values());
      return projectId ? tasks.filter(t => t.projectId === projectId) : tasks;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  },

  async getTask(taskId: string): Promise<Task> {
    try {
      const task = simulatedDB.tasks.get(taskId);
      if (!task) throw new APIError('Task not found', 404);
      return task;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch task');
    }
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const taskId = `t_${Date.now()}`;
      const newTask: Task = {
        ...task,
        id: taskId,
      };

      simulatedDB.tasks.set(taskId, newTask);
      return newTask;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to create task');
    }
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const task = simulatedDB.tasks.get(taskId);
      if (!task) throw new APIError('Task not found', 404);

      const updated = { ...task, ...updates };
      simulatedDB.tasks.set(taskId, updated);
      return updated;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to update task');
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      simulatedDB.tasks.delete(taskId);
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  },
};

// Seed initial data (call this once during app initialization)
export const seedData = () => {
  const sampleUser: User = {
    id: 'u1',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo@example.com',
    role: 'Admin',
  };

  simulatedDB.users.set(sampleUser.id, sampleUser);

  const workspace: Workspace = {
    id: 'w1',
    name: 'Demo Workspace',
    ownerId: 'u1',
  };
  simulatedDB.workspaces.set(workspace.id, workspace);
  simulatedDB.userWorkspaces.set('u1', ['w1']);

  const sampleProject: Project = {
    id: 'p1',
    name: 'Sample Project',
    description: 'This is a sample project to get started.',
    status: 'Active',
    priority: 'High',
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    leadId: 'u1',
    memberIds: ['u1'],
  };
  simulatedDB.projects.set(sampleProject.id, sampleProject);
};

// Initialize seed data on module load
seedData();
