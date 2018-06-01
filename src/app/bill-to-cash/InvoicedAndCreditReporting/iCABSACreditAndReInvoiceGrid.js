import { RiExchange } from './../../../shared/services/riExchange';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Logger } from '@nsalaun/ng2-logger';
import { Utils } from '../../../shared/services/utility';
export var CreditAndReInvoiceGridComponent = (function () {
    function CreditAndReInvoiceGridComponent(route, utils, fb, router, httpService, serviceConstants, zone, global, ajaxconstant, authService, _logger, errorService, messageService, titleService, componentInteractionService, translate, localeTranslateService, store, sysCharConstants, riExchange) {
        this.route = route;
        this.utils = utils;
        this.fb = fb;
        this.router = router;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.zone = zone;
        this.global = global;
        this.ajaxconstant = ajaxconstant;
        this.authService = authService;
        this._logger = _logger;
        this.errorService = errorService;
        this.messageService = messageService;
        this.titleService = titleService;
        this.componentInteractionService = componentInteractionService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.store = store;
        this.sysCharConstants = sysCharConstants;
        this.riExchange = riExchange;
        this.CurrentColumnName = '';
        this.CreditNarrativeValue = '';
        this.strFunction = '';
        this.vbUpdateRecord = '';
        this.vbUpdateVisitNarrative = '';
        this.selectParams = {};
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.showHeader = true;
        this.headerParams = {
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSACreditAndReInvoiceGrid',
            module: 'contract-admin'
        };
        this.lookupParams = new URLSearchParams();
        this.ajaxSource = new BehaviorSubject(0);
        this.querySysChar = new URLSearchParams();
        this.rowId = '';
        this.search = new URLSearchParams();
        this.getSearch = new URLSearchParams();
    }
    CreditAndReInvoiceGridComponent.prototype.fetchSysChar = function (vSCEnableCompanyCode) {
        var _this = this;
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, vSCEnableCompanyCode);
        this.httpService.sysCharRequest(this.querySysChar).subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
            }
            else {
                if (e) {
                    _this.vSCEnableCompanyCode = e.records[0].Required;
                    if (_this.vSCEnableCompanyCode)
                        _this.blnSCEnableCompanyCode = 'TRUE';
                    else
                        _this.blnSCEnableCompanyCode = 'FALSE';
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    CreditAndReInvoiceGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.inputParams = {
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'CompanyCode': this.routeParams.CompanyCode,
            'CompanyDesc': this.routeParams.CompanyDesc,
            'CompanyInvoiceNumber': this.routeParams.CompanyInvoiceNumber,
            'InvoiceNumber': this.routeParams.InvoiceNumber,
            'CreditReasonCode': this.routeParams.CreditReasonCode,
            'CreditReasonDesc': this.routeParams.CreditReasonDesc,
            'UseAddress': this.routeParams.UseAddress,
            'riGridMode': '0',
            'sortOrder': 'Descending'
        };
        this.localeTranslateService.setUpTranslation();
        this.CurrentContractType = this.utils.getCurrentContractType(this.CurrentContractTypeURLParameter);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);
        var vSCEnableCompanyCode = this.sysCharConstants.SystemCharEnableCompanyCode.toString();
        this.fetchSysChar(vSCEnableCompanyCode);
        this.maxColumn = 9;
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.action = '2';
        this.pageSize = 15;
        this.creditAndReInvoiceFormGroup = this.fb.group({
            CompanyCode: [{ value: '', disabled: true }],
            CompanyDesc: [{ value: '', disabled: true }],
            CompanyInvoiceNumber: [{ value: '', disabled: true }],
            CreditReasonCode: [{ value: '', disabled: true }],
            CreditReasonDesc: [{ value: '', disabled: true }],
            InvoiceNumber: [{ value: '', disabled: true }],
            UseAddress: [{ value: '', disabled: true }]
        });
        this.creditAndReInvoiceFormGroup.controls['CompanyCode'].setValue(this.routeParams.CompanyCode);
        this.creditAndReInvoiceFormGroup.controls['CompanyDesc'].setValue(this.routeParams.CompanyDesc);
        this.creditAndReInvoiceFormGroup.controls['CompanyInvoiceNumber'].setValue(this.routeParams.CompanyInvoiceNumber);
        this.creditAndReInvoiceFormGroup.controls['InvoiceNumber'].setValue(this.routeParams.InvoiceNumber);
        this.creditAndReInvoiceFormGroup.controls['CreditReasonCode'].setValue(this.routeParams.CreditReasonCode);
        this.creditAndReInvoiceFormGroup.controls['CreditReasonDesc'].setValue(this.routeParams.CreditReasonDesc);
        this.creditAndReInvoiceFormGroup.controls['UseAddress'].setValue(this.routeParams.UseAddress);
        this.buildgrid();
        if (localStorage.getItem('navFromCreditReinvoiceToGrid')) {
            localStorage.setItem('navFromCreditReinvoiceToGrid', 'false');
        }
    };
    CreditAndReInvoiceGridComponent.prototype.getGridInfo = function (info) {
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * this.itemsPerPage;
        }
        else {
            this.totalRecords = 0;
        }
    };
    CreditAndReInvoiceGridComponent.prototype.getCurrentPage = function (data) {
        this.gridCurPage = data.value;
        this.buildgrid();
    };
    CreditAndReInvoiceGridComponent.prototype.sortGrid = function (data) {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.buildgrid();
    };
    CreditAndReInvoiceGridComponent.prototype.buildgrid = function () {
        this.inputParams.module = this.headerParams.module;
        this.inputParams.method = this.headerParams.method;
        this.inputParams.operation = this.headerParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.Action, this.action);
        this.search.set('InvoiceNumber', this.inputParams.InvoiceNumber);
        this.search.set('riSortOrder', this.inputParams.sortOrder);
        this.search.set('riCacheRefresh', this.inputParams.riCacheRefresh);
        this.search.set('riGridMode', this.inputParams.riGridMode);
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.CurrentColumnName);
        this.inputParams.search = this.search;
        this.creditReinvoiceGrid.loadGridData(this.inputParams, this.rowId);
        this.rowId = '';
    };
    CreditAndReInvoiceGridComponent.prototype.refresh = function () {
        this.gridCurPage = 1;
        this.creditReinvoiceGrid.clearGridData();
        this.buildgrid();
    };
    CreditAndReInvoiceGridComponent.prototype.onGridRowClick = function (data) {
        this.rowId = '';
        if (data.cellIndex === 0) {
            this.InvoiceNumberAttributeProRataChargeRowID = data.trRowData[8].rowID;
            this.InvoiceNumberAttributeRowID = data.cellData.rowID;
            this.rowId = data.cellData.rowID;
            this.CurrentColumnName = 'ItemNo';
            this.updateGrid(data);
        }
        if (data.cellIndex === 8) {
            this.InvoiceNumberAttributeProRataChargeRowID = data.cellData.rowID;
            var firstdata = this.creditReinvoiceGrid.getCellInfoForSelectedRow(data.rowIndex, 0);
            this.InvoiceNumberAttributeRowID = firstdata['rowID'];
            this.rowId = firstdata['rowID'];
            this.CurrentColumnName = 'Credit';
            this.updateGrid(data);
        }
    };
    CreditAndReInvoiceGridComponent.prototype.updateGrid = function (fulldata) {
        var _this = this;
        if (this.InvoiceNumberAttributeProRataChargeRowID === '1') {
            this.strFunction = 'InvoiceDetailAddProRataCharge';
        }
        else {
            this.strFunction = 'InvoiceDetailDeleteProRataCharge';
        }
        var data = fulldata.rowData;
        var cellData = fulldata.cellData;
        this.inputParams.module = this.headerParams.module;
        this.inputParams.method = this.headerParams.method;
        this.inputParams.operation = this.headerParams.operation;
        this.getSearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.getSearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.getSearch.set(this.serviceConstants.Action, '6');
        this.getSearch.set('LanguageCode', this.riExchange.LanguageCode());
        this.getSearch.set('InvoiceNumber', this.inputParams.InvoiceNumber);
        this.getSearch.set('Function', this.strFunction);
        this.getSearch.set('InvoiceDetailRowID', this.InvoiceNumberAttributeRowID);
        this.getSearch.set('CreditNarrative', this.CreditNarrativeValue);
        this.getSearch.set('CreditReasonCode', this.creditAndReInvoiceFormGroup.controls['CreditReasonCode'].value);
        this.getSearch.set('UseAddress', this.creditAndReInvoiceFormGroup.controls['UseAddress'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.getSearch)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                if (e) {
                    _this.creditReinvoiceGrid.clearGridData();
                    _this.creditReinvoiceGrid.loadGridData(_this.inputParams);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    CreditAndReInvoiceGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSACreditAndReInvoiceGrid.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    CreditAndReInvoiceGridComponent.ctorParameters = [
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: FormBuilder, },
        { type: Router, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: NgZone, },
        { type: GlobalConstant, },
        { type: AjaxObservableConstant, },
        { type: AuthService, },
        { type: Logger, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: Title, },
        { type: ComponentInteractionService, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Store, },
        { type: SysCharConstants, },
        { type: RiExchange, },
    ];
    CreditAndReInvoiceGridComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'creditReinvoiceGrid': [{ type: ViewChild, args: ['creditReinvoiceGrid',] },],
        'creditReinvoicePagination': [{ type: ViewChild, args: ['creditReinvoicePagination',] },],
    };
    return CreditAndReInvoiceGridComponent;
}());
