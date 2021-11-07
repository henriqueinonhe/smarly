import React, { useCallback, useMemo, useRef } from "react";
import { Store } from "./Store";
import { StoreContext as StoreContextType } from "./StoreContext";
import { StoreContextTable } from "./StoreContextTable";

export type UseStoreReturnType<S> = {
  getState: () => S;
  setState: (state: S | ((state: S) => S)) => void;
  StoreContextProvider: (props: { children: React.ReactNode }) => JSX.Element;
};

export function useStore<S>(
  name: string,
  initialState: S | (() => S)
): UseStoreReturnType<S> {
  const storeRef = useRef(new Store(initialState));
  const store = storeRef.current;

  const getState = useCallback(() => store.getState(), [store]);

  const setState = useCallback(
    (state: S | ((state: S) => S)) => {
      store.setState(state);
    },
    [store]
  );

  const storeContextValue = useMemo(
    () => ({
      store,
    }),
    [store]
  );

  const StoreContext = StoreContextTable.borrowContext(
    name
  ) as StoreContextType<S>;
  const StoreContextProvider = useCallback(
    (props: { children: React.ReactNode }) => (
      <StoreContext.Provider value={storeContextValue}>
        {props.children}
      </StoreContext.Provider>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storeContextValue]
  );

  return {
    getState,
    setState,
    StoreContextProvider,
  };
}
