import { useEffect, useState } from 'react';

export const useDebounce = <T>(data: T, delay: number) => {
  const [debounceData, setDebounceData] = useState<T>(data);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceData(data);
    }, delay);

    return () => clearInterval(handler);
  }, [delay, data]);

  return debounceData;
};
