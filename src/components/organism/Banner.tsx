import React from 'react';
import { useCallback } from 'react';
import { Image, StyleSheet } from 'react-native';
import colors from '../../assets/constants/colors';
import sizes from '../../assets/constants/sizes';
import Banner1 from '../../assets/images/banner/banner1.jpg';
import Banner2 from '../../assets/images/banner/banner2.jpg';
import Banner3 from '../../assets/images/banner/banner3.jpg';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';
import { Carousel } from '../molecule/Carousel';

type BannerItem = { id: number; image: any };

const banner: Array<BannerItem> = [
  {
    id: 1,
    image: Banner1,
  },
  {
    id: 2,
    image: Banner2,
  },
  {
    id: 3,
    image: Banner3,
  },
];

export const Banner = () => {
  const renderItem = useCallback(({ item }: { item: BannerItem }) => {
    return <Image style={styles.image} source={item.image} />;
  }, []);

  const keyExtractor = useCallback((item: BannerItem) => `slide_${item.id}`, []);

  return (
    <Carousel
      style={styles.carousel}
      items={banner}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    backgroundColor: colors.divider,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  image: {
    width: sizes.SCREEN_WIDTH - horizontalScale(32),
    height: verticalScale(215),
    zIndex: 20,
  },
});
