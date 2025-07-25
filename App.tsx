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
import BarbecueMasterChoiceScreen from './android/app/src/screens/BarbecueMasterChoiceScreen';
import BarbecueMasterScreen from './android/app/src/screens/BarbecueMasterScreen';
import ReviewScreen from './android/app/src/screens/ReviewScreen';
import ConfirmationScreen from './android/app/src/screens/ConfirmationScreen';

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
        <Stack.Screen name="BarbecueMasterChoice" component={BarbecueMasterChoiceScreen} />
        <Stack.Screen name="BarbecueMaster" component={BarbecueMasterScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
