import { useEffect, useState } from "preact/hooks";

function setItem(key: string, state: any) {
  localStorage.setItem(key, JSON.stringify(state));
}

function getItem<T>(key: string) {
  const value = localStorage.getItem(key);
  if (value != null) {
    return JSON.parse(value) as T;
  } else {
    return value;
  }
}

export function usePersisted<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    return getItem(key) ?? initialValue;
  });

  useEffect(() => {
    setItem(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
