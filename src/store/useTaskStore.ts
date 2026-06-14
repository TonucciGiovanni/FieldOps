import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  Task,
  TaskPriority,
  TaskStatus,
  TaskType,
  Technician,
} from '../types';
import { theme } from '../theme';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function createChecklist(type: TaskType): Task['checklist'] {
  const templates: Record<TaskType, string[]> = {
    installation: [
      'Site survey complete',
      'Power connection verified',
      'Sensor mounted and sealed',
      'Network connectivity confirmed',
      'Baseline reading recorded',
    ],
    maintenance: [
      'Visual inspection complete',
      'Filters cleaned',
      'Calibration checked',
      'Battery replaced',
      'Report submitted',
    ],
    inspection: [
      'Safety check complete',
      'Readings documented',
      'Photo evidence captured',
      'Anomalies flagged',
      'Sign-off obtained',
    ],
    repair: [
      'Fault diagnosed',
      'Replacement parts installed',
      'System tested',
      'Connectivity restored',
      'Incident report filed',
    ],
    calibration: [
      'Reference standards verified',
      'Zero point calibrated',
      'Span calibration complete',
      'Accuracy within tolerance',
      'Calibration certificate logged',
    ],
    emergency: [
      'Safety perimeter established',
      'Critical fault isolated',
      'Emergency repair completed',
      'System operational verified',
      'Escalation report submitted',
    ],
  };

  return templates[type].map((label) => ({
    id: uuid.v4() as string,
    label,
    completed: false,
  }));
}

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const initialTechnician: Technician = {
  name: 'Giovanni Tonucci',
  id: 'TECH-001',
  role: 'Field Technician',
  county: 'Nairobi',
  tasksCompleted: 0,
  activeTaskCount: 0,
};

const initialTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Flow sensor calibration at Nairobi Central Pump Station',
    description:
      'Perform full calibration cycle on primary flow sensors at Nairobi Central Pump Station. Verify readings against reference meter and update firmware configuration if drift exceeds 2%.',
    type: 'calibration',
    priority: 'medium',
    status: 'in_progress',
    county: 'Nairobi',
    siteId: 'SNS-001',
    assignedTo: 'Giovanni Tonucci',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    dueDate: daysFromNow(0),
    completedAt: null,
    notes: 'Reference meter on site. Last calibration 6 months ago.',
    checklist: createChecklist('calibration').map((item, i) => ({
      ...item,
      completed: i < 2,
    })),
  },
  {
    id: 'task-002',
    title: 'Emergency pressure sensor replacement - Mombasa Port Zone',
    description:
      'Critical pressure sensor failure detected at Mombasa Port Zone monitoring node. Replace sensor unit and restore telemetry link to central dashboard immediately.',
    type: 'emergency',
    priority: 'critical',
    status: 'pending',
    county: 'Mombasa',
    siteId: 'SNS-018',
    assignedTo: 'Giovanni Tonucci',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    dueDate: daysFromNow(-1),
    completedAt: null,
    notes: 'Spare sensor unit confirmed in Mombasa depot.',
    checklist: createChecklist('emergency'),
  },
  {
    id: 'task-003',
    title: 'Quarterly inspection - Kisumu Water Treatment Plant',
    description:
      'Conduct scheduled quarterly inspection of all IoT monitoring nodes at Kisumu Water Treatment Plant including pH, turbidity, and chlorine sensors.',
    type: 'inspection',
    priority: 'medium',
    status: 'pending',
    county: 'Kisumu',
    siteId: 'SNS-024',
    assignedTo: 'Giovanni Tonucci',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
    dueDate: daysFromNow(2),
    completedAt: null,
    notes: '',
    checklist: createChecklist('inspection'),
  },
  {
    id: 'task-004',
    title: 'Install new pH monitoring unit - Nakuru Industrial Zone',
    description:
      'Deploy and commission new pH monitoring unit at Nakuru Industrial Zone effluent monitoring point. Configure network gateway and register device in asset management system.',
    type: 'installation',
    priority: 'high',
    status: 'in_progress',
    county: 'Nakuru',
    siteId: 'SNS-031',
    assignedTo: 'Giovanni Tonucci',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(0),
    dueDate: daysFromNow(1),
    completedAt: null,
    notes: 'Gateway firmware v2.4 pre-loaded.',
    checklist: createChecklist('installation').map((item, i) => ({
      ...item,
      completed: i < 3,
    })),
  },
  {
    id: 'task-005',
    title: 'Network connectivity repair - Eldoret Agricultural Hub',
    description:
      'Restore LoRaWAN connectivity at Eldoret Agricultural Hub after intermittent signal loss. Inspect antenna, gateway, and backhaul connection.',
    type: 'repair',
    priority: 'high',
    status: 'pending',
    county: 'Uasin Gishu',
    siteId: 'SNS-037',
    assignedTo: 'Giovanni Tonucci',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    dueDate: daysFromNow(3),
    completedAt: null,
    notes: 'Possible antenna damage from recent storm.',
    checklist: createChecklist('repair'),
  },
  {
    id: 'task-006',
    title: 'Routine maintenance check - Thika River Monitoring Station',
    description:
      'Perform routine maintenance on water level and quality sensors at Thika River Monitoring Station. Clean probes, check solar panel output, and verify data transmission.',
    type: 'maintenance',
    priority: 'low',
    status: 'completed',
    county: 'Kiambu',
    siteId: 'SNS-012',
    assignedTo: 'Giovanni Tonucci',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(7),
    dueDate: daysAgo(7),
    completedAt: daysAgo(7),
    notes: 'All sensors within spec. Solar panel cleaned.',
    checklist: createChecklist('maintenance').map((item) => ({
      ...item,
      completed: true,
    })),
  },
  {
    id: 'task-007',
    title: 'Sensor firmware update - Machakos Valley Station',
    description:
      'Apply firmware update v3.1 to all deployed sensors at Machakos Valley Station. Update includes improved battery management and data compression.',
    type: 'maintenance',
    priority: 'medium',
    status: 'pending',
    county: 'Machakos',
    siteId: 'SNS-045',
    assignedTo: 'Giovanni Tonucci',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    dueDate: daysFromNow(5),
    completedAt: null,
    notes: 'OTA update package downloaded to field tablet.',
    checklist: createChecklist('maintenance'),
  },
  {
    id: 'task-008',
    title: 'Water quality audit - Nyeri Highland Reserve',
    description:
      'Comprehensive water quality audit at Nyeri Highland Reserve monitoring network. Validate sensor accuracy, review historical trends, and document any anomalies.',
    type: 'inspection',
    priority: 'low',
    status: 'pending',
    county: 'Nyeri',
    siteId: 'SNS-052',
    assignedTo: 'Giovanni Tonucci',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
    dueDate: daysFromNow(7),
    completedAt: null,
    notes: '',
    checklist: createChecklist('inspection'),
  },
];

function countActiveTasks(tasks: Task[]): number {
  return tasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress',
  ).length;
}

function countCompletedTasks(tasks: Task[]): number {
  return tasks.filter((t) => t.status === 'completed').length;
}

