import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

// Define a generic type for the data
interface FetchResponse<T> {
  items: T[];
  hasMore: boolean;
}

export function useSearch<T>(initialSearchTerm: string, fetchUrl: string) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, error, isValidating } = useSWR<FetchResponse<T>>(
    searchTerm ? `${fetchUrl}?search=${searchTerm}&page=${page}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const loadResults = () => {
    if (data) {
      console.log(data);
      setResults((prevResults) => [...prevResults, ...data.items]); // Append new results
      setHasMore(data.hasMore);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setResults([]);
    setPage(1);
    setHasMore(true);
  };

  return {
    searchTerm,
    results,
    loading: isValidating,
    hasMore,
    handleSearchChange,
    loadResults,
    error,
  };
}
