import React from "react";
import { Store } from "./Store";

export type StoreContextValue<S> =
  | {
      store: Store<S>;
    }
  | undefined;

export type StoreContext<S> = React.Context<StoreContextValue<S>>;
