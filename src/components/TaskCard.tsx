import React from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { Task } from '../types';
import { theme } from '../theme';
import { getPriorityColor, getTaskTypeIcon, useTaskStore } from '../store/useTaskStore';
import { TaskStackParamList } from '../navigation/TaskStackNavigator';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const navigation = useNavigation<StackNavigationProp<TaskStackParamList>>();
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const completedCount = task.checklist.filter((i) => i.completed).length;
  const totalCount = task.checklist.length;
  const accentColor = getPriorityColor(task.priority);

  const handlePress = () => {
    navigation.navigate('TaskDetail', { taskId: task.id, title: task.title });
  };

  const handleLongPress = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(task.id),
        },
      ],
    );
  };

  const dueDate = new Date(task.dueDate).toLocaleDateString();

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <PriorityBadge priority={task.priority} />
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name={getTaskTypeIcon(task.type)}
            size={14}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.metaText}>
            {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{task.county}</Text>
        </View>

        <Text style={styles.siteId}>{task.siteId}</Text>

        <View style={styles.bottomRow}>
          <StatusBadge status={task.status} />
          <Text style={styles.dueDate}>Due {dueDate}</Text>
          <Text style={styles.checklist}>
            {completedCount}/{totalCount} ✓
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: theme.fonts.sizes.base,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  metaDot: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sizes.sm,
  },
  siteId: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  dueDate: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
  },
  checklist: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primaryLight,
    fontWeight: '600',
    marginLeft: 'auto',
  },
});
