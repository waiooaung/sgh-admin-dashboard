import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";

const useDelete = (urlString: string) => {
  return useSWRMutation(urlString, async (url, { arg }: { arg: number }) => {
    return await axiosInstance.delete(`${url}/${arg}`);
  });
};

export default useDelete;
