import React, { FC, memo, PropsWithChildren } from 'react';
import { StatusBar, StatusBarStyle, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../assets/constants/colors';

interface Props {
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  barStyle?: StatusBarStyle;
}

const ScreenComponent: FC<PropsWithChildren<Props>> = ({ edges, style, barStyle, children }) => {
  return (
    <SafeAreaView edges={edges} style={[styles.base, style]}>
      <StatusBar barStyle={barStyle || 'dark-content'} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: colors.white },
});

export default memo(ScreenComponent);
