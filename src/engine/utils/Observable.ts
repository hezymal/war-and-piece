export interface Observer<T> {
    (data: T): void;
}

class Observable<T> {
    private observers: Observer<T>[];

    constructor() {
        this.observers = [];

        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.broadcast = this.broadcast.bind(this);
    }
  
    subscribe(observer: Observer<T>) {
        this.observers.push(observer)
    }
  
    unsubscribe(observer: Observer<T>) {
        this.observers = this.observers.filter(subscriber => subscriber !== observer)
    }
  
    broadcast(data: T) {
        this.observers.forEach(subscriber => subscriber(data))
    }
}

export default Observable;
