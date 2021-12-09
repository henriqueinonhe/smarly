import React from "react";
import { StoreContextValue } from "./StoreContext";
import { makeUseSelector, UseSelector } from "./useSelector";
import { makeUseStore, UseStore } from "./useStore";
import { makeUseStoreProvider, UseStoreProvider } from "./useStoreProvider";

export type CreateHooksReturnValue<S> = {
  useStoreProvider: UseStoreProvider<S>;
  useSelector: UseSelector<S>;
  useStore: UseStore<S>;
};

export const createHooks = <S>(): CreateHooksReturnValue<S> => {
  const StoreContext = React.createContext<StoreContextValue<S>>(undefined);

  return {
    useStoreProvider: makeUseStoreProvider({ StoreContext }),
    useSelector: makeUseSelector({ StoreContext }),
    useStore: makeUseStore({ StoreContext }),
  };
};
