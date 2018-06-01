export var Stack = (function () {
    function Stack() {
        this._store = [];
    }
    Stack.prototype.push = function (val) {
        this._store.push(val);
    };
    Stack.prototype.pop = function () {
        return this._store.pop();
    };
    Stack.prototype.getLast = function () {
        if (this._store.length > 0) {
            return this._store[this._store.length - 1];
        }
    };
    Stack.prototype.clear = function () {
        this._store.length = 0;
    };
    return Stack;
}());
