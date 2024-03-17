import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import colors from '../../assets/constants/colors';
import sizes from '../../assets/constants/sizes';
import { default as SearchIcon } from '../../assets/icons/search.svg';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';

const firstStage = sizes.SCREEN_WIDTH - horizontalScale(72);
const secondStage = sizes.SCREEN_WIDTH - horizontalScale(32);
const PADDING = horizontalScale(16);
const INITIAL_WIDTH = moderateScale(24);

interface Props {
  isOpened?: boolean;
  onChangeText?: (text: string) => void;
}

export const HeaderSearch: FC<Props> = ({ isOpened = false, onChangeText }) => {
  const inputRef = useRef<TextInput>(null);
  const [opened, setOpened] = useState(isOpened);
  const [focused, setFocused] = useState(false);
  const width = useSharedValue(INITIAL_WIDTH);

  useEffect(() => {
    if (opened) {
      width.value = withTiming(firstStage, { duration: 1000 });
      if (focused) {
        width.value = withTiming(secondStage, { duration: 500 });
      }
    } else {
      width.value = withTiming(INITIAL_WIDTH, { duration: 1500 });
    }
  }, [focused, opened, width]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handlePress = useCallback(() => {
    if (opened) {
      inputRef.current?.blur();
    }
    setOpened(prev => !prev);
  }, [opened]);

  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
      paddingHorizontal: interpolate(
        width.value,
        [INITIAL_WIDTH, firstStage],
        [0, PADDING],
        Extrapolation.CLAMP,
      ),
      backgroundColor: interpolateColor(
        width.value,
        [INITIAL_WIDTH, firstStage],
        [colors.white, colors.background_gray],
        'RGB',
      ),
    };
  }, []);

  return (
    <Animated.View style={[style, styles.base]}>
      <TouchableOpacity style={styles.button} hitSlop={12} onPress={handlePress}>
        <SearchIcon />
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={onChangeText}
        placeholder="SEARCH"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(40),
    top: -22,
    right: 0,
    overflow: 'hidden',
    borderRadius: moderateScale(5),
  },
  button: {},
  input: {
    flex: 1,
  },
});
