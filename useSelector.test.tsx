import React, { useEffect, useState } from "react";
import { StoreContextValue } from "./StoreContext";
import { makeUseSelector } from "./useSelector";
import { makeUseStoreProvider } from "./useStoreProvider";
import { render, screen } from "@testing-library/react";
import { makeUseStore } from "./useStore";

describe("useSelector()", () => {
  describe("Pre Conditions", () => {});

  describe("Post Conditions", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    context("Selector first run", () => {
      type State = {
        a: number;
        b: number;
      };
      const StoreContext =
        React.createContext<StoreContextValue<State>>(undefined);

      const useStoreProvider = makeUseStoreProvider({ StoreContext });
      const useSelector = makeUseSelector({ StoreContext });
      const useStore = makeUseStore({ StoreContext });

      const GrandParent = jest.fn().mockImplementation(() => {
        const { StoreContextProvider } = useStoreProvider({
          a: 10,
          b: 20,
        });

        return (
          <StoreContextProvider>
            <Parent />
          </StoreContextProvider>
        );
      });

      const Parent = jest.fn().mockImplementation(() => {
        return <Child />;
      });

      const selector = jest.fn().mockImplementation((state) => state.a);

      const Child = jest.fn().mockImplementation(() => {
        const value = useSelector(selector);
        const { store } = useStore();

        return (
          <>
            <div data-testid="value">{JSON.stringify(value)}</div>
          </>
        );
      });

      it("Returns the correct slice of the state", () => {
        render(<GrandParent />);

        expect(screen.getByTestId("value")).toHaveTextContent(
          JSON.stringify(10)
        );
      });
    });

    context(
      "When state is updated and selector evaluates to a different value",
      () => {
        type State = {
          a: number;
          b: number;
        };
        const StoreContext =
          React.createContext<StoreContextValue<State>>(undefined);

        const useStoreProvider = makeUseStoreProvider({ StoreContext });
        const useSelector = makeUseSelector({ StoreContext });
        const useStore = makeUseStore({ StoreContext });

        const GrandParent = jest.fn().mockImplementation(() => {
          const { StoreContextProvider } = useStoreProvider({
            a: 10,
            b: 20,
          });

          return (
            <StoreContextProvider>
              <Parent />
            </StoreContextProvider>
          );
        });

        const Parent = jest.fn().mockImplementation(() => {
          return <Child />;
        });

        const selector = jest.fn().mockImplementation((state) => state.a);

        const Child = jest.fn().mockImplementation(() => {
          const value = useSelector(selector);
          const { store } = useStore();

          return (
            <>
              <div data-testid="value">{JSON.stringify(value)}</div>
              <button
                data-testid="button"
                onClick={() =>
                  store.setState({
                    a: 1000,
                    b: 20,
                  })
                }
              ></button>
            </>
          );
        });

        it("Component that uses selector is rerendered with updated value and others are not rerendered", () => {
          render(<GrandParent />);

          screen.getByTestId("button").click();

          expect(screen.getByTestId("value")).toHaveTextContent(
            JSON.stringify(1000)
          );
          expect(GrandParent).toHaveBeenCalledTimes(1);
          expect(Parent).toHaveBeenCalledTimes(1);
          expect(Child).toHaveBeenCalledTimes(2);
        });
      }
    );

    context(
      "When state is updated and selector evaluates to the same value",
      () => {
        type State = {
          a: number;
          b: number;
        };
        const StoreContext =
          React.createContext<StoreContextValue<State>>(undefined);

        const useStoreProvider = makeUseStoreProvider({ StoreContext });
        const useSelector = makeUseSelector({ StoreContext });
        const useStore = makeUseStore({ StoreContext });

        const GrandParent = jest.fn().mockImplementation(() => {
          const { StoreContextProvider } = useStoreProvider({
            a: 10,
            b: 20,
          });

          return (
            <StoreContextProvider>
              <Parent />
            </StoreContextProvider>
          );
        });

        const Parent = jest.fn().mockImplementation(() => {
          return <Child />;
        });

        const selector = jest.fn().mockImplementation((state) => state.a);

        const Child = jest.fn().mockImplementation(() => {
          const value = useSelector(selector);
          const { store } = useStore();

          return (
            <>
              <div data-testid="value">{JSON.stringify(value)}</div>
              <button
                data-testid="button"
                onClick={() =>
                  store.setState({
                    a: 10,
                    b: 20,
                  })
                }
              ></button>
            </>
          );
        });

        it("Component that uses selector is NOT rerendered", () => {
          render(<GrandParent />);

          screen.getByTestId("button").click();

          expect(screen.getByTestId("value")).toHaveTextContent(
            JSON.stringify(10)
          );
          expect(GrandParent).toHaveBeenCalledTimes(1);
          expect(Parent).toHaveBeenCalledTimes(1);
          expect(Child).toHaveBeenCalledTimes(1);
        });
      }
    );

    context(
      "When state is updated before the selector subscribes to the state",
      () => {
        type State = {
          a: number;
          b: number;
        };
        const StoreContext =
          React.createContext<StoreContextValue<State>>(undefined);

        const useStoreProvider = makeUseStoreProvider({ StoreContext });
        const useSelector = makeUseSelector({ StoreContext });
        const useStore = makeUseStore({ StoreContext });

        const GrandParent = jest.fn().mockImplementation(() => {
          const { StoreContextProvider } = useStoreProvider({
            a: 10,
            b: 20,
          });

          return (
            <StoreContextProvider>
              <Parent />
            </StoreContextProvider>
          );
        });

        const Parent = jest.fn().mockImplementation(() => {
          return <Child />;
        });

        const selector = jest.fn().mockImplementation((state) => state.a);

        const Child = jest.fn().mockImplementation(() => {
          const { store } = useStore();
          useEffect(() => {
            store.setState({
              a: 1000,
              b: 20,
            });
          });
          const value = useSelector(selector);

          return (
            <>
              <div data-testid="value">{JSON.stringify(value)}</div>
            </>
          );
        });

        it("Component rerenders with new value", () => {
          render(<GrandParent />);

          expect(screen.getByTestId("value")).toHaveTextContent(
            JSON.stringify(1000)
          );
          expect(GrandParent).toHaveBeenCalledTimes(1);
          expect(Parent).toHaveBeenCalledTimes(1);
          expect(Child).toHaveBeenCalledTimes(2);
        });
      }
    );

    context(
      "When component renders with a new selector, but without the state updating",
      () => {
        type State = {
          a: number;
          b: number;
        };
        const StoreContext =
          React.createContext<StoreContextValue<State>>(undefined);

        const useStoreProvider = makeUseStoreProvider({ StoreContext });
        const useSelector = makeUseSelector({ StoreContext });

        const GrandParent = jest.fn().mockImplementation(() => {
          const { StoreContextProvider } = useStoreProvider({
            a: 10,
            b: 20,
          });

          return (
            <StoreContextProvider>
              <Parent />
            </StoreContextProvider>
          );
        });

        const Parent = jest.fn().mockImplementation(() => {
          return <Child />;
        });

        const Child = jest.fn().mockImplementation(() => {
          const [flag, setFlag] = useState(true);
          const value = useSelector((state) => (flag ? state.a : state.b));

          return (
            <>
              <div data-testid="value">{JSON.stringify(value)}</div>
              <button
                data-testid="button"
                onClick={() => setFlag((flag) => !flag)}
              ></button>
            </>
          );
        });

        it("Component rerenders with new value", () => {
          render(<GrandParent />);

          screen.getByTestId("button").click();

          expect(screen.getByTestId("value")).toHaveTextContent(
            JSON.stringify(20)
          );
          expect(GrandParent).toHaveBeenCalledTimes(1);
          expect(Parent).toHaveBeenCalledTimes(1);
          expect(Child).toHaveBeenCalledTimes(2);
        });
      }
    );

    context(
      "When selector throws an error during subscriber notification phase, but component dies before retrieving selector value",
      () => {
        type State = {
          posts: {
            byId: Record<
              string,
              {
                id: string;
                title: string;
                text: string;
              }
            >;
          };
        };
        const StoreContext =
          React.createContext<StoreContextValue<State>>(undefined);

        const useStoreProvider = makeUseStoreProvider({ StoreContext });
        const useSelector = makeUseSelector({ StoreContext });
        const useStore = makeUseStore({ StoreContext });

        const App = jest.fn().mockImplementation(() => {
          const { StoreContextProvider } = useStoreProvider({
            posts: {
              byId: {
                "1": {
                  id: "1",
                  title: "Post 1",
                  text: "Text 1",
                },
                "2": {
                  id: "2",
                  title: "Post 2",
                  text: "Text 2",
                },
                "3": {
                  id: "3",
                  title: "Post 3",
                  text: "Text 3",
                },
              },
            },
          });

          return (
            <StoreContextProvider>
              <PostList />
            </StoreContextProvider>
          );
        });

        const PostList = jest.fn().mockImplementation(() => {
          const posts = useSelector((state) => state.posts);
          const postsIds = Object.keys(posts.byId);

          return (
            <>
              {postsIds.map((postId) => (
                <Post key={postId} postId={postId} />
              ))}
            </>
          );
        });

        const Post = jest.fn().mockImplementation(({ postId }) => {
          // Should throw when title is accessed on non existing post
          const postTitle = useSelector(
            (state) => state.posts.byId[postId].title
          );
          const { store } = useStore();

          function deletePost(): void {
            store.setState((state) => {
              const filteredPosts = Object.values(state.posts.byId).filter(
                (post) => post.id !== postId
              );
              const newState: State = {
                posts: {
                  byId: {},
                },
              };

              filteredPosts.forEach((post) => {
                newState.posts.byId[post.id] = post;
              });

              return newState;
            });
          }

          return (
            <>
              <div data-testid={`post-${postId}`}>{postTitle}</div>
              <button onClick={deletePost} data-testid={`button-${postId}`}>
                Delete
              </button>
            </>
          );
        });

        it("Error is swallowed", () => {
          render(<App />);

          screen.getByTestId("button-2").click();

          expect(screen.getByTestId("post-1")).toHaveTextContent("Post 1");
          expect(screen.getByTestId("post-3")).toHaveTextContent("Post 3");
        });
      }
    );
  });
});
