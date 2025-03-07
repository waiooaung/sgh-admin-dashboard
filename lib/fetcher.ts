import axiosInstance from "./axios-instance";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export default fetcher;
