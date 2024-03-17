import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { getProduct, Product } from '../api/productApi';
import colors from '../assets/constants/colors';
import { default as BackIcon } from '../assets/icons/back.svg';
import { default as FavoriteIcon } from '../assets/icons/favorite.svg';
import { default as StarIcon } from '../assets/icons/star.svg';
import { default as WishlistIcon } from '../assets/icons/wishlist.svg';
import Loading from '../components/atom/Loading';
import Screen from '../components/atom/Screen';
import Text from '../components/atom/Text';
import Header from '../components/organism/Header';
import { SingleProductBanner } from '../components/organism/SingleProductBanner';
import { useWishlist } from '../context/WishListProvider';
import { PrivateStackParams } from '../navigation/PrivateNavigation';
import { horizontalScale, moderateScale, verticalScale } from '../utils/scale';

export const SingleProduct = () => {
  const route = useRoute<RouteProp<PrivateStackParams, 'SingleProduct'>>();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['products', route.params.id],
    queryFn: () => getProduct(route.params.id),
  });

  const { isFromWishlist, addOrRemoveItem } = useWishlist();
  const { goBack } =
    useNavigation<NativeStackNavigationProp<PrivateStackParams, 'SingleProduct'>>();

  const backHeaderIcon = useMemo(
    () => (
      <TouchableOpacity hitSlop={12} onPress={() => goBack()}>
        <BackIcon />
      </TouchableOpacity>
    ),
    [goBack],
  );

  const wishlistHeaderIcon = useMemo(
    () => (
      <TouchableOpacity
        hitSlop={12}
        onPress={() => product && addOrRemoveItem && addOrRemoveItem(product)}>
        {isFromWishlist && isFromWishlist(product?.id) ? (
          <FavoriteIcon width={24} height={24} />
        ) : (
          <WishlistIcon fill={'#343434'} />
        )}
      </TouchableOpacity>
    ),
    [addOrRemoveItem, isFromWishlist, product],
  );

  const totalPrice = useMemo(
    () => (product ? product?.price - (product?.price * product?.discountPercentage) / 100 : 0),
    [product],
  );

  return (
    <>
      <Loading visible={isLoading} />
      <Screen>
        <Header leftComponent={backHeaderIcon} rightComponent={wishlistHeaderIcon} />
        <ScrollView contentContainerStyle={styles.list}>
          <SingleProductBanner images={product?.images || []} id={product?.id || 0} />
          <View style={styles.infoContainer}>
            <Text fontSize={16} style={styles.title}>
              {product?.title}
            </Text>
            <View style={styles.infoContainerItem}>
              <Text fontSize={14} style={styles.oldPrice}>
                {product?.price || 0}$
              </Text>
              <Text fontSize={16} style={styles.title}>
                {totalPrice}$
              </Text>
            </View>
            <View style={styles.infoContainerItem}>
              <Text fontSize={14} style={styles.infoTitle}>
                Rating
              </Text>
              <View style={styles.rating}>
                <StarIcon />
                <Text fontSize={12} style={styles.infoTitle}>
                  {product?.rating}
                </Text>
              </View>
            </View>
            <View style={styles.infoContainerItem}>
              <Text fontSize={14} style={styles.infoTitle}>
                ID:
                <Text fontSize={14} style={styles.infoValue}>
                  {' '}
                  {product?.stock}
                </Text>
              </Text>
            </View>
            <View style={styles.infoContainerItem}>
              <Text fontSize={14} style={styles.infoTitle}>
                Brand
              </Text>
              <Text fontSize={14} style={styles.infoValue}>
                {product?.brand}
              </Text>
            </View>
            <View style={styles.infoContainerItem}>
              <Text fontSize={14} style={styles.infoTitle}>
                Category
              </Text>
              <Text fontSize={14} style={styles.infoValue}>
                {product?.category}
              </Text>
            </View>
          </View>
          <View style={styles.descContainer}>
            <Text style={styles.desc} fontSize={14}>
              {product?.description}
            </Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.totalHelper} fontSize={10}>
              Total
            </Text>
            <Text style={styles.total} fontSize={16}>
              {totalPrice}$
            </Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} fontSize={14}>
              Add to cart
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingTop: verticalScale(16),
  },
  infoContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
    gap: verticalScale(16),
  },
  title: {
    fontFamily: 'Gotham-Medium',
    color: colors.text_black,
  },
  infoContainerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
  },

  oldPrice: {
    fontFamily: 'Gotham-Light',
    color: colors.red,
    textDecorationLine: 'line-through',
  },
  infoTitle: {
    fontFamily: 'Gotham-Book',
    color: colors.text_black,
  },
  infoValue: { fontFamily: 'Gotham-Light', color: colors.text_black, textTransform: 'capitalize' },
  rating: {
    flexDirection: 'row',
    gap: horizontalScale(2),
  },
  descContainer: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    borderTopWidth: verticalScale(1),
    borderTopColor: colors.border_color,
  },
  desc: {
    fontFamily: 'Gotham-Light',
    color: '#8F8F8F',
    textAlign: 'justify',
    lineHeight: verticalScale(24),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: colors.border_color,
    borderTopWidth: verticalScale(1),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
  },
  footerInfo: { gap: verticalScale(8) },
  totalHelper: { fontFamily: 'Gotham-Book', color: '#777777' },
  total: {
    fontFamily: 'Gotham-Medium',
    color: colors.text_black,
  },
  button: {
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(14),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(5),
  },
  buttonText: {
    fontFamily: 'Gotham-Book',
    color: colors.white,
    textTransform: 'uppercase',
  },
});
