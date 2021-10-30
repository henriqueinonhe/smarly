export class Store<S> {
  constructor(initialState: S) {
    this.state = initialState;
    this.subscribers = new Set();
  }

  public getState(): S {
    return this.state;
  }

  public setState(state: S): void {
    this.state = state;
    this.notifySubscribers();
  }

  public notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }

  public subscribe(subscriber: Subscriber<S>): void {
    this.subscribers.add(subscriber);
    console.log(this.subscribers);
  }

  public unsubscribe(subscriber: Subscriber<S>): void {
    this.subscribers.delete(subscriber);
  }

  private state: S;
  private subscribers: Set<Subscriber<S>>;
}

export type Subscriber<T> = (state: T) => void;
