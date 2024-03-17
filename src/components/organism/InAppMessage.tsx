import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { verticalScale } from '../../utils/scale';

export const InAppMessage = () => {
  const insets = useSafeAreaInsets();
  return (
    <Toast position={'top'} topOffset={insets.top + verticalScale(16)} visibilityTime={4000} />
  );
};
