import axios, { AxiosInstance } from 'axios';

const useAba: AxiosInstance = axios.create({
  baseURL: process.env.PAYWAY_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default useAba;
