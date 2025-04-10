import { useMemo } from "react";
import { useApi } from "./useApi";
import { CountryInfoApiResponse } from "@/types/country";

export const useCountries = () => {
  const { data, error } = useApi<CountryInfoApiResponse>(
    `https://restcountries.com/v3.1/all?fields=name,flags,idd`,
  );

  const countries = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data
      .map((country) => {
        const dialCodes =
          country.idd.suffixes?.map(
            (suffix: string[]) => `${country.idd.root}${suffix}`,
          ) || [];

        return {
          name: country.name.common,
          officialName: country.name.official,
          flag: country.flags.png,
          dialCodes,
          primaryDialCode: dialCodes[0] || "",
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return {
    countries,
    isError: !!error,
  };
};
