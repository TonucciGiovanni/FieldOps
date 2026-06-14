import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { useTaskStore } from '../store/useTaskStore';

export default function ProfileScreen() {
  const technician = useTaskStore((s) => s.technician);
  const getStats = useTaskStore((s) => s.getStats);

  const stats = getStats();
  const completionRate =
    stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const initials = technician.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Sign out not available in demo mode',
      [{ text: 'OK' }],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{technician.name}</Text>
          <Text style={styles.role}>
            {technician.role} • {technician.county}
          </Text>
          <Text style={styles.techId}>{technician.id}</Text>
        </View>

        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{technician.tasksCompleted}</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.colors.accent }]}>
              {technician.activeTaskCount}
            </Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {completionRate}%
            </Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            label="Notification Preferences"
            trailing={
              <Switch
                value={true}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.textPrimary}
              />
            }
          />
          <SettingRow
            label="Dark Mode"
            trailing={
              <Switch
                value={true}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.textPrimary}
              />
            }
          />
          <SettingRow
            label="County Assignment"
            trailing={
              <Text style={styles.settingValue}>{technician.county}</Text>
            }
          />
          <SettingRow
            label="App Version"
            trailing={<Text style={styles.settingValue}>1.0.0</Text>}
            isLast
          />
        </View>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  label,
  trailing,
  isLast = false,
}: {
  label: string;
  trailing: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.settingRow, !isLast && styles.settingRowBorder]}>
      <Text style={styles.settingLabel}>{label}</Text>
      {trailing}
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
    paddingTop: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarText: {
    fontSize: theme.fonts.sizes.display,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  name: {
    fontSize: theme.fonts.sizes.xxxl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  role: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  techId: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xxxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    fontSize: theme.fonts.sizes.xxxl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xxxl,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLabel: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textPrimary,
  },
  settingValue: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: theme.colors.danger,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  signOutText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: theme.fonts.sizes.base,
  },
});
