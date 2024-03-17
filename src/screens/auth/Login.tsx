import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { login, LogInData, LogInResponse } from '../../api/authApi';
import colors from '../../assets/constants/colors';
import { default as Logo } from '../../assets/icons/logo.svg';
import Loading from '../../components/atom/Loading';
import Screen from '../../components/atom/Screen';
import Text from '../../components/atom/Text';
import TextInput from '../../components/atom/TextInput';
import { useAuth } from '../../context/AuthProvider';
import { AppStackParams } from '../../navigation/AppNavigation';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scale';

export const Login = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<AppStackParams, 'Login'>>();
  const { setIsLoggedIn } = useAuth();

  const { mutate, isPending } = useMutation<LogInResponse, Error, LogInData>({
    mutationFn: login,
    onSuccess: async ({ token }) => {
      setIsLoggedIn && setIsLoggedIn(true);
      await AsyncStorage.setItem('token', token);
      navigate('Private', { screen: 'Tab', params: { screen: 'Profile' } });
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInData>();

  const onSubmit: SubmitHandler<LogInData> = useCallback(
    data => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <>
      <Loading visible={isPending} />
      <Screen style={styles.base}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Text fontSize={24} style={styles.text}>
              LOG IN
            </Text>
            <Logo />
            <View style={styles.form}>
              <Controller
                name="username"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    wrapperStyle={styles.input}
                    helperText="Username"
                    isRequired
                    error={errors.username?.message}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    wrapperStyle={styles.input}
                    helperText="Password"
                    isRequired
                    error={errors.password?.message}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.buttonText} fontSize={14}>
                LOG IN
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  base: {},
  keyboardView: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    paddingTop: verticalScale(40),
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(24),
    alignItems: 'center',
  },

  text: {
    fontFamily: 'Gotham-Medium',
    color: colors.text_black,
    lineHeight: verticalScale(28.8),
    textAlign: 'center',
    paddingBottom: verticalScale(30),
  },

  form: {
    width: '100%',
    flexDirection: 'column',
    paddingTop: verticalScale(50),
    gap: verticalScale(24),
    paddingBottom: verticalScale(12),
  },

  input: {
    borderWidth: verticalScale(1),
    borderStyle: 'solid',
    borderColor: colors.border_color,
    borderRadius: moderateScale(10),
  },

  button: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(16),
  },
  buttonText: {
    fontFamily: 'Gotham-Book',
    color: colors.white,
  },
});
