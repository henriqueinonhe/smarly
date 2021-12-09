import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "./StoreContext";

export type UseSelector<S> = <T>(selector: Selector<S, T>) => T;

export type Selector<S, T> = (state: S) => T;

type Dependencies<S> = {
  StoreContext: StoreContext<S>;
};

export function makeUseSelector<S>({
  StoreContext,
}: Dependencies<S>): UseSelector<S> {
  return <T>(selector: Selector<S, T>) => {
    const storeContextValue = useContext(StoreContext);

    if (!storeContextValue) {
      throw new Error("There is no store available in this context!");
    }

    const { store } = storeContextValue;

    const [, set] = useState({});
    const forceRender = useCallback(() => set({}), []);

    const latestStateRef = useRef<S | null>(null);
    const latestSelectorRef = useRef<Selector<S, T> | null>(null);
    const latestSelectedStateRef = useRef<T | null>(null);
    const latestSubscriptionCallbackErrorRef = useRef<unknown | null>(null);

    const latestState = latestStateRef.current;
    const latestSelector = latestSelectorRef.current;
    const state = store.getState();
    const latestSubscriptionCallbackError =
      latestSubscriptionCallbackErrorRef.current;

    if (latestSubscriptionCallbackError) {
      throw latestSubscriptionCallbackError;
    }

    if (state !== latestState || selector !== latestSelector) {
      latestStateRef.current = state;
      latestSelectorRef.current = selector;
      latestSelectedStateRef.current = selector(state);
    }

    useEffect(() => {
      const checkForUpdates = (state: S) => {
        try {
          const latestSelectedState = latestSelectedStateRef.current!;
          const latestSelector = latestSelectorRef.current!;
          const newSelectedState = latestSelector(state);

          if (latestSelectedState !== newSelectedState) {
            latestSelectedStateRef.current = newSelectedState;
            forceRender();
          }
        } catch (error) {
          latestSubscriptionCallbackErrorRef.current = error;
        }
      };

      store.subscribe(checkForUpdates);

      // This is called here because:
      // The subscription to the store
      // happens inside a useEffect, so if a component
      // that invokes useSelector updates the state inside
      // a useEffect that is called BEFORE this useSelector,
      // this state update won't trigger checkForUpdates.
      // Therefore we're calling checkForUpdates right after the
      // subscription to catch these updates that happened
      // before useSelector had the chance to subscribe to the state.
      const state = store.getState();
      if (state !== latestStateRef.current) {
        checkForUpdates(state);
      }

      return () => {
        store.unsubscribe(checkForUpdates);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store]);
    // Maybe do same sanity checks to ensure
    // that store should always remain the same

    return latestSelectedStateRef.current!;
  };
}
