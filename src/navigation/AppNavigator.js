import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import PreloaderScreen from '../screens/PreloaderScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        detachInactiveScreens: false,
      }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{animationEnabled: false}}
      />
      <Stack.Screen
        name="Preloader"
        component={PreloaderScreen}
        options={{
          cardStyleInterpolator: ({current}) => ({
            card: {opacity: current.progress},
          }),
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          cardStyleInterpolator: ({current}) => ({
            card: {opacity: current.progress},
          }),
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
