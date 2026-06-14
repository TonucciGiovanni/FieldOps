import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TaskPriority } from '../types';
import { theme } from '../theme';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; bg: string; text: string }
> = {
  critical: {
    label: '🔴 Critical',
    bg: 'rgba(255, 123, 114, 0.2)',
    text: theme.colors.critical,
  },
  high: {
    label: '🟠 High',
    bg: 'rgba(255, 166, 87, 0.2)',
    text: theme.colors.high,
  },
  medium: {
    label: '🟡 Medium',
    bg: 'rgba(210, 153, 34, 0.2)',
    text: theme.colors.medium,
  },
  low: {
    label: '🟢 Low',
    bg: 'rgba(63, 185, 80, 0.2)',
    text: theme.colors.low,
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: '600',
  },
});