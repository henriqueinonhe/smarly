import { zip } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStoreContext } from "./useStoreContext";

export type Selector<S, T> = (state: S) => T;

export function useSelector<S, T>(name: string, selector: Selector<S, T>): T {
  const { store } = useStoreContext<S>(name);

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
