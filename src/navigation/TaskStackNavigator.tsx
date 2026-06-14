import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import { theme } from '../theme';

export type TaskStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string; title: string };
  EditTask: { taskId: string };
};

const Stack = createStackNavigator<TaskStackParamList>();

export default function TaskStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{
          title: 'Edit Task',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}
