import { zip } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StoreContextValue } from "./StoreContext";
import { StoreContextTable } from "./StoreContextTable";

export type Selector<S, T> = (state: S) => T;

export function useSelector<S, T>(name: string, selector: Selector<S, T>): T {
  const StoreContext = StoreContextTable.getContext(name);
  const storeContextValue = useContext(StoreContext) as StoreContextValue<S>;

  if (!storeContextValue) {
    throw new Error("There is no store available in this context!");
  }

  const { store } = storeContextValue;

  const currentSelectedStateRef = useRef(selector(store.getState()));

  const [, set] = useState({});
  const forceRender = useCallback(() => {
    set({});
  }, []);

  useEffect(() => {
    const subscriber = (state: S) => {
      const currentSelectedState = currentSelectedStateRef.current;
      const newSelectedState = selector(state);

      if (currentSelectedState !== newSelectedState) {
        currentSelectedStateRef.current = newSelectedState;
        forceRender();
      }
    };

    store.subscribe(subscriber);

    return () => {
      store.unsubscribe(subscriber);
    };
  }, [store, selector, forceRender]);
  // Maybe do same sanity checks to ensure
  // that store should always remain the same

  return currentSelectedStateRef.current;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function depsHaveChanged(
  currentDeps: Array<unknown>,
  newDeps: Array<unknown>
): boolean {
  if (currentDeps.length !== newDeps.length) {
    return true;
  }

  const zippedDeps = zip(currentDeps, newDeps);
  return zippedDeps.some(
    ([currentDependency, newDependency]: [unknown, unknown]) =>
      currentDependency !== newDependency
  );
}
