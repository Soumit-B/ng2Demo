import { Component, OnInit, OnDestroy, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { GlobalConstant } from '../../constants/global.constant';
import { RiExchange } from '../../../shared/services/riExchange';

// webpack html imports
//let template = require('./pagination.html');

@Component({
    selector: 'icabs-pagination',
    template: `
      <pagination [boundaryLinks]="boundaryLinks" [maxSize]="maxSize" [itemsPerPage]="itemsPerPage" [totalItems]="totalItems" [disabled]="disabled" [(ngModel)]="currentPage" [previousText]="previousText" [nextText]="nextText" [firstText]="firstText" [lastText]="lastText" class="pagination" (pageChanged)="currentPageChanged($event)"></pagination>
    `
})
export class PaginationComponent implements OnInit, OnDestroy, OnChanges {
    // public maxSize: number;
    public boundaryLinks: boolean;
    public previousText: string;
    public nextText: string;
    public firstText: string;
    public lastText: string;
    public defaultStartPage: number;
    //public itemsPerPage:number =11;

    private _config: any;

    @Input() public totalItems: number;
    @Input() public maxSize: number;
    @Input() public itemsPerPage: number;
    @Input() public currentPage: number;
    @Input() public disabled: boolean = false;
    @Output() getCurrentPage = new EventEmitter<any>();

    constructor(private _logger: Logger, private _global: GlobalConstant, private riExchange: RiExchange) { }

    ngOnInit(): void {
        this._config = this._global.AppConstants().paginationConfig;
        this.boundaryLinks = this._config.boundaryLinks;
        if (this.maxSize === 0) {
            this.maxSize = this.maxSize;
        } else {
            this.maxSize = this._config.maxSize;
        }
        this.previousText = this._config.previousText;
        this.nextText = this._config.nextText;
        this.firstText = this._config.firstText;
        this.lastText = this._config.lastText;
        this.defaultStartPage = this._config.defaultStartPage;
        this.currentPage = this.currentPage || this._config.defaultStartPage;
        this.totalItems = this.totalItems || 100;
        this.itemsPerPage = this.itemsPerPage || this._global.AppConstants().tableConfig.itemsPerPage;
    }

    ngOnDestroy(): void {
        this.riExchange.releaseReference(this);
    }

    ngOnChanges(val: any): void {
        //console.log(val);
    }

    public setPage(pageNo: number): void {
        this.currentPage = pageNo;
    };

    public currentPageChanged(event: any): void {
        this.getCurrentPage.emit({ value: event.page });
    };
}
