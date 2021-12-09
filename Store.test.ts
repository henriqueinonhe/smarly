import { Store } from "./Store";

describe("constructor()", () => {
  describe("Post Conditions", () => {
    context("When passing data as argument", () => {
      const initialState = {
        a: 10,
      };
      const store = new Store(initialState);

      it("Is constructed correctly", () => {
        expect(store.getState()).toBe(initialState);
      });
    });

    context("When passing a function as argument", () => {
      const initialState = {
        a: 10,
      };
      const initializer = () => initialState;
      const store = new Store(initializer);

      it("Is constructed correctly", () => {
        expect(store.getState()).toBe(initialState);
      });
    });
  });
});

describe("setState()", () => {
  describe("Post Conditions", () => {
    context("When passing data as argument", () => {
      const store = new Store({
        a: 10,
      });

      const newState = {
        a: 20,
      };

      store.setState(newState);

      it("Works as expected", () => {
        expect(store.getState()).toBe(newState);
      });
    });

    context("When passing a function as argument", () => {
      const store = new Store({
        a: 10,
      });

      const newState = {
        a: 20,
      };

      store.setState(() => newState);

      it("Works as expected", () => {
        expect(store.getState()).toBe(newState);
      });
    });
  });
});

describe("subscribe()", () => {
  describe("Pre Conditions", () => {
    context("When trying to subscribe a function twice", () => {
      const store = new Store({
        a: 10,
      });

      const subscriber = jest.fn();
      store.subscribe(subscriber);

      it("Throws an error", () => {
        expect(() =>
          store.subscribe(subscriber)
        ).toThrowErrorMatchingInlineSnapshot(
          `"You're trying to subscribe the same subscriber twice!"`
        );
      });
    });
  });

  describe("Post Conditions", () => {
    context("General case", () => {
      const store = new Store({
        a: 10,
      });

      const subscriber1 = jest.fn();
      store.subscribe(subscriber1);

      const newState1 = {
        a: 20,
      };
      store.setState(newState1);

      const subscriber2 = jest.fn();
      store.subscribe(subscriber2);

      const newState2 = {
        a: 30,
      };
      store.setState(newState2);

      it("Subscribers are notified with the most recent state", () => {
        expect(subscriber1).toHaveBeenNthCalledWith(1, newState1);
        expect(subscriber1).toHaveBeenNthCalledWith(2, newState2);
        expect(subscriber1).toHaveBeenCalledTimes(2);

        expect(subscriber2).toHaveBeenNthCalledWith(1, newState2);
        expect(subscriber2).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe("unsubscribe()", () => {
  describe("Pre Conditions", () => {
    context(
      "When trying to unsubscribe a function that is not subscribed",
      () => {
        const store = new Store({
          a: 10,
        });
        const subscriber1 = jest.fn();
        const subscriber2 = jest.fn();

        store.subscribe(subscriber1);

        it("Throws an error", () => {
          expect(() =>
            store.unsubscribe(subscriber2)
          ).toThrowErrorMatchingInlineSnapshot(
            `"You're trying to unsubscribe a function that is not subscribed!"`
          );
        });
      }
    );
  });

  describe("Post Conditions", () => {
    context("General case", () => {
      const store = new Store({
        a: 10,
      });
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();

      store.subscribe(subscriber1);
      store.subscribe(subscriber2);

      const newState1 = {
        a: 20,
      };
      store.setState(newState1);

      store.unsubscribe(subscriber2);

      const newState2 = {
        a: 30,
      };
      store.setState(newState2);

      it("Cease calling unsubscribed function", () => {
        expect(subscriber1).toHaveBeenNthCalledWith(1, newState1);
        expect(subscriber1).toHaveBeenNthCalledWith(2, newState2);
        expect(subscriber1).toHaveBeenCalledTimes(2);

        expect(subscriber2).toHaveBeenNthCalledWith(1, newState1);
        expect(subscriber2).toHaveBeenCalledTimes(1);
      });
    });
  });
});
