import React, { memo, useCallback } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../../assets/constants/colors';
import CategoryImages from '../../assets/images/categories';
import { PrivateStackParams } from '../../navigation/PrivateNavigation';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';
import Text from '../atom/Text';

export const Category = memo(({ name }: { name: string }) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<PrivateStackParams, 'Tab'>>();

  const handlePress = useCallback(() => {
    navigate('Products', { category: name });
  }, [name, navigate]);
  return (
    <ImageBackground style={styles.base} source={(CategoryImages as Record<string, any>)[name]}>
      <TouchableOpacity style={styles.overlap} onPress={handlePress}>
        <Text style={styles.text} fontSize={16}>
          {name}
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: verticalScale(130),
    overflow: 'hidden',
    borderRadius: moderateScale(10),
  },
  overlap: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  text: {
    fontFamily: 'Gotham-Medium',
    textTransform: 'uppercase',
    color: colors.white,
  },
});
