import { useContext } from "react";
import { StoreContextValue } from "./StoreContext";
import { StoreContextTable } from "./StoreContextTable";

export function useStoreContext<S>(
  name: string
): NonNullable<StoreContextValue<S>> {
  const StoreContext = StoreContextTable.getContext(name);
  const storeContextValue = useContext(StoreContext) as StoreContextValue<S>;

  if (!storeContextValue) {
    throw new Error("There is no store available in this context!");
  }

  return storeContextValue;
}
