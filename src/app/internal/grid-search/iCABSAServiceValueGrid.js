import { Utils } from './../../../shared/services/utility';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { ErrorService } from './../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { HttpService } from './../../../shared/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
export var ServiceValueGridComponent = (function () {
    function ServiceValueGridComponent(serviceConstants, fb, searchService, _router, localeTranslateService, _logger, messageService, zone, ajaxconstant, httpService, activatedRoute, util, errorService) {
        var _this = this;
        this.serviceConstants = serviceConstants;
        this.fb = fb;
        this.searchService = searchService;
        this._router = _router;
        this.localeTranslateService = localeTranslateService;
        this._logger = _logger;
        this.messageService = messageService;
        this.zone = zone;
        this.ajaxconstant = ajaxconstant;
        this.httpService = httpService;
        this.activatedRoute = activatedRoute;
        this.util = util;
        this.errorService = errorService;
        this.method = 'contract-management/grid';
        this.module = 'service-cover';
        this.operation = 'Application/iCABSAServiceValueGrid';
        this.search = new URLSearchParams();
        this.fromParentMode = 'PremiseHistory-All';
        this.page = 1;
        this.totalItem = 11;
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.ContractNumber = '';
        this.PremiseNumber = '';
        this.CurrentColumnName = '';
        this.showHeader = true;
        this.lookupParams = new URLSearchParams();
        this.ajaxSource = new BehaviorSubject(0);
        this.subscription = activatedRoute.queryParams.subscribe(function (param) {
            _this.routeParams = param;
            _this.ContractNumber = param.ContractNumber;
            _this.ContractName = param.ContractName;
            _this.PremiseNumber = param.PremiseNumber;
            _this.PremiseName = param.PremiseName;
            _this.ServiceCoverRowID = param.ServiceCoverRowID;
            _this.fromParentMode = param.ParentMode || param.parentMode;
            _this.ProductCode = param.ProductCode;
            _this.ProductDesc = param.ProductDesc;
        });
    }
    ServiceValueGridComponent.prototype.ngAfterViewInit = function () {
        this.messageService.emitMessage(this.fromParentMode);
    };
    ServiceValueGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        if (this.fromParentMode !== 'Contract' &&
            this.fromParentMode !== 'Job' &&
            this.fromParentMode !== 'Product Sales' &&
            this.fromParentMode !== 'ServiceCover' &&
            this.fromParentMode !== 'ServiceCoverAll' &&
            this.fromParentMode !== 'ServiceCoverDisplay' &&
            this.fromParentMode !== 'Contract-ServiceSummary' &&
            this.fromParentMode !== 'Premise-ServiceSummary' &&
            this.fromParentMode !== 'ContractHistory-All' &&
            this.fromParentMode !== 'PremiseHistory-All' &&
            this.fromParentMode !== 'ServiceCoverHistory-All' &&
            this.fromParentMode !== 'PremiseAll' &&
            this.fromParentMode !== 'Premise' &&
            this.fromParentMode !== 'ProductAll' &&
            this.fromParentMode !== 'ContractAll' &&
            this.fromParentMode !== 'Premise-ServiceSummary') {
            this.messageService.emitMessage(0);
            this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
                _this._logger.log('messageSubscription ---', data);
                if (data !== 0) {
                    _this.zone.run(function () {
                        _this.messageModal.show({ msg: 'Unknown mode: ' + data, title: 'Error' }, false);
                    });
                }
            });
        }
        this.itemsPerPage = '10';
        this.maxColumn = 8;
        this.gridCurPage = 1;
        this.pageSize = 10;
        this.action = '2';
        this.inputParams = {
            parentMode: this.fromParentMode,
            businessCode: this.util.getBusinessCode(),
            countryCode: this.util.getCountryCode(),
            ShowAdjustments: 'False'
        };
        this.localeTranslateService.setUpTranslation();
        this.servicevaluegridFormGroup = this.fb.group({
            ContractNumber: ['', Validators.required],
            ContractName: ['', Validators.required],
            PremiseNumber: ['', Validators.required],
            PremiseName: ['', Validators.required],
            ProductCode: ['', Validators.required],
            ProductDesc: ['', Validators.required]
        });
        this.servicevaluegridFormGroup.controls['ContractNumber'].setValue(this.ContractNumber);
        this.servicevaluegridFormGroup.controls['PremiseNumber'].setValue(this.PremiseNumber);
        this.PageparentMode = this.inputParams.parentMode;
        this.search.set(this.serviceConstants.Action, '0');
        this.getfromParent(this.inputParams.parentMode);
        this.createPage(this.inputParams.parentMode);
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.buildGrid();
    };
    ServiceValueGridComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    ServiceValueGridComponent.prototype.getfromParent = function (parentMode) {
        this._logger.log('Get Parent Form Data --- ', this.ContractNumber);
        switch (parentMode) {
            case 'Contract':
                this.title = 'Contract My Service Cover Details';
                this.Business = this.inputParams.BusinessCode;
                this.ContractNumber = this.ContractNumber;
                this.Mode = 'Contract';
                break;
            case 'Job':
                this.title = 'Job My Service Cover Details';
                break;
            case 'Product Sales':
                this.title = 'Product Sales My Service Cover Details';
                break;
            case 'ServiceCover':
                this.Mode = 'ServiceCover';
                this.RowID = this.ServiceCover;
                break;
            case 'ServiceCoverAll':
            case 'ServiceCoverDisplay':
                this.Mode = 'ServiceCoverAll';
                this.RowID = this.ServiceCoverRowID;
                break;
            case 'Contract-ServiceSummary':
            case 'Premise-ServiceSummary':
                this.Mode = 'ServiceCoverAll';
                this.RowID = this.ServiceCoverRowID;
                this.ContractNumber = this.ContractNumber;
                break;
            case 'ContractHistory-All':
                this.Mode = 'ContractAll';
                this.Business = this.inputParams.BusinessCode;
                this.ContractNumber = this.ContractNumber;
                break;
            case 'PremiseHistory-All':
                this.Mode = 'PremiseAll';
                this.Business = this.inputParams.BusinessCode;
                this.ContractNumber = this.ContractNumber;
                this.PremiseNumber = this.PremiseNumber;
                this.servicevaluegridFormGroup.controls['ContractName'].setValue(this.ContractName);
                this.servicevaluegridFormGroup.controls['PremiseName'].setValue(this.PremiseName);
                break;
            case 'ServiceCoverHistory-All':
                this.Mode = 'ServiceCoverAll';
                this.RowID = this.RowID;
                this.ContractNumber = this.ContractNumber;
                break;
            case 'PremiseAll':
                this.Mode = 'PremiseAll';
                this.RowID = this.Premise;
                break;
            case 'Premise':
                this.Mode = 'Premise';
                this.RowID = this.Premise;
                break;
            case 'ProductAll':
                this.Mode = 'ProductAll';
                this.Business = this.inputParams.BusinessCode;
                this.ContractNumber = this.ContractNumber;
                this.ProductCode = this.ContractHistoryFilterValue;
                break;
            default:
        }
    };
    ServiceValueGridComponent.prototype.createPage = function (parentMode) {
        switch (parentMode) {
            case 'Contract':
            case 'ContractAll':
            case 'ContractHistory-All':
                this.mViewType = 'Contract';
                this.setmaxcolumn(this.mViewType);
                this.ContractNumber = this.ContractNumber;
                this.ContractName = this.ContractName;
                this.servicevaluegridFormGroup = this.fb.group({
                    ContractNumber: [this.ContractNumber],
                    ContractName: [this.ContractName]
                });
                break;
            case 'ProductAll':
                this.mViewType = 'Contract';
                this.setmaxcolumn(this.mViewType);
                this.ContractNumber = this.ContractNumber;
                this.ContractName = this.ContractName;
                this.servicevaluegridFormGroup = this.fb.group({
                    ProductCode: [this.ContractHistoryFilterValue],
                    ProductDesc: [this.ContractHistoryFilterDesc]
                });
                break;
            case 'Premise':
            case 'Premise-ServiceSummary':
            case 'PremiseAll':
            case 'PremiseHistory-All':
            case 'Contract-ServiceSummary':
                this.mViewType = 'Premise';
                this.setmaxcolumn(this.mViewType);
                this.title = 'Premise Details';
                this.ContractNumber = this.ContractNumber;
                this.ContractName = this.ContractName;
                if (parentMode === 'PremiseAll') {
                    this.servicevaluegridFormGroup = this.fb.group({
                        PremiseNumber: [this.ContractHistoryFilterValue],
                        PremiseName: [this.ContractHistoryFilterDesc]
                    });
                }
                else if (parentMode === 'Contract-ServiceSummary') {
                    this.servicevaluegridFormGroup = this.fb.group({
                        PremiseNumber: [this.ContractHistoryFilterValue],
                        PremiseName: [this.ContractHistoryFilterDesc],
                        ContractNumber: [this.ContractNumber],
                        ContractName: [this.ContractName]
                    });
                }
                else {
                    this.PremiseNumber = this.PremiseNumber;
                    this.PremiseName = this.PremiseName;
                }
                if (parentMode === 'Premise-ServiceSummary' || parentMode === 'Contract-ServiceSummary') {
                    this.mViewType = 'Premise';
                    this.setmaxcolumn(this.mViewType);
                    this.servicevaluegridFormGroup = this.fb.group({
                        ProductCode: [this.ContractHistoryFilterValue],
                        ProductDesc: [this.ContractHistoryFilterDesc]
                    });
                }
                break;
            case 'ServiceCover':
            case 'ServiceCoverAll':
            case 'ServiceCoverHistory-All':
            case 'ServiceCoverDisplay':
                this.mViewType = 'ServiceCover';
                this.setmaxcolumn(this.mViewType);
                this.title = 'Service Cover Details';
                this.PremiseNumber = this.PremiseNumber;
                this.PremiseName = this.PremiseName;
                this.ContractNumber = this.ContractNumber;
                this.ContractName = this.ContractName;
                this.ProductCode = this.ProductCode;
                this.ProductDesc = this.ProductDesc;
                this.servicevaluegridFormGroup.controls['PremiseName'].setValue(this.PremiseName);
                this.servicevaluegridFormGroup.controls['ContractName'].setValue(this.ContractName);
                this.servicevaluegridFormGroup.controls['ProductCode'].setValue(this.ProductCode);
                this.servicevaluegridFormGroup.controls['ProductDesc'].setValue(this.ProductDesc);
                break;
            default:
        }
    };
    ServiceValueGridComponent.prototype.setmaxcolumn = function (mViewType) {
        switch (mViewType) {
            case 'Contract':
                this.maxColumn = 9;
                break;
            case 'Contract':
            case 'Premise':
                this.maxColumn = 9;
                break;
            case 'ServiceCover':
                this.maxColumn = 13;
                break;
            default:
                this.maxColumn = 9;
                break;
        }
    };
    ServiceValueGridComponent.prototype.updateCheckedOptions = function (event) {
        if (event.target.checked) {
            this.inputParams.ShowAdjustments = 'True';
        }
        else {
            this.inputParams.ShowAdjustments = 'False';
        }
    };
    ServiceValueGridComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    ServiceValueGridComponent.prototype.getCurrentPage = function (data) {
        this.gridCurPage = data.value;
        this.buildGrid();
    };
    ServiceValueGridComponent.prototype.sortGrid = function (data) {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.buildGrid();
    };
    ServiceValueGridComponent.prototype.buildGrid = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        }
        else {
            this.search.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        }
        this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        this.search.set('ShowAdjustments', this.inputParams.ShowAdjustments);
        this.search.set('Mode', this.Mode);
        this.search.set('Contract', this.ContractNumber);
        this.search.set('Premise', this.PremiseNumber);
        if (this.RowID) {
            this.search.set('RowID', this.RowID);
        }
        this.search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.Action, this.action);
        this.inputParams.search = this.search;
        this.serviceValueGrid.loadGridData(this.inputParams);
    };
    ServiceValueGridComponent.prototype.refresh = function () {
        this.buildGrid();
        this.serviceValueGrid.loadGridData(this.inputParams);
    };
    ServiceValueGridComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.lookupParams.set(this.serviceConstants.Action, '0');
        this.lookupParams.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        this.lookupParams.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        if (maxresults) {
            this.lookupParams.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        if (data)
            return this.httpService.lookUpRequest(this.lookupParams, data);
    };
    ServiceValueGridComponent.prototype.onDataReceived = function (data, route) {
        this.servicevaluegridFormGroup.controls['ContractName'].setValue(data.ContractName);
        this.servicevaluegridFormGroup.controls['PremiseName'].setValue(data.PremiseName);
    };
    ServiceValueGridComponent.prototype.onGridRowClick = function (event) {
        if (event.cellIndex === 0) {
            alert('Page (Service/iCABSSeServiceValueMaintenance.htm) is not developed.');
        }
    };
    ServiceValueGridComponent.prototype.onGridRowDblClick = function (event) {
        console.log(event);
    };
    ServiceValueGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceValueGrid.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    ServiceValueGridComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: FormBuilder, },
        { type: HttpService, },
        { type: Router, },
        { type: LocaleTranslationService, },
        { type: Logger, },
        { type: MessageService, },
        { type: NgZone, },
        { type: AjaxObservableConstant, },
        { type: HttpService, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: ErrorService, },
    ];
    ServiceValueGridComponent.propDecorators = {
        'serviceValueGrid': [{ type: ViewChild, args: ['serviceValueGrid',] },],
        'serviceValuePagination': [{ type: ViewChild, args: ['serviceValuePagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return ServiceValueGridComponent;
}());
