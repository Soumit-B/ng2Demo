import { LookUp } from './../../../shared/services/lookup';
import { ContractActionTypes } from './../../actions/contract';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Location } from '@angular/common';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { Utils } from './../../../shared/services/utility';
import { PremiseSearchGridComponent } from './iCABSAPremiseSearchGrid';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { PageDataService } from './../../../shared/services/page-data.service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { MessageService } from './../../../shared/services/message.service';
import { ErrorService } from './../../../shared/services/error.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Http, URLSearchParams } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
import { Component, ViewChild, NgZone, Injector, Renderer } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { LocalStorageService } from 'ng2-webstorage';
import { RiExchange } from './../../../shared/services/riExchange';
import { HttpService } from '../../../shared/services/http-service';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
export var VisitToleranceGridComponent = (function () {
    function VisitToleranceGridComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, localeTranslateService, fb, logger, activatedRoute, utilService, global, location, lookUp, renderer, injector) {
        var _this = this;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.router = router;
        this.pageData = pageData;
        this.titleService = titleService;
        this.zone = zone;
        this.store = store;
        this.translate = translate;
        this.ls = ls;
        this.http = http;
        this.localeTranslateService = localeTranslateService;
        this.fb = fb;
        this.logger = logger;
        this.activatedRoute = activatedRoute;
        this.utilService = utilService;
        this.global = global;
        this.location = location;
        this.lookUp = lookUp;
        this.renderer = renderer;
        this.ajaxSource = new BehaviorSubject(0);
        this.status = false;
        this.showHeader = true;
        this.showErrorHeader = true;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalRecords = 0;
        this.maxColumn = 6;
        this.search = new URLSearchParams();
        this.queryParams = {
            action: '2',
            operation: 'System/iCABSSVisitToleranceGrid',
            module: 'csi',
            method: 'service-planning/maintenance'
        };
        this.inputParams = {
            'parentMode': 'LookUp'
        };
        this.inputParamsGrpAccNumber = {
            'parentMode': 'LookUp',
            'Action': '2'
        };
        this.inputParamsContract = {
            'parentMode': 'LookUp-All',
            'pageTitle': 'Contract Entry',
            'currentContractType': 'C',
            'showAddNew': true
        };
        this.inputParamsPremise = {
            'parentMode': 'LookUp'
        };
        this.inputParamsProductCode = {
            'parentMode': 'LookUp'
        };
        this.inputPremiseSearchGrid = {
            'parentMode': 'LookUp'
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.isRequesting = false;
        this.inputParamsAccSearch = { 'parentMode': 'LookUp', 'accountName': 'JET' };
        this.dynamicComponent1 = AccountSearchComponent;
        this.contractSearchComponent = ContractSearchComponent;
        this.groupAccNum = GroupAccountNumberComponent;
        this.premiseSearchGridComponent = PremiseSearchGridComponent;
        this.pageAttribute = {
            'BusinessCodeRow': '',
            'GrdToleranceRow': '',
            'BusinessCodeVisitToleranceRowID': '',
            'GrdToleranceVisitToleranceRowID': '',
            'ProductCodeServiceCoverRowID': ''
        };
        this.showCloseButton = true;
        this.visittoleranceContractData = {
            'BusinessCode': '',
            'BusinessDesc': ''
        };
        this.storeData = {};
        this.parentData = {};
        this.currentContractTypeURLParameter = '<contract>';
        this.inputParamsVisitTolerance = { 'parentMode': '' };
        this.pageParams = {};
        this.isProductCodeEllipsisDisabled = true;
        this.isPremiseNumberEllipsisDisabled = true;
        this.injectServices(injector);
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data && data['action']) {
                _this.storeData = data;
                switch (data['action']) {
                    case ContractActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.parentData = data;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
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
        this.inputParams.businessCode = this.utilService.getBusinessCode();
        this.visittoleranceContractData.BusinessCode = this.inputParams.businessCode;
        this.inputParams.countryCode = this.utilService.getCountryCode();
        if (this.inputParams.businessCode) {
            this.doLookupformData();
        }
        this.localeTranslateService.setUpTranslation();
    }
    VisitToleranceGridComponent.prototype.injectServices = function (injector) {
        this.riExchange = injector.get(RiExchange);
    };
    VisitToleranceGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.visitToleranceFormGroup = this.fb.group({
            BusinessCode: [{ value: '', disabled: true }],
            BusinessDesc: [{ value: '', disabled: true }],
            GroupAccountNumber: [{ value: '', disabled: false }],
            GroupName: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: false }],
            AccountName: [{ value: '', disabled: true }],
            ContractNumber: [{ value: '', disabled: false }],
            ContractName: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: false }],
            PremiseName: [{ value: '', disabled: true }],
            ProductCode: [{ value: '', disabled: false }],
            ProductDesc: [{ value: '', disabled: true }],
            ServiceCoverRowID: [{ value: '', disabled: true }],
            ServiceCoverNumber: [{ value: '', disabled: true }]
        });
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['parentMode']) {
                _this.parentMode = params['parentMode'];
                _this.inputParamsVisitTolerance.parentMode = params['parentMode'];
            }
            if (params['parentMode'] === 'GroupAccountVisitTolerance') {
                if (_this.storeData['data'] === undefined) {
                    _this.storeData['data'] = {};
                }
                _this.storeData['data'].GroupAccountNumber = params['GroupAccountNumber'];
                _this.storeData['data'].GroupName = params['GroupName'];
            }
            if (params['currentContractTypeURLParameter']) {
                var contractTypeURLParameter = params['currentContractTypeURLParameter'];
                _this.currentContractTypeURLParameter = _this.utilService.getCurrentContractType(contractTypeURLParameter);
            }
        });
        this.visitToleranceGrid.update = true;
        this.setFormData(this.storeData);
        this.buildGrid();
    };
    VisitToleranceGridComponent.prototype.ngAfterViewInit = function () {
        this.buildGrid();
    };
    VisitToleranceGridComponent.prototype.ngOnDestroy = function () {
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    VisitToleranceGridComponent.prototype.onSubmit = function (value) {
    };
    VisitToleranceGridComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    VisitToleranceGridComponent.prototype.getCurrentPage = function (data) {
        this.currentPage = data.value;
        this.buildGrid();
    };
    VisitToleranceGridComponent.prototype.setFormData = function (data) {
        this.visitToleranceFormGroup.controls['BusinessCode'].setValue(this.visittoleranceContractData.BusinessCode);
        this.visitToleranceFormGroup.controls['BusinessDesc'].setValue(this.visittoleranceContractData.BusinessDesc);
        if (data && data['data']) {
            var pageparentmode = this.inputParamsVisitTolerance.parentMode;
            switch (pageparentmode) {
                case 'GroupAccountVisitTolerance':
                    this.visitToleranceFormGroup.controls['GroupName'].setValue((typeof data['data'].GroupName !== 'undefined') ? data['data'].GroupName : '');
                    this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue((typeof data['data'].GroupAccountNumber !== 'undefined') ? data['data'].GroupAccountNumber : '');
                    break;
                case 'AccountVisitTolerance':
                    this.visitToleranceFormGroup.controls['AccountNumber'].setValue((typeof data['data'].AccountNumber !== 'undefined') ? data['data'].AccountNumber : '');
                    this.visitToleranceFormGroup.controls['AccountName'].setValue((typeof data['data'].AccountName !== 'undefined') ? data['data'].AccountName : '');
                    break;
                case 'ContractVisitTolerance':
                    this.visitToleranceFormGroup.controls['ContractNumber'].setValue((typeof data['data'].ContractNumber !== 'undefined') ? data['data'].ContractNumber : '');
                    this.visitToleranceFormGroup.controls['ContractName'].setValue((typeof data['data'].ContractName !== 'undefined') ? data['data'].ContractName : '');
                    break;
                case 'PremiseVisitTolerance':
                    this.visitToleranceFormGroup.controls['ContractNumber'].setValue((typeof data['data'].ContractNumber !== 'undefined') ? data['data'].ContractNumber : '');
                    this.visitToleranceFormGroup.controls['ContractName'].setValue((typeof data['data'].ContractName !== 'undefined') ? data['data'].ContractName : '');
                    this.visitToleranceFormGroup.controls['PremiseNumber'].setValue((typeof data['data'].PremiseNumber !== 'undefined') ? data['data'].PremiseNumber : '');
                    this.visitToleranceFormGroup.controls['PremiseName'].setValue((typeof data['data'].PremiseName !== 'undefined') ? data['data'].PremiseName : '');
                    this.visitToleranceFormGroup.controls['ProductCode'].setValue((typeof data['data'].ProductCode !== 'undefined') ? data['data'].ProductCode : '');
                    break;
                case 'ServiceCoverVisitTolerance':
                    this.visitToleranceFormGroup.controls['ContractNumber'].setValue((typeof data['data'].ContractNumber !== 'undefined') ? data['data'].ContractNumber : '');
                    this.visitToleranceFormGroup.controls['ContractName'].setValue((typeof data['data'].ContractName !== 'undefined') ? data['data'].ContractName : '');
                    this.visitToleranceFormGroup.controls['PremiseNumber'].setValue((typeof data['data'].PremiseNumber !== 'undefined') ? data['data'].PremiseNumber : '');
                    this.visitToleranceFormGroup.controls['PremiseName'].setValue((typeof data['data'].PremiseName !== 'undefined') ? data['data'].PremiseName : '');
                    this.visitToleranceFormGroup.controls['ProductCode'].setValue((typeof data['data'].ProductCode !== 'undefined') ? data['data'].ProductCode : '');
                    this.visitToleranceFormGroup.controls['ProductDesc'].setValue((typeof data['data'].ProductDesc !== 'undefined') ? data['data'].ProductDesc : '');
                    this.visitToleranceFormGroup.controls['ServiceCoverRowID'].setValue((typeof data['data'].CurrentServiceCoverRowID !== 'undefined') ? data['data'].CurrentServiceCoverRowID : '');
                    break;
                default:
                    break;
            }
        }
        this.visitToleranceFormGroup.updateValueAndValidity();
    };
    VisitToleranceGridComponent.prototype.onGroupAccount = function (data) {
        if (data.GroupName) {
            this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
            this.visitToleranceFormGroup.controls['GroupName'].setValue(data.GroupName);
        }
        else {
            this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue(this.GroupAccount = data.GroupAccountNumber);
        }
    };
    VisitToleranceGridComponent.prototype.setAccountNumber = function (data) {
        this.visitToleranceFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.visitToleranceFormGroup.controls['AccountName'].setValue(data.AccountName);
    };
    VisitToleranceGridComponent.prototype.onContractDataReceived = function (data) {
        this.visitToleranceFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.visitToleranceFormGroup.controls['ContractName'].setValue(data.ContractName);
    };
    VisitToleranceGridComponent.prototype.onChangeEvent = function (event) {
        this.router.navigate(['/maintenance/visitTolerance'], {
            queryParams: {
                parentMode: 'VisitToleranceGrid',
                VisitToleranceAdd: 'VisitToleranceAdd',
                currentContractTypeURLParameter: this.currentContractTypeURLParameter
            }
        });
    };
    VisitToleranceGridComponent.prototype.buildGrid = function () {
        this.search = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode || this.utilService.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode || this.utilService.getCountryCode());
        this.visitToleranceGrid.update = true;
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set('HeaderClickedColumn', '');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('Level', this.parentMode);
        this.search.set('GroupAccountNumber', this.visitToleranceFormGroup.controls['GroupAccountNumber'].value);
        this.search.set('AccountNumber', this.visitToleranceFormGroup.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.visitToleranceFormGroup.controls['ContractNumber'].value);
        if (this.parentMode === 'PremiseVisitTolerance') {
            this.search.set('PremiseNumber', this.visitToleranceFormGroup.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.visitToleranceFormGroup.controls['ProductCode'].value);
        }
        if (this.parentMode === 'ServiceCoverVisitTolerance') {
            this.search.set('PremiseNumber', this.visitToleranceFormGroup.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.visitToleranceFormGroup.controls['ProductCode'].value);
            this.search.set('ServiceCoverNumber', this.visitToleranceFormGroup.controls['ServiceCoverNumber'].value);
            this.search.set('ServiceCoverRowID', this.visitToleranceFormGroup.controls['ServiceCoverRowID'].value);
        }
        this.inputParams.search = this.search;
        this.visitToleranceGrid.loadGridData(this.inputParams);
    };
    VisitToleranceGridComponent.prototype.postData = function (params) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utilService.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utilService.getCountryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riGridMode', '3');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', 'Descending');
        this.search.set('Level', this.parentMode);
        this.search.set('GroupAccountNumber', this.visitToleranceFormGroup.controls['GroupAccountNumber'].value);
        this.search.set('AccountNumber', this.visitToleranceFormGroup.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.visitToleranceFormGroup.controls['ContractNumber'].value);
        if (this.parentMode === 'PremiseVisitTolerance') {
            this.search.set('PremiseNumber', this.visitToleranceFormGroup.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.visitToleranceFormGroup.controls['ProductCode'].value);
        }
        if (this.parentMode === 'ServiceCoverVisitTolerance') {
            this.search.set('PremiseNumber', this.visitToleranceFormGroup.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.visitToleranceFormGroup.controls['ProductCode'].value);
            this.search.set('ServiceCoverNumber', this.visitToleranceFormGroup.controls['ServiceCoverNumber'].value);
            this.search.set('ServiceCoverRowID', this.visitToleranceFormGroup.controls['ServiceCoverRowID'].value);
        }
        if (params) {
            for (var key in params) {
                if (key) {
                    this.search.set(key, params[key]);
                }
            }
        }
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, params).subscribe(function (e) {
            if (e.status === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                    return;
                }
                _this.visitToleranceGrid.clearGridData();
                _this.buildGrid();
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    VisitToleranceGridComponent.prototype.selectedDataOnDoubleClick = function (event) {
        if (event) {
            this.visitToleranceFocus(event);
            if (event.cellIndex === 0) {
                var self_1 = { VisitToleranceRowID: this.pageAttribute.BusinessCodeVisitToleranceRowID, ParentPageMode: this.inputParamsVisitTolerance.parentMode };
                var grid = { gridData: event };
                var controls = { fromGroup: this.visitToleranceFormGroup.controls };
                var pageObj = this.riExchange.createPageObject(this.visitToleranceFormGroup, controls, self_1, grid);
                this.riExchange.initBridge(pageObj);
                this.router.navigate(['/maintenance/visitTolerance'], {
                    queryParams: {
                        Mode: 'VisitToleranceGrid',
                        RowID: this.pageAttribute.BusinessCodeVisitToleranceRowID,
                        currentContractTypeURLParameter: this.currentContractTypeURLParameter
                    }
                });
            }
        }
    };
    VisitToleranceGridComponent.prototype.selectedDataOnCellFocus = function (event) {
        this.setupTableColumn(event.colIndex, event.rowIndex);
        if (event.cellIndex === 5) {
            this.currentColumnName = 'Tolerance';
            this.visitToleranceFocus(event);
        }
    };
    VisitToleranceGridComponent.prototype.setupTableColumn = function (colIndex, rowIndex) {
        var obj = document.querySelectorAll('.gridtable tbody > tr > td:first-child input[type=text]');
        if (obj && obj.length >= rowIndex) {
            obj[rowIndex].setAttribute('readonly', 'true');
        }
        var obj2 = document.querySelectorAll('.gridtable tbody > tr > td:last-child input[type=text]');
        if (obj2 && obj2.length >= rowIndex) {
            obj2[rowIndex].setAttribute('maxlength', '6');
            this.renderer.listen(obj2[rowIndex], 'keypress', function (event) {
                return /\d/.test(String.fromCharCode(((event || window.event).which || (event || window.event).which)));
            });
        }
    };
    VisitToleranceGridComponent.prototype.numeticTextvalue = function (event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode === 46 && event.srcElement.value.split('.').length > 1) {
            return false;
        }
        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    };
    VisitToleranceGridComponent.prototype.onCellClickBlur = function (data) {
        if ((data.cellIndex === 5) && data.updateValue && (data.cellData.text !== data.updateValue)) {
            var params = {
                'ToleranceRowID': data.cellData.rowID,
                'Tolerance': data.updateValue
            };
            this.postData(params);
        }
    };
    VisitToleranceGridComponent.prototype.visitToleranceFocus = function (event) {
        if (event.cellData) {
            this.pageAttribute.BusinessCodeVisitToleranceRowID = event.cellData.rowID;
            this.pageAttribute.GrdToleranceVisitToleranceRowID = event.cellData.rowID;
        }
    };
    VisitToleranceGridComponent.prototype.onKeyDown = function (event) {
        if (!event)
            return;
        event.preventDefault();
        if (event.keyCode === 34) {
            if (event.target.id === 'ContractNumber') {
                this.contractSearchEllipsis.openModal();
            }
            else if (event.target.id === 'AccountNumber') {
                this.accountSearchEllipsis.openModal();
            }
            else if (event.target.id === 'GroupAccountNumber') {
                this.groupAccountNumberEllipsis.openModal();
            }
            else if (event.target.id === 'ProductCode') {
                this.lookUpServiceCover();
            }
            else if (event.target.id === 'PremiseNumber') {
                this.premiseSearchEllipsis.openModal();
            }
        }
    };
    VisitToleranceGridComponent.prototype.lookUpServiceCover = function () {
    };
    VisitToleranceGridComponent.prototype.onBlur = function (event) {
        if (!event)
            return;
        var elementValue = event.target.value;
        var _paddedValue = elementValue;
        if (event.target.id === 'ContractNumber') {
            if (elementValue.length > 0) {
                event.target.value = this.numberFormatValue(elementValue, 8);
                this.visitToleranceFormGroup.controls['ContractNumber'].setValue(event.target.value);
            }
            this.onDeActivate(event);
        }
        else if (event.target.id === 'AccountNumber') {
            if (elementValue.length > 0) {
                event.target.value = this.numberFormatValue(elementValue, 9);
                this.visitToleranceFormGroup.controls['AccountNumber'].setValue(event.target.value);
            }
            this.onDeActivate(event);
        }
        else if (event.target.id === 'PremiseNumber') {
            this.onDeActivate(event);
        }
        else if (event.target.id === 'ProductCode') {
            this.onDeActivate(event);
        }
        else if (event.target.id === 'GroupAccountNumber') {
            this.onDeActivate(event);
        }
    };
    ;
    VisitToleranceGridComponent.prototype.onDeActivate = function (event) {
        var elementValue = event.target.value;
        if (event.target.id === 'ContractNumber') {
            this.populateDescriptions();
        }
        else if (event.target.id === 'PremiseNumber') {
            this.populateDescriptions();
        }
        else if (event.target.id === 'ProductCode') {
            this.ServiceCoverNumber = '';
            if (this.visitToleranceFormGroup.controls['ContractNumber'].value !== '' && this.visitToleranceFormGroup.controls['PremiseNumber'].value
                !== '' && this.pageAttribute.ProductCodeServiceCoverRowID === '') {
                if (this.visitToleranceFormGroup.controls['ServiceCoverNumber'].value === '') {
                    this.lookUpServiceCover();
                }
            }
            this.visitToleranceFormGroup.controls['ServiceCoverRowID'].setValue(this.pageAttribute.ProductCodeServiceCoverRowID);
            this.pageAttribute.ProductCodeServiceCoverRowID = '';
            this.populateDescriptions();
        }
        else if (event.target.id === 'AccountNumber') {
            this.populateDescriptions();
        }
        else if (event.target.id === 'GroupAccountNumber') {
            this.populateDescriptions();
        }
    };
    VisitToleranceGridComponent.prototype.numberFormatValue = function (elementValue, maxLength) {
        var paddedValue = elementValue;
        if (elementValue.length < maxLength) {
            paddedValue = this.utilService.numberPadding(elementValue, maxLength);
        }
        return paddedValue;
    };
    VisitToleranceGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.visitToleranceGrid.clearGridData();
        this.buildGrid();
    };
    VisitToleranceGridComponent.prototype.populateDescriptions = function () {
        var _this = this;
        this.query = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, '2');
        var postObj = {
            'Function': 'PopulateDescriptions',
            'GroupAccountNumber': this.visitToleranceFormGroup.controls['GroupAccountNumber'].value,
            'AccountNumber': this.visitToleranceFormGroup.controls['AccountNumber'].value,
            'ContractNumber': this.visitToleranceFormGroup.controls['ContractNumber'].value,
            'PremiseNumber': this.visitToleranceFormGroup.controls['PremiseNumber'].value,
            'ProductCode': this.visitToleranceFormGroup.controls['ProductCode'].value,
            'ServiceCoverRowID': this.visitToleranceFormGroup.controls['ServiceCoverRowID'].value
        };
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query, postObj)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue(e.GroupAccountNumber);
                    _this.visitToleranceFormGroup.controls['GroupName'].setValue(e.GroupName);
                    var accountNumber = (e.AccountNumber) ? _this.numberFormatValue(e.AccountNumber, 9) : '';
                    _this.visitToleranceFormGroup.controls['AccountNumber'].setValue(accountNumber);
                    _this.visitToleranceFormGroup.controls['AccountName'].setValue(e.AccountName);
                    var contractNumber = (e.ContractNumber) ? _this.numberFormatValue(e.ContractNumber, 8) : '';
                    _this.visitToleranceFormGroup.controls['ContractNumber'].setValue(contractNumber);
                    _this.visitToleranceFormGroup.controls['ContractName'].setValue(e.ContractName);
                    _this.visitToleranceFormGroup.controls['PremiseNumber'].setValue(e.PremiseNumber);
                    _this.visitToleranceFormGroup.controls['PremiseName'].setValue(e.PremiseName);
                    _this.visitToleranceFormGroup.controls['ProductCode'].setValue(e.ProductCode);
                    _this.visitToleranceFormGroup.controls['ProductDesc'].setValue(e.ProductDesc);
                    _this.visitToleranceFormGroup.controls['ServiceCoverNumber'].setValue(e.ServiceCoverNumber);
                }
                else {
                    _this.visitToleranceFormGroup.controls['ContractNumber'].setValue('');
                    _this.visitToleranceFormGroup.controls['ContractName'].setValue('');
                    _this.visitToleranceFormGroup.controls['PremiseNumber'].setValue('');
                    _this.visitToleranceFormGroup.controls['PremiseName'].setValue('');
                    _this.visitToleranceFormGroup.controls['ProductCode'].setValue('');
                    _this.visitToleranceFormGroup.controls['ProductDesc'].setValue('');
                    _this.visitToleranceFormGroup.controls['ServiceCoverNumber'].setValue('');
                    _this.visitToleranceFormGroup.controls['AccountName'].setValue('');
                    _this.visitToleranceFormGroup.controls['AccountNumber'].setValue('');
                    _this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue('');
                    _this.visitToleranceFormGroup.controls['GroupName'].setValue('');
                }
            }
            _this.buildGrid();
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    VisitToleranceGridComponent.prototype.optionsChange = function (event) {
        switch (event) {
            case 'AddVisitTolerance':
                var self_2 = { ParentPageMode: this.inputParamsVisitTolerance.parentMode };
                var controls = { fromGroup: this.visitToleranceFormGroup.controls };
                var pageObj = this.riExchange.createPageObject(this.visitToleranceFormGroup, controls, self_2);
                this.riExchange.initBridge(pageObj);
                this.router.navigate(['/maintenance/visitTolerance'], {
                    queryParams: {
                        Mode: 'AddVisitTolerance',
                        VisitToleranceAdd: 'VisitToleranceAdd',
                        currentContractTypeURLParameter: this.currentContractTypeURLParameter
                    }
                });
        }
    };
    VisitToleranceGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    VisitToleranceGridComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Business',
                'query': {
                    'BusinessCode': this.utilService.getBusinessCode()
                },
                'fields': ['BusinessDesc']
            }
        ];
        this.lookUpSubscription = this.lookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data) {
                var business = data[0][0];
                if (business) {
                    _this.visittoleranceContractData.BusinessDesc = business.BusinessDesc || '';
                }
            }
        });
    };
    VisitToleranceGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-visit-tolerance-grid-search',
                    templateUrl: 'iCABSSVisitToleranceGrid.html',
                    providers: [HttpService, ErrorService]
                },] },
    ];
    VisitToleranceGridComponent.ctorParameters = [
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: AuthService, },
        { type: AjaxObservableConstant, },
        { type: Router, },
        { type: PageDataService, },
        { type: Title, },
        { type: NgZone, },
        { type: Store, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: FormBuilder, },
        { type: Logger, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: GlobalConstant, },
        { type: Location, },
        { type: LookUp, },
        { type: Renderer, },
        { type: Injector, },
    ];
    VisitToleranceGridComponent.propDecorators = {
        'visitToleranceGrid': [{ type: ViewChild, args: ['visitToleranceGrid',] },],
        'visitTolerancePagination': [{ type: ViewChild, args: ['visitTolerancePagination',] },],
        'groupAccountNumberEllipsis': [{ type: ViewChild, args: ['groupAccountNumberEllipsis',] },],
        'accountSearchEllipsis': [{ type: ViewChild, args: ['accountSearchEllipsis',] },],
        'contractSearchEllipsis': [{ type: ViewChild, args: ['contractSearchEllipsis',] },],
        'premiseSearchEllipsis': [{ type: ViewChild, args: ['premiseSearchEllipsis',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return VisitToleranceGridComponent;
}());
