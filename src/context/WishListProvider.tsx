import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthProvider';
import { Product } from '../api/productApi';

interface WishlistState {
  wishlist: Array<Product>;
  addOrRemoveItem?: (product: Product) => void;
  isFromWishlist?: (id?: number) => boolean;
}

const WishlistContext = createContext<WishlistState>({
  wishlist: [],
});

interface Props {
  children?: JSX.Element;
}

export const WishlistProvider: FC<Props> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Array<Product>>([]);
  const { user } = useAuth();

  const addOrRemoveItem = useCallback(
    (product: Product) => {
      const index = wishlist.findIndex(item => item.id === product.id);

      if (index > -1) {
        setWishlist(prev => prev.filter(item => item.id !== product.id));
      } else {
        setWishlist(prev => prev.concat(product));
      }
    },
    [wishlist],
  );

  const isFromWishlist = useCallback(
    (id?: number) => !!wishlist.find(item => item.id === id),
    [wishlist],
  );

  const storeContext = useCallback(async () => {
    try {
      if (user) {
        const serializedData = JSON.stringify(wishlist);
        await AsyncStorage.setItem(`wishlist_${user.id}`, serializedData);
      }
      console.log('Context stored successfully');
    } catch (error) {
      console.error('Error storing context:', error);
    }
  }, [user, wishlist]);

  useEffect(() => {
    storeContext();
  }, [storeContext, wishlist]);

  useLayoutEffect(() => {
    (async () => {
      if (user?.id) {
        await AsyncStorage.getItem(`wishlist_${user.id}`).then(value => {
          if (value) {
            try {
              const initialWishlist = JSON.parse(value) as Array<Product>;
              setWishlist(initialWishlist);
            } catch (err) {}
          }
        });
      }
    })();
  }, [user?.id]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addOrRemoveItem, isFromWishlist }}
      children={children}
    />
  );
};

export const useWishlist = () => useContext(WishlistContext);
