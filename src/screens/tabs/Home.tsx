import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
// import { useGetCategoriesQuery } from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/productApi';
import colors from '../../assets/constants/colors';
import Loading from '../../components/atom/Loading';
import Screen from '../../components/atom/Screen';
import Text from '../../components/atom/Text';
import { Banner } from '../../components/organism/Banner';
import { HomeProducts } from '../../components/organism/HomeProducts';
import { PrivateStackParams } from '../../navigation/PrivateNavigation';
import { horizontalScale, verticalScale } from '../../utils/scale';

export const Home = () => {
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const {
    data: categories,
    isLoading,
    refetch,
    isSuccess,
    isError,
  } = useQuery({ queryKey: ['products/categories'], queryFn: getCategories });

  const { navigate } = useNavigation<NativeStackNavigationProp<PrivateStackParams, 'Tab'>>();

  useEffect(() => {
    if ((isSuccess || isError) && isUpdating) {
      setUpdating(false);
    }
  }, [isError, isSuccess, isUpdating]);

  const navigateToSingleCategory = useCallback(
    (category: string) => () => navigate('Products', { category }),
    [navigate],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => {
      return (
        <View style={styles.sectionHeader}>
          <Text fontSize={16} style={styles.sectionTitle}>
            {section.title}
          </Text>
          <TouchableOpacity onPress={navigateToSingleCategory(section.title)}>
            <Text fontSize={12} style={styles.seeAll}>
              SEE ALL
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [navigateToSingleCategory],
  );

  const renderItem = ({ item }: { item: string }) => {
    return <HomeProducts category={item} refreshing={isUpdating} />;
  };
  const keyExtractor = useCallback((item: string, index: number) => item + index, []);

  const data = useMemo(() => {
    return categories?.map(cat => ({ title: cat, data: [cat] })) || [];
  }, [categories]);

  const onRefresh = useCallback(() => {
    refetch();
    setUpdating(true);
  }, [refetch]);
  return (
    <>
      <Loading visible={isLoading} />
      <Screen>
        <SectionList
          nestedScrollEnabled={true}
          sections={data}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={Banner}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isUpdating}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          removeClippedSubviews
        />
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
  },
  sectionTitle: {
    fontFamily: 'Gotham-Medium',
    textTransform: 'uppercase',
    color: colors.text_black,
  },
  seeAll: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontFamily: 'Gotham-Bold',
  },
  divider: {
    marginVertical: verticalScale(12),
    height: verticalScale(1),
    width: '100%',
    backgroundColor: colors.divider,
  },
});
