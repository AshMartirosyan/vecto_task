import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Product } from '../../api/productApi';
import colors from '../../assets/constants/colors';
import Screen from '../../components/atom/Screen';
import { ProductItem } from '../../components/molecule/Product';
import { useWishlist } from '../../context/WishListProvider';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';

export const Wishlist = () => {
  const { wishlist } = useWishlist();

  const renderItem = useCallback(({ item }: { item: Product }) => {
    return <ProductItem product={item} />;
  }, []);
  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  return (
    <Screen style={styles.base}>
      <FlatList
        columnWrapperStyle={styles.columnWrapperStyle}
        contentContainerStyle={styles.list}
        numColumns={2}
        data={wishlist}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background,
  },
  columnWrapperStyle: { justifyContent: 'space-between' },
  list: {
    paddingVertical: verticalScale(24),
    gap: moderateScale(16),
    paddingHorizontal: horizontalScale(16),
  },
});
