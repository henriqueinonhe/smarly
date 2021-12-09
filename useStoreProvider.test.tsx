import React, { useContext } from "react";
import { makeUseStoreProvider } from "./useStoreProvider";
import { StoreContextValue } from "./StoreContext";
import { render, screen } from "@testing-library/react";

describe("useStoreProvider()", () => {
  describe("Post Conditions", () => {
    context("General case", () => {
      type State = {
        a: number;
      };
      const StoreContext =
        React.createContext<StoreContextValue<State>>(undefined);

      const useStoreProvider = makeUseStoreProvider({ StoreContext });

      const Parent = () => {
        const { store, StoreContextProvider } = useStoreProvider({
          a: 42,
        });

        return (
          <StoreContextProvider>
            <div data-testid="parent-store">
              {JSON.stringify(store.getState())}
            </div>
            <Child />
          </StoreContextProvider>
        );
      };

      const Child = () => {
        const { store } = useContext(StoreContext)!;

        return (
          <div data-testid="child-store">
            {JSON.stringify(store.getState())}
          </div>
        );
      };

      it("Store is created correctly", () => {
        render(<Parent />);

        expect(screen.getByTestId("parent-store")).toHaveTextContent(
          JSON.stringify({ a: 42 })
        );
      });

      it("Provider works as expected", () => {
        render(<Parent />);

        expect(screen.getByTestId("child-store")).toHaveTextContent(
          JSON.stringify({ a: 42 })
        );
      });
    });
  });
});
