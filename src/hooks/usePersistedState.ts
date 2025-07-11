import { useEffect, useState } from "preact/hooks";
import type { Setup } from "../components/SelectCharacterDialog/SelectCharacterDialog";

type PersistedState = {
  selectedCharacters: Record<string, boolean>;
  playerCount: number;
  setup: Setup;
};

type StateKeys = keyof PersistedState;

function setItem<K extends StateKeys>(key: K, state: PersistedState[K]) {
  localStorage.setItem(key, JSON.stringify(state));
}

function getItem<K extends StateKeys>(key: K): PersistedState[K] | null {
  const value = localStorage.getItem(key);
  if (value != null) {
    return JSON.parse(value) as PersistedState[K];
  } else {
    return value;
  }
}

export function usePersisted<K extends StateKeys>(
  key: K,
  initialValue: PersistedState[K]
) {
  const [state, setState] = useState<PersistedState[K]>(() => {
    return getItem(key) ?? initialValue;
  });

  useEffect(() => {
    setItem(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
