import React, { useContext } from "react";
import { makeUseStoreProvider } from "./useStoreProvider";
import { StoreContextValue } from "./StoreContext";
import { render, screen } from "@testing-library/react";
import { makeUseStore } from "./useStore";

describe("useStore()", () => {
  describe("Pre Conditions", () => {
    context("When store hasn't been provided", () => {
      type State = {
        a: number;
      };
      const StoreContext =
        React.createContext<StoreContextValue<State>>(undefined);

      const useStore = makeUseStore({ StoreContext });

      const Parent = () => {
        return <Child />;
      };

      const Child = () => {
        const { store } = useStore();

        return (
          <div data-testid="child-store">
            {JSON.stringify(store.getState())}
          </div>
        );
      };

      it("Throws an error", () => {
        expect(() => render(<Parent />)).toThrow();
      });
    });
  });

  describe("Post Conditions", () => {
    context("General case", () => {
      type State = {
        a: number;
      };
      const StoreContext =
        React.createContext<StoreContextValue<State>>(undefined);

      const useStoreProvider = makeUseStoreProvider({ StoreContext });
      const useStore = makeUseStore({ StoreContext });

      const Parent = () => {
        const { StoreContextProvider } = useStoreProvider({
          a: 42,
        });

        return (
          <StoreContextProvider>
            <Child />
          </StoreContextProvider>
        );
      };

      const Child = () => {
        const { store } = useStore();

        return (
          <div data-testid="store">{JSON.stringify(store.getState())}</div>
        );
      };

      it("Receiving store works as expected", () => {
        render(<Parent />);

        expect(screen.getByTestId("store")).toHaveTextContent(
          JSON.stringify({ a: 42 })
        );
      });
    });
  });
});
