import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { theme } from '../theme';
import {
  formatTimeAgo,
  getGreeting,
  isToday,
  sortByPriority,
  useTaskStore,
} from '../store/useTaskStore';
import { AppTabParamList, RootStackParamList } from '../navigation/AppNavigator';

type HomeNavProp = BottomTabNavigationProp<AppTabParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const rootNavigation =
    navigation.getParent<StackNavigationProp<RootStackParamList>>();
  const tasks = useTaskStore((s) => s.tasks);
  const technician = useTaskStore((s) => s.technician);
  const getStats = useTaskStore((s) => s.getStats);

  const stats = getStats();
  const activeCount = stats.pending + stats.inProgress;

  const todaysTasks = sortByPriority(
    tasks.filter(
      (t) =>
        isToday(t.dueDate) &&
        t.status !== 'completed' &&
        t.status !== 'cancelled',
    ),
  ).slice(0, 3);

  const recentActivity = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  const initials = technician.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{technician.name}</Text>
            <Text style={styles.role}>
              {technician.role} • {technician.county}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          <StatCard label="Total Tasks" value={stats.total} icon="layers-outline" />
          <StatCard
            label="Active"
            value={activeCount}
            color={theme.colors.accent}
            icon="flash-outline"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color={theme.colors.success}
            icon="checkmark-circle-outline"
          />
          <StatCard
            label="Critical"
            value={stats.critical}
            color={theme.colors.critical}
            icon="alert-circle-outline"
          />
          <StatCard
            label="Overdue"
            value={stats.overdueCount}
            color={theme.colors.warning}
            icon="time-outline"
          />
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            {todaysTasks.length > 0 && (
              <Pressable
                onPress={() =>
                  navigation.navigate('Tasks', { screen: 'TaskList' })
                }
              >
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            )}
          </View>
          {todaysTasks.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="No tasks due today"
              subtitle="You're all caught up for today. Check back tomorrow or browse all tasks."
            />
          ) : (
            todaysTasks.map((task) => (
              <Pressable
                key={task.id}
                style={styles.taskItem}
                onPress={() =>
                  navigation.navigate('Tasks', {
                    screen: 'TaskDetail',
                    params: { taskId: task.id, title: task.title },
                  })
                }
              >
                <View style={styles.taskItemContent}>
                  <Text style={styles.taskItemTitle} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskItemMeta}>{task.county}</Text>
                </View>
                <StatusBadge status={task.status} />
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((task) => (
            <View key={task.id} style={styles.activityItem}>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {task.title}
                </Text>
                <Text style={styles.activityTime}>
                  {formatTimeAgo(task.updatedAt)}
                </Text>
              </View>
              <StatusBadge status={task.status} />
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => rootNavigation?.navigate('AddTask')}
          >
            <Ionicons name="add-circle" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.primaryButtonText}>New Task</Text>
          </Pressable>
          <Pressable
            style={styles.outlinedButton}
            onPress={() =>
              navigation.navigate('Tasks', { screen: 'TaskList' })
            }
          >
            <Text style={styles.outlinedButtonText}>View All</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.huge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
  },
  name: {
    fontSize: theme.fonts.sizes.hero,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  role: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  statsRow: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  viewAll: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.primaryLight,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
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
  },
  taskItemContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  taskItemTitle: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  taskItemMeta: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  activityTitle: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textPrimary,
  },
  activityTime: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: theme.fonts.sizes.base,
  },
  outlinedButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  outlinedButtonText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: theme.fonts.sizes.base,
  },
});
