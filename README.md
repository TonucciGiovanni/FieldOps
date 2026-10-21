# FieldOps 🔧

> A React Native task management app for IoT field operations teams 
> working across Kenya's counties. Built to demonstrate CRUD operations, 
> persistent state management, and complex navigation patterns in 
> React Native.

---

## 📱 Screenshots

| Home | Task List | Task Detail | Add Task |
|------|-----------|-------------|----------|
| ![Home](./screenshots/home.png) | ![Tasks](./screenshots/tasks.png) | ![Detail](./screenshots/detail.png) | ![Add](./screenshots/add.png) |

> Screenshots taken on Expo Go iOS and Android

---

## Overview

FieldOps is a field technician task tracker built for IoT infrastructure 
teams operating across Kenya's 47 counties. Technicians use it to log 
site visits, manage work orders, track task progress through checklists, 
and maintain a record of completed jobs all with full offline support 
through local persistence.

The app covers real-world field operations workflows: an installation 
technician in Kisumu can create a task, work through a checklist on 
site, update the status to completed, and see their performance stats 
update on the profile screen all without an internet connection.

---

## Features

- **Dashboard** Personalised greeting, daily task summary, stat cards, 
  and recent activity feed
- **Full CRUD task management** Create, view, edit, and delete tasks 
  with full form validation
- **Priority system** Four levels: Critical, High, Medium, Low with 
  colour-coded visual indicators throughout
- **Status workflow** Pending → In Progress → Completed → Cancelled 
  with one-tap status updates
- **Interactive checklists** Per-task checklists with completion 
  progress bar and tap-to-toggle items
- **Advanced filtering** Filter by status and priority simultaneously, 
  with live search across title, county, and site ID
- **Persistent local storage** Tasks survive app restarts via Zustand 
  persist middleware and AsyncStorage
- **Completed tasks archive** Full history of finished work sorted 
  by completion date
- **Technician profile** Performance stats including completion rate, 
  active task count, and total completed
- **County-based organisation** Tasks tagged by Kenyan county and 
  site ID for field team context
- **TypeScript throughout** Fully typed components, store, navigation, 
  and data layer

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 54 |
| Language | TypeScript |
| UI | React Native 0.81 |
| State Management | Zustand with persist middleware |
| Persistence | AsyncStorage |
| Navigation | React Navigation v6 (Bottom Tabs + Stack) |
| Icons | @expo/vector-icons (Ionicons) |
| ID Generation | react-native-uuid |

---

## Project Structure
FieldOps/
├── App.tsx                          # Entry point NavigationContainer
│                                    # + SafeAreaProvider
└── src/
├── types.ts                     # Task, ChecklistItem, Technician
│                                # TypeScript interfaces and union types
├── theme/
│   └── index.ts                 # Colors, spacing, borderRadius,
│                                # font sizes
├── store/
│   └── useTaskStore.ts          # Zustand store with AsyncStorage
│                                # persistence all state and actions
├── navigation/
│   ├── AppNavigator.tsx         # Bottom tab navigator
│   └── TaskStackNavigator.tsx   # Stack navigator for task flow
├── components/
│   ├── TaskCard.tsx             # List item with priority border accent
│   ├── StatusBadge.tsx          # Pending / In Progress / Completed pill
│   ├── PriorityBadge.tsx        # Critical / High / Medium / Low pill
│   ├── EmptyState.tsx           # Reusable empty state with icon
│   └── StatCard.tsx             # Metric card for stats rows
└── screens/
├── HomeScreen.tsx           # Dashboard with stats and today's tasks
├── TaskListScreen.tsx       # Filtered and searchable task list
├── TaskDetailScreen.tsx     # Full detail, checklist, status update
├── AddTaskScreen.tsx        # New task form with validation
├── EditTaskScreen.tsx       # Pre-populated edit form
├── CompletedScreen.tsx      # Completed tasks archive
└── ProfileScreen.tsx        # Technician profile and stats

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- [Expo Go](https://expo.dev/go) on your iOS or Android device (SDK 54)

### Install and run

```bash
git clone https://github.com/TonucciGiovanni/FieldOps.git
cd FieldOps
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone. The app launches with 
8 pre-seeded tasks covering real IoT field operation scenarios across 
Kenyan counties so you can explore all features immediately.

---

## Architecture Notes

**Persistent state** — The Zustand store uses the `persist` middleware 
with AsyncStorage as the storage engine. Every task creation, update, 
status change, and checklist toggle is automatically persisted to the 
device. Tasks survive app restarts with no extra code in the components.

**Stack inside Tabs navigation** — The Tasks tab contains a full stack 
navigator (TaskList → TaskDetail → EditTask). This means drilling into 
a task pushes a new screen onto the stack while keeping the bottom tabs 
visible. The Add Task tab uses a `tabPress` listener to navigate 
imperatively to AddTaskScreen as a modal rather than switching tabs.

**CRUD pattern** — All data operations go through the Zustand store:
- `addTask` — generates UUID, sets timestamps, prepends to tasks array
- `updateTask` — maps over tasks, merges updates into matching ID
- `updateTaskStatus` — updates status, sets completedAt if completed, 
  increments technician stats
- `toggleChecklistItem` — nested update: finds task, finds item, 
  toggles completed boolean
- `deleteTask` — filters out matching ID

**Computed getters** — `getFilteredTasks()` and `getStats()` use 
`get()` to read current state and compute derived values. Components 
call these directly — no selector libraries needed.

---

## Roadmap

- [ ] Backend API integration with real job dispatch system
- [ ] Photo capture for site visit evidence
- [ ] GPS check-in when technician arrives on site
- [ ] Offline sync when connectivity is restored
- [ ] Push notifications for new task assignments
- [ ] Team view — see tasks assigned to other technicians
- [ ] Export completed task report as PDF

---

## Author

**Giovanni Tonucci** — Full Stack Developer, Nairobi Kenya

[GitHub](https://github.com/TonucciGiovanni) · 
[LinkedIn](https://linkedin.com/in/giovanni-tonucci)

---

## License

MIT
