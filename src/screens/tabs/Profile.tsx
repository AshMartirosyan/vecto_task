import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import RNFetchBlob from 'rn-fetch-blob';
import { getMe } from '../../api/authApi';
import colors from '../../assets/constants/colors';
import { default as BackIcon } from '../../assets/icons/back.svg';
import { default as LogoutIcon } from '../../assets/icons/logout.svg';
import Loading from '../../components/atom/Loading';
import Screen from '../../components/atom/Screen';
import Text from '../../components/atom/Text';
import { CachedImage, defaultPath } from '../../components/molecule/CachedImage';
import { useAuth } from '../../context/AuthProvider';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';

export const Profile = () => {
  const queryClient = useQueryClient();

  const { setIsLoggedIn, isLoggedIn } = useAuth();
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth/getMe'],
    queryFn: getMe,
    enabled: isLoggedIn,
  });

  const handleLogOut = useCallback(async () => {
    try {
      setIsLoggedIn && setIsLoggedIn(false);
      queryClient.clear();
      await AsyncStorage.removeItem('token');
      await RNFetchBlob.fs.unlink(defaultPath);
    } catch (err) {
      console.log(err);
    }
  }, [queryClient, setIsLoggedIn]);
  console.log({ user: user?.image });
  return (
    <>
      <Loading visible={isLoading} />
      <Screen style={styles.base}>
        <View>
          {!!user && (
            <View style={styles.profile}>
              <CachedImage
                style={styles.image}
                defaultFileName="profile.png"
                cacheKey={`/user/${user.id}`}
                src={user?.image}
              />
              <View style={styles.info}>
                <Text fontSize={16} style={styles.name}>
                  {user.firstName}
                </Text>
                <Text fontSize={16} style={styles.gender}>
                  {user.gender}
                </Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.logout} onPress={handleLogOut}>
          <LogoutIcon />
          <Text fontSize={16} style={styles.logoutText}>
            Log Out
          </Text>
          <BackIcon style={styles.back} fill={'#D1D1D1'} />
        </TouchableOpacity>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(12),
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: verticalScale(1),
    borderBottomColor: colors.background_gray,
    paddingVertical: verticalScale(16),
  },
  image: {
    height: moderateScale(60),
    width: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  info: {
    gap: verticalScale(10),
    paddingLeft: horizontalScale(16),
  },
  name: { fontFamily: 'Gotham-Book', color: colors.text_black, textTransform: 'capitalize' },
  gender: { fontFamily: 'Gotham-Light', color: colors.text_light, textTransform: 'capitalize' },
  logout: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: verticalScale(18),
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: colors.border_color,
  },
  logoutText: {
    paddingLeft: horizontalScale(12),
    color: colors.text_black,
    fontFamily: 'Gotham-Light',
  },
  back: {
    width: moderateScale(16),
    height: moderateScale(16),
    transform: [{ rotate: '180deg' }],
    marginLeft: 'auto',
  },
});
