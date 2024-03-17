import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import { queryClient } from '../../App';
import { defaultPath } from '../components/molecule/CachedImage';
import { AuthRef } from '../context/AuthProvider';

const $apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
});

$apiClient.interceptors.request.use(
  async function (config) {
    if (config.headers) {
      const token = await AsyncStorage.getItem('token').catch(() => '');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error.response.data);
  },
);

$apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    Toast.show({ type: 'error', text1: error.response.data.message });
    if (error.response.status === 401) {
      try {
        if (AuthRef.setIsLoggedIn) {
          AuthRef.setIsLoggedIn(false);
        }
        queryClient.clear();
        await AsyncStorage.removeItem('token');
        await RNFetchBlob.fs.unlink(defaultPath);
      } catch (err) {
        console.warn(err);
      }
    }
    return Promise.reject(error.response.data);
  },
);

export default $apiClient;
