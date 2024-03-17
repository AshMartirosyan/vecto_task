import React, { forwardRef, memo } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import Text from './Text';
import colors from '../../assets/constants/colors';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';

interface Props extends TextInputProps {
  helperText?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  error?: string;
  isRequired?: boolean;
}

const TextInputComponent = forwardRef<TextInput, Props>(
  ({ error, helperText, wrapperStyle, isRequired, ...rest }, ref) => {
    return (
      <View style={styles.base}>
        {helperText && (
          <Text fontSize={16} style={styles.helperText}>
            {helperText}
            {isRequired && (
              <Text fontSize={16} style={styles.required}>
                *
              </Text>
            )}
          </Text>
        )}
        <View style={[styles.inputWrapper, wrapperStyle]}>
          <TextInput
            ref={ref}
            autoCorrect={false}
            spellCheck={false}
            placeholderTextColor={error ? colors.red : colors.text_black}
            autoCapitalize="none"
            accessible={false}
            style={[styles.input, { color: error ? colors.text_black : undefined }, rest.style]}
            {...rest}
          />
        </View>
        {error && (
          <Text fontSize={12} style={styles.error}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  helperText: {
    fontFamily: 'Gotham-Book',
    color: colors.text_black,
    paddingBottom: verticalScale(10),
  },
  required: {
    color: colors.required_red,
  },
  inputWrapper: { width: '100%' },
  input: {
    fontSize: moderateScale(16),
    color: colors.text_black,
    paddingHorizontal: horizontalScale(12),
  },
  error: {
    color: colors.red,
  },
});

export default memo(TextInputComponent);
