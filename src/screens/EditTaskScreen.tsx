import React, { useState } from 'react';
import {
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
import uuid from 'react-native-uuid';
import { theme } from '../theme';
import { useTaskStore } from '../store/useTaskStore';
import { TaskStackParamList } from '../navigation/TaskStackNavigator';
import { ChecklistItem, TaskPriority, TaskType } from '../types';

const TASK_TYPES: TaskType[] = [
  'installation',
  'maintenance',
  'inspection',
  'repair',
  'calibration',
  'emergency',
];

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'critical'];

type RouteProps = RouteProp<TaskStackParamList, 'EditTask'>;
type NavProp = StackNavigationProp<TaskStackParamList, 'EditTask'>;

export default function EditTaskScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { taskId } = route.params;

  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId));
  const updateTask = useTaskStore((s) => s.updateTask);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [type, setType] = useState<TaskType>(task?.type ?? 'maintenance');
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? 'medium',
  );
  const [county, setCounty] = useState(task?.county ?? '');
  const [siteId, setSiteId] = useState(task?.siteId ?? '');
  const [dueDate, setDueDate] = useState(
    task ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  );
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    task?.checklist ?? [],
  );
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; county?: string }>(
    {},
  );

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Task not found</Text>
      </View>
    );
  }

  const addChecklistItem = () => {
    const label = newChecklistItem.trim();
    if (!label) return;
    setChecklistItems((prev) => [
      ...prev,
      { id: uuid.v4() as string, label, completed: false },
    ]);
    setNewChecklistItem('');
  };

  const removeChecklistItem = (id: string) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const newErrors: { title?: string; county?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!county.trim()) newErrors.county = 'County is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const parsedDueDate = dueDate.trim()
      ? new Date(dueDate.trim()).toISOString()
      : task.dueDate;

    updateTask(taskId, {
      title: title.trim(),
      description: description.trim(),
      type,
      priority,
      county: county.trim(),
      siteId: siteId.trim(),
      dueDate: parsedDueDate,
      checklist: checklistItems,
    });

    navigation.goBack();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.form}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Field label="Title *">
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
          placeholderTextColor={theme.colors.textMuted}
        />
        {submitted && errors.title && (
          <Text style={styles.errorText}>{errors.title}</Text>
        )}
      </Field>

      <Field label="Description">
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the task..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </Field>

      <Field label="Type">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {TASK_TYPES.map((t) => (
            <Pill
              key={t}
              label={t.charAt(0).toUpperCase() + t.slice(1)}
              active={type === t}
              onPress={() => setType(t)}
            />
          ))}
        </ScrollView>
      </Field>

      <Field label="Priority">
        <View style={styles.pillRowWrap}>
          {PRIORITIES.map((p) => (
            <Pill
              key={p}
              label={p.charAt(0).toUpperCase() + p.slice(1)}
              active={priority === p}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>
      </Field>

      <Field label="County *">
        <TextInput
          style={[styles.input, errors.county && styles.inputError]}
          value={county}
          onChangeText={setCounty}
          placeholder="e.g. Nairobi"
          placeholderTextColor={theme.colors.textMuted}
        />
        {submitted && errors.county && (
          <Text style={styles.errorText}>{errors.county}</Text>
        )}
      </Field>

      <Field label="Site ID">
        <TextInput
          style={styles.input}
          value={siteId}
          onChangeText={setSiteId}
          placeholder="e.g. SNS-042"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="characters"
        />
      </Field>

      <Field label="Due Date">
        <TextInput
          style={styles.input}
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.colors.textMuted}
        />
      </Field>

      <Field label="Checklist">
        <View style={styles.checklistInputRow}>
          <TextInput
            style={[styles.input, styles.checklistInput]}
            value={newChecklistItem}
            onChangeText={setNewChecklistItem}
            placeholder="Add checklist item"
            placeholderTextColor={theme.colors.textMuted}
            onSubmitEditing={addChecklistItem}
          />
          <Pressable style={styles.addChipButton} onPress={addChecklistItem}>
            <Text style={styles.addChipButtonText}>Add</Text>
          </Pressable>
        </View>
        <View style={styles.chips}>
          {checklistItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.chip}
              onPress={() => removeChecklistItem(item.id)}
            >
              <Text style={styles.chipText}>{item.label}</Text>
              <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
            </Pressable>
          ))}
        </View>
      </Field>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  form: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.huge,
  },
  field: {
    marginBottom: theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textPrimary,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.fonts.sizes.sm,
    marginTop: theme.spacing.xs,
  },
  pillRow: {
    gap: theme.spacing.sm,
  },
  pillRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  pill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pillText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  checklistInputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  checklistInput: {
    flex: 1,
  },
  addChipButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
  },
  addChipButtonText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textPrimary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  submitButtonText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: theme.fonts.sizes.base,
  },
});
