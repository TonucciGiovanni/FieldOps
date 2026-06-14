export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskType =
  | 'installation'
  | 'maintenance'
  | 'inspection'
  | 'repair'
  | 'calibration'
  | 'emergency';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  county: string;
  siteId: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  completedAt: string | null;
  notes: string;
  checklist: ChecklistItem[];
}

export interface Technician {
  name: string;
  id: string;
  role: string;
  county: string;
  tasksCompleted: number;
  activeTaskCount: number;
}