import { Subject } from 'rxjs/Subject';
export var SelectedDataEvent = (function () {
    function SelectedDataEvent() {
        this.selectedDataEvent = new Subject();
    }
    SelectedDataEvent.prototype.getSelectedDataEvent = function () {
        return this.selectedDataEvent.asObservable();
    };
    SelectedDataEvent.prototype.emitSelectedData = function (data) {
        this.selectedDataEvent.next(data);
    };
    return SelectedDataEvent;
}());