interface TaskStore {
  tasks: Task[];
  technician: Technician;
  filter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
  searchQuery: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: TaskStatus | 'all') => void;
  setPriorityFilter: (filter: TaskPriority | 'all') => void;
  setSearchQuery: (query: string) => void;
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getStats: () => {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    critical: number;
    overdueCount: number;
  };
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      technician: {
        ...initialTechnician,
        tasksCompleted: countCompletedTasks(initialTasks),
        activeTaskCount: countActiveTasks(initialTasks),
      },
      filter: 'all',
      priorityFilter: 'all',
      searchQuery: '',

      addTask: (task) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...task,
          id: uuid.v4() as string,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => {
          const tasks = [newTask, ...state.tasks];
          return {
            tasks,
            technician: {
              ...state.technician,
              activeTaskCount: countActiveTasks(tasks),
            },
          };
        });
      },

      updateTask: (id, updates) => {
        set((state) => {
          const tasks = state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task,
          );
          return {
            tasks,
            technician: {
              ...state.technician,
              activeTaskCount: countActiveTasks(tasks),
              tasksCompleted: countCompletedTasks(tasks),
            },
          };
        });
      },

      updateTaskStatus: (id, status) => {
        set((state) => {
          const tasks = state.tasks.map((task) => {
            if (task.id !== id) return task;
            const updates: Partial<Task> = {
              status,
              updatedAt: new Date().toISOString(),
            };
            if (status === 'completed') {
              updates.completedAt = new Date().toISOString();
            } else if (task.status === 'completed') {
              updates.completedAt = null;
            }
            return { ...task, ...updates };
          });
          return {
            tasks,
            technician: {
              ...state.technician,
              activeTaskCount: countActiveTasks(tasks),
              tasksCompleted: countCompletedTasks(tasks),
            },
          };
        });
      },

      toggleChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              updatedAt: new Date().toISOString(),
              checklist: task.checklist.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            };
          }),
        }));
      },

      deleteTask: (id) => {
        set((state) => {
          const tasks = state.tasks.filter((task) => task.id !== id);
          return {
            tasks,
            technician: {
              ...state.technician,
              activeTaskCount: countActiveTasks(tasks),
              tasksCompleted: countCompletedTasks(tasks),
            },
          };
        });
      },

      setFilter: (filter) => set({ filter }),
      setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      getFilteredTasks: () => {
        const { tasks, filter, priorityFilter, searchQuery } = get();
        const query = searchQuery.toLowerCase().trim();

        let filtered = tasks.filter((task) => {
          if (filter !== 'all' && task.status !== filter) return false;
          if (priorityFilter !== 'all' && task.priority !== priorityFilter)
            return false;
          if (query) {
            const matches =
              task.title.toLowerCase().includes(query) ||
              task.county.toLowerCase().includes(query) ||
              task.siteId.toLowerCase().includes(query);
            if (!matches) return false;
          }
          return true;
        });

        filtered = [...filtered].sort((a, b) => {
          const statusOrder: Record<TaskStatus, number> = {
            in_progress: 0,
            pending: 1,
            completed: 2,
            cancelled: 3,
          };
          const statusDiff = statusOrder[a.status] - statusOrder[b.status];
          if (statusDiff !== 0) return statusDiff;
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        });

        return filtered;
      },

      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },

      getStats: () => {
        const { tasks } = get();
        const now = new Date();
        return {
          total: tasks.length,
          pending: tasks.filter((t) => t.status === 'pending').length,
          inProgress: tasks.filter((t) => t.status === 'in_progress').length,
          completed: tasks.filter((t) => t.status === 'completed').length,
          cancelled: tasks.filter((t) => t.status === 'cancelled').length,
          critical: tasks.filter(
            (t) => t.priority === 'critical' && t.status !== 'completed',
          ).length,
          overdueCount: tasks.filter(
            (t) =>
              t.status !== 'completed' && new Date(t.dueDate) < now,
          ).length,
        };
      },
    }),
    {
      name: 'fieldops-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getTaskTypeIcon(type: TaskType): keyof typeof import('@expo/vector-icons').Ionicons.glyphMap {
  const icons: Record<TaskType, keyof typeof import('@expo/vector-icons').Ionicons.glyphMap> = {
    installation: 'construct-outline',
    maintenance: 'build-outline',
    inspection: 'search-outline',
    repair: 'hammer-outline',
    calibration: 'options-outline',
    emergency: 'warning-outline',
  };
  return icons[type];
}

export function getPriorityColor(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    critical: theme.colors.critical,
    high: theme.colors.high,
    medium: theme.colors.medium,
    low: theme.colors.low,
  };
  return map[priority];
}
