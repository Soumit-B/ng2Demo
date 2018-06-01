import { LookUp } from './../../../shared/services/lookup';
import { RiExchange } from './../../../shared/services/riExchange';
import { SpeedScript } from './../../../shared/services/speedscript';
import { Utils } from './../../../shared/services/utility';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Logger } from '@nsalaun/ng2-logger';
import { FormBuilder } from '@angular/forms';
import { Component, ViewChild, NgZone, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { Http, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
export var PlanVisitGridDayComponent = (function () {
    function PlanVisitGridDayComponent(_logger, _fb, utils, SpeedScript, _router, _activatedRoute, zone, _http, errorService, httpService, _authService, _ls, _componentInteractionService, serviceConstants, renderer, store, router, activatedRoute, translateService, riExchange, LookUp, SysCharConstants) {
        var _this = this;
        this._logger = _logger;
        this._fb = _fb;
        this.utils = utils;
        this.SpeedScript = SpeedScript;
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this.zone = zone;
        this._http = _http;
        this.errorService = errorService;
        this.httpService = httpService;
        this._authService = _authService;
        this._ls = _ls;
        this._componentInteractionService = _componentInteractionService;
        this.serviceConstants = serviceConstants;
        this.renderer = renderer;
        this.store = store;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.translateService = translateService;
        this.riExchange = riExchange;
        this.LookUp = LookUp;
        this.SysCharConstants = SysCharConstants;
        this.inputParams = { parentMode: '', SelectedDate: '', RowID: '' };
        this.isRequesting = false;
        this.method = 'service-planning/maintenance';
        this.module = 'plan-visits';
        this.operation = 'Application/iCABSAPlanVisitGridDay';
        this.search = new URLSearchParams();
        this.trContractDisplay = false;
        this.trPremiseDisplay = false;
        this.trProductDisplay = false;
        this.ContractNumberState = false;
        this.ContractNameState = false;
        this.PremiseNumberState = false;
        this.PremiseNameState = false;
        this.ProductCodeState = false;
        this.ProductDescState = false;
        this.bUpdateParent = false;
        this.maxColumn = 8;
        this.currentPage = 1;
        this.contractStoreData = {};
        this.ContractNumber = '';
        this.ContractName = '';
        this.PremiseNumber = '';
        this.PremiseName = '';
        this.ProductCode = '';
        this.ProductDesc = '';
        this.legend = [];
        this.subscription = activatedRoute.queryParams.subscribe(function (param) {
            _this.routeParams = param;
        });
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                _this.contractStoreData = data;
            }
        });
    }
    PlanVisitGridDayComponent.prototype.ngOnInit = function () {
        this.BusinessCode = this.utils.getBusinessCode();
        this.translateService.setUpTranslation();
        this.SelectedDateValue = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'SelectedDate', true);
        this.parentMode = this.routeParams.parentMode;
        this.pageSize = 10;
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.doLookup();
        if (this.parentMode === 'Year') {
            this.YearLoad();
        }
        else {
            alert('error invalid parent mode!');
        }
    };
    PlanVisitGridDayComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        if (this.subLookup) {
            this.subLookup.unsubscribe();
        }
    };
    PlanVisitGridDayComponent.prototype.YearLoad = function () {
        this.trContractDisplay = true;
        this.trPremiseDisplay = true;
        this.trProductDisplay = true;
        this.ContractNumber = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber', true);
        this.PremiseNumber = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseNumber', true);
        this.ProductCode = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductCode', true);
        this.ContractNumberServiceCoverRowID = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        this.BuildGrid();
    };
    PlanVisitGridDayComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIPSub = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.BusinessCode,
                    'ContractNumber': this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber', true)
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.BusinessCode,
                    'ContractNumber': this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber', true),
                    'PremiseNumber': this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseNumber', true)
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.BusinessCode,
                    'ProductCode': this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductCode', true)
                },
                'fields': ['ProductDesc']
            }
        ];
        this.subLookup = this.LookUp.lookUpRecord(lookupIPSub).subscribe(function (data) {
            _this._logger.log('Lookup:', data);
            if (data.length > 0 && data[0].length > 0) {
                var resultContract = data[0];
                var resultPremise = data[1];
                var resultProduct = data[2];
                _this.ContractName = resultContract[0].ContractName;
                if (resultPremise[0] && resultPremise[0].PremiseName) {
                    _this.PremiseName = resultPremise[0].PremiseName;
                }
                if (resultProduct[0] && resultProduct[0].ProductDesc) {
                    _this.ProductDesc = resultProduct[0].ProductDesc;
                }
            }
        });
    };
    PlanVisitGridDayComponent.prototype.riExchange_UpdateHTMLDocument = function () {
        this.bUpdateParent = true;
    };
    PlanVisitGridDayComponent.prototype.riGrid_BeforeExecute = function () {
        this.strGridData = this.strGridData + '&Date=' + this.SelectedDateValue;
    };
    PlanVisitGridDayComponent.prototype.riGrid_BodyOnDblClick = function (data) {
        this.Detail(data);
    };
    PlanVisitGridDayComponent.prototype.Detail = function (data) {
        var completRowData = data.trRowData;
        this.router.navigate(['/maintenance/planvisit'], {
            queryParams: {
                'parentMode': 'Year',
                'PlanVisitRowID': completRowData[0].rowID
            }
        });
    };
    PlanVisitGridDayComponent.prototype.BuildGrid = function () {
        this.setFilterValues();
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.search;
        this.visitGrid.loadGridData(this.inputParams);
    };
    PlanVisitGridDayComponent.prototype.setFilterValues = function () {
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.contractStoreData['code'] ? this.contractStoreData['code'].business : this.utils.getBusinessCode());
        this.search.set('countryCode', this.contractStoreData['code'] ? this.contractStoreData['code'].country : this.utils.getCountryCode());
        this.search.set('Date', this.SelectedDateValue);
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riGridMode', '0');
        this.search.set('RowID', this.ContractNumberServiceCoverRowID);
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set('level', 'ServiceCoverDay');
    };
    PlanVisitGridDayComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * this.itemsPerPage;
        }
        else {
            this.totalRecords = 0;
        }
        var obj = this.visitGrid.bodyColumns[0];
        if (obj) {
            setTimeout(function () {
                _this.legend = [];
                var legend = obj.additionalData.split('bgcolor=');
                for (var i = 0; i < legend.length; i++) {
                    var str = legend[i];
                    if (str.indexOf('"#') >= 0) {
                        _this.legend.push({
                            color: str.substr(str.indexOf('"#') + 1, 7),
                            label: str.substr(str.indexOf('<td>') + 4, str.substr(str.indexOf('<td>') + 4).indexOf('&'))
                        });
                    }
                }
            }, 100);
        }
    };
    PlanVisitGridDayComponent.prototype.getCurrentPage = function (event) {
        this.gridCurPage = event.value;
        this.BuildGrid();
    };
    PlanVisitGridDayComponent.prototype.refresh = function () {
        this.gridCurPage = 1;
        this.visitGrid.clearGridData();
        this.BuildGrid();
    };
    PlanVisitGridDayComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPlanVisitGridDay.html',
                    styles: ["\n    :host /deep/ .gridtable tbody tr td:nth-child(1)  {\n        width:10%;\n    }\n  "]
                },] },
    ];
    PlanVisitGridDayComponent.ctorParameters = [
        { type: Logger, },
        { type: FormBuilder, },
        { type: Utils, },
        { type: SpeedScript, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: NgZone, },
        { type: Http, },
        { type: ErrorService, },
        { type: HttpService, },
        { type: AuthService, },
        { type: LocalStorageService, },
        { type: ComponentInteractionService, },
        { type: ServiceConstants, },
        { type: Renderer, },
        { type: Store, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: LocaleTranslationService, },
        { type: RiExchange, },
        { type: LookUp, },
        { type: SysCharConstants, },
    ];
    PlanVisitGridDayComponent.propDecorators = {
        'visitGrid': [{ type: ViewChild, args: ['visitGrid',] },],
        'visitGridPagination': [{ type: ViewChild, args: ['visitGridPagination',] },],
    };
    return PlanVisitGridDayComponent;
}());
