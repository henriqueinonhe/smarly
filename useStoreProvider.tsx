import React, { useMemo, useRef } from "react";
import { Store } from "./Store";
import { StoreContext } from "./StoreContext";

export type UseStoreProviderReturnValue<S> = {
  store: Store<S>;
  StoreContextProvider: (props: { children: React.ReactNode }) => JSX.Element;
};

export type UseStoreProvider<S> = (
  initialState: S | (() => S)
) => UseStoreProviderReturnValue<S>;

type Dependencies<S> = {
  StoreContext: StoreContext<S>;
};

export function makeUseStoreProvider<S>({
  StoreContext,
}: Dependencies<S>): UseStoreProvider<S> {
  return (initialState) => {
    const storeRef = useRef(new Store(initialState));
    const store = storeRef.current;

    const storeContextValue = useMemo(
      () => ({
        store,
      }),
      [store]
    );

    const StoreContextProvider = useRef(
      (props: { children: React.ReactNode }) => (
        <StoreContext.Provider value={storeContextValue}>
          {props.children}
        </StoreContext.Provider>
      )
    ).current;

    return {
      store,
      StoreContextProvider,
    };
  };
}
