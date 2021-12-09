import { useContext } from "react";
import { StoreContext, StoreContextValue } from "./StoreContext";

export type UseStore<S> = () => NonNullable<StoreContextValue<S>>;

type Dependencies<S> = {
  StoreContext: StoreContext<S>;
};

export function makeUseStore<S>({
  StoreContext,
}: Dependencies<S>): UseStore<S> {
  return () => {
    const storeContextValue = useContext(StoreContext);

    if (!storeContextValue) {
      throw new Error("There is no store available in this context!");
    }

    return storeContextValue;
  };
}
