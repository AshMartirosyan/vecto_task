import React, { createContext, Dispatch, useContext, useLayoutEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { getMe, User } from '../api/authApi';
import Loading from '../components/atom/Loading';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn?: Dispatch<React.SetStateAction<boolean>>;
  user: Maybe<User>;
}

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  user: null,
});

interface Props {
  children?: JSX.Element;
}

export const AuthRef: { setIsLoggedIn: Maybe<Function> } = {
  setIsLoggedIn: null,
};

export function AuthProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useLayoutEffect(() => {
    (async () => {
      if (isLoading) {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token);
        setIsLoading(false);
      }
    })();
  }, [isLoading]);

  useLayoutEffect(() => {
    AuthRef.setIsLoggedIn = setIsLoggedIn;

    return () => {
      AuthRef.setIsLoggedIn = null;
    };
  }, []);

  const { data: user } = useQuery({
    queryKey: ['auth/getMe'],
    queryFn: getMe,
    enabled: isLoggedIn,
  });

  if (isLoading) {
    return <Loading visible={true} />;
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, setIsLoggedIn, user }}
      children={children}
    />
  );
}

export const useAuth = () => useContext(AuthContext);
