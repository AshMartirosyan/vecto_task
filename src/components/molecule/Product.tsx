import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CachedImage } from './CachedImage';
import { Product } from '../../api/productApi';
import colors from '../../assets/constants/colors';
import { default as FavoriteIcon } from '../../assets/icons/favorite.svg';
import { default as StarIcon } from '../../assets/icons/star.svg';
import { default as WishlistIcon } from '../../assets/icons/wishlist.svg';
import { useWishlist } from '../../context/WishListProvider';
import { PrivateStackParams } from '../../navigation/PrivateNavigation';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';
import Text from '../atom/Text';

export const ProductItem = ({ product }: { product: Product }) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<PrivateStackParams, 'Tab'>>();
  const { addOrRemoveItem } = useWishlist();
  const { isFromWishlist } = useWishlist();

  const handleFavorite = useCallback(() => {
    addOrRemoveItem && addOrRemoveItem(product);
  }, [addOrRemoveItem, product]);

  const onProduct = useCallback(() => {
    navigate('SingleProduct', { id: product.id });
  }, [navigate, product.id]);

  return (
    <TouchableOpacity style={styles.base} onPress={onProduct}>
      <CachedImage
        src={product.thumbnail}
        cacheKey={`/products/${product.id}`}
        style={styles.image}
      />
      <Text style={styles.title} fontSize={12}>
        {product.title}
      </Text>
      <View style={styles.info}>
        <View style={styles.rating}>
          <StarIcon />
          <Text fontSize={12} style={styles.ratingText}>
            {product.rating}
          </Text>
        </View>
        <Text fontSize={14} style={styles.price}>
          {product.price + '$'}
        </Text>
      </View>
      <TouchableOpacity style={styles.favorite} hitSlop={8} onPress={handleFavorite}>
        {isFromWishlist && isFromWishlist(product.id) ? (
          <FavoriteIcon />
        ) : (
          <WishlistIcon width={20} height={20} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { width: moderateScale(164), gap: verticalScale(10), position: 'relative' },
  image: {
    width: '100%',
    height: moderateScale(164),
    borderRadius: moderateScale(10),
  },
  title: {
    fontFamily: 'Gotham-Book',
    textTransform: 'uppercase',
  },
  info: { flexDirection: 'row', justifyContent: 'space-between' },
  rating: { flexDirection: 'row', gap: horizontalScale(2), alignItems: 'center' },
  ratingText: { fontFamily: 'Gotham-Book', color: colors.text_black },
  price: { fontFamily: 'Gotham-Medium', color: colors.text_black },
  favorite: {
    position: 'absolute',
    top: moderateScale(10),
    right: moderateScale(10),
  },
});
