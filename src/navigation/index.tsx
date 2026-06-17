import React, { useEffect } from "react";
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from "@/stores/useAuthStore";

import Login from "@/screens/Login";
import Register from "@/screens/Register";
import HomeArecaNut from "@/screens/HomeArecaNut";
import Profile from "@/screens/Profile";
import OutputResultScan from "@/screens/OutputResultScan";
import HistoryScan from "@/screens/HistoryScan";
import ArticleDetail from "@/screens/ArticleDetail";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  HomeArecaNut: undefined;
  Profile: undefined;
  OutputResultScan: undefined;
  HistoryScan: undefined;
  ArticleDetail: { article: any };
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isAuthLoading);
  const loadStorageToken = useAuthStore((state) => state.loadStorageToken);

  useEffect(() => {
    loadStorageToken();
  }, []);

  if(isLoading){
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeArecaNut" component={HomeArecaNut} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="OutputResultScan" component={OutputResultScan} />
        <Stack.Screen name="HistoryScan" component={HistoryScan} />
        <Stack.Screen name="ArticleDetail" component={ArticleDetail} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}