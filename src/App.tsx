import { Text, View } from 'react-native';
import HomeArecaNut from './screens/HomeArecaNut';
import Profile from './screens/Profile';
import OutputResultScan from './screens/OutputResultScan';
import Register from './screens/Register';
import Login from './screens/Login';
import HistoryScan from './screens/HistoryScan';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
      <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false}}>
              <Stack.Screen key={"HomeArecaNut"} name={"HomeArecaNut"} component={HomeArecaNut}/>
              <Stack.Screen key={"Profile"} name={"Profile"} component={Profile}/>
              <Stack.Screen key={"OutputResultScan"} name={"OutputResultScan"} component={OutputResultScan}/>
              <Stack.Screen key={"Register"} name={"Register"} component={Register}/>
              <Stack.Screen key={"Login"} name={"Login"} component={Login}/>
              <Stack.Screen key={"HistoryScan"} name={"HistoryScan"} component={HistoryScan}/>
            </ Stack.Navigator>
      </NavigationContainer>
  );
}
