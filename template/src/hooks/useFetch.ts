import { useMemo } from "react";

import useSWRImmutable, { KeyedMutator } from "swr"; // eslint-disable-line import/named
import { v4 as uuid } from "uuid";

export const useFetch = <T>(fetcher: () => Promise<T>): { data: T | undefined; mutate: KeyedMutator<T> } => {
  const key = useMemo(() => uuid(), []); // Do not use cache

  const { data, error, mutate } = useSWRImmutable<T>(key, async () => {
    const fetchData = await fetcher();
    return fetchData;
  });

  if (error != null) {
    throw error;
  }

  return { data, mutate };
};
