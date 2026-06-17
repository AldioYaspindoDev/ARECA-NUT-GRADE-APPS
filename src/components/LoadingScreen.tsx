// src/components/LoadingScreen.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRestyleTheme } from '../theme';

export const LoadingScreen = () => {
  const theme = useRestyleTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
