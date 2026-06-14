import React from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { theme } from '../theme';
import { useTaskStore } from '../store/useTaskStore';
import { TaskPriority, TaskStatus } from '../types';

const STATUS_FILTERS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

const PRIORITY_FILTERS: { label: string; value: TaskPriority | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export default function TaskListScreen() {
  const filter = useTaskStore((s) => s.filter);
  const priorityFilter = useTaskStore((s) => s.priorityFilter);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const setFilter = useTaskStore((s) => s.setFilter);
  const setPriorityFilter = useTaskStore((s) => s.setPriorityFilter);
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
  const getFilteredTasks = useTaskStore((s) => s.getFilteredTasks);

  const filteredTasks = getFilteredTasks();

  const renderFilterPill = (
    label: string,
    isActive: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      key={label}
      style={[styles.pill, isActive && styles.pillActive]}
      onPress={onPress}
    >
      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={18}
          color={theme.colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks, counties, site IDs..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STATUS_FILTERS.map(({ label, value }) =>
          renderFilterPill(label, filter === value, () => setFilter(value)),
        )}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {PRIORITY_FILTERS.map(({ label, value }) =>
          renderFilterPill(
            label,
            priorityFilter === value,
            () => setPriorityFilter(value),
          ),
        )}
      </ScrollView>

      <Text style={styles.resultCount}>
        Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No tasks found"
            subtitle="Try adjusting your filters or search query."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fonts.sizes.xxxl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textPrimary,
  },
  filterRow: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
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
  resultCount: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.huge,
    flexGrow: 1,
  },
});
