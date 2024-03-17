import React from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParams, TabNavigation } from './TabNavigation';
import { WishlistProvider } from '../context/WishListProvider';
import { Products } from '../screens/Products';
import { SingleProduct } from '../screens/SingleProduct';

export type PrivateStackParams = {
  Tab: NavigatorScreenParams<MainTabParams>;
  SingleProduct: { id: number };
  Products: { category: string } | undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<PrivateStackParams>();

export const PrivateNavigator = () => {
  return (
    <WishlistProvider>
      <Navigator initialRouteName={'Tab'}>
        <Screen name="Tab" component={TabNavigation} options={{ headerShown: false }} />
        <Screen name="Products" component={Products} options={{ headerShown: false }} />
        <Screen name="SingleProduct" component={SingleProduct} options={{ headerShown: false }} />
      </Navigator>
    </WishlistProvider>
  );
};
