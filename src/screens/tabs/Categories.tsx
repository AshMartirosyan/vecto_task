import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/productApi';
import colors from '../../assets/constants/colors';
import Loading from '../../components/atom/Loading';
import Screen from '../../components/atom/Screen';
import { Category } from '../../components/molecule/Category';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';

export const Categories = () => {
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const {
    data: categories,
    isLoading,
    refetch,
    isSuccess,
    isError,
  } = useQuery({ queryKey: ['products/categories'], queryFn: getCategories });

  useEffect(() => {
    if ((isSuccess || isError) && isUpdating) {
      setUpdating(false);
    }
  }, [isError, isSuccess, isUpdating]);

  const renderItem = useCallback(({ item }: { item: string }) => {
    return <Category name={item} />;
  }, []);

  const keyExtractor = useCallback((item: string, index: number) => {
    return item + index;
  }, []);

  const onRefresh = useCallback(() => {
    refetch();
    setUpdating(true);
  }, [refetch]);

  return (
    <>
      <Loading visible={isLoading} />
      <Screen style={styles.base}>
        <FlatList
          contentContainerStyle={styles.list}
          data={categories}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={isUpdating}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background,
  },

  list: {
    paddingVertical: verticalScale(24),
    gap: moderateScale(16),
    paddingHorizontal: horizontalScale(16),
  },
});
