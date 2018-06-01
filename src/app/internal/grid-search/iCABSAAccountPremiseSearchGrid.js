var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { SpeedScript } from '../../../shared/services/speedscript';
import { LookUp } from '../../../shared/services/lookup';
import { Utils } from '../../../shared/services/utility';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Store } from '@ngrx/store';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { HttpService } from '../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { ActionTypes } from '../../actions/account';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var AccountPremiseSearchComponent = (function (_super) {
    __extends(AccountPremiseSearchComponent, _super);
    function AccountPremiseSearchComponent(serviceConstants, _formBuilder, _router, httpService, logger, global, localeTranslateService, store, sysCharConstants, activatedRoute, utils, LookUp, SpeedScript) {
        var _this = this;
        _super.call(this);
        this.serviceConstants = serviceConstants;
        this._formBuilder = _formBuilder;
        this._router = _router;
        this.httpService = httpService;
        this.logger = logger;
        this.global = global;
        this.localeTranslateService = localeTranslateService;
        this.store = store;
        this.sysCharConstants = sysCharConstants;
        this.activatedRoute = activatedRoute;
        this.utils = utils;
        this.LookUp = LookUp;
        this.SpeedScript = SpeedScript;
        this.method = 'contract-management/search';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountPremiseSearchGrid';
        this.search = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.maxColumn = 9;
        this.totalItems = 11;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.page = 1;
        this.AccountNumber = '';
        this.AccountName = '';
        this.ExchangeMode = 'AccountPremiseSearch';
        this.showHeader = true;
        this.inputParams = {
            'Function': 'GeneralSearch',
            'riGridMode': '0',
            'riGridHandle': '',
            'PageSize': '10',
            'PageCurrent': '1',
            'riSortOrder': 'Descending',
            'parentMode': 'Account',
            'businessCode': 'D',
            'countryCode': 'UK',
            'AccountNumber': this.AccountNumber,
            'AccountName': this.AccountName,
            'ExchangeMode': this.ExchangeMode,
            'Action': 2
        };
        this.getUrlParams();
        this.storeSubscription = store.select('account').subscribe(function (data) {
            _this.storeData = data;
            _this.setFormData(_this.storeData);
        });
    }
    AccountPremiseSearchComponent.prototype.getData = function (params) {
        return this.httpService.makeGetRequest(params.method, params.module, params.operation, params.search);
    };
    AccountPremiseSearchComponent.prototype.getUrlParams = function () {
        var _this = this;
        this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['parentMode'] !== undefined)
                _this.inputParams.parentMode = params['parentMode'];
            if (params['AccountNumber'] !== undefined) {
                _this.AccountNumber = params['AccountNumber'];
                _this.onAccountBlur('AccountNumber');
            }
        });
    };
    AccountPremiseSearchComponent.prototype.setFormData = function (data) {
        if (data) {
            this.inputParams.businessCode = this.utils.getBusinessCode();
            this.inputParams.countryCode = this.utils.getCountryCode();
            if (data.hasOwnProperty('sentFromParent')) {
                if (data['sentFromParent'].hasOwnProperty('AccountNumber')) {
                    this.AccountNumber = data['sentFromParent'].AccountNumber;
                    this.inputParams.AccountNumber = this.AccountName;
                }
                if (data['sentFromParent'].hasOwnProperty('AccountName')) {
                    this.AccountName = data['sentFromParent'].AccountName;
                    this.inputParams.AccountName = this.AccountName;
                }
                if (data['sentFromParent'].hasOwnProperty('parentMode')) {
                    this.inputParams.parentMode = data['sentFromParent'].parentMode;
                }
            }
        }
    };
    AccountPremiseSearchComponent.prototype.ngOnInit = function () {
        var params = this.inputParams;
        this.inputParams['riGridHandle'] = (Math.floor(Math.random() * 900000) + 100000).toString();
        this.updateView(this.inputParams);
        this.search.set(this.serviceConstants.Action, '2');
        this.localeTranslateService.setUpTranslation();
        this.gridSortHeaders = [{
                'fieldName': 'ContractNumber',
                'index': 2,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremiseName',
                'index': 4,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'AddressLine1',
                'index': 5,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremisePostcode',
                'index': 6,
                'sortType': 'ASC'
            }];
    };
    AccountPremiseSearchComponent.prototype.ngOnDestroy = function () {
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    };
    AccountPremiseSearchComponent.prototype.updateView = function (params) {
        if (params['AccountNumber'] !== undefined && params['AccountNumber'] !== '') {
            this.AccountNumber = params['AccountNumber'];
            if (params['AccountName'] !== undefined && params['AccountName'] !== '') {
                this.AccountName = params['AccountName'];
            }
            else {
                this.onAccountBlur('AccountNumber');
            }
        }
        if (params['parentMode']) {
            this.inputParams.parentMode = params['parentMode'];
        }
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('Function', 'GeneralSearch');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', this.inputParams['riGridHandle']);
        this.search.set('riCacheRefresh', 'true');
        this.search.set('PageSize', '10');
        this.search.set('PageCurrent', '1');
        this.search.set('AccountNumber', this.AccountNumber);
        this.search.set(this.serviceConstants.Action, '2');
        this.inputParams.search = this.search;
        this.accountPremise.loadGridData(this.inputParams);
    };
    AccountPremiseSearchComponent.prototype.selectedDataOnClick = function (event) {
        var _this = this;
        var returnGrpObj;
        var parentMode = this.inputParams.parentMode;
        var groupAccountNumber = event.trRowData[0].text;
        var contractTypeCode = event.trRowData[1].text;
        var contractNumber = event.trRowData[2].text;
        var premiseNumber = event.trRowData[3].text;
        var premiseName = event.trRowData[4].text;
        var premiseAddressLine1 = event.trRowData[5].text;
        var rowID = event.cellData['rowID'];
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('Function', 'GetFullPremiseAddress');
        this.search.set('PremiseNumber', premiseNumber);
        if (contractNumber !== undefined && contractNumber !== null) {
            this.search.set('ContractNumber', contractNumber);
        }
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.MethodType, this.serviceConstants.Method.Maintenance);
        this.search.set('action', '6');
        this.search.set('Function', 'GetFullPremiseAddress');
        this.search.set('ContractNumber', contractNumber);
        this.search.set('methodtype', 'maintenance');
        this.search.set('premiseNumber', premiseNumber);
        this.inputParams.search = this.search;
        switch (contractTypeCode) {
            case 'C':
            case 'P':
                returnGrpObj = {
                    'strURLExtra': '<product>'
                };
                break;
            case 'J':
                returnGrpObj = {
                    'strURLExtra': '<job>'
                };
                break;
        }
        if (event.cellIndex === 5 && premiseAddressLine1 === '') {
            returnGrpObj = {
                'GroupAccountNumber': groupAccountNumber,
                'Object': event.rowData
            };
            this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: returnGrpObj });
            return;
        }
        switch (parentMode) {
            case 'Account':
                returnGrpObj = {
                    'ExchangeMode': this.inputParams.ExchangeMode
                };
                this._router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        'parentMode': this.inputParams.ExchangeMode,
                        'PremiseRowID': rowID,
                        'ContractTypeCode': contractTypeCode
                    }
                });
                break;
            case 'Prospect':
                returnGrpObj = {
                    'PremiseNumber': premiseNumber,
                    'PremiseName': premiseName,
                    'ContractNumber': contractNumber
                };
                this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: returnGrpObj });
                break;
            case 'PipelineProspect':
                returnGrpObj = {
                    'PremiseNumber': premiseNumber,
                    'PremiseName': premiseName,
                    'PremiseAddressLine1': premiseAddressLine1,
                    'ContractNumber': contractNumber
                };
                this.getData(this.inputParams).subscribe(function (e) {
                    if (e && !e.errorNumber) {
                        _this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: e });
                        _this.search.set('Function', 'GeneralSearch');
                        _this.inputParams.search = _this.search;
                    }
                });
                break;
            default:
                returnGrpObj = {
                    'GroupAccountNumber': groupAccountNumber,
                    'Object': event.rowData
                };
                this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: returnGrpObj });
        }
    };
    AccountPremiseSearchComponent.prototype.onGridCellClick = function (event) {
        var returnGrpObj;
        var parentMode = this.inputParams.parentMode;
        var groupAccountNumber = event.trRowData[0].text;
        var contractTypeCode = event.trRowData[1].text;
        var contractNumber = event.trRowData[2].text;
        var premiseNumber = event.trRowData[3].text;
        var premiseName = event.trRowData[4].text;
        var premiseAddressLine1 = event.trRowData[5].text;
        switch (parentMode) {
            case 'Account':
                returnGrpObj = {
                    'ExchangeMode': this.inputParams.ExchangeMode,
                    'PremiseNumber': premiseNumber
                };
                break;
            case 'Prospect':
                returnGrpObj = {
                    'PremiseNumber': premiseNumber,
                    'PremiseName': premiseName,
                    'ContractNumber': contractNumber
                };
                break;
            case 'PipelineProspect':
                returnGrpObj = {
                    'PremiseNumber': premiseNumber,
                    'PremiseName': premiseName,
                    'PremiseAddressLine1': premiseAddressLine1,
                    'ContractNumber': contractNumber
                };
                break;
            default:
                returnGrpObj = {
                    'GroupAccountNumber': groupAccountNumber,
                    'Object': event.rowData,
                    'PremiseNumber': premiseNumber
                };
        }
        this.emitSelectedData(returnGrpObj);
    };
    AccountPremiseSearchComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    AccountPremiseSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.search = this.search;
        this.accountPremise.loadGridData(this.inputParams);
    };
    AccountPremiseSearchComponent.prototype.onAccountBlur = function (event) {
        var _this = this;
        if (this.AccountNumber && this.AccountNumber.length > 0 && this.AccountNumber.length < 9) {
            this.AccountNumber = this.utils.numberPadding(this.AccountNumber, 9);
        }
        if (this.AccountNumber !== '') {
            var data = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': this.AccountNumber },
                    'fields': ['AccountNumber', 'AccountName']
                }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.AccountName = e['results'][0][0].AccountName;
                }
            }, function (error) {
                _this.AccountNumber = '';
                error['errorMessage'] = error['errorMessage'];
            });
        }
    };
    ;
    AccountPremiseSearchComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    AccountPremiseSearchComponent.prototype.searchload = function () {
        this.search.set('AccountNumber', this.AccountNumber);
        this.accountPremise.loadGridData(this.inputParams);
    };
    AccountPremiseSearchComponent.prototype.sortGrid = function (data) {
        for (var i in this.gridSortHeaders) {
            if (i) {
                if (this.gridSortHeaders[i]['fieldName'] === data.fieldname) {
                    this.gridSortHeaders[i]['sortType'] = data.sort;
                }
            }
        }
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        if (data.sort === 'DESC') {
            this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        }
        else {
            this.search.set(this.serviceConstants.GridSortOrder, 'Ascending');
        }
        this.updateView({});
    };
    AccountPremiseSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-premise-grid',
                    templateUrl: 'iCABSAAccountPremiseSearchGrid.html',
                    styles: ["\n    :host /deep/ .gridtable tbody tr td:nth-child(6) input,\n    :host /deep/ .gridtable tbody tr td:nth-child(5) input,\n    :host /deep/ .gridtable tbody tr td:nth-child(7) input,\n    :host /deep/ .gridtable tbody tr td:nth-child(9) input {\n        text-align: left;\n    }\n    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(5),\n    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(6) {\n        width:28% !important;\n    }\n    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(3) {\n        width:7% !important;\n    }\n    :host /deep/ .gridtable tbody tr td:nth-child(2) input {\n        text-align: center;\n    }\n    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(6) {\n        width:20% !important;\n    }\n    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(7) {\n        width:8% !important;\n    }\n    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(9) {\n        width:12% !important;\n    }\n  "]
                },] },
    ];
    AccountPremiseSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: FormBuilder, },
        { type: Router, },
        { type: HttpService, },
        { type: Logger, },
        { type: GlobalConstant, },
        { type: LocaleTranslationService, },
        { type: Store, },
        { type: SysCharConstants, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: LookUp, },
        { type: SpeedScript, },
    ];
    AccountPremiseSearchComponent.propDecorators = {
        'accountPremise': [{ type: ViewChild, args: ['accountPremise',] },],
        'accountPremisePagination': [{ type: ViewChild, args: ['accountPremisePagination',] },],
    };
    return AccountPremiseSearchComponent;
}(SelectedDataEvent));
