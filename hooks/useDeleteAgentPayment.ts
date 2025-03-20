import useSWRMutation from "swr/mutation";
import axiosInstance from "@/lib/axios-instance";

const useDeleteAgentPayment = () => {
  return useSWRMutation(
    "/agent-payments",
    async (url: string, { arg }: { arg: number }) => {
      return await axiosInstance.delete(`${url}/${arg}`);
    },
  );
};

export default useDeleteAgentPayment;
