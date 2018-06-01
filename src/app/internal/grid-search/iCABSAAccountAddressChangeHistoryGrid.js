import { GenericActionTypes } from './../../actions/generic';
import { Utils } from './../../../shared/services/utility';
import { Logger } from '@nsalaun/ng2-logger';
import { HttpService } from './../../../shared/services/http-service';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { Renderer, ElementRef, Component, ViewChild, NgZone } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ErrorService } from './../../../shared/services/error.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../../../shared/services/message.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { ActionTypes } from '../../../app/actions/account';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from './../../../shared/constants/error.constant';
import { Location } from '@angular/common';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var AccountAddressChangeHistoryComponent = (function () {
    function AccountAddressChangeHistoryComponent(fb, _router, serviceConstants, searchService, errorService, messageService, localeTranslateService, _logger, zone, _eRef, _renderer, store, ajaxconstant, httpService, utils, location) {
        var _this = this;
        this.fb = fb;
        this._router = _router;
        this.serviceConstants = serviceConstants;
        this.searchService = searchService;
        this.errorService = errorService;
        this.messageService = messageService;
        this.localeTranslateService = localeTranslateService;
        this._logger = _logger;
        this.zone = zone;
        this._eRef = _eRef;
        this._renderer = _renderer;
        this.store = store;
        this.ajaxconstant = ajaxconstant;
        this.httpService = httpService;
        this.utils = utils;
        this.location = location;
        this.ajaxSource = new BehaviorSubject(0);
        this.CurrentColumnName = '';
        this.showErrorHeader = true;
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountAddressChangeHistoryGrid';
        this.search = new URLSearchParams();
        this.dynamicComponent1 = AccountSearchComponent;
        this.ToDate = new Date();
        this.FromDate = new Date();
        this.curPage = 1;
        this.pageSize = 10;
        this.dateObjectsEnabled = {
            ToDate: true,
            FromDate: true,
            firstday: true,
            FromdtDisplayed: true
        };
        this.showHeader = true;
        this.inputParamsAccSearch = { 'parentMode': 'LookUp', 'showAddNewDisplay': false };
        this.lookupParams = new URLSearchParams();
        this.inputParams = {};
        this.pageData = {};
        this.showMessageHeader = true;
        this.isRequesting = false;
        this.storeSubscription = store.select('generic').subscribe(function (data) {
            _this.addressChangeData = data['account_address_change'];
        });
    }
    AccountAddressChangeHistoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
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
        if (this.addressChangeData.AccountNumber) {
            this.FromdtDisplayed = this.addressChangeData.FromdtDisplayed;
            this.FromDate = new Date(this.FromdtDisplayed);
            this.TodtDisplayed = this.addressChangeData.TodtDisplayed;
            this.ToDate = new Date(this.TodtDisplayed);
            this.accountAddressGroup.controls['AccountNumber'].setValue(this.addressChangeData.AccountNumber);
            this.accountAddressGroup.controls['AccountName'].setValue(this.addressChangeData.AccountName);
        }
        else if (this.addressChangeData.FromdtDisplayed && this.addressChangeData.TodtDisplayed) {
            this.FromdtDisplayed = this.addressChangeData.FromdtDisplayed;
            this.FromDate = new Date(this.FromdtDisplayed);
            this.TodtDisplayed = this.addressChangeData.TodtDisplayed;
            this.ToDate = new Date(this.TodtDisplayed);
        }
        else {
            this.FromDate = new Date(new Date().setDate(1));
            this.FromdtDisplayed = this.formatDate(this.FromDate);
            this.ToDate = new Date();
            this.TodtDisplayed = this.formatDate(new Date(this.ToDate));
        }
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.windowOnload();
    };
    AccountAddressChangeHistoryComponent.prototype.windowOnload = function () {
        this.riGrid.PageSize = 10;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.buildGrid();
        this.riGrid_BeforeExecute();
    };
    AccountAddressChangeHistoryComponent.prototype.buildGrid = function () {
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
    };
    AccountAddressChangeHistoryComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
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
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                return;
            }
            _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
            _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
            _this.riGrid.Update = true;
            _this.riGrid.UpdateBody = true;
            _this.riGrid.UpdateHeader = true;
            _this.riGrid.UpdateFooter = false;
            _this.riGrid.Execute(data);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountAddressChangeHistoryComponent.prototype.riGrid_BodyOnDblClick = function (ev) {
        if (this.riGrid.CurrentColumnName === 'AccountNumber') {
            this.HistoryFocus(ev.srcElement);
            this.CurrentColumnName = 'AccountNumber';
            this.AccountRowID = ev.srcElement.getAttribute('rowid');
            this.pageData.AccountNumber = this.accountAddressGroup.controls['AccountNumber'].value;
            this.pageData.AccountName = this.accountAddressGroup.controls['AccountName'].value;
            this.pageData.FromdtDisplayed = this.FromdtDisplayed;
            this.pageData.TodtDisplayed = this.TodtDisplayed;
            this.store.dispatch({
                type: GenericActionTypes.SAVE_ADDRESS_CHANGE_DATA, payload: this.pageData
            });
            this._router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { Mode: 'History', AccountRowID: this.AccountRowID } });
        }
        var currentRowIndex = this.riGrid.CurrentRow;
        this.store.dispatch({
            type: ActionTypes.SAVE_ACCOUNT_ROW_DATA, payload: {
                rowData: {
                    name: this.riGrid.bodyArray[currentRowIndex][2].text,
                    number: this.riGrid.bodyArray[currentRowIndex][1].text
                }
            }
        });
    };
    AccountAddressChangeHistoryComponent.prototype.riGrid_BodyOnClick = function (ev) {
        if (this.riGrid.CurrentColumnName === 'UpdateInvoiceGroupsInd') {
            this.HistoryFocus(ev.srcElement);
            alert('Page not ready');
        }
        else if (this.riGrid.CurrentColumnName === 'AccountNumber') {
            if (ev.srcElement.tagName === 'INPUT') {
                ev.srcElement.focus();
                ev.srcElement.select();
            }
        }
    };
    AccountAddressChangeHistoryComponent.prototype.HistoryFocus = function (rsrcElement) {
        var oTR = rsrcElement.parentElement.parentElement.parentElement;
        if (oTR.tagName === 'TR') {
            rsrcElement.focus();
            if (this.riGrid.CurrentColumnName === 'AccountNumber')
                rsrcElement.select();
            var obj = {
                'AccountHistoryRowID': oTR.children[6].children[0].children[0].getAttribute('rowid'),
                'AccountRowID': oTR.children[1].children[0].children[0].getAttribute('rowid'),
                'Row': oTR.sectionRowIndex
            };
        }
    };
    AccountAddressChangeHistoryComponent.prototype.riGrid_BodyOnKeyDown = function (event) {
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
    };
    AccountAddressChangeHistoryComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    AccountAddressChangeHistoryComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    AccountAddressChangeHistoryComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    AccountAddressChangeHistoryComponent.prototype.setAccountNumber = function (data) {
        if (data) {
            this.AccountNumber = data.AccountNumber;
            this.AccountName = data.AccountName;
            this.accountAddressGroup.controls['AccountNumber'].setValue('');
            this.accountAddressGroup.controls['AccountNumber'].setValue(data.AccountNumber);
            this.accountAddressGroup.controls['AccountName'].setValue('');
            this.accountAddressGroup.controls['AccountName'].setValue(data.AccountName);
        }
    };
    AccountAddressChangeHistoryComponent.prototype.fromDateSelectedValue = function (value) {
        if (value && value.value) {
            this.FromdtDisplayed = value.value;
        }
        else {
            this.FromdtDisplayed = '';
        }
    };
    AccountAddressChangeHistoryComponent.prototype.toDateSelectedValue = function (value) {
        if (value && value.value) {
            this.TodtDisplayed = value.value;
        }
        else {
            this.TodtDisplayed = '';
        }
    };
    AccountAddressChangeHistoryComponent.prototype.onblurAccount = function (event) {
        this.inputParams.AccountNumber = event.target.value;
    };
    AccountAddressChangeHistoryComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    AccountAddressChangeHistoryComponent.prototype.getCellInfo = function (info) {
        if (info.cellIndex === 6) {
            this.pageData.AccountNumber = this.accountAddressGroup.controls['AccountNumber'].value;
            this.pageData.FromdtDisplayed = this.FromdtDisplayed;
            this.pageData.TodtDisplayed = this.TodtDisplayed;
            this.store.dispatch({
                type: GenericActionTypes.SAVE_ADDRESS_CHANGE_DATA, payload: this.pageData
            });
        }
    };
    AccountAddressChangeHistoryComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.lookupParams.set(this.serviceConstants.Action, '0');
        this.lookupParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.lookupParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.lookupParams.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        if (data) {
            return this.httpService.lookUpRequest(this.lookupParams, data);
        }
    };
    AccountAddressChangeHistoryComponent.prototype.onDataReceived = function (data, route) {
        this.accountAddressGroup.controls['AccountName'].setValue('');
        this.accountAddressGroup.controls['AccountName'].setValue(data.AccountName);
        this.refresh();
    };
    AccountAddressChangeHistoryComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    AccountAddressChangeHistoryComponent.prototype.onBlur = function (event) {
        var _this = this;
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 9) {
            var _paddedValue = this.numberPadding(elementValue, 9);
            if (event.target.id === 'AccountNumber') {
                this.accountAddressGroup.controls['AccountNumber'].setValue(_paddedValue);
            }
        }
        if (!this.accountAddressGroup.controls['AccountNumber'].value) {
            this.accountAddressGroup.controls['AccountName'].setValue('');
            return;
        }
        var accountaddressData = [{
                'table': 'Account',
                'query': { 'AccountNumber': this.accountAddressGroup.controls['AccountNumber'].value },
                'fields': [
                    'AccountNumber',
                    'AccountName'
                ]
            }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpRecord(accountaddressData, 1).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                var accountaddressDatafetched = (e.results[0])[0];
                _this.onDataReceived(accountaddressDatafetched);
            }
            else {
                e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                _this.errorService.emitError(e);
            }
        }, function (error) {
            error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            _this.errorService.emitError(error);
        });
    };
    AccountAddressChangeHistoryComponent.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    AccountAddressChangeHistoryComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    AccountAddressChangeHistoryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAAccountAddressChangeHistoryGrid.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    AccountAddressChangeHistoryComponent.ctorParameters = [
        { type: FormBuilder, },
        { type: Router, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: LocaleTranslationService, },
        { type: Logger, },
        { type: NgZone, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: Store, },
        { type: AjaxObservableConstant, },
        { type: HttpService, },
        { type: Utils, },
        { type: Location, },
    ];
    AccountAddressChangeHistoryComponent.propDecorators = {
        'accountAddressPagination': [{ type: ViewChild, args: ['accountAddressPagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return AccountAddressChangeHistoryComponent;
}());
