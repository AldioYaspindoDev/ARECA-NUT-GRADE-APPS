// src/theme/index.ts
import { createTheme, ThemeProvider, useTheme } from '@shopify/restyle';
import { TextStyle, ViewStyle } from 'react-native';

export const theme = createTheme({
  colors: {
    background: '#0A0A0A', // dark background
    card: 'rgba(255,255,255,0.08)',
    primary: 'hsl(210, 60%, 55%)', // teal/blue gradient start
    secondary: 'hsl(260, 55%, 50%)', // violet gradient end
    text: '#FFFFFF',
    muted: '#AAAAAA',
    border: 'rgba(255,255,255,0.12)',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadii: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
  },
  textVariants: {
    header: {
      fontSize: 28,
      fontFamily: 'Inter_900Black',
      color: 'text',
    } as TextStyle,
    title: {
      fontSize: 20,
      fontFamily: 'Inter_700Bold',
      color: 'text',
    } as TextStyle,
    body: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      color: 'text',
    } as TextStyle,
    muted: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: 'muted',
    } as TextStyle,
  },
  breakpoints: {},
});

export type Theme = typeof theme;
export const { ThemeProvider: RestyleProvider, useTheme: useRestyleTheme } = { ThemeProvider, useTheme };
