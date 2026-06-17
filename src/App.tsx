import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeArecaNut from './screens/HomeArecaNut';
import Profile from './screens/Profile';
import OutputResultScan from './screens/OutputResultScan';
import Register from './screens/Register';
import Login from './screens/Login';
import HistoryScan from './screens/HistoryScan';
import ArticleDetail from './screens/ArticleDetail';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from './theme';
import { useFonts, Outfit_400Regular, Outfit_700Bold, Outfit_900Black } from '@expo-google-fonts/outfit';
import { LoadingScreen } from './components/LoadingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ Outfit_400Regular, Outfit_700Bold, Outfit_900Black });

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeArecaNut" component={HomeArecaNut} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="OutputResultScan" component={OutputResultScan} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="HistoryScan" component={HistoryScan} />
          <Stack.Screen name="ArticleDetail" component={ArticleDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
