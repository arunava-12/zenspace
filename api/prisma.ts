import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Error handling
export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

const SALT_ROUNDS = 10;

// Authentication API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new APIError('User not found', 404);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new APIError('Invalid password', 401);
      }

      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('zenspace_token', token);
      localStorage.setItem('zenspace_current_user_id', user.id);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error instanceof Error ? error.message : 'Login failed');
    }
  },

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new APIError('Email already exists', 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          role: UserRole.MEMBER
        }
      });

      // Create default workspace
      const workspace = await prisma.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          ownerId: newUser.id
        }
      });

      // Add user to workspace
      await prisma.workspaceUser.create({
        data: {
          userId: newUser.id,
          workspaceId: workspace.id
        }
      });

      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('zenspace_token', token);
      localStorage.setItem('zenspace_current_user_id', newUser.id);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof APIError) throw error;
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
  }
};

// User API
export const userAPI = {
  async getCurrentUser(): Promise<any> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) throw new APIError('User not found', 404);

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  },

  async getUser(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) throw new APIError('User not found', 404);

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  },

  async getUsers(): Promise<any[]> {
    try {
      const users = await prisma.user.findMany();
      return users.map(u => {
        const { password: _, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }
};

// Workspace API
export const workspaceAPI = {
  async getUserWorkspaces(): Promise<any[]> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const workspaceUsers = await prisma.workspaceUser.findMany({
        where: { userId },
        include: { workspace: true }
      });

      return workspaceUsers.map(wu => wu.workspace);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch workspaces');
    }
  },

  async createWorkspace(name: string): Promise<any> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const workspace = await prisma.workspace.create({
        data: {
          name,
          ownerId: userId
        }
      });

      // Add user to workspace
      await prisma.workspaceUser.create({
        data: {
          userId,
          workspaceId: workspace.id
        }
      });

      return workspace;
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error instanceof Error ? error.message : 'Failed to create workspace');
    }
  }
};

// Project API
export const projectAPI = {
  async getProjects(workspaceId: string): Promise<any[]> {
    try {
      return await prisma.project.findMany({
        where: { workspaceId },
        include: {
          lead: { select: { id: true, name: true, email: true, avatar: true } },
          users: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
          tasks: { select: { id: true, status: true } }
        }
      });
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch projects');
    }
  },

  async getProject(projectId: string): Promise<any> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          lead: { select: { id: true, name: true, email: true, avatar: true } },
          users: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
          tasks: true,
          files: true
        }
      });

      if (!project) throw new APIError('Project not found', 404);
      return project;
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch project');
    }
  },

  async createProject(data: any): Promise<any> {
    try {
      const userId = localStorage.getItem('zenspace_current_user_id');
      if (!userId) throw new APIError('No user logged in', 401);

      const project = await prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
          status: data.status || 'ACTIVE',
          priority: data.priority || 'MEDIUM',
          progress: data.progress || 0,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          workspaceId: data.workspaceId,
          leadId: userId
        }
      });

      // Add lead as project member
      await prisma.projectUser.create({
        data: {
          userId,
          projectId: project.id
        }
      });

      return project;
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error instanceof Error ? error.message : 'Failed to create project');
    }
  },

  async updateProject(projectId: string, updates: any): Promise<any> {
    try {
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          ...updates,
          startDate: updates.startDate ? new Date(updates.startDate) : undefined,
          endDate: updates.endDate ? new Date(updates.endDate) : undefined
        }
      });

      return project;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to update project');
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    try {
      await prisma.project.delete({
        where: { id: projectId }
      });
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to delete project');
    }
  }
};

// Task API
export const taskAPI = {
  async getTasks(projectId?: string): Promise<any[]> {
    try {
      return await prisma.task.findMany({
        where: projectId ? { projectId } : {},
        include: {
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true, email: true, avatar: true } },
          comments: true,
          files: true
        }
      });
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  },

  async getTask(taskId: string): Promise<any> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true, email: true, avatar: true } },
          comments: true,
          files: true
        }
      });

      if (!task) throw new APIError('Task not found', 404);
      return task;
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error instanceof Error ? error.message : 'Failed to fetch task');
    }
  },

  async createTask(data: any): Promise<any> {
    try {
      const task = await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status || 'TODO',
          type: data.type || 'TASK',
          priority: data.priority || 'MEDIUM',
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          projectId: data.projectId,
          assigneeId: data.assigneeId
        }
      });

      return task;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to create task');
    }
  },

  async updateTask(taskId: string, updates: any): Promise<any> {
    try {
      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...updates,
          dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined
        }
      });

      return task;
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to update task');
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await prisma.task.delete({
        where: { id: taskId }
      });
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }
};

// Export PrismaClient for direct use if needed
export { prisma };
