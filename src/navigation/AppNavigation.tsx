import React from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateNavigator, PrivateStackParams } from './PrivateNavigation';
import { useAuth } from '../context/AuthProvider';
import { Login } from '../screens';

export type AppStackParams = {
  Private: NavigatorScreenParams<PrivateStackParams>;
  Login: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<AppStackParams>();

export const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Navigator initialRouteName={'Login'}>
      {!isLoggedIn ? (
        <Screen name="Login" component={Login} options={{ headerShown: false }} />
      ) : (
        <Screen name="Private" component={PrivateNavigator} options={{ headerShown: false }} />
      )}
    </Navigator>
  );
};
