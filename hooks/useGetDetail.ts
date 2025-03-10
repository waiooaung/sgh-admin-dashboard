import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useGetDetail = <T>(urlString: string, id: number) => {
  const { data, error, isLoading } = useSWR<T>(`${urlString}/${id}`, fetcher);

  return {
    data,
    error,
    isLoading,
  };
};

export default useGetDetail;
