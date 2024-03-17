import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import colors from '../../assets/constants/colors';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';

interface CarouselProps<T> extends ViewProps {
  items: Array<T>;
  renderItem: (item: ListRenderItemInfo<T>) => JSX.Element;
  keyExtractor: (item: T) => string;
  style?: StyleProp<ViewStyle>;
  dotSize?: number;
}

export const Carousel = <T,>({
  items,
  renderItem,
  style,
  dotSize = moderateScale(8),
  keyExtractor,
  ...viewProps
}: CarouselProps<T>) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const onScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const totalWidth = event.nativeEvent.layoutMeasurement.width;
    const xPos = event.nativeEvent.contentOffset.x;
    const current = Math.ceil(xPos / totalWidth);
    setScrollPosition(current);
  }, []);

  return (
    <View style={[{ flex: 1 }, style]} {...viewProps}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal={true}
        onScroll={onScrollEnd}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        pagingEnabled
      />
      {items?.length > 1 && (
        <View style={styles.pagination}>
          {items?.map((_, index) => (
            <View
              key={index}
              style={{
                backgroundColor: index === scrollPosition ? colors.black : colors.white,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    flexDirection: 'row',
    gap: horizontalScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: verticalScale(10),
    left: 0,
    right: 0,
  },
});
