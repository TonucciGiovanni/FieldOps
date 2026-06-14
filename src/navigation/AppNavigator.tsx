import React from 'react';
import { View } from 'react-native';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CompletedScreen from '../screens/CompletedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskStackNavigator, {
  TaskStackParamList,
} from './TaskStackNavigator';
import { theme } from '../theme';
import { useTaskStore } from '../store/useTaskStore';

export type AppTabParamList = {
  Home: undefined;
  Tasks: NavigatorScreenParams<TaskStackParamList>;
  AddTaskTab: undefined;
  Completed: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<AppTabParamList>;
  AddTask: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

function PlaceholderScreen() {
  return <View />;
}

function TabNavigator() {
  const activeTaskCount = useTaskStore(
    (s) => s.technician.activeTaskCount,
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingTop: 4,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.primaryLight,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
          tabBarBadge: activeTaskCount > 0 ? activeTaskCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.primary,
            fontSize: 10,
          },
        }}
      />
      <Tab.Screen
        name="AddTaskTab"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <Ionicons
              name="add-circle"
              size={32}
              color={theme.colors.primary}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent()?.navigate('AddTask');
          },
        })}
      />
      <Tab.Screen
        name="Completed"
        component={CompletedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={TabNavigator} />
      <RootStack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
    </RootStack.Navigator>
  );
}