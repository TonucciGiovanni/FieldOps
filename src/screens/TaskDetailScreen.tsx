import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import { theme } from '../theme';
import { getTaskTypeIcon, useTaskStore } from '../store/useTaskStore';
import { TaskStackParamList } from '../navigation/TaskStackNavigator';
import { TaskStatus } from '../types';

const STATUS_OPTIONS: TaskStatus[] = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
];

type RouteProps = RouteProp<TaskStackParamList, 'TaskDetail'>;
type NavProps = StackNavigationProp<TaskStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { taskId } = route.params;

  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId));
  const updateTask = useTaskStore((s) => s.updateTask);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const toggleChecklistItem = useTaskStore((s) => s.toggleChecklistItem);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [notes, setNotes] = useState(task?.notes ?? '');

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Task not found</Text>
      </View>
    );
  }

  const completedCount = task.checklist.filter((i) => i.completed).length;
  const totalCount = task.checklist.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const handleNotesBlur = () => {
    if (notes !== task.notes) {
      updateTask(task.id, { notes });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.badgeRow}>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </View>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Type</Text>
            <View style={styles.gridValueRow}>
              <Ionicons
                name={getTaskTypeIcon(task.type)}
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.gridValue}>
                {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>County</Text>
            <Text style={styles.gridValue}>{task.county}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Site ID</Text>
            <Text style={styles.gridValue}>{task.siteId}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Update Status</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusRow}
      >
        {STATUS_OPTIONS.map((status) => (
          <Pressable
            key={status}
            style={[
              styles.statusPill,
              task.status === status && styles.statusPillActive,
            ]}
            onPress={() => updateTaskStatus(task.id, status)}
          >
            <Text
              style={[
                styles.statusPillText,
                task.status === status && styles.statusPillTextActive,
              ]}
            >
              {status === 'in_progress'
                ? 'In Progress'
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>Description</Text>
      <Text style={styles.description}>{task.description}</Text>

      <Text style={styles.sectionLabel}>
        Checklist ({completedCount}/{totalCount} complete)
      </Text>
      <View style={styles.progressBarBg}>
        <View
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>
      {task.checklist.map((item) => (
        <Pressable
          key={item.id}
          style={styles.checklistItem}
          onPress={() => toggleChecklistItem(task.id, item.id)}
        >
          <Ionicons
            name={item.completed ? 'checkbox' : 'square-outline'}
            size={22}
            color={item.completed ? theme.colors.primary : theme.colors.textMuted}
          />
          <Text
            style={[
              styles.checklistLabel,
              item.completed && styles.checklistCompleted,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.sectionLabel}>Task Details</Text>
      <View style={styles.metaCard}>
        <MetaRow label="Created" value={formatDate(task.createdAt)} />
        <MetaRow label="Updated" value={formatDate(task.updatedAt)} />
        <MetaRow label="Due Date" value={formatDate(task.dueDate)} />
        <MetaRow label="Assigned To" value={task.assignedTo} />
        {task.status === 'completed' && task.completedAt && (
          <MetaRow label="Completed" value={formatDate(task.completedAt)} />
        )}
      </View>

      <Text style={styles.sectionLabel}>Notes</Text>
      <TextInput
        style={styles.notesInput}
        multiline
        numberOfLines={4}
        value={notes}
        onChangeText={setNotes}
        onBlur={handleNotesBlur}
        placeholder="Add notes..."
        placeholderTextColor={theme.colors.textMuted}
      />

      <View style={styles.actions}>
        <Pressable
          style={styles.editButton}
          onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
        >
          <Text style={styles.editButtonText}>Edit Task</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.huge,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  notFoundText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.sizes.lg,
  },
  headerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fonts.sizes.xxl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  gridItem: {
    minWidth: '28%',
  },
  gridLabel: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  gridValue: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sectionLabel: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  statusRow: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  statusPill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  statusPillText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  statusPillTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  description: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  checklistLabel: {
    flex: 1,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textPrimary,
  },
  checklistCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  metaCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
  },
  metaValue: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.sm,
  },
  editButton: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: theme.colors.accent,
    fontWeight: '600',
    fontSize: theme.fonts.sizes.base,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: theme.colors.danger,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: theme.fonts.sizes.base,
  },
});
