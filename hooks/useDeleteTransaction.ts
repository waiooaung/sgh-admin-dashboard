import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";

const useDeleteTransaction = () => {
  return useSWRMutation(
    "/transactions",
    async (url, { arg }: { arg: number }) => {
      return await axiosInstance.delete(`${url}/${arg}`);
    },
  );
};

export default useDeleteTransaction;
