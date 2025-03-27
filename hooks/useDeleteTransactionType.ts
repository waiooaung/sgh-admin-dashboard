import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";

const useDeleteTransactionType = () => {
  return useSWRMutation(
    "/transaction-types",
    async (url, { arg }: { arg: number }) => {
      return await axiosInstance.delete(`${url}/${arg}`);
    },
  );
};

export default useDeleteTransactionType;
