import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { toast } from "sonner";

export const useApi = <T>(key: string | null, showToastError = true) => {
  const { data, error, mutate, isValidating } = useSWR<T>(key, fetcher);

  if (error && showToastError) {
    toast.error(error.message || "Failed to fetch data");
  }

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
    isValidating,
  };
};
