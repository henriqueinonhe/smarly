import { useCallback } from "react";
import { useStoreContext } from "./useStoreContext";

type UseSetStateReturnType<S> = (state: S | ((state: S) => S)) => void;

export function useSetState<S>(name: string): UseSetStateReturnType<S> {
  const { store } = useStoreContext(name);

  const setState = useCallback(
    (state: S | ((state: S) => S)) => {
      store.setState(state);
    },
    [store]
  );

  return setState;
}
