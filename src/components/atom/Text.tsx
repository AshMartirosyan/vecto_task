import React, { FC, memo } from 'react';
import { Text, TextProps } from 'react-native';
import { moderateScale } from '../../utils/scale';

export interface ITextProps {
  fontSize?: number;
}

const TextComponent: FC<ITextProps & TextProps> = ({ fontSize = 13, style, children, ...rest }) => {
  return (
    <Text style={[{ fontSize: moderateScale(fontSize) }, style]} {...rest}>
      {children}
    </Text>
  );
};

export default memo(TextComponent);
