export class Store<S> {
  constructor(initialState: S | (() => S)) {
    if (isFunction(initialState)) {
      this.state = initialState();
    } else {
      this.state = initialState;
    }

    this.subscribers = new Set();
  }

  public getState(): S {
    return this.state;
  }

  public setState(state: S | ((state: S) => S)): void {
    if (isSetter(state)) {
      this.state = state(this.state);
    } else {
      this.state = state;
    }

    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }

  public subscribe(subscriber: Subscriber<S>): void {
    if (process.env.NODE_ENV !== "production") {
      if (this.subscribers.has(subscriber)) {
        throw new Error(
          `You're trying to subscribe the same subscriber twice!`
        );
      }
    }

    this.subscribers.add(subscriber);
  }

  public unsubscribe(subscriber: Subscriber<S>): void {
    if (process.env.NODE_ENV !== "production") {
      if (!this.subscribers.has(subscriber)) {
        throw new Error(
          `You're trying to unsubscribe a function that is not subscribed!`
        );
      }
    }

    this.subscribers.delete(subscriber);
  }

  private state: S;
  private subscribers: Set<Subscriber<S>>;
}

export type Subscriber<T> = (state: T) => void;

function isFunction<S>(initialState: S | (() => S)): initialState is () => S {
  return typeof initialState === "function";
}

function isSetter<S>(state: S | ((state: S) => S)): state is (state: S) => S {
  return typeof state === "function";
}
