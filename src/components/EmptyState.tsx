import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  buttonLabel,
  onButtonPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {buttonLabel && onButtonPress && (
        <Pressable style={styles.button} onPress={onButtonPress}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: theme.fonts.sizes.base,
  },
});
