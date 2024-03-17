import React, { FC, memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategoryName } from '../../api/productApi';
import colors from '../../assets/constants/colors';
import { horizontalScale, verticalScale } from '../../utils/scale';
import { ProductItem } from '../molecule/Product';

interface Props {
  category: string;
  refreshing?: boolean;
}

export const HomeProducts: FC<Props> = memo(({ category, refreshing = false }) => {
  const { data: products, refetch } = useQuery({
    queryKey: ['products/home', category],
    queryFn: () => getProductsByCategoryName({ category }),
  });

  useEffect(() => {
    if (refreshing) {
      refetch();
    }
  }, [refetch, refreshing]);

  return (
    <>
      <View style={styles.base}>
        {products?.products?.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </View>
      <View style={styles.divider} />
    </>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: horizontalScale(15),
    rowGap: verticalScale(16),
  },
  divider: {
    height: verticalScale(1),
    marginTop: verticalScale(24),
    marginBottom: verticalScale(10),
    backgroundColor: colors.divider,
  },
});
