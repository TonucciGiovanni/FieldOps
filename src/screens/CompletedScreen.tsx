import React, { useMemo } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { theme } from '../theme';
import { getTaskTypeIcon, useTaskStore } from '../store/useTaskStore';

function isThisWeek(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return date >= weekAgo && date <= now;
}

function isThisMonth(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

export default function CompletedScreen() {
  const tasks = useTaskStore((s) => s.tasks);

  const completedTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status === 'completed')
      .sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [tasks]);

  const thisWeekCount = completedTasks.filter(
    (t) => t.completedAt && isThisWeek(t.completedAt),
  ).length;

  const thisMonthCount = completedTasks.filter(
    (t) => t.completedAt && isThisMonth(t.completedAt),
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Completed Tasks</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{completedTasks.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsRow}
      >
        <StatCard
          label="Total Completed"
          value={completedTasks.length}
          color={theme.colors.success}
          icon="checkmark-done-outline"
        />
        <StatCard
          label="This Week"
          value={thisWeekCount}
          color={theme.colors.accent}
          icon="calendar-outline"
        />
        <StatCard
          label="This Month"
          value={thisMonthCount}
          color={theme.colors.primaryLight}
          icon="stats-chart-outline"
        />
      </ScrollView>

      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Ionicons
                name={getTaskTypeIcon(item.type)}
                size={20}
                color={theme.colors.success}
              />
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.taskMeta}>{item.county}</Text>
            </View>
            <Text style={styles.completedDate}>
              {item.completedAt
                ? new Date(item.completedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—'}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-circle-outline"
            title="No completed tasks yet"
            subtitle="Tasks you mark as completed will appear here."
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fonts.sizes.xxxl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  countBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    minWidth: 28,
    alignItems: 'center',
  },
  countBadgeText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: theme.fonts.sizes.sm,
  },
  statsRow: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.huge,
    flexGrow: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(35, 134, 54, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  taskMeta: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  completedDate: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
});
