import { AppModuleRoutes, InternalGridSearchModuleRoutes, InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';
import { GenericActionTypes } from './../../actions/generic';
import { Observable } from 'rxjs/Rx';
import { Utils } from './../../../shared/services/utility';
import { Logger } from '@nsalaun/ng2-logger';
import { HttpService } from './../../../shared/services/http-service';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { Renderer, ElementRef, Component, OnInit, Input, EventEmitter, Injectable, OnDestroy, AfterViewInit, ViewChild, ViewChildren, NgZone, trigger, state, style, animate, transition, Output, AfterContentInit, ContentChild, AfterViewChecked } from '@angular/core';
//import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { URLSearchParams } from '@angular/http';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ErrorService } from './../../../shared/services/error.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../../../shared/services/message.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { ActionTypes } from '../../../app/actions/account';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from './../../../shared/constants/error.constant';
import { Location } from '@angular/common';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAAccountAddressChangeHistoryGrid.html',
    providers: [ErrorService, MessageService]
})
export class AccountAddressChangeHistoryComponent implements OnInit {
    //@ViewChild('accountAddressGrid') accountAddressGrid: GridComponent;
    @ViewChild('accountAddressPagination') accountAddressPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public backLinkText: string;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public errorSubscription;
    private CurrentColumnName: string = '';
    public showErrorHeader: boolean = true;
    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountAddressChangeHistoryGrid';
    public search: URLSearchParams = new URLSearchParams();
    public dynamicComponent1 = AccountSearchComponent;
    public storeSubscription: Subscription;
    public ToDate: Date = new Date();
    public FromDate: Date = new Date();
    public curPage: number = 1;
    public totalRecords: number;
    public pageSize: number = 10;

