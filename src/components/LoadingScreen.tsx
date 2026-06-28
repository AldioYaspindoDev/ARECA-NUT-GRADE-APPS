// src/components/LoadingScreen.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Logo3.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#572B18', // Coklat ArecaNut
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  }
});
