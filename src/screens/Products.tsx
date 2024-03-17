import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getAllProducts,
  getProductsByCategoryName,
  Product,
  ResponseInfo,
  searchProduct,
} from '../api/productApi';
import colors from '../assets/constants/colors';
import { default as BackIcon } from '../assets/icons/back.svg';
import Loading from '../components/atom/Loading';
import Screen from '../components/atom/Screen';
import { HeaderSearch } from '../components/molecule/HeaderSearch';
import { ProductItem } from '../components/molecule/Product';
import Header from '../components/organism/Header';
import { useDebounce } from '../hooks/useDebounce';
import { PrivateStackParams } from '../navigation/PrivateNavigation';
import { horizontalScale, moderateScale, verticalScale } from '../utils/scale';

type ProductsResponse = ResponseInfo & { products: Array<Product> };

export const Products = () => {
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const route = useRoute<RouteProp<PrivateStackParams, 'Products'>>();
  const { goBack } =
    useNavigation<NativeStackNavigationProp<PrivateStackParams, 'SingleProduct'>>();
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 500);

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isSuccess,
  } = useInfiniteQuery<ProductsResponse>({
    queryKey: ['products/all', route.params?.category],
    queryFn: ({ pageParam }) =>
      route.params?.category
        ? getProductsByCategoryName({
            category: route.params?.category,
            skip: pageParam as number,
            limit: 10,
          })
        : getAllProducts({ skip: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.products.length === 10) {
        return pages.length * 10;
      }
    },
    enabled: !debSearch,
  });

  const { data: searchedData } = useQuery<ProductsResponse>({
    queryKey: ['product', debSearch],
    queryFn: () => searchProduct(debSearch),
    enabled: !!debSearch,
  });

  const products = useMemo(() => {
    if (searchedData && debSearch) {
      return searchedData.products;
    }

    return data?.pages.reduce<Array<Product>>((prev, curr: ProductsResponse) => {
      if (curr) {
        return [...prev, ...curr.products];
      }
      return [...prev];
    }, []);
  }, [data?.pages, debSearch, searchedData]);

  useEffect(() => {
    if ((isSuccess || isError) && isUpdating) {
      setUpdating(false);
    }
  }, [isError, isSuccess, isUpdating]);

  const backHeaderIcon = useMemo(
    () => (
      <TouchableOpacity hitSlop={4} onPress={() => goBack()}>
        <BackIcon />
      </TouchableOpacity>
    ),
    [goBack],
  );

  const renderItem = useCallback(({ item }: { item: Product }) => {
    return <ProductItem product={item} />;
  }, []);
  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const ListFooterComponent = useMemo(
    () => (isFetchingNextPage ? <ActivityIndicator size={'large'} color={colors.primary} /> : null),
    [isFetchingNextPage],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !debSearch) {
      fetchNextPage();
    }
  }, [debSearch, fetchNextPage, hasNextPage]);

  const onRefresh = useCallback(() => {
    refetch();
    setUpdating(true);
  }, [refetch]);

  return (
    <>
      <Loading visible={isLoading} />
      <Screen style={styles.base}>
        <Header
          rightComponent={
            !route.params?.category ? (
              <HeaderSearch isOpened={!route.params?.category} onChangeText={setSearch} />
            ) : null
          }
          leftComponent={backHeaderIcon}
        />
        <FlatList
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapperStyle}
          numColumns={2}
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={ListFooterComponent}
          onEndReached={onEndReached}
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
  columnWrapperStyle: { justifyContent: 'space-between' },
  list: {
    paddingVertical: verticalScale(24),
    gap: moderateScale(16),
    paddingHorizontal: horizontalScale(16),
  },
});
