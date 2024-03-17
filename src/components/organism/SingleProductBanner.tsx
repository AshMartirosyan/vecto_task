import React, { FC, useMemo } from 'react';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Product } from '../../api/productApi';
import colors from '../../assets/constants/colors';
import sizes from '../../assets/constants/sizes';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';
import { CachedImage } from '../molecule/CachedImage';
import { Carousel } from '../molecule/Carousel';

type BannerItem = { id: string; image: string };

interface Props {
  id: Product['id'];
  images: Product['images'];
}

export const SingleProductBanner: FC<Props> = ({ images, id }) => {
  const imagesList = useMemo(
    () => images.map((image, index) => ({ id: 'image' + index, image })),
    [images],
  );

  const renderItem = useCallback(
    ({ item }: { item: BannerItem }) => {
      return <CachedImage style={styles.image} src={item.image} cacheKey={`/product/${id}`} />;
    },
    [id],
  );

  const keyExtractor = useCallback((item: BannerItem) => `slide_${item.id}`, []);

  return (
    <Carousel
      style={styles.carousel}
      items={imagesList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    marginHorizontal: horizontalScale(16),
    backgroundColor: colors.divider,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  image: {
    width: sizes.SCREEN_WIDTH - horizontalScale(32),
    height: verticalScale(343),
    zIndex: 20,
  },
});
