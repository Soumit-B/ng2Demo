import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';

@Component({
    selector: 'icabs-refresh',
    templateUrl: 'refresh.html'
})

export class RefreshComponent implements OnInit {
    @Input() disabled: Boolean = false;
    @Output() onRefresh = new EventEmitter<any>();

    constructor(private _logger: Logger) { }

    ngOnInit(): void {
        // this._logger.info('Inside refresh init');
    }

    public refresh(event: any): void {
        event.preventDefault();
        if (!this.disabled) {
            this.onRefresh.emit();
        }
    };
}
