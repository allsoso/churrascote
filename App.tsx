/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './android/app/src/screens/LoginScreen';
import RegisterScreen from './android/app/src/screens/RegisterScreen';
import SelectPersonsScreen from './android/app/src/screens/SelectPersonsScreen';
import BbqIngredientsScreen from './android/app/src/screens/BbqIngredientsScreen';
import BeverageScreen from './android/app/src/screens/BeverageScreen';

const Stack = createStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="SelectPersons" component={SelectPersonsScreen} />
        <Stack.Screen name="BbqIngredients" component={BbqIngredientsScreen} />
        <Stack.Screen name="Beverage" component={BeverageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
