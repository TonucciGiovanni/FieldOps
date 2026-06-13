# FieldOps

A mobile task-management app for field operations teams. Built with Expo and React Native, FieldOps helps technicians track, prioritize, and complete work in the field.

## Features

- **Dashboard** — Overview of active tasks and key stats
- **Task list** — Browse and filter open work items
- **Task details** — View full task information, status, and priority
- **Create & edit tasks** — Add new tasks or update existing ones
- **Completed tasks** — Review finished work
- **Profile** — User settings and account info
- **Offline-friendly storage** — Tasks persisted locally with AsyncStorage

> This project is under active development. Feature details will be updated as screens and store logic are implemented.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/) |
| UI | React Native 0.81, React 19 |
| Language | TypeScript |
| Navigation | React Navigation (bottom tabs + stack) |
| State | [Zustand](https://github.com/pmndrs/zustand) |
| Persistence | `@react-native-async-storage/async-storage` |
| Icons | `@expo/vector-icons` |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- [Expo Go](https://expo.dev/go) on a physical device, or an Android emulator / iOS simulator

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd FieldOps
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on a platform**

   ```bash
   npm run android   # Android emulator or device
   npm run ios       # iOS simulator (macOS only)
   npm run web       # Web browser
   ```

   You can also scan the QR code from the Expo CLI with Expo Go on your phone.

## Project Structure

```
FieldOps/
├── App.tsx                 # Root application component
├── app.json                # Expo configuration
├── index.ts                # App entry point
├── assets/                 # Icons, splash screen, favicon
└── src/
    ├── components/         # Reusable UI (TaskCard, badges, StatCard, etc.)
    ├── navigation/         # AppNavigator, TaskStackNavigator
    ├── screens/            # Home, TaskList, TaskDetail, Add/Edit, Completed, Profile
    ├── store/              # Zustand task store (useTaskStore)
    ├── theme/              # Colors, spacing, typography
    └── types.ts            # Shared TypeScript types
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start and open in the browser |

## Configuration

App metadata (name, slug, icons, splash screen) lives in [`app.json`](./app.json). The app targets portrait orientation and uses the React Native new architecture (`newArchEnabled: true`).

## Contributing

1. Create a feature branch from `main`
2. Make your changes and test on at least one platform
3. Open a pull request with a clear description of what changed

## License

Private project — all rights reserved.

---

**Changelog / updates** — Add release notes and milestones below as the project evolves.

### v1.0.0 (in progress)

- Initial Expo scaffold
- Project structure for task management screens and components
