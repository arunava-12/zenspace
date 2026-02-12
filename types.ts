
export type Priority = 'Low' | 'Medium' | 'High';
export type ProjectStatus = 'Active' | 'Planning' | 'Completed' | 'On Hold' | 'Cancelled';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type TaskType = 'Task' | 'Bug' | 'Feature' | 'Improvement';
export type UserRole = 'Admin' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  startDate: string;
  endDate: string;
  leadId: string;
  memberIds: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
}

export interface FileAsset {
  id: string;
  projectId: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  createdAt: string;
  url: string;
}

export interface Comment {
  id: string;
  taskId?: string;
  projectId?: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
}
