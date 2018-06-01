import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


export class SelectedDataEvent {
  private selectedDataEvent = new Subject<any>();

  public getSelectedDataEvent(): Observable<any> {
    return this.selectedDataEvent.asObservable();
  }
  public emitSelectedData(data: any): void {
    this.selectedDataEvent.next(data);
  }
}
