import { PremiseLocationSearchComponent } from './../search/iCABSAPremiseLocationSearch.component';
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
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { Utils } from '../../../shared/services/utility';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
export var PlanVisitTabularComponent = (function () {
    function PlanVisitTabularComponent(route, utils, fb, router, httpService, serviceConstants, zone, global, ajaxconstant, authService, logger, errorService, messageService, titleService, componentInteractionService, translate, localeTranslateService, store, sysCharConstants, routeAwayGlobals, riExchange, _router) {
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
        this.logger = logger;
        this.errorService = errorService;
        this.messageService = messageService;
        this.titleService = titleService;
        this.componentInteractionService = componentInteractionService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.store = store;
        this.sysCharConstants = sysCharConstants;
        this.routeAwayGlobals = routeAwayGlobals;
        this.riExchange = riExchange;
        this._router = _router;
        this.CurrentColumnName = '';
        this.checkedarray = [];
        this.vbUpdateRecord = '';
        this.vbUpdateVisitNarrative = '';
        this.GenLabelsRowid = [];
        this.vbUpdateQty = '';
        this.selectParams = {};
        this.dtto = new Date();
        this.dtfrom = new Date();
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.showHeader = true;
        this.premiselocno = GroupAccountNumberComponent;
        this.trLocation = true;
        this.inputParamspremiselocNumber = {
            'parentMode': 'LookUp',
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'Action': '2'
        };
        this.headerParams = {
            method: 'service-planning/maintenance',
            operation: 'Application/iCABSAPlanVisitTabular',
            module: 'plan-visits'
        };
        this.lookupParams = new URLSearchParams();
        this.ajaxSource = new BehaviorSubject(0);
        this.querySysChar = new URLSearchParams();
        this.rowId = '';
        this.validateProperties = [];
        this.headerProperties = [];
        this.search = new URLSearchParams();
        this.GetProductLabelFlagsearch = new URLSearchParams();
        this.PremiseLocationNumber_onchangesearch = new URLSearchParams();
        this.cmdPlanVisitGenLabels_onClicksearch = new URLSearchParams();
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.defaultOpt = {
            text: 'Options',
            value: ''
        };
        this.MenuOptionList = [
            {
                text: 'Add Plan Visit',
                value: 'AddPlanVisit'
            }
        ];
        this.ellipsisConfig = {
            premiseLocation: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                showAddNew: false,
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: '',
                component: PremiseLocationSearchComponent
            }
        };
        this.flag = false;
    }
    PlanVisitTabularComponent.prototype.fetchSysChar = function (SYSTEMCHAR_EnableWED) {
        var _this = this;
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, SYSTEMCHAR_EnableWED);
        this.httpService.sysCharRequest(this.querySysChar).subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
            }
            else {
                if (e) {
                    _this.vEnableWED = e.records[0].Required;
                    if (_this.vEnableWED)
                        _this.vbEnableWED = 'TRUE';
                    else
                        _this.vbEnableWED = 'FALSE';
                }
            }
            _this.calculateMaxColumn();
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.calculateMaxColumn();
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitTabularComponent.prototype.onbuildmenyOptionChange = function (event) {
        if (this.BuildMenuOptions.selectedItem && this.BuildMenuOptions.selectedItem === 'AddPlanVisit') {
            var buildmenuoptionselected = this.BuildMenuOptions.selectedItem.toString();
        }
        this.ContractNumberAttrSelectedDate = '';
        this.ServiceCoverRowIDattrProdCode = this.ContractNumberServiceCoverRowID;
        if (this.BuildMenuOptions.selectedItem && this.BuildMenuOptions.selectedItem === 'AddPlanVisit') {
            alert('iCABSSePlanVisitMaintenance2.htm -- out of scope of this sprint');
        }
    };
    PlanVisitTabularComponent.prototype.ngAfterViewInit = function () {
        this.messageService.emitMessage(this.inputParams.parentMode);
    };
    PlanVisitTabularComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.inputParams = {
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'ContractNumber': this.routeParams.ContractNumber,
            'PremiseNumber': this.routeParams.PremiseNumber,
            'ProductCode': this.routeParams.ProductCode,
            'ServiceCoverNumber': '',
            'ServiceCoverContract': '',
            'parentMode': this.routeParams.parentMode,
            'sortOrder': 'Descending',
            'riCacheRefresh': 'True',
            'vbVisitNarrativeCode': '',
            'vbUpdateRecord': '',
            'vbUpdateVisitNarrative': '',
            'vbUpdateQty': '',
            'CurrentColumnName': '',
            'riGridMode': '0',
            'PremiseLocationNumber': '',
            'CurrentContractTypeURLParameter': this.routeParams.CurrentContractTypeURLParameter
        };
        this.GetParentRowIDServiceCoverParent = this.routeParams.ServiceCoverRowID;
        this.localeTranslateService.setUpTranslation();
        this.CurrentContractType = this.utils.getCurrentContractType(this.routeParams.CurrentContractTypeURLParameter);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType) + ' Number';
        this.dispdtfrom = this.formatDate(this.dtfrom);
        this.dispdtto = '';
        this.dtto = null;
        var SYSTEMCHAR_EnableWED = this.sysCharConstants.SystemCharEnableWED.toString();
        this.fetchSysChar(SYSTEMCHAR_EnableWED);
        this.maxColumn = 15;
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.action = '2';
        this.pageSize = 10;
        this.onbuildmenyOptionChange('');
        this.ContractNumber = this.inputParams.ContractNumber;
        this.PremiseNumber = this.inputParams.PremiseNumber;
        this.ProductCode = this.inputParams.ProductCode;
        this.PremiseLocationNumber = this.inputParams.PremiseLocationNumber;
        this.planvisitFormGroup = this.fb.group({
            ContractNumber: [this.ContractNumber],
            ContractName: [{ value: '', disabled: true }],
            PremiseNumber: [this.PremiseNumber],
            PremiseName: [{ value: '', disabled: true }],
            ProductCode: [this.ProductCode],
            ProductDesc: [{ value: '', disabled: true }],
            PremiseLocationNumber: [this.PremiseLocationNumber],
            PremiseLocationDesc: [{ value: '', disabled: true }]
        });
        this.routeAwayUpdateSaveFlag();
        if (this.routeParams.parentMode !== 'ServiceCover' &&
            this.routeParams.parentMode !== 'PlanVisitGridYear' &&
            this.routeParams.parentMode !== 'ServiceVisitMaintenance' &&
            this.routeParams.parentMode !== 'byServiceCoverRowID' &&
            this.routeParams.parentMode !== 'ServiceCoverAnnualCalendar') {
            this.messageService.emitMessage(0);
            this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
                if (data !== 0) {
                    _this.zone.run(function () {
                        _this.messageModal.show({ msg: 'Invalid Parent mode: ' + data, title: 'Error' }, false);
                    });
                }
            });
        }
        else {
            this.ServiceCoverLoad(this.inputParams.parentMode);
        }
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
        this.ContractNumberServiceCoverRowID = '';
        var contractvalueData = [{
                'table': 'ServiceCover',
                'query': {
                    'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value,
                    'ProductCode': this.planvisitFormGroup.controls['ProductCode'].value,
                    'PremiseNumber': this.planvisitFormGroup.controls['ProductCode'].value
                },
                'fields': [
                    'ContractNumber',
                    'PremiseNumber',
                    'ServiceCoverNumber',
                    'ProductCode',
                    'ServiceCoverRowID'
                ]
            },
            {
                'table': 'Contract',
                'query': {
                    'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value
                },
                'fields': [
                    'ContractNumber',
                    'ContractName'
                ]
            },
            {
                'table': 'Premise',
                'query': {
                    'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value,
                    'PremiseNumber': this.planvisitFormGroup.controls['PremiseNumber'].value
                },
                'fields': [
                    'PremiseNumber',
                    'PremiseName'
                ]
            },
            {
                'table': 'Product',
                'query': {
                    'ProductCode': this.planvisitFormGroup.controls['ProductCode'].value
                },
                'fields': [
                    'ProductCode',
                    'ProductDesc'
                ]
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpRecord(contractvalueData, 1).subscribe(function (e) {
            var servicevalueDatafetched = e['results'];
            _this.onDataReceived(servicevalueDatafetched);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            _this.errorService.emitError(error);
            _this.planvisitFormGroup.controls['ContractNumber'].setValue('');
        });
        this.GetProductLabelFlag();
        this.validateProperties = [
            {
                'type': MntConst.eTypeText,
                'index': 0,
                'align': 'right',
                'readonly': true
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 3,
                'align': 'right',
                'maxlength': 4,
                'readonly': false
            },
            {
                'type': MntConst.eTypeText,
                'index': 12,
                'align': 'right',
                'maxlength': 10,
                'readonly': false
            }
        ];
        this.headerProperties = [
            {
                'width': '120px',
                'index': 3
            }
        ];
    };
    PlanVisitTabularComponent.prototype.ngOnDestroy = function () {
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    PlanVisitTabularComponent.prototype.GetProductLabelFlag = function () {
        var _this = this;
        this.GetProductLabelFlagsearch = new URLSearchParams();
        this.GetProductLabelFlagsearch.set(this.serviceConstants.Action, '0');
        this.GetProductLabelFlagsearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.GetProductLabelFlagsearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.GetProductLabelFlagsearch.set('Function', 'GetProductLabelFlag');
        this.GetProductLabelFlagsearch.set('ProductCode', this.planvisitFormGroup.controls['ProductCode'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.GetProductLabelFlagsearch)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                if (e.DisplayLabelsIcons) {
                    _this.DisplayLabelsIcons = e.DisplayLabelsIcons;
                    _this.calculateMaxColumn();
                    _this.buildgrid();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.calculateMaxColumn();
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitTabularComponent.prototype.cmdPlanVisitCancel_onClick = function () {
        var _this = this;
        if (((this.checkedarray.length) !== null) && ((this.checkedarray.length) > 0)) {
            alert('Goes to Application/iCABSAPlanVisitCancellationMaintenance.htm with ' + this.checkedarray.join(';'));
        }
        else {
            this.messageService.emitMessage(0);
            this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
                if (data === 0) {
                    _this.zone.run(function () {
                        _this.messageModal.show({ msg: 'No planned visits have been selected!', title: 'Error' }, false);
                    });
                }
            });
        }
    };
    PlanVisitTabularComponent.prototype.calculateMaxColumn = function () {
        this.maxColumn = 15;
        if (this.vbEnableWED === 'TRUE') {
            this.planVisitGrid.clearGridData();
            this.maxColumn = this.maxColumn + 1;
            this.validateProperties = [
                {
                    'type': MntConst.eTypeText,
                    'index': 0,
                    'align': 'right',
                    'readonly': true
                },
                {
                    'type': MntConst.eTypeInteger,
                    'index': 3,
                    'align': 'right',
                    'maxlength': 4,
                    'readonly': false
                },
                {
                    'type': MntConst.eTypeText,
                    'index': 13,
                    'align': 'right',
                    'maxlength': 10,
                    'readonly': false
                }
            ];
        }
        if (this.DisplayLabelsIcons === 'Yes') {
            this.planVisitGrid.clearGridData();
            this.maxColumn = this.maxColumn + 2;
        }
    };
    PlanVisitTabularComponent.prototype.cmdPlanVisitGenLabels_onClick = function () {
        var _this = this;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        if (((this.GenLabelsRowid.length) !== null) && ((this.GenLabelsRowid.length) > 0)) {
            this.cmdPlanVisitGenLabels_onClicksearch = new URLSearchParams();
            this.cmdPlanVisitGenLabels_onClicksearch.set(this.serviceConstants.Action, '0');
            this.cmdPlanVisitGenLabels_onClicksearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.cmdPlanVisitGenLabels_onClicksearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.cmdPlanVisitGenLabels_onClicksearch.set('Function', 'PlanVisitGenerateLabels');
            this.cmdPlanVisitGenLabels_onClicksearch.set('ProductCode', this.planvisitFormGroup.controls['ProductCode'].value);
            this.cmdPlanVisitGenLabels_onClicksearch.set('GenLabelsRowid', this.GenLabelsRowid);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.cmdPlanVisitGenLabels_onClicksearch)
                .subscribe(function (e) {
                if (e.errorMessage) {
                    _this.errorService.emitError(e);
                }
                else {
                    _this.QtyMessage = e.QtyMessage;
                    if (e.QtyMessage === 'Yes') {
                        _this.messageService.emitMessage(0);
                        _this.messageSubscription = _this.messageService.getObservableSource().subscribe(function (data) {
                            if (data === 0) {
                                _this.zone.run(function () {
                                    _this.messageModal.show({ msg: 'Labels have been created.  Please check those labels where the Planned Qty has been changed. ', title: 'Information' }, false);
                                });
                            }
                        });
                    }
                    else {
                        _this.messageService.emitMessage(0);
                        _this.messageSubscription = _this.messageService.getObservableSource().subscribe(function (data) {
                            if (data === 0) {
                                _this.zone.run(function () {
                                    _this.messageModal.show({ msg: 'Labels have been created.', title: 'Information' }, false);
                                });
                            }
                        });
                    }
                    _this.GenLabelsRowid = '';
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorMessage = error;
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.messageService.emitMessage(0);
            this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
                if (data === 0) {
                    _this.zone.run(function () {
                        _this.messageModal.show({ msg: 'No Planned Visits have been selected!', title: 'Information' }, false);
                    });
                }
            });
        }
    };
    PlanVisitTabularComponent.prototype.cmd_GridView_onclick = function () {
        if (this.inputParams.parentMode === 'PlanVisitGridYear') {
            this.router.navigate(['/grid/application/contract/planVisitGridYear'], {
                queryParams: {
                    'parentMode': 'PlanVisitTabular',
                    'CurrentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter,
                    'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value,
                    'PremiseNumber': this.planvisitFormGroup.controls['PremiseNumber'].value,
                    'ProductCode': this.planvisitFormGroup.controls['ProductCode'].value,
                    'ServiceCoverRowID': this.routeParams.ServiceCoverRowIDattrProdCodeParent,
                    'PlanVisitRowID': this.routeParams.ServiceCoverRowIDattrProdCodeParent
                }
            });
        }
        else {
            this.router.navigate(['/grid/application/contract/planVisitGridYear'], {
                queryParams: {
                    'parentMode': 'PlanVisitTabular',
                    'CurrentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter,
                    'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value,
                    'PremiseNumber': this.planvisitFormGroup.controls['PremiseNumber'].value,
                    'ProductCode': this.planvisitFormGroup.controls['ProductCode'].value,
                    'ServiceCoverRowID': this.routeParams.ServiceCoverRowID,
                    'PlanVisitRowID': this.routeParams.ServiceCoverRowID
                }
            });
        }
    };
    PlanVisitTabularComponent.prototype.PremiseLocationNumber_onchange = function () {
        var _this = this;
        if (this.planvisitFormGroup.controls['ProductCode'].value !== null && this.planvisitFormGroup.controls['PremiseLocationNumber'].value !== '') {
            this.PremiseLocationNumber_onchangesearch = new URLSearchParams();
            this.PremiseLocationNumber_onchangesearch.set(this.serviceConstants.Action, '0');
            this.PremiseLocationNumber_onchangesearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.PremiseLocationNumber_onchangesearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.PremiseLocationNumber_onchangesearch.set('Function', 'GetLocationDesc');
            this.PremiseLocationNumber_onchangesearch.set('ProductCode', this.planvisitFormGroup.controls['ProductCode'].value);
            this.PremiseLocationNumber_onchangesearch.set('ContractNumber', this.planvisitFormGroup.controls['ContractNumber'].value);
            this.PremiseLocationNumber_onchangesearch.set('PremiseNumber', this.planvisitFormGroup.controls['PremiseNumber'].value);
            this.PremiseLocationNumber_onchangesearch.set('PremiseLocationNumber', this.planvisitFormGroup.controls['PremiseLocationNumber'].value);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.PremiseLocationNumber_onchangesearch)
                .subscribe(function (e) {
                if (e.errorMessage) {
                    if (_this.planvisitFormGroup.controls['PremiseLocationNumber'].value !== '') {
                        _this.errorService.emitError(e);
                        if (!e.PremiseLocationDesc) {
                            _this.riExchange.riInputElement.SetValue(_this.planvisitFormGroup, 'PremiseLocationNumber', '');
                            _this.riExchange.riInputElement.SetValue(_this.planvisitFormGroup, 'PremiseLocationDesc', '');
                        }
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.planvisitFormGroup, 'PremiseLocationNumber', '');
                        _this.riExchange.riInputElement.SetValue(_this.planvisitFormGroup, 'PremiseLocationDesc', '');
                    }
                }
                else {
                    if (e.PremiseLocationDesc) {
                        _this.PremiseLocationDesc = e.PremiseLocationDesc;
                        _this.planvisitFormGroup.controls['PremiseLocationDesc'].setValue(_this.PremiseLocationDesc);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.planvisitFormGroup, 'PremiseLocationNumber', '');
                        _this.riExchange.riInputElement.SetValue(_this.planvisitFormGroup, 'PremiseLocationDesc', '');
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorMessage = error;
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.planvisitFormGroup.controls['PremiseLocationDesc'].setValue('');
        }
    };
    PlanVisitTabularComponent.prototype.ServiceCoverLoad = function (parentMode) {
        if (parentMode === 'ServiceVisitMaintenance' || parentMode === 'ServiceCoverAnnualCalendar' || parentMode === 'PlanVisitGridYear') {
            this.ServiceCoverRowIDattrProdCodeParent = this.routeParams.ServiceCoverRowIDattrProdCodeParent;
            this.strGridData = { level: 'ServiceCoverYear', RowID: this.ServiceCoverRowIDattrProdCodeParent };
        }
        else if (parentMode === 'byServiceCoverRowID') {
            this.strGridData = { level: 'ServiceCoverYear', RowID: this.ServiceCoverRowIDattrbusinessCodeParent };
        }
        else {
            this.strGridData = { level: 'ServiceCoverYear', RowID: this.GetParentRowIDServiceCoverParent };
        }
        if (parentMode === 'ServiceVisitMaintenance' || parentMode === 'ServiceCoverAnnualCalendar') {
            this.ContractNumberServiceCoverRowID = this.ServiceCoverRowIDattrProdCodeParent;
        }
        else if (parentMode === 'byServiceCoverRowID') {
            this.ContractNumberServiceCoverRowID = this.ServiceCoverRowIDattrbusinessCodeParent;
        }
        else if (parentMode === 'ServiceCoverAnnualCalendar') {
            this.ContractNumberServiceCoverRowID = this.ServiceCoverRowIDattrProdCode;
            this.planvisitFormGroup.controls['PremiseNumber'].value = this.ServiceCoverRowIDattrProdCodeParent + this.attrPremiseNumber;
            this.planvisitFormGroup.controls['PremiseName'].value = this.ServiceCoverRowIDattrProdCodeParent + this.attrPremiseName;
        }
        else {
            this.ContractNumberServiceCoverRowID = this.GetParentRowIDServiceCoverParent;
        }
    };
    PlanVisitTabularComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    PlanVisitTabularComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * this.itemsPerPage;
        }
        else {
            this.totalRecords = 0;
        }
    };
    PlanVisitTabularComponent.prototype.getCurrentPage = function (data) {
        if (this.pagecurrentgrid && this.pagecurrentgrid['flagcurrentpage'] === 'UpdateTrue') {
            this.pagecurrentgrid['flagcurrentpage'] = '';
            this.gridCurPage = Number(this.pagecurrentgrid['currentpageingrid']);
            this.search.set(this.serviceConstants.PageCurrent, String(this.gridCurPage));
            this.buildgrid();
        }
        else {
            this.gridCurPage = data.value;
            this.search.set(this.serviceConstants.PageCurrent, String(this.gridCurPage));
            this.buildgrid();
        }
    };
    PlanVisitTabularComponent.prototype.sortGrid = function (data) {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.buildgrid();
    };
    PlanVisitTabularComponent.prototype.onCellClick = function (data) {
        if (this.maxColumn === 15) {
            if (data.cellIndex === 3 || data.cellIndex === 12) {
                this.setupTableColumn(data.cellIndex, data.rowIndex);
                this.grdPlanVisitAttrPlanVisitRowID = data.cellData.additionalData;
                this.grdPlanVisitAttrRow = data.cellData.rowID;
            }
        }
        if (this.maxColumn === 17) {
            if (data.cellIndex === 3 || data.cellIndex === 12) {
                this.setupTableColumn(data.cellIndex, data.rowIndex);
                this.grdPlanVisitAttrPlanVisitRowID = data.cellData.additionalData;
                this.grdPlanVisitAttrRow = data.cellData.rowID;
            }
        }
        if (this.maxColumn === 16 || this.maxColumn === 18) {
            if (data.cellIndex === 3 || data.cellIndex === 13) {
                this.setupTableColumn(data.cellIndex, data.rowIndex);
                this.grdPlanVisitAttrPlanVisitRowID = data.cellData.additionalData;
                this.grdPlanVisitAttrRow = data.cellData.rowID;
            }
        }
    };
    PlanVisitTabularComponent.prototype.setupTableColumn = function (cellIndex, rowIndex) {
        var colIndex = 1 + cellIndex;
        var obj = document.querySelectorAll('.gridtable tbody > tr > td:nth-child(' + colIndex + ') input[type=text]');
        if (obj.length > 0) {
            if (colIndex === 4) {
                if (obj[rowIndex])
                    obj[rowIndex].setAttribute('maxlength', '4');
            }
            else {
                if (obj[rowIndex])
                    obj[rowIndex].setAttribute('maxlength', '10');
            }
        }
    };
    PlanVisitTabularComponent.prototype.onCellClickBlur = function (data) {
        var _this = this;
        var completRowData = data.trRowData;
        this.vbUpdateQty = 'Update';
        if (!completRowData) {
            return;
        }
        if (this.maxColumn === 15) {
            if (data.cellIndex === 12) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (completRowData) {
                    completRowData[12].text = data.keyCode.target.value.toUpperCase();
                }
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }
            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }
            if (this.DisplayLabelsIcons === 'Yes') {
                var celldatacol3 = void 0;
                var celldatacol15 = void 0;
                if (data.cellIndex === 3) {
                    celldatacol3 = data.keyCode.target.value;
                }
                if (data.cellIndex === 15) {
                    celldatacol15 = data.keyCode.target.value;
                }
                if (celldatacol3 !== celldatacol15) {
                    this.messageService.emitMessage(0);
                    this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
                        if (data === 0) {
                            _this.zone.run(function () {
                                _this.messageModal.show({ msg: 'Planned Quantity has been modified. Please modify the labels accordingly', title: 'Information' }, false);
                            });
                        }
                    });
                }
            }
        }
        if (this.maxColumn === 17) {
            if (data.cellIndex === 12) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (completRowData) {
                    completRowData[12].text = data.keyCode.target.value.toUpperCase();
                }
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }
            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }
            if (this.DisplayLabelsIcons === 'Yes') {
                var celldatacol3 = void 0;
                var celldatacol15 = void 0;
                if (data.cellIndex === 3) {
                    celldatacol3 = data.keyCode.target.value;
                }
                if (data.cellIndex === 15) {
                    celldatacol15 = data.keyCode.target.value;
                }
                if (celldatacol3 !== celldatacol15) {
                    this.messageService.emitMessage(0);
                    this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
                        if (data === 0) {
                            _this.zone.run(function () {
                                _this.messageModal.show({ msg: 'Planned Quantity has been modified. Please modify the labels accordingly', title: 'Information' }, false);
                            });
                        }
                    });
                }
            }
        }
        if (this.maxColumn === 17) {
            if (data.cellIndex === 12) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (completRowData) {
                    completRowData[12].text = data.keyCode.target.value.toUpperCase();
                }
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }
            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }
        }
        if (this.maxColumn === 16) {
            if (data.cellIndex === 13) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                completRowData[13].text = data.keyCode.target.value.toUpperCase();
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }
            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }
        }
        if (this.maxColumn === 18) {
            if (data.cellIndex === 13) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                completRowData[13].text = data.keyCode.target.value.toUpperCase();
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }
            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }
            if (this.DisplayLabelsIcons === 'Yes') {
                var celldatacol3 = void 0;
                var celldatacol15 = void 0;
                if (data.cellIndex === 3) {
                    celldatacol3 = data.keyCode.target.value;
                }
                if (celldatacol3 !== celldatacol15) {
                    this.messageService.emitMessage(0);
                    this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
                        if (data === 0) {
                            _this.zone.run(function () {
                                _this.messageModal.show({ msg: 'Planned Quantity has been modified. Please modify the labels accordingly', title: 'Information' }, false);
                            });
                        }
                    });
                }
            }
        }
    };
    PlanVisitTabularComponent.prototype.onCellKeyDown = function (data) {
        if (this.maxColumn === 15) {
            this.vbUpdateRecord = 'Update';
            if (data.cellIndex === 3) {
                this.CurrentColumnName = 'PlanQuantity';
                this.vbUpdateQty = 'Update';
                if (data.keyCode.target.value)
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
            }
            if (data.cellIndex === 12) {
                this.CurrentColumnName = 'VisitNarrativeCd';
                this.vbUpdateVisitNarrative = 'Update';
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (data.keyCode.code === 'PageDown') {
                    data.keyCode.preventDefault();
                    if ((data.keyCode.target.value !== this.VisitNarrativeCodeSearchvalue) || (data.cellData.text !== this.VisitNarrativeCodeSearchvalue)) {
                        data.keyCode.target.value = this.VisitNarrativeCodeSearchvalue;
                        data.cellData.text = data.keyCode.target.value;
                    }
                    if (data.cellData.text) {
                        this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                    }
                    else {
                        if (data.keyCode.target.value)
                            this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                        data.cellData.text = data.keyCode.target.value.toUpperCase();
                    }
                    this.vbUpdateVisitNarrative = 'Update';
                    this.buildgrid();
                    data.cellData.text = '';
                    this.vbVisitNarrativeCode = '';
                }
            }
        }
        if (this.maxColumn === 17) {
            this.vbUpdateRecord = 'Update';
            if (data.cellIndex === 3) {
                this.CurrentColumnName = 'PlanQuantity';
                this.vbUpdateQty = 'Update';
                if (data.keyCode.target.value)
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
            }
            if (data.cellIndex === 12) {
                this.CurrentColumnName = 'VisitNarrativeCd';
                this.vbUpdateVisitNarrative = 'Update';
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (data.keyCode.code === 'PageDown') {
                    data.keyCode.preventDefault();
                    if ((data.keyCode.target.value !== this.VisitNarrativeCodeSearchvalue) || (data.cellData.text !== this.VisitNarrativeCodeSearchvalue)) {
                        data.keyCode.target.value = this.VisitNarrativeCodeSearchvalue;
                        data.cellData.text = data.keyCode.target.value;
                    }
                    if (data.cellData.text) {
                        this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                    }
                    else {
                        if (data.keyCode.target.value)
                            this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                        data.cellData.text = data.keyCode.target.value.toUpperCase();
                    }
                    this.vbUpdateVisitNarrative = 'Update';
                    this.buildgrid();
                    data.cellData.text = '';
                    this.vbVisitNarrativeCode = '';
                }
            }
        }
        if (this.maxColumn === 16 || this.maxColumn === 18) {
            this.vbUpdateRecord = 'Update';
            if (data.cellIndex === 3) {
                this.CurrentColumnName = 'PlanQuantity';
                this.vbUpdateQty = 'Update';
                if (data.keyCode.target.value)
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
            }
            if (data.cellIndex === 13) {
                this.CurrentColumnName = 'VisitNarrativeCd';
                this.vbUpdateVisitNarrative = 'Update';
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (data.keyCode.code === 'PageDown') {
                    data.keyCode.preventDefault();
                    if ((data.keyCode.target.value !== this.VisitNarrativeCodeSearchvalue) || (data.cellData.text !== this.VisitNarrativeCodeSearchvalue)) {
                        data.keyCode.target.value = this.VisitNarrativeCodeSearchvalue;
                        data.cellData.text = data.keyCode.target.value;
                    }
                    if (data.cellData.text) {
                        this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                    }
                    else {
                        if (data.keyCode.target.value)
                            this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                        data.cellData.text = data.keyCode.target.value.toUpperCase();
                    }
                    this.vbUpdateVisitNarrative = 'Update';
                    this.buildgrid();
                    data.cellData.text = '';
                    this.vbVisitNarrativeCode = '';
                }
            }
        }
        if (this.maxColumn === 17) {
            this.vbUpdateRecord = 'Update';
            if (data.cellIndex === 3) {
                this.CurrentColumnName = 'PlanQuantity';
                this.vbUpdateQty = 'Update';
                if (data.keyCode.target.value)
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
            }
            if (data.cellIndex === 12) {
                this.CurrentColumnName = 'VisitNarrativeCd';
                this.vbUpdateVisitNarrative = 'Update';
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (data.keyCode.code === 'PageDown') {
                    data.keyCode.preventDefault();
                    if ((data.keyCode.target.value !== this.VisitNarrativeCodeSearchvalue) || (data.cellData.text !== this.VisitNarrativeCodeSearchvalue)) {
                        data.keyCode.target.value = this.VisitNarrativeCodeSearchvalue;
                        data.cellData.text = data.keyCode.target.value;
                    }
                    if (data.cellData.text) {
                        this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                    }
                    else {
                        if (data.keyCode.target.value)
                            this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                        data.cellData.text = data.keyCode.target.value.toUpperCase();
                    }
                    this.vbUpdateVisitNarrative = 'Update';
                    this.buildgrid();
                    data.cellData.text = '';
                    this.vbVisitNarrativeCode = '';
                }
            }
        }
    };
    PlanVisitTabularComponent.prototype.onGridRowClick = function (data) {
        var completRowData = data.trRowData;
        this.griddata = data;
        if (completRowData[0].text === data.cellData.text) {
            this.CurrentColumnName = 'PlanDate';
            this.ContracNumberattrPlanVisitRowID = data.cellData.additionalData;
            this._router.navigate(['/maintenance/planvisit'], {
                queryParams: {
                    'parentMode': 'Year',
                    'currentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter,
                    'PlanVisitRowID': completRowData[0].additionalData
                }
            });
        }
        if (this.maxColumn === 17) {
            if (completRowData[15].text === data.cellData.text) {
                this.CurrentColumnName = 'NoOfLabels';
                this.ContracNumberattrPlanVisitRowID = data.cellData.additionalData;
                alert('Application/iCABSAPlanVisitLabels.htm not yet deployed');
            }
        }
        if (this.maxColumn === 18) {
            if (completRowData[16].text === data.cellData.text) {
                this.CurrentColumnName = 'NoOfLabels';
                this.ContracNumberattrPlanVisitRowID = data.cellData.additionalData;
                alert('Application/iCABSAPlanVisitLabels.htm not yet deployed');
            }
        }
    };
    PlanVisitTabularComponent.prototype.onChangeCheckBox = function (data) {
        if (this.maxColumn === 15) {
            if (data.cellIndex === 14) {
                var cbIdx = this.checkedarray.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.checkedarray.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.checkedarray.splice(cbIdx, 1);
                }
                this.checkedarray.join(';');
            }
        }
        if (this.maxColumn === 16) {
            if (data.cellIndex === 15) {
                var cbIdx = this.checkedarray.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.checkedarray.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.checkedarray.splice(cbIdx, 1);
                }
                this.checkedarray.join(';');
            }
        }
        if (this.maxColumn === 18) {
            if (data.cellIndex === 15) {
                var cbIdx = this.checkedarray.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.checkedarray.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.checkedarray.splice(cbIdx, 1);
                }
                this.checkedarray.join(';');
            }
            if (data.cellIndex === 17) {
                var cbIdx = this.GenLabelsRowid.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.GenLabelsRowid.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.GenLabelsRowid.splice(cbIdx, 1);
                }
                if (this.GenLabelsRowid.length > 0) {
                    this.GenLabelsRowid.join(';');
                }
            }
        }
        if (this.maxColumn === 17) {
            if (data.cellIndex === 14) {
                var cbIdx = this.checkedarray.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.checkedarray.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.checkedarray.splice(cbIdx, 1);
                }
                this.checkedarray.join(';');
            }
            if (data.cellIndex === 16) {
                var cbIdx = this.GenLabelsRowid.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.GenLabelsRowid.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.GenLabelsRowid.splice(cbIdx, 1);
                }
                if (this.GenLabelsRowid.length > 0) {
                    this.GenLabelsRowid.join(';');
                }
            }
        }
    };
    PlanVisitTabularComponent.prototype.fromDateSelectedValue = function (value) {
        if (value && value.value) {
            this.dispdtfrom = value.value;
        }
        else {
            this.dispdtfrom = '';
        }
    };
    PlanVisitTabularComponent.prototype.toDateSelectedValue = function (value) {
        if (value && value.value) {
            this.dispdtto = value.value;
        }
        else {
            this.dispdtto = '';
        }
    };
    PlanVisitTabularComponent.prototype.updateGrid = function (fulldata) {
        var _this = this;
        var data = fulldata.rowData;
        var completRowData = fulldata.trRowData;
        var cellData = fulldata.cellData;
        this.inputParams.module = this.headerParams.module;
        this.inputParams.method = this.headerParams.method;
        this.inputParams.operation = this.headerParams.operation;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, this.action);
        var postParams = {};
        if (completRowData) {
            postParams.PlanDate = completRowData[0].text;
            postParams.PlanVisitType = completRowData[1].text;
            postParams.PlanStatus = completRowData[2].text;
            postParams.PlanQuantity = completRowData[3].text;
            postParams.PlanEmployee = completRowData[4].text;
            postParams.ActualVisitDate = completRowData[5].text;
            postParams.ActualQty = completRowData[6].text;
            postParams.ActualEmployee = completRowData[7].text;
            postParams.VisitNarrativeCd = completRowData[12].text;
            postParams.VisitNarrativeCode = completRowData[12].text;
            postParams.ServiceVisitText = completRowData[13].text;
            postParams.PlanVisitCancel = completRowData[14].text;
        }
        if (this.vbEnableWED === 'TRUE') {
            if (completRowData) {
                postParams.PlanEmployee = completRowData[5].text;
                postParams.ActualVisitDate = completRowData[6].text;
                postParams.ActualQty = completRowData[7].text;
                postParams.ActualEmployee = completRowData[8].text;
                postParams.VisitNarrativeCd = completRowData[13].text;
                postParams.VisitNarrativeCode = completRowData[13].text;
                postParams.ServiceVisitText = completRowData[14].text;
                postParams.PlanVisitCancel = completRowData[15].text;
            }
        }
        postParams.ServiceCoverItemNumberDesc = 0;
        postParams.PremiseLocNo = 0;
        postParams.ProductComponent = '';
        postParams.ProductComponentRem = '';
        postParams.level = this.strGridData.level;
        postParams.RowID = this.strGridData.RowID;
        postParams.PlanVisitFrom = this.dispdtfrom.toString();
        postParams.PlanVisitTo = this.dispdtto.toString();
        postParams.ProductCode = this.planvisitFormGroup.controls['ProductCode'].value;
        postParams.PremiseLocationNumber = this.planvisitFormGroup.controls['PremiseLocationNumber'].value;
        postParams.UpdateRecord = this.vbUpdateRecord;
        postParams.UpdateVisitNarrative = this.vbUpdateVisitNarrative;
        postParams.UpdateQty = this.vbUpdateQty;
        postParams.PlanVisitRowid = cellData.rowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
                _this.refresh();
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                    _this.refresh();
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                    _this.refresh();
                }
                else {
                    _this.planVisitGrid.clearGridData();
                    _this.pagecurrentgrid = { currentpageingrid: _this.gridCurPage.toString(), flagcurrentpage: 'UpdateTrue' };
                    _this.buildgrid(postParams.VisitNarrativeCode, postParams.UpdateRecord, postParams.UpdateVisitNarrative, postParams.UpdateQty);
                    _this.refresh();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitTabularComponent.prototype.buildgrid = function (VisitNarrativeCode, UpdateRecord, UpdateVisitNarrative, UpdateQty) {
        this.inputParams.module = this.headerParams.module;
        this.inputParams.method = this.headerParams.method;
        this.inputParams.operation = this.headerParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.Action, this.action);
        if (this.strGridData) {
            this.search.set('level', this.strGridData.level);
            this.search.set('RowID', this.strGridData.RowID);
        }
        this.search.set('PlanVisitFrom', this.dispdtfrom.toString());
        this.search.set('PlanVisitTo', this.dispdtto.toString());
        this.search.set('ProductCode', this.planvisitFormGroup.controls['ProductCode'].value);
        this.search.set('PremiseLocationNumber', this.planvisitFormGroup.controls['PremiseLocationNumber'].value);
        if (VisitNarrativeCode) {
            this.search.set('VisitNarrativeCode', VisitNarrativeCode);
        }
        else {
            this.search.set('VisitNarrativeCode', this.inputParams.vbVisitNarrativeCode);
        }
        if (UpdateRecord) {
            this.search.set('UpdateRecord', UpdateRecord);
        }
        else {
            this.search.set('UpdateRecord', this.inputParams.vbUpdateRecord);
        }
        if (UpdateVisitNarrative) {
            this.search.set('UpdateVisitNarrative', UpdateVisitNarrative);
        }
        else {
            this.search.set('UpdateVisitNarrative', this.inputParams.vbUpdateVisitNarrative);
        }
        if (UpdateQty) {
            this.search.set('UpdateQty', UpdateQty);
        }
        else {
            this.search.set('UpdateQty', this.inputParams.vbUpdateQty);
        }
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riCacheRefresh', this.inputParams.riCacheRefresh);
        this.search.set('riGridMode', this.inputParams.riGridMode);
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.inputParams.CurrentColumnName);
        this.inputParams.search = this.search;
        this.planVisitGrid.update = true;
        this.planVisitGrid.loadGridData(this.inputParams, this.rowId);
        this.rowId = '';
    };
    PlanVisitTabularComponent.prototype.refresh = function () {
        this.flag = true;
        this.planVisitGrid.clearGridData();
        this.buildgrid();
    };
    PlanVisitTabularComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.lookupParams.set(this.serviceConstants.Action, '0');
        this.lookupParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.lookupParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.lookupParams.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        if (data)
            return this.httpService.lookUpRequest(this.lookupParams, data);
    };
    PlanVisitTabularComponent.prototype.onDataReceived = function (data, route) {
        if (data) {
            if ((data[1])[0] !== undefined) {
                this.ContractNumberServiceCoverRowID = (data[1])[0].ttContract;
                this.planvisitFormGroup.controls['ContractName'].setValue((data[1])[0].ContractName);
            }
            if ((data[2])[0] !== undefined) {
                this.planvisitFormGroup.controls['PremiseName'].setValue((data[2])[0].PremiseName);
            }
            if ((data[3])[0] !== undefined) {
                this.planvisitFormGroup.controls['ProductDesc'].setValue((data[3])[0].ProductDesc);
            }
        }
    };
    PlanVisitTabularComponent.prototype.onPremiseLocation = function (data) {
        this.PremiseLocationNumber = data.PremiseLocationNumber;
        this.PremiseLocationDesc = data.PremiseLocationDesc;
        this.PremiseLocationNumber_onchange();
        this.buildgrid();
    };
    PlanVisitTabularComponent.prototype.formatDate = function (date) {
        var d = new Date(date), day = '' + d.getDate(), month = '' + (d.getMonth() + 1), year = '' + d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    PlanVisitTabularComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    PlanVisitTabularComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.planvisitFormGroup.statusChanges.subscribe(function (value) {
            if (_this.planvisitFormGroup.valid === true) {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    PlanVisitTabularComponent.prototype.premiseLocationOnKeyDown = function (obj, call) {
        if (call && obj) {
            if (obj.PremiseLocationNumber) {
                this.planvisitFormGroup.controls['PremiseLocationNumber'].setValue(obj.PremiseLocationNumber);
            }
            if (obj.PremiseLocationDesc) {
                this.planvisitFormGroup.controls['PremiseLocationDesc'].setValue(obj.PremiseLocationDesc);
            }
            if (!obj.PremiseLocationDesc) {
                this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationNumber', '');
                this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationDesc', '');
            }
        }
        else {
            this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationNumber', '');
            this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationDesc', '');
        }
    };
    PlanVisitTabularComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPlanVisitTabular.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    PlanVisitTabularComponent.ctorParameters = [
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
        { type: RouteAwayGlobals, },
        { type: RiExchange, },
        { type: Router, },
    ];
    PlanVisitTabularComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'BuildMenuOptions': [{ type: ViewChild, args: ['BuildMenuOptions',] },],
        'planVisitGrid': [{ type: ViewChild, args: ['planVisitGrid',] },],
        'planVisitPagination': [{ type: ViewChild, args: ['planVisitPagination',] },],
        'LocationEllipsis': [{ type: ViewChild, args: ['LocationEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return PlanVisitTabularComponent;
}());
