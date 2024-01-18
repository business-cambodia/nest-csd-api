import axios, { AxiosInstance } from 'axios';

const useAba: AxiosInstance = axios.create({
  baseURL: 'https://checkout-sandbox.payway.com.kh/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default useAba;