    public accountAddressGroup: FormGroup;
    public dateObjectsEnabled: Object = {
        ToDate: true,
        FromDate: true,
        firstday: true,
        FromdtDisplayed: true
    };
    //public itemsPerPage: number;
    //public currentPage: string;
    //public maxColumn: number;
    public AccountNumber: string;
    public showHeader: boolean = true;
    public AccountName: string;
    public inputParamsAccSearch: any = { 'parentMode': 'LookUp', 'showAddNewDisplay': false };
    public response: string;
    public gridSortHeaders: Array<any>;
    //public pageSize: number;
    //public gridCurPage: number;
    public lookupParams: URLSearchParams = new URLSearchParams();
    public action: string;
    //public totalRecords: number;
    public FromdtDisplayed: string;
    public firstday: string;
    public TodtDisplayed: string;
    public AccountHistoryRowID: string;
    public AccountRowID: string;
    public inputParams: any = {};
    public pageData: any = {};
    public addressChangeData: any;
    public showMessageHeader: boolean = true;
    public isRequesting: boolean = false;
    public ajaxSubscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private _router: Router,
        private serviceConstants: ServiceConstants,
        private searchService: HttpService,
        private errorService: ErrorService,
        private messageService: MessageService,
        private localeTranslateService: LocaleTranslationService,
        private _logger: Logger,
        private zone: NgZone,
        private _eRef: ElementRef,
        private _renderer: Renderer,
        private store: Store<any>,
        private ajaxconstant: AjaxObservableConstant,
        private httpService: HttpService,
        private utils: Utils,
        private location: Location
    ) {
        this.storeSubscription = store.select('generic').subscribe(data => {
            this.addressChangeData = data['account_address_change'];
        });

    }

    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
                    switch (event) {
                        case this.ajaxconstant.START:
                            this.isRequesting = true;
                            break;
                        case this.ajaxconstant.COMPLETE:
                            this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.accountAddressGroup = this.fb.group({
            AccountNumber: [''],
            AccountName: ['']
        });
        this.localeTranslateService.setUpTranslation();
        this.pageSize = 10;
        this.action = '2';
        this.errorService.emitError(0);
        this.messageService.emitMessage(0);
        this.gridSortHeaders = [{
            'fieldName': 'AccountNumber',
            'colName': 'Account Number',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'HistoryEffectDate',
            'colName': 'Date',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'BranchNumber',
            'colName': 'Branch Number',
            'sortType': 'ASC'
        }];

        if (this.addressChangeData.AccountNumber) {

            this.FromdtDisplayed = this.addressChangeData.DateFrom;
            this.FromDate = new Date(this.FromdtDisplayed);
            this.TodtDisplayed = this.addressChangeData.DateTo;
            this.ToDate = new Date(this.TodtDisplayed);
            this.accountAddressGroup.controls['AccountNumber'].setValue(this.addressChangeData.AccountNumber);
            //this.accountAddressGrid.loadGridData(this.addressChangeData);
            this.riGrid_BeforeExecute();
        } else {
            this.FromDate = new Date(new Date().setDate(1));
            this.FromdtDisplayed = this.formatDate(this.FromDate);

            this.ToDate = new Date();
            this.TodtDisplayed = this.formatDate(new Date(this.ToDate));
        }
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.windowOnload();
    }

    public windowOnload(): void {
        this.riGrid.PageSize = 10;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.buildGrid();
        this.riGrid_BeforeExecute();
    }

    public buildGrid(): void {

        this.riGrid.Clear();

        this.riGrid.AddColumn('HistoryEffectDate', 'History', 'HistoryEffectDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('HistoryEffectDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('AccountNumber', 'History', 'AccountNumber', MntConst.eTypeText, 10, true);
        this.riGrid.AddColumnAlign('AccountNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('AccountName', 'History', 'AccountName', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('AccountName', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('CurrentInvoiceGroups', 'History', 'CurrentInvoiceGroups', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('CurrentInvoiceGroups', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('UserCode', 'History', 'UserCode', MntConst.eTypeTextFree, 10);

        this.riGrid.AddColumn('BranchNumber', 'History', 'BranchNumber', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumnAlign('BranchNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('UpdateInvoiceGroupsInd', 'History', 'UpdateInvoiceGroupsInd', MntConst.eTypeImage, 1, false, 'Click here to update Invoice Groups');
        this.riGrid.AddColumnAlign('UpdateInvoiceGroupsInd', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('HistoryEffectDate', true);
        this.riGrid.AddColumnOrderable('AccountNumber', true);
        this.riGrid.AddColumnOrderable('BranchNumber', true);

        this.riGrid.Complete();
    }

    private riGrid_BeforeExecute(): void {
        let gridParams: URLSearchParams = new URLSearchParams();

        gridParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridParams.set('DateFrom', this.FromdtDisplayed);
        gridParams.set('DateTo', this.TodtDisplayed);
        gridParams.set('AccountNumber', this.accountAddressGroup.controls['AccountNumber'].value);
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());

        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    return;
                }
                this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                this.riGrid.UpdateBody = true;
                this.riGrid.UpdateHeader = true;
                this.riGrid.UpdateFooter = false;
                this.riGrid.Execute(data);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_BodyOnDblClick(ev: Event): void {
        if (this.riGrid.CurrentColumnName === 'AccountNumber') {
            this.HistoryFocus(ev.srcElement);
            this.CurrentColumnName = 'AccountNumber';
            this.AccountRowID = ev.srcElement.getAttribute('rowid');
            this.pageData.AccountNumber = this.accountAddressGroup.controls['AccountNumber'].value;
            this.pageData.FromdtDisplayed = this.FromdtDisplayed;
            this.pageData.TodtDisplayed = this.TodtDisplayed;
            this.store.dispatch({
                type: GenericActionTypes.SAVE_ADDRESS_CHANGE_DATA, payload: this.pageData
            });
            this._router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { Mode: 'History', AccountRowID: this.AccountRowID } });
        }
        let currentRowIndex = this.riGrid.CurrentRow;

        this.store.dispatch({
            type: ActionTypes.SAVE_ACCOUNT_ROW_DATA, payload:
            {
                rowData: {
                    name: this.riGrid.bodyArray[currentRowIndex][2].text,
                    number: this.riGrid.bodyArray[currentRowIndex][1].text
                }
            }
        });
    }

    public riGrid_BodyOnClick(ev: any): void {
        let oTR = ev.srcElement.parentElement.parentElement.parentElement;
        if (this.riGrid.CurrentColumnName === 'UpdateInvoiceGroupsInd') {
            this.HistoryFocus(ev.srcElement);
            /*Below Code remains as it is as page is already developed*/
            this._router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSAINVOICEGROUPADDRESSAMENDMENTGRID], { queryParams: { parentMode: 'History', AccountHistoryRowID: oTR.children[6].children[0].children[0].getAttribute('rowid') } });
        } else if (this.riGrid.CurrentColumnName === 'AccountNumber') {
            if (ev.srcElement.tagName === 'INPUT') {
                ev.srcElement.focus();
                ev.srcElement.select();
            }
        }
    }

    public HistoryFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        if (oTR.tagName === 'TR') {
            rsrcElement.focus();
            if (this.riGrid.CurrentColumnName === 'AccountNumber') rsrcElement.select();
            let obj = {
                'AccountHistoryRowID': oTR.children[6].children[0].children[0].getAttribute('rowid'),
                'AccountRowID': oTR.children[1].children[0].children[0].getAttribute('rowid'),
                'Row': oTR.sectionRowIndex
            };
        }

        /*  AccountNumber.setAttribute "AccountHistoryRowID", oTR.children(6).children(0).RowID
          AccountNumber.setAttribute "AccountRowID",        oTR.children(1).children(0).RowID
          AccountNumber.setAttribute "Row",                 oTR.sectionRowIndex*/
    }

    public riGrid_BodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.HistoryFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.HistoryFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public fromDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.FromdtDisplayed = value.value;
        } else {
            this.FromdtDisplayed = '';
        }
    }

    public toDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.TodtDisplayed = value.value;
        } else {
            this.TodtDisplayed = '';
        }
    }

    public onblurAccount(event: any): void {
        this.inputParams.AccountNumber = event.target.value;
    }

    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }

    public getCellInfo(info: any): void {
        if (info.cellIndex === 6) {
            this.pageData.AccountNumber = this.accountAddressGroup.controls['AccountNumber'].value;
            this.pageData.FromdtDisplayed = this.FromdtDisplayed;
            this.pageData.TodtDisplayed = this.TodtDisplayed;
            this.store.dispatch({
                type: GenericActionTypes.SAVE_ADDRESS_CHANGE_DATA, payload: this.pageData
            });

        }
    }

    /*public onGridRowClick(data: any): void {
        if (data.rowData['Account Number'] === data.cellData.text) {
            this.CurrentColumnName = 'AccountNumber';
            this.AccountRowID = data.cellData.rowID;
            this.pageData.AccountNumber = this.accountAddressGroup.controls['AccountNumber'].value;
            this.pageData.FromdtDisplayed = this.FromdtDisplayed;
            this.pageData.TodtDisplayed = this.TodtDisplayed;
            this.store.dispatch({
                type: GenericActionTypes.SAVE_ADDRESS_CHANGE_DATA, payload: this.pageData
            });
            this._router.navigate(['/contractmanagement/account/maintenance'], { queryParams: { Mode: 'History', AccountRowID: this.AccountRowID } });
        }

        this.store.dispatch({
            type: ActionTypes.SAVE_ACCOUNT_ROW_DATA, payload:
            {
                rowData: {
                    name: data.rowData['Account Name'],
                    number: data.rowData['Account Number']
                }
            }
        });
    }*/


    public setAccountNumber(data: any): void {
        if (data) {
            this.AccountNumber = data.AccountNumber;
            this.AccountName = data.AccountName;
            this.accountAddressGroup.controls['AccountNumber'].setValue('');
            this.accountAddressGroup.controls['AccountNumber'].setValue(data.AccountNumber);
            this.accountAddressGroup.controls['AccountName'].setValue('');
            this.accountAddressGroup.controls['AccountName'].setValue(data.AccountName);
        }
    }

    public lookUpRecord(data: any, maxresults: any): Observable<any> {
        this.lookupParams.set(this.serviceConstants.Action, '0');
        this.lookupParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.lookupParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.lookupParams.set(this.serviceConstants.MaxResults, maxresults.toString());
        }

        if (data) {
            return this.httpService.lookUpRequest(this.lookupParams, data);
        }
    }

    public onDataReceived(data: any, route?: any): void {
        this.accountAddressGroup.controls['AccountName'].setValue('');
        this.accountAddressGroup.controls['AccountName'].setValue(data.AccountName);
        this.refresh();
    }

    public numberPadding(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    public onBlur(event: any): void {

        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 9) {
            let _paddedValue = this.numberPadding(elementValue, 9);
            if (event.target.id === 'AccountNumber') {
                this.accountAddressGroup.controls['AccountNumber'].setValue(_paddedValue);
            }
        }
        if (!this.accountAddressGroup.controls['AccountNumber'].value) {
            this.accountAddressGroup.controls['AccountName'].setValue('');
            return;
        }

        let accountaddressData = [{
            'table': 'Account',
            'query': { 'AccountNumber': this.accountAddressGroup.controls['AccountNumber'].value },
            'fields': [
                'AccountNumber',
                'AccountName'
            ]
        }];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpRecord(accountaddressData, 1).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    let accountaddressDatafetched = (e.results[0])[0];
                    this.onDataReceived(accountaddressDatafetched);
                }
                else {
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    this.errorService.emitError(e);
                }
            },
            (error) => {
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                this.errorService.emitError(error);
            });
    }

    public formatDate(date: Date): any {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [day, month, year].join('/');
    }
    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }
}
