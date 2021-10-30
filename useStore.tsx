import React, { useCallback, useMemo, useRef } from "react";
import { Store } from "./Store";
import { StoreContext as StoreContextType } from "./StoreContext";
import { StoreContextTable } from "./StoreContextTable";

export type UseStoreReturnType<S> = {
  store: Store<S>;
  StoreContextProvider: (props: { children: React.ReactNode }) => JSX.Element;
};

export function useStore<S>(
  name: string,
  initialState: S
): UseStoreReturnType<S> {
  const storeRef = useRef(new Store(initialState));
  const store = storeRef.current;

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
    store,
    StoreContextProvider,
  };
}
