// src/components/GlassCard.tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useRestyleTheme } from '../theme';

export const GlassCard: React.FC<ViewProps> = ({ children, style, ...rest }) => {
  const theme = useRestyleTheme();
  return (
    <View
      style={[styles.card, { backgroundColor: theme.colors.card }, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    // iOS blur not directly available, use rgba background + backdropFilter not supported, but Expo provides
    // We'll use semi-transparent background with shadow for glass effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});
