import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter, ViewChild, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Utils } from './../../../shared/services/utility';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { RiExchange } from './../../../shared/services/riExchange';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { TableComponent } from './../../../shared/components/table/table';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';

@Component({
    templateUrl: 'iCABSSContactTypeDetailSearch.html'
})
export class ContactTypeDetailSearchComponent extends SelectedDataEvent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('resultTable') resultTable: TableComponent;
    public pageId: string = '';
    public inputParams: any;
    public page: number = 1;
    public itemsPerPage: number = 10;
    public columns: Array<any> = [];
    public rowmetadata: Array<any> = [];
    public rows: Array<any> = [];
    public pageTitle: string = 'ContactTypeDetail Search';

    constructor(
        private serviceConstants: ServiceConstants,
        private utils: Utils,
        private riExchange: RiExchange
    ) {
        super();
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEDETAILSEARCH;
    }

    ngOnInit(): void {
        //this.utils.setTitle(this.pageTitle); this is not required as it is ellipsis/dropdown page
    }

    ngAfterViewInit(): void {
        this.updateView();
    }

    ngOnDestroy(): void {
        this.serviceConstants = null;
        this.utils = null;
    }

    public updateView(params?: any): void {
        this.inputParams = params;
        this.loadData();
    }

    public tableDataLoaded(obj: any): void {
        //Do nothing
    }

    public selectedData(obj: any): void {
        let returnObj = {
            ContactTypeCode: obj.row.ContactTypeCode,
            ContactTypeSystemDesc: obj.row.ContactTypeSystemDesc,
            ContactTypeDetailCode: obj.row.ContactTypeDetailCode,
            ContactTypeDetailSystemDesc: obj.row.ContactTypeDetailSystemDesc
        };
        this.emitSelectedData(returnObj);
    }

    public loadData(): void {
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('pageSize', '500');

        let passContactTypeCode = '';
        if (this.inputParams) { if (this.inputParams.hasOwnProperty('ContactTypeCode')) { passContactTypeCode = this.inputParams.ContactTypeCode; } }
        if (passContactTypeCode) search.set('ContactTypeCode', passContactTypeCode);

        let xhr = {
            module: 'tickets',
            method: 'ccm/search',
            operation: 'System/iCABSSContactTypeDetailSearch',
            search: search
        };
        this.columns = [];
        this.columns.push({ name: 'ContactTypeCode', title: 'ContactTypeCode', size: 8 });
        this.columns.push({ name: 'ContactTypeSystemDesc', title: 'Contact Type Description', size: 30 });
        this.columns.push({ name: 'ContactTypeDetailCode', title: 'DetailCode', size: 8 });
        this.columns.push({ name: 'ContactTypeDetailSystemDesc', title: 'Detail Description', size: 30 });

        this.resultTable.loadTableData(xhr);
    }
}

@Component({
    selector: 'icabs-contacttype-detailsearch',
    template: ` <icabs-dropdown #customDropDown [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [triggerValidate]="isTriggerValidate" [active]="active" (selectedValue)="onDataReceived($event)" [isFirstItemSelected]="isFirstItemSelected"> </icabs-dropdown> `
})
export class ContactTypeDetailSearchDropDownComponent implements OnInit, OnDestroy {
    @ViewChild('customDropDown') public customDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean = false;
    @Input() public isFirstItemSelected: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean = false;
    @Input() public isTriggerValidate: boolean;
    @Output() getDefaultInfo = new EventEmitter();
    @Output() receivedContactTypeDetailSearch: EventEmitter<any> = new EventEmitter();
    public requestdata: Array<any>;

    public displayFields: Array<string> = ['ContactTypeDetail.ContactTypeDetailCode', 'ContactTypeDetail.ContactTypeDetailSystemDesc'];

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private riExchange: RiExchange) {
    }

    ngOnInit(): void {
        this.fetchData();
    }

    ngOnDestroy(): void {
        //Not Required
    }

    public fetchData(): void {
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('pageSize', '500');

        let passContactTypeCode = '';
        if (this.inputParams) { passContactTypeCode = this.inputParams.params.ContactTypeCode; }
        if (passContactTypeCode) search.set('ContactTypeCode', passContactTypeCode);

        let xhr = {
            module: 'tickets',
            method: 'ccm/search',
            operation: 'System/iCABSSContactTypeDetailSearch',
            search: search
        };

        this.httpService.xhrGet(xhr.method, xhr.module, xhr.operation, xhr.search).then(data => {
            this.requestdata = data.records;
            if (this.isFirstItemSelected) {
                this.getDefaultInfo.emit({ totalRecords: this.requestdata ? this.requestdata.length : 0, firstRow: (this.requestdata && this.requestdata.length > 0) ? this.requestdata[0] : {} });
            }
            if (!data.records) { return; }
            this.customDropDown.updateComponent(data.records);
        });
    }

    public onDataReceived(obj: any): void {
        this.receivedContactTypeDetailSearch.emit(obj.value);
    }
}
