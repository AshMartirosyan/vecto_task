import React, { FC, memo } from 'react';
import { StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Text from './Text';
import colors from '../../assets/constants/colors';
import { moderateScale } from '../../utils/scale';
// import {StyleSheet, View} from 'react-native';

// const BaseComponent = styled(Animated.View)<{focused: boolean}>`
//   background-color: ${({focused}) => focused && colors.background2};
//   border-radius: ${moderateScale(24)}px;
//   width: ${moderateScale(48)}px;
//   height: ${moderateScale(48)}px;
//   justify-content: center;
//   align-items: center;
// `;

interface TabIconProps {
  Icon: FC<SvgProps>;
  focused: boolean;
  text: string;
}

const TabIcon: FC<TabIconProps> = ({ Icon, focused, text }) => {
  return (
    <>
      <Icon style={styles.icon} fill={focused ? colors.primary : colors.inactive} />
      <Text
        style={[styles.text, { color: focused ? colors.primary : colors.inactive }]}
        fontSize={10}>
        {text}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
  text: {},
});

export default memo(TabIcon);
