export interface Subscription {
    unsubscribe: () => void
}

export class CustomeObservable<T> {
    private observers: Array<(data: T) => void> = [];
    private onLastUnsubscribe?: () => void;

    constructor(private onFirstSubscribe?: () => (() => void) | void) {}

    subscribe(f: (data: T) => void): Subscription {
        if (!this.observers.length && this.onFirstSubscribe) {
          this.onLastUnsubscribe = this.onFirstSubscribe() || undefined
        }
        this.observers.push(f)
        return {
          unsubscribe: () => {
            this.observers = this.observers.filter((other) => f !== other)
            if (!this.observers.length && this.onLastUnsubscribe) {
              this.onLastUnsubscribe()
            }
          },
        }
      }

      notify(data: T) {
        this.observers.forEach((observer) => observer(data))
      }

}

export function mergeObservables<T>(...observables: Array<CustomeObservable<T>>) {
    const globalObservable = new CustomeObservable<T>(() => {
      const subscriptions: Subscription[] = observables.map((observable) =>
        observable.subscribe((data) => globalObservable.notify(data))
      )
      return () => subscriptions.forEach((subscription) => subscription.unsubscribe())
    })
  
    return globalObservable
  }