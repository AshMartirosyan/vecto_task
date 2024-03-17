import React from 'react';
import { FC, memo, ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import colors from '../../assets/constants/colors';
import { horizontalScale, verticalScale } from '../../utils/scale';
import Text from '../atom/Text';

interface Props {
  leftComponent?: JSX.Element;
  rightComponent?: Maybe<JSX.Element>;
  hasSearch?: ReactNode;
  onBack?: Function;
  style?: StyleProp<ViewStyle>;
  title?: string;
}

const Header: FC<Props> = ({ leftComponent, rightComponent, title, style }) => {
  return (
    <View style={[styles.base, style]}>
      <View style={styles.left}>{leftComponent}</View>
      {title && (
        <Text fontSize={16} style={styles.title}>
          {title}
        </Text>
      )}
      <View style={styles.right}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(48),
    paddingHorizontal: horizontalScale(16),
    position: 'relative',
  },
  left: {},
  right: {},
  title: {
    fontFamily: 'Gotham-Medium',
    color: colors.text_black,
  },
});

export default memo(Header);
