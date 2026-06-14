import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function StatCard({
  label,
  value,
  color = theme.colors.textPrimary,
  icon,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={color}
          style={styles.icon}
        />
      )}
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  icon: {
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: theme.fonts.sizes.xxxl,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
  },
});