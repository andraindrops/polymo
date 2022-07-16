import { useMemo } from "react";

import useSWRImmutable from "swr";
import { v4 as uuid } from "uuid";

export const useFetch = <T>(fetcher: () => Promise<T>): T | undefined => {
  const key = useMemo(() => uuid(), []); // Do not use cache

  const { data, error } = useSWRImmutable<T>(key, async () => {
    const fetchData = await fetcher();
    return fetchData;
  });

  if (error != null) {
    throw error;
  }

  return data;
};
