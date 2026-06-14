import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { TaskStatus } from '../types';
import { theme } from '../theme';

interface StatusBadgeProps {
  status: TaskStatus;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; text: string }
> = {
  pending: {
    label: 'Pending',
    bg: theme.colors.border,
    text: theme.colors.textSecondary,
  },
  in_progress: {
    label: 'In Progress',
    bg: 'rgba(31, 111, 235, 0.2)',
    text: theme.colors.accent,
  },
  completed: {
    label: 'Completed',
    bg: 'rgba(35, 134, 54, 0.2)',
    text: theme.colors.success,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'rgba(218, 54, 51, 0.2)',
    text: theme.colors.danger,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status !== 'in_progress') return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [status, pulseAnim]);

  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      {status === 'in_progress' && (
        <Animated.View
          style={[styles.pulseDot, { opacity: pulseAnim, backgroundColor: config.text }]}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: config.text },
          status === 'cancelled' && styles.strikethrough,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: '600',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
});
