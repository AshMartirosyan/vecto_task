import React, { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { addEventListener } from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { focusManager, onlineManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { InAppMessage } from './src/components/organism/InAppMessage';
import { AuthProvider } from './src/context/AuthProvider';
import { AppNavigation } from './src/navigation';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function App(): React.JSX.Element {
  const onAppStateChange = useCallback((status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      if (!state.isConnected) {
        Toast.show({ type: 'info', text1: 'Internet connection lost' });
      } else {
        Toast.show({ type: 'info', text1: 'Internet connection has been restored' });
      }
    });

    const subscription = AppState.addEventListener('change', onAppStateChange);

    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected);
      });
    });

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, [onAppStateChange]);

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}>
        <>
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
          <InAppMessage />
        </>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
