export class Stack<T> {

    _store: T[] = [];
    push(val: T): void {
        this._store.push(val);
    }

    pop(): T | undefined {
        return this._store.pop();
    }

    getLast(): T {
        if (this._store.length > 0) {
            return this._store[this._store.length - 1];
        }
    }

    clear(): void {
        this._store.length = 0;
    }
}
