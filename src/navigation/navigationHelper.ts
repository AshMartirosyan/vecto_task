import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParams } from './AppNavigation';

export type AppNavigationProp = NativeStackNavigationProp<AppStackParams, 'Private'>;
export const navigationRef = createRef<NavigationContainerRef<AppStackParams>>();
