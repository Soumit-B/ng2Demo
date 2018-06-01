import { Component, OnInit, Injector, Input, EventEmitter, ViewChild, Output, OnDestroy, OnChanges } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Utils } from '../../../shared/services/utility';
import { RiExchange } from '../../../shared/services/riExchange';
import { TableComponent } from './../../../shared/components/table/table';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    selector: 'icabs-expensecode',
    template: `<icabs-dropdown #expenseCodeSearch
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onExpenseCodeReceived($event)" [isFirstItemSelected]="isFirstItemSelected" [triggerValidate]="isTriggerValidate"></icabs-dropdown>`
})

/*
 Class for implementing ExpenseCodeSearch DropDown
*/
export class ExpenseCodeSearchDropDownComponent implements OnInit {
    @ViewChild('expenseCodeSearch') expenseCodeSearch: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public isFirstItemSelected: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public isTriggerValidate: boolean;
    @Output() getDefaultInfo = new EventEmitter();
    @Output() receivedExpenseCode = new EventEmitter();
    public requestdata: Array<any>;

    public displayFields: Array<string> = ['ExpenseCode', 'ExpenseDesc'];

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils) {
    }

    ngOnInit(): void {
        this.fetchExpenseCode();
    }

    /*
    API Call to fetch data
    */
    public fetchExpenseCode(): void {
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('pageSize', '500');

        let xhr = {
            module: 'charges',
            method: 'bill-to-cash/search',
            operation: 'Business/iCABSBExpenseCodeSearch',
            search: search
        };
        this.httpService.xhrGet(xhr.method, xhr.module, xhr.operation, xhr.search).then(data => {
            if (!data.records) { return; }
            this.requestdata = data.records;
            this.getDefaultInfo.emit({ totalRecords: this.requestdata ? this.requestdata.length : 0, firstRow: (this.requestdata && this.requestdata.length > 0) ? this.requestdata[0] : {} });
            this.expenseCodeSearch.updateComponent(data.records);
        });
    }

    /*
    Method invoked on selecting data from dropdown
    */
    public onExpenseCodeReceived(obj: any): void {
        let expenseCode = obj.value.ExpenseCode;
        let expenseDesc = obj.value.ExpenseDesc;
        let returnObj: any;
        switch (this.inputParams.parentMode) {
            case 'LookUp':
                returnObj = {
                    'ExpenseCode': expenseCode,
                    'ExpenseDesc': expenseDesc,
                    'RecordID': obj.value.RecordID,
                    'ttExpenseCode': obj.value.ttExpenseCode
                };
                break;
            case 'LookUp-Installation':
                returnObj = {
                    'InstallationChargeExpenseCode': expenseCode,
                    'InstallationChargeExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Removal':
                returnObj = {
                    'RemovalChargeExpenseCode': expenseCode,
                    'RemovalChargeExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Initial':
                returnObj = {
                    'InitialChargeExpenseCode': expenseCode,
                    'InitialChargeExpenseDesc': expenseDesc
                };
                break;
            case 'MaterialsExpenseCode':
                returnObj = {
                    'MaterialsExpenseCode': expenseCode,
                    'MaterialsExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Labour':
                returnObj = {
                    'LabourExpenseCode': expenseCode,
                    'LabourExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Replacement':
                returnObj = {
                    'ReplacementExpenseCode': expenseCode,
                    'ReplacementExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Invoice':
                returnObj = {
                    'InvoiceExpenseCode': expenseCode,
                    'InvoiceExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Credit':
                returnObj = {
                    'CreditExpenseCode': expenseCode,
                    'CreditExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-ProductChargeContract':
                returnObj = {
                    'ProductChargeContractExpense': expenseCode,
                    'ProductChargeContractExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-ProductChargeJob':
                returnObj = {
                    'ProductChargeJobExpense': expenseCode,
                    'ProductChargeJobExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-ProductChargeProduct':
                returnObj = {
                    'ProductChargeProductExpense': expenseCode,
                    'ProductChargeProductExpenseDesc': expenseDesc
                };
                break;
            default:
                returnObj = {
                    'ExpenseCode': expenseCode
                };
                break;
        }
        this.receivedExpenseCode.emit(returnObj);
    }
}

/*
 Class for implementing ExpenseCodeSearch DropDown
*/
@Component({
    templateUrl: 'iCABSBExpenseCodeSearch.html'
})

export class ExpenseCodeSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Business/iCABSBExpenseCodeSearch',
        module: 'charges',
        method: 'bill-to-cash/search'
    };

    public pageId: string = '';
    public riExchange: RiExchange;
    public utils: Utils;
    public controls = [];
    public serviceConstants: ServiceConstants;
    public formBuilder: FormBuilder;
    public uiForm: FormGroup;
    public parentMode: string;
    public inputParams: any = {};
    public itemsPerPage: number = 10;
    public page: number = 1;
    public columns: Array<any>;
    public pageTitle: string = 'Expense Code Search';

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSBEXPENSECODESEARCH;
    }

    ngOnInit(): void {
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    ngOnDestroy(): void {
        this.serviceConstants = null;
        this.utils = null;
        this.formBuilder = null;
        this.riExchange = null;
    }

    public injectServices(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.riExchange = injector.get(RiExchange);
    }

    //Called during ellipsis search
    public updateView(params?: any): void {
        this.parentMode = params.parentMode ? params.parentMode : '';
        this.buildTable();
    }

    //Method to set filter values for table
    public buildTable(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('search.sortby', 'ExpenseCode');
        this.inputParams.search = search;
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.columns = new Array();
        this.buildTableColumns();
        this.riTable.loadTableData(this.inputParams);
    }

    //Method to build table columns
    public buildTableColumns(): void {
        this.columns.push({ title: 'Expense Code', name: 'ExpenseCode', type: MntConst.eTypeCode });
        this.columns.push({ title: 'Description', name: 'ExpenseDesc', type: MntConst.eTypeText });
    }

    //Method called on selecting a data from table
    public selectedData(event: any): void {
        console.log(event);
        let expenseCode = event.row.ExpenseCode;
        let expenseDesc = event.row.ExpenseDesc;
        let returnObj: any;
        switch (this.parentMode) {
            case 'LookUp':
                returnObj = {
                    'ExpenseCode': expenseCode,
                    'ExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Installation':
                returnObj = {
                    'InstallationChargeExpenseCode': expenseCode,
                    'InstallationChargeExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Removal':
                returnObj = {
                    'RemovalChargeExpenseCode': expenseCode,
                    'RemovalChargeExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Initial':
                returnObj = {
                    'InitialChargeExpenseCode': expenseCode,
                    'InitialChargeExpenseDesc': expenseDesc
                };
                break;
            case 'MaterialsExpenseCode':
                returnObj = {
                    'MaterialsExpenseCode': expenseCode,
                    'MaterialsExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Labour':
                returnObj = {
                    'LabourExpenseCode': expenseCode,
                    'LabourExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Replacement':
                returnObj = {
                    'ReplacementExpenseCode': expenseCode,
                    'ReplacementExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Invoice':
                returnObj = {
                    'InvoiceExpenseCode': expenseCode,
                    'InvoiceExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-Credit':
                returnObj = {
                    'CreditExpenseCode': expenseCode,
                    'CreditExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-ProductChargeContract':
                returnObj = {
                    'ProductChargeContractExpense': expenseCode,
                    'ProductChargeContractExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-ProductChargeJob':
                returnObj = {
                    'ProductChargeJobExpense': expenseCode,
                    'ProductChargeJobExpenseDesc': expenseDesc
                };
                break;
            case 'LookUp-ProductChargeProduct':
                returnObj = {
                    'ProductChargeProductExpense': expenseCode,
                    'ProductChargeProductExpenseDesc': expenseDesc
                };
                break;
            default:
                returnObj = {
                    'ExpenseCode': expenseCode
                };
                break;
        }
        this.emitSelectedData(returnObj);
    }
}
