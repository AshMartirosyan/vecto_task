import React, { FC, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrivateStackParams } from './PrivateNavigation';
import colors from '../assets/constants/colors';
import sizes from '../assets/constants/sizes';
import { default as CategoriesIcon } from '../assets/icons/categories.svg';
import { default as HomeIcon } from '../assets/icons/home.svg';
import { default as Logo } from '../assets/icons/logo.svg';
import { default as ProfileIcon } from '../assets/icons/person.svg';
import { default as SearchIcon } from '../assets/icons/search.svg';
import { default as WishlistIcon } from '../assets/icons/wishlist.svg';
import TabItem from '../components/atom/TabItem';
import { Categories, Home, Profile, Wishlist } from '../screens';
import { horizontalScale, moderateScale, verticalScale } from '../utils/scale';

export type MainTabParams = {
  Home: undefined;
  Categories: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<MainTabParams>();

const tabBarIcon =
  (name: keyof MainTabParams) =>
  ({ focused }: { focused: boolean }) => {
    switch (name) {
      case 'Home':
        return <TabItem Icon={HomeIcon} text="Home" focused={focused} />;
      case 'Categories':
        return <TabItem Icon={CategoriesIcon} text="Categories" focused={focused} />;
      case 'Wishlist':
        return <TabItem Icon={WishlistIcon} text="Wishlist" focused={focused} />;
      case 'Profile':
        return <TabItem Icon={ProfileIcon} text="Profile" focused={focused} />;
    }
  };

interface Props {
  navigation: NativeStackNavigationProp<PrivateStackParams, 'Tab'>;
}

export const TabNavigation: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const homeLeftIcon = useCallback(
    () => <Logo height={verticalScale(26)} width={horizontalScale(43)} />,
    [],
  );

  const searchHeaderIcon = useCallback(
    () => (
      <TouchableOpacity hitSlop={12} onPress={() => navigation.navigate('Products')}>
        <SearchIcon />
      </TouchableOpacity>
    ),
    [navigation],
  );

  return (
    <Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: colors.white,
          height: insets.bottom + sizes.TAB_HEIGHT,
          borderTopWidth: 0,
          elevation: 0,
          shadowOffset: {
            width: 0,
            height: 0,
          },
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          textTransform: 'uppercase',
          fontSize: moderateScale(16),
          fontFamily: 'Gotham-Medium',
          color: colors.text_black,
        },
        headerLeftContainerStyle: { paddingLeft: horizontalScale(16) },
        headerRightContainerStyle: { paddingRight: horizontalScale(16) },
        headerStyle: {
          height: verticalScale(48),
        },
      }}
      initialRouteName="Home">
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: tabBarIcon('Home'),
          headerTitleStyle: { display: 'none' },
          headerLeft: homeLeftIcon,
          headerRight: searchHeaderIcon,
        }}
      />
      <Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarIcon: tabBarIcon('Categories'),
          headerRight: searchHeaderIcon,
        }}
      />
      <Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          tabBarIcon: tabBarIcon('Wishlist'),
          headerRight: searchHeaderIcon,
        }}
      />
      <Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: tabBarIcon('Profile'),
        }}
      />
    </Navigator>
  );
};
