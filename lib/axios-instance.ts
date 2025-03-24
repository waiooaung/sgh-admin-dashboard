import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: `application/json`,
    "Access-Control": "Allow-Origin",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");

    if (config.headers) {
      config.headers.Authorization = token ? `Bearer ${token}` : "";
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (!response.data) {
      return Promise.reject(response);
    }
    return response;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
