import { HttpService } from '../../../shared/services/http-service';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { URLSearchParams } from '@angular/http';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { Utils } from './../../../shared/services/utility';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { TranslateService } from 'ng2-translate';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var ServiceVisitSummaryComponent = (function () {
    function ServiceVisitSummaryComponent(router, componentInteractionService, translateService, translate, store, titleService, zone, serviceConstants, utils, _httpService, el, errorService, activatedRoute, systemCharacterConstant, location) {
        var _this = this;
        this.router = router;
        this.componentInteractionService = componentInteractionService;
        this.translateService = translateService;
        this.translate = translate;
        this.store = store;
        this.titleService = titleService;
        this.zone = zone;
        this.serviceConstants = serviceConstants;
        this.utils = utils;
        this._httpService = _httpService;
        this.el = el;
        this.errorService = errorService;
        this.activatedRoute = activatedRoute;
        this.systemCharacterConstant = systemCharacterConstant;
        this.location = location;
        this.showHeader = true;
        this.sortUpdate = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.additionalProperty = true;
        this.headerClickedColumn = '';
        this.riSortOrder = '';
        this.searchModalRoute = '';
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.inputParamsServiceCover = {
            'parentMode': 'LookUp-Freq',
            currentContractTypeURLParameter: 'Contract',
            'ContractNumber': '',
            'ContractName': '',
            'PremiseNumber': '',
            'PremiseName': ''
        };
        this.formatData = { pageName: 'visitSummary', timeFormatIndex: {} };
        this.headerProperties = [];
        this.gridSortHeaders = [];
        this.premiseSearchComponent = PremiseSearchComponent;
        this.inputParamsPremise = {
            'parentMode': 'Search',
            'showAddNew': false
        };
        this.showCloseButton = true;
        this.isDisplayLevelInd = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.columnIndex = {
            ServiceDateStart: 0,
            VisitTypeCode: 0,
            ProductCode: 0,
            PremiseNumber: 0,
            PrintTreatment: 0,
            Information: 0,
            VisitDetail: 0,
            Recommendation: 0,
            ServiceVisitFrequency: 0,
            VisitReference: 0,
            StandardDuration: 0,
            OvertimeDuration: 0,
            Employee: 0,
            EmployeeSurname: 0
        };
        this.inputParams = {};
        this.validateProperties = [];
        this.strPremiseTitle = ' Premises Visit Summary';
        this.strServiceTitle = ' Service Visit Summary';
        this.vbDisplayLevelInd = false;
        this.vbPremiseError = false;
        this.vbProductError = false;
        this.vbContractError = false;
        this.vbPremiseVisitOption = false;
        this.blnInstantReport = true;
        this.btnTxt = 'Submit Report Generation';
        this.enablePreps = 'False';
        this.enableInfestations = 'False';
        this.enableVisitDurations = 'True';
        this.enableVisitCostings = 'True';
        this.enableDrivingCharges = 'False';
        this.enableWorkLoadIndex = 'False';
        this.enableVisitRef = 'False';
        this.enableUserCode = 'False';
        this.enableVisitDetail = 'False';
        this.enableWED = 'False';
        this.enableServCoverDispLevel = 'False';
        this.enableServDocketNoVisitEntry = 'False';
        this.enableBarcodes = 'False';
        this.enableNoServiceReasons = 'False';
        this.enableServiceEntryUserCodeLog = 'False';
        this.businessCode = this.utils.getBusinessCode();
        this.countryCode = this.utils.getCountryCode();
        this.dt = new Date();
        this.currDate = new Date();
        this.currDate2 = new Date();
        this.pagination = true;
        this.pageSize = 10;
        this.pageCurrent = '1';
        this.itemsPerPage = 10;
        this.page = 1;
        this.maxColumn = 0;
        this.infoDataColumnReference = null;
        this.isRequesting = false;
        this.method = 'service-delivery/maintenance';
        this.module = 'service';
        this.operation = 'Application/iCABSAServiceVisitSummary';
        this.cmdSubmitEnabled = true;
        this.searchType = '';
        this.contractNumberEnabled = true;
        this.contractNameEnabled = true;
        this.premiseNumberEnabled = true;
        this.premiseNumberHide = false;
        this.productCodeHide = false;
        this.premiseNameEnabled = true;
        this.productCodeEnabled = true;
        this.productDescEnabled = true;
        this.serviceVisitAnnivDateEnabled = true;
        this.serviceVisitFrequencyEnabled = true;
        this.productDisplay = false;
        this.submitBlockDisplay = false;
        this.informationDisplay = false;
        this.repDestHeaderDisplay = false;
        this.repDestSelectDisplay = false;
        this.menuDisplay = true;
        this.isNationalAccount = false;
        this.showFreqIndDisplay = false;
        this.showFreqIndChecked = true;
        this.backLinkText = '';
        this.querySysChar = new URLSearchParams();
        this.premiseRequired = false;
        this.showTotalRow = true;
        this.contractLabel = '';
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data !== null && data['data'] &&
                !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                _this.contractStoreData = data['data'];
                _this.inputParams.ContractType = _this.contractStoreData['ContractType'];
                _this.inputParams.contractNumber = _this.contractStoreData['ContractNumber'];
                _this.inputParamsPremise.ContractNumber = _this.contractStoreData['ContractNumber'];
                _this.inputParams.productCode = (_this.contractStoreData['ProductCode']) ? _this.contractStoreData['ProductCode'] : '';
                _this.inputParams.productDesc = _this.contractStoreData['ProductDesc'];
                _this.inputParams.premiseNumber = (_this.contractStoreData['PremiseNumber']) ? _this.contractStoreData['PremiseNumber'] : '';
                _this.inputParams.premiseName = _this.contractStoreData['PremiseName'];
                _this.inputParams.serviceVisitAnnivDate = _this.contractStoreData['ServiceVisitAnnivDate'];
                ;
                _this.inputParams.entitlementMonth = _this.contractStoreData['EntitlementMonth'];
                _this.inputParams.entitlementMonth = _this.contractStoreData['EntitlementMonth'];
                _this.inputParams.dateTo = _this.contractStoreData['dateTo'];
                _this.inputParams.dateFrom = _this.contractStoreData['dateFrom'];
                _this.inputParams.serviceCoverRowID = _this.contractStoreData['ServiceCoverRowID'];
                _this.additionalProperty = true;
                _this.storeData = data;
            }
        });
        this.subscription = activatedRoute.queryParams.subscribe(function (param) {
            _this.inputParams.parentMode = param['parentMode'];
            _this.inputParams.currentContractType = param['currentContractTypeURLParameter'];
            _this.inputParams.currentContractTypeCode = _this.utils.getCurrentContractType(param['currentContractTypeURLParameter']);
            _this.inputParams.isNationalAccount = param['isNationalAccount'];
        });
    }
    ServiceVisitSummaryComponent.prototype.searchTypeChange = function (OptionsValue) {
        this.searchType = OptionsValue;
        if (this.searchType === 'PremiseVisitInd') {
            this.pageTitle = this.strPremiseTitle;
            this.productDisplay = false;
            this.submitBlockDisplay = true;
            if (!this.blnInstantReport) {
                this.informationDisplay = true;
                this.informationDetails = '';
                this.repDestHeaderDisplay = true;
                this.repDestSelectDisplay = true;
            }
        }
        else {
            this.pageTitle = this.strServiceTitle;
            this.productDisplay = true;
            this.submitBlockDisplay = false;
            this.informationDisplay = false;
            this.repDestHeaderDisplay = false;
            this.repDestSelectDisplay = true;
        }
        this.titleService.setTitle(this.contractLabel + this.pageTitle);
        this.sortUpdate = true;
        this.setMaxColumn();
        this.historyGrid.clearGridData();
        this.historyGridPagination.setPage(1);
        this.pageCurrent = '1';
        this.historyGridPagination.setPage(1);
        this.updateView(this.inputParams);
    };
    ServiceVisitSummaryComponent.prototype.onPremiseDataReceived = function (data, route) {
        this.premiseNumber = data.PremiseNumber;
        this.premiseName = data.PremiseName;
        this.inputParamsServiceCover.PremiseNumber = this.premiseNumber;
        this.inputParamsServiceCover.PremiseName = data.PremiseName;
        this.cmdSubmitEnabled = true;
        this.populateDescriptions(this.productCode);
    };
    ServiceVisitSummaryComponent.prototype.serviceCoverSearchDataReceived = function (data) {
        this.productCode = data.ProductCode;
        this.productDesc = data.ProductDesc;
        this.serviceCoverRowID = data.row.ttServiceCover;
        this.populateDescriptions(this.productCode);
    };
    ServiceVisitSummaryComponent.prototype.contractNumberChange = function (contractNumber) {
        var _this = this;
        this.contractNumber = contractNumber;
        this.inputParamsServiceCover.ContractNumber = this.contractNumber;
        if (contractNumber !== '') {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set('ContractNumber', this.contractNumber);
            this.search.set('PostDesc', 'Contract');
            this.search.set(this.serviceConstants.CountryCode, this.countryCode);
            this.ajaxSubscription = this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
                try {
                    _this.inputParamsPremise.ContractName = data.ContractName;
                    _this.inputParamsServiceCover.ContractName = data.ContractName;
                    _this.contractName = data.ContractName;
                }
                catch (error) {
                    _this.errorService.emitError(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ServiceVisitSummaryComponent.prototype.premiseNumberChange = function (premiseNumber) {
        var _this = this;
        this.premiseNumber = premiseNumber;
        if (this.premiseNumber !== '') {
            this.cmdSubmitEnabled = true;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set('ContractNumber', this.contractNumber);
            this.search.set('countryCode', this.countryCode);
            this.search.set('PostDesc', 'Premise');
            this.search.set('PremiseNumber', this.premiseNumber);
            this.ajaxSubscription = this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
                try {
                    if (data.PremiseName) {
                        _this.inputParamsServiceCover.PremiseNumber = _this.premiseNumber;
                        _this.inputParamsServiceCover.PremiseName = data.PremiseName;
                        _this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-invalid');
                        _this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-valid');
                    }
                    else {
                        _this.showAlert(MessageConstant.Message.RecordNotFound);
                        _this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-valid');
                        _this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-touched');
                        _this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-touched');
                        _this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-invalid');
                    }
                    _this.premiseName = data.PremiseName;
                }
                catch (error) {
                    _this.errorService.emitError(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else if (!this.premiseRequired) {
            this.cmdSubmitEnabled = false;
            this.premiseName = '';
            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-invalid');
            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-valid');
        }
        else {
            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-valid');
            this.el.nativeElement.querySelector('#premiseNumber').classList.remove('ng-touched');
            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-touched');
            this.el.nativeElement.querySelector('#premiseNumber').classList.add('ng-invalid');
        }
    };
    ServiceVisitSummaryComponent.prototype.selectedOptions = function (optionsValue) {
        this.repDest = optionsValue;
    };
    ServiceVisitSummaryComponent.prototype.setButtonText = function () {
        this.btnTxt = (this.blnInstantReport) ? 'Proof Of Service Instant Report' : 'Submit Report Generation';
    };
    ServiceVisitSummaryComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
        this.updateView(this.inputParams);
    };
    ServiceVisitSummaryComponent.prototype.onGridRowClick = function (data) {
        switch (data.cellData.text) {
            case 'SP':
                this.treatmentPrint(data.cellData.rowID);
                break;
            default:
                break;
        }
        var idxPremiseRowID = -1, blnPremiseRowID = false, idxPremiseVisitRowID = -1, blnPremiseVisitRowID = false, idxServiceVisitRowID = -1, blnServiceVisitRowID = false, idxServiceCoverRowID = -1, blnServiceCoverRowID = false;
        if (this.searchType === 'PremiseVisitInd') {
            blnPremiseRowID = true;
            blnPremiseVisitRowID = true;
            if (this.premiseNumber) {
                idxPremiseVisitRowID = 0;
            }
            else {
                idxPremiseRowID = 0;
                idxPremiseVisitRowID = 1;
            }
        }
        else {
            if (!this.premiseNumber && !this.productCode) {
                blnServiceVisitRowID = true;
                blnServiceCoverRowID = true;
                blnPremiseRowID = true;
                idxServiceCoverRowID = 1;
                idxPremiseRowID = 0;
                if (this.searchType === 'DetailInd') {
                    idxServiceVisitRowID = 6;
                    if (this.enableVisitRef === 'True') {
                        idxServiceVisitRowID++;
                    }
                    if (this.enableVisitDetail === 'True') {
                        idxServiceVisitRowID++;
                    }
                }
            }
            else if (this.premiseNumber && !this.productCode) {
                blnServiceVisitRowID = true;
                blnServiceCoverRowID = true;
                idxServiceCoverRowID = 0;
                if (this.searchType === 'DetailInd') {
                    idxServiceVisitRowID = 5;
                    if (this.enableVisitRef === 'True') {
                        idxServiceVisitRowID++;
                    }
                    if (this.enableVisitDetail === 'True') {
                        idxServiceVisitRowID++;
                    }
                }
            }
            else {
                if (this.showFreqIndChecked) {
                    blnServiceVisitRowID = true;
                    blnServiceCoverRowID = true;
                    idxServiceCoverRowID = 0;
                    if (this.searchType === 'DetailInd') {
                        idxServiceVisitRowID = 3;
                        if (this.enableVisitRef === 'True') {
                            idxServiceVisitRowID++;
                        }
                        if (this.enableVisitDetail === 'True') {
                            idxServiceVisitRowID++;
                        }
                    }
                }
                else {
                    if (this.searchType === 'DetailInd') {
                        blnServiceVisitRowID = true;
                        idxServiceVisitRowID = 2;
                        if (this.enableVisitRef === 'True') {
                            idxServiceVisitRowID++;
                        }
                        if (this.enableVisitDetail === 'True') {
                            idxServiceVisitRowID++;
                        }
                        idxServiceCoverRowID = idxServiceVisitRowID;
                    }
                }
            }
        }
        if (idxPremiseRowID !== -1) {
            if (blnPremiseRowID) {
                if (data.trRowData[idxPremiseRowID].rowID) {
                    this.premiseRowID = data.trRowData[idxPremiseRowID].rowID;
                }
            }
            else {
                if (data.trRowData[idxPremiseRowID].AdditionalProperty) {
                    this.premiseRowID = data.trRowData[idxPremiseRowID].additionalData;
                }
            }
        }
        if (idxPremiseVisitRowID !== -1) {
            if (blnPremiseVisitRowID) {
                if (data.trRowData[idxPremiseVisitRowID].rowID) {
                    this.premiseVisitRowID = data.trRowData[idxPremiseVisitRowID].rowID;
                }
            }
            else {
                if (data.trRowData[idxPremiseVisitRowID].additionalData) {
                    this.premiseVisitRowID = data.trRowData[idxPremiseVisitRowID].additionalData;
                }
            }
        }
        if (idxServiceVisitRowID !== -1) {
            if (blnServiceVisitRowID) {
                if (data.trRowData[idxServiceVisitRowID].rowID) {
                    this.serviceVisitRowID = data.trRowData[idxServiceVisitRowID].rowID;
                }
            }
            else {
                if (data.trRowData[idxServiceVisitRowID].additionalData) {
                    this.serviceVisitRowID = data.trRowData[idxServiceVisitRowID].additionalData;
                }
            }
        }
        if (idxServiceCoverRowID !== -1) {
            if (blnServiceCoverRowID) {
                if (data.trRowData[idxServiceCoverRowID].rowID) {
                    this.serviceCoverRowID = data.trRowData[idxServiceCoverRowID].rowID;
                }
            }
            else {
                if (data.trRowData[idxServiceCoverRowID].additionalData) {
                    this.serviceCoverRowID = data.trRowData[idxServiceCoverRowID].additionalData;
                }
            }
        }
    };
    ServiceVisitSummaryComponent.prototype.onGridRowDblClick = function (data) {
        this.onGridRowClick(data);
        switch (data.cellIndex) {
            case this.columnIndex.ServiceDateStart - 1:
                this.showAlert('iCABSSePremiseVisitMaintenance.htm is yet developed');
                break;
            case this.columnIndex.VisitTypeCode - 1:
                this.showAlert('iCABSSeServiceVisitMaintenance.htm is yet developed');
                break;
            case this.columnIndex.PremiseNumber - 1:
                this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        'parentMode': 'Summary',
                        'PremiseRowID': this.premiseRowID,
                        'ContractTypeCode': this.inputParams.currentContractTypeCode,
                        'CurrentContractType': this.inputParams.currentContractType
                    }
                });
                break;
            case this.columnIndex.ProductCode - 1:
            case this.columnIndex.ServiceVisitFrequency - 1:
                this.router.navigate([ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE], {
                    queryParams: {
                        'parentMode': 'Summary',
                        'ServiceCoverRowID': this.serviceCoverRowID
                    }
                });
                break;
            case this.columnIndex.PrintTreatment - 1:
                this.treatmentPrint(data.cellData.rowID);
                break;
            case this.columnIndex.VisitDetail - 1:
                var premiseNumber = void 0, productCode = void 0;
                if (this.premiseNumber === '' && this.productCode === '') {
                    premiseNumber = (data.trRowData[this.columnIndex.PremiseNumber - 1].text) ? data.trRowData[this.columnIndex.PremiseNumber - 1].text : this.premiseNumber;
                    productCode = (data.trRowData[this.columnIndex.ProductCode - 1].text) ? data.trRowData[this.columnIndex.ProductCode - 1].text : this.productCode;
                }
                else if (this.premiseNumber !== '' && this.productCode === '') {
                    premiseNumber = this.premiseNumber;
                    productCode = (data.trRowData[this.columnIndex.ProductCode - 1].text) ? data.trRowData[this.columnIndex.ProductCode - 1].text : this.productCode;
                }
                else if (this.premiseNumber === '' && this.productCode !== '') {
                    premiseNumber = (data.trRowData[this.columnIndex.PremiseNumber - 1]) ? data.trRowData[this.columnIndex.PremiseNumber - 1].text : this.premiseNumber;
                    productCode = this.productCode;
                }
                else {
                    premiseNumber = this.premiseNumber;
                    productCode = this.productCode;
                }
                this.router.navigate([ContractManagementModuleRoutes.ICABSASERVICEVISITDETAILSUMMARY], {
                    queryParams: {
                        'parentMode': 'Summary',
                        'ContractNumber': this.contractNumber,
                        'PremiseNumber': premiseNumber,
                        'ProductCode': productCode,
                        'ContractNumberServiceVisitRowID': this.serviceVisitRowID
                    }
                });
                break;
            case this.columnIndex.Recommendation - 1:
                if (data.trRowData[data.cellIndex].text !== '' && data.trRowData[data.cellIndex].text !== undefined) {
                    this.router.navigate(['grid/application/service/recommendation'], {
                        queryParams: {
                            parentMode: 'Summary',
                            'ContractNumber': this.contractNumber,
                            'ContractName': this.contractName,
                            'PremiseNumber': this.premiseNumber,
                            'ProductCode': this.productCode,
                            'PremiseName': this.premiseName,
                            'ProductDesc': this.productDesc,
                            'currentContractType': this.inputParams.currentContractType,
                            'ServiceDateStart': data.trRowData[this.columnIndex.ServiceDateStart - 1].text
                        }
                    });
                }
                break;
            default:
                break;
        }
    };
    ServiceVisitSummaryComponent.prototype.treatmentPrint = function (rowId) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('Function', 'Single');
        this.search.set('countryCode', this.countryCode);
        this.search.set('PremiseVisitRowID', rowId);
        this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
            try {
                window.open(data.url, '_blank');
            }
            catch (error) {
                _this.errorService.emitError(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceVisitSummaryComponent.prototype.informationBox = function (data) {
        var _this = this;
        var msg = '';
        if (data.data.additionalData) {
            msg = data.data.additionalData;
        }
        else {
            msg = MessageConstant.Message.noSpecialInstructions;
        }
        this.getTranslatedValue(msg, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.showAlert(res);
                }
                else {
                    _this.showAlert(msg);
                }
            });
        });
    };
    ServiceVisitSummaryComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ServiceVisitSummaryComponent.prototype.refresh = function (event) {
        this.sortUpdate = true;
        this.pageCurrent = '1';
        this.historyGridPagination.setPage(1);
        this.historyGrid.clearGridData();
        this.updateView(this.inputParams);
    };
    ServiceVisitSummaryComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.loadData(this.inputParams);
    };
    ServiceVisitSummaryComponent.prototype.AddSearchTypeOption = function (value, textVal) {
        var optionObj = { 'text': textVal, value: value };
        this.searchTypeOptions.push(optionObj);
    };
    ServiceVisitSummaryComponent.prototype.buildSearchOption = function () {
        this.searchTypeOptions = [];
        if (!this.productCode) {
            this.searchType = 'PremiseVisitInd';
            this.pageTitle = this.strPremiseTitle;
            this.AddSearchTypeOption('PremiseVisitInd', 'Premises Visit');
        }
        else {
            this.searchType = 'DetailInd';
            this.pageTitle = this.strServiceTitle;
        }
        this.titleService.setTitle(this.contractLabel + this.pageTitle);
        this.AddSearchTypeOption('DetailInd', 'Service Covers Detail');
        this.AddSearchTypeOption('SummaryInd', 'Service Covers Summary');
        this.searchTypeChange(this.searchType);
    };
    ServiceVisitSummaryComponent.prototype.loadData = function (params) {
        this.setFilterValues(params);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.search;
        this.historyGrid.loadGridData(this.inputParams);
    };
    ServiceVisitSummaryComponent.prototype.getGridInfo = function (info) {
        this.historyGridPagination.totalItems = info.totalRows;
    };
    ServiceVisitSummaryComponent.prototype.getCurrentDate = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var _date = dd + '/' + mm + '/' + yyyy;
        return _date;
    };
    ServiceVisitSummaryComponent.prototype.setUI = function (params) {
        this.productCode = '';
        this.menuOptions = [{
                'text': 'Options',
                'value': ' '
            }, {
                'text': 'Add Service Visit',
                'value': 'AddVisit'
            }
        ];
        if (params.parentMode === 'DespatchGrid') {
            this.contractNumber = params.contractNumber;
            this.contractNumberChange(this.contractNumber);
            this.premiseNumber = params.premiseNumber;
            this.premiseNumberChange(this.premiseNumber);
        }
        else {
            this.contractNumber = params.contractNumber;
            this.contractNumberChange(this.contractNumber);
            this.premiseNumber = params.premiseNumber;
            this.premiseNumberChange(this.premiseNumber);
            this.wasteConsignmentNoteNumber = params.WasteConsignmentNoteNumber;
        }
        if (params.parentMode === 'ShowPremiseLevel') {
            this.serviceCoverRowID = params.ServiceCoverRowID;
            this.currDate = params.dateFrom;
            this.currDate2 = params.dateTo;
            this.searchType = 'PremiseVisitInd';
            this.searchTypeChange(this.searchType);
            this.menuDisplay = false;
        }
        else {
            this.contractNumber = params.contractNumber;
            this.contractNumberChange(this.contractNumber);
            this.premiseNumber = params.premiseNumber;
            this.premiseNumberChange(this.premiseNumber);
            this.wasteConsignmentNoteNumber = params.WasteConsignmentNoteNumber;
        }
        if (params.parentMode === 'Contract') {
            this.currDate2 = new Date();
            this.currDate = new Date(this.dt.getFullYear(), this.dt.getMonth() - 6, this.dt.getDate());
            this.menuDisplay = false;
        }
        else {
            this.currDate2 = new Date();
            this.currDate = new Date(this.dt.getFullYear() - 1, this.dt.getMonth(), this.dt.getDate());
        }
        if (this.inputParams.isNationalAccount === 'true') {
            this.currDate2 = new Date();
            this.currDate = new Date(this.dt.getFullYear(), this.dt.getMonth() - 3, this.dt.getDate());
        }
        if (params.parentMode === 'ServiceCover' || params.parentMode === 'ServiceVisitEntryGrid' || params.parentMode === 'UnreturnedConsignmentGrid') {
            this.productCode = params.productCode;
            this.productDesc = params.productDesc;
            this.serviceVisitFrequency = params.serviceVisitFrequency;
            this.serviceVisitAnnivDate = params.serviceVisitAnnivDate;
            if (params.parentMode === 'ServiceCover') {
                this.serviceCoverRowID = params.serviceCoverRowID;
            }
            else {
                this.serviceCoverRowID = params.serviceCoverRowID;
                this.populateDescriptions(this.productCode);
            }
            this.searchType = 'DetailInd';
            this.showFreqIndChecked = false;
            this.menuDisplay = true;
        }
        else if (params.parentMode === 'DespatchGrid') {
            this.serviceCoverRowID = params.serviceCoverRowID;
            this.productCode = params.productCode;
            this.populateDescriptions(this.productCode);
            this.searchType = 'DetailInd';
            this.showFreqIndChecked = false;
            this.menuDisplay = true;
        }
        if (params.parentMode === 'Entitlement') {
            this.dateTo = params.dateTo;
            this.dateFrom = params.dateFrom;
            this.populateDescriptions(this.productCode);
            this.searchType = 'DetailInd';
            this.showFreqIndChecked = false;
            this.menuDisplay = true;
        }
        if (params.parentMode === 'EntitlementVariance') {
            if (params.EntitlementMonth === 0) {
                this.currDate2 = new Date();
                this.currDate = new Date(this.dt.getFullYear(), 1, 1);
            }
            else {
                this.currDate2 = new Date();
                this.currDate = new Date(this.dt.getFullYear() - 1, params.EntitlementMonth + 1, 1);
            }
            this.serviceCoverRowID = params.ServiceCoverRowID;
            this.populateDescriptions(this.productCode);
            this.searchType = 'DetailInd';
            this.showFreqIndChecked = false;
            this.menuDisplay = true;
        }
        this.contractNumberEnabled = false;
        this.contractNameEnabled = false;
        this.premiseNameEnabled = false;
        this.productDescEnabled = false;
        this.serviceVisitAnnivDateEnabled = false;
        this.serviceVisitFrequencyEnabled = false;
        if (this.premiseNumber) {
            this.premiseNumberEnabled = false;
            this.premiseNumberHide = true;
        }
        if (this.productCode) {
            this.productCodeEnabled = false;
            this.productCodeHide = true;
        }
        if (this.premiseNumber) {
            this.cmdSubmitEnabled = true;
        }
        else {
            this.cmdSubmitEnabled = false;
        }
        if (this.inputParams.isNationalAccount === 'true') {
            this.el.nativeElement.querySelector('#premiseNumber').focus();
            this.premiseRequired = true;
        }
        this.dateFrom = this.currDate.getDate() + '/' + (this.currDate.getMonth() + 1) + '/' + this.currDate.getFullYear();
        this.dateTo = this.currDate2.getDate() + '/' + (this.currDate2.getMonth() + 1) + '/' + this.currDate2.getFullYear();
        this.buildSearchOption();
        this.setDisplayMax();
    };
    ServiceVisitSummaryComponent.prototype.populateDescriptions = function (productCode) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('countryCode', this.countryCode);
        if (this.contractNumber !== '')
            this.search.set('ContractNumber', this.contractNumber);
        if (this.premiseNumber !== '')
            this.search.set('PremiseNumber', this.premiseNumber);
        if (this.productCode !== '')
            this.search.set('ProductCode', this.productCode);
        if (this.serviceCoverRowID !== '')
            this.search.set('ServiceCoverRowID', this.serviceCoverRowID);
        this.search.set('Function', 'SetDisplayFields');
        this.ajaxSubscription = this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
            try {
                _this.contractNumber = data.ContractNumber;
                _this.contractName = data.ContractName;
                _this.premiseNumber = data.PremiseNumber;
                _this.premiseName = data.PremiseName;
                _this.productCode = data.ProductCode;
                _this.productDesc = data.ProductDesc;
                if (data.PremiseNumber !== '' && data.PremiseName === '') {
                    _this.premiseNumberChange(data.PremiseNumber);
                }
                if (data.ServiceVisitAnnivDate)
                    _this.serviceVisitAnnivDate = data.ServiceVisitAnnivDate;
                if (data.ServiceVisitFrequency)
                    _this.serviceVisitFrequency = data.ServiceVisitFrequency;
                if (_this.serviceVisitFrequency === '0') {
                    _this.serviceVisitFrequency = '';
                }
                if (data.ProductDesc) {
                    _this.el.nativeElement.querySelector('#productCode').classList.remove('ng-invalid');
                    _this.el.nativeElement.querySelector('#productCode').classList.add('ng-valid');
                }
                else if (_this.productCode !== '') {
                    _this.el.nativeElement.querySelector('#productCode').classList.remove('ng-valid');
                    _this.el.nativeElement.querySelector('#productCode').classList.remove('ng-touched');
                    _this.el.nativeElement.querySelector('#productCode').classList.add('ng-touched');
                    _this.el.nativeElement.querySelector('#productCode').classList.add('ng-invalid');
                }
            }
            catch (error) {
                _this.errorService.emitError(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceVisitSummaryComponent.prototype.setMaxColumn = function () {
        this.maxColumn = 0;
        this.columnIndex.ServiceDateStart = 0;
        this.columnIndex.VisitTypeCode = 0;
        this.columnIndex.ProductCode = 0;
        this.columnIndex.PrintTreatment = 0;
        this.columnIndex.Information = 0;
        this.columnIndex.VisitDetail = 0;
        this.columnIndex.Recommendation = 0;
        this.columnIndex.PremiseNumber = 0;
        this.columnIndex.ServiceVisitFrequency = 0;
        this.columnIndex.StandardDuration = 0;
        this.columnIndex.OvertimeDuration = 0;
        this.columnIndex.VisitReference = 0;
        this.columnIndex.Employee = 0;
        this.columnIndex.EmployeeSurname = 0;
        var premiseAdjustObj = {}, productAdjustObj = {}, visitTypeAdjustObj = {}, employeeAdjustObj = {}, employeeSurnameAdjustObj = {};
        this.headerProperties = [];
        if (this.premiseNumber === '') {
            this.maxColumn++;
            this.columnIndex.PremiseNumber++;
            this.columnIndex.ServiceDateStart++;
            this.columnIndex.VisitTypeCode++;
            this.columnIndex.ProductCode++;
            this.columnIndex.PrintTreatment++;
            this.columnIndex.Information++;
            this.columnIndex.VisitDetail++;
            this.columnIndex.Recommendation++;
            this.columnIndex.ServiceVisitFrequency++;
            this.columnIndex.VisitReference++;
            this.columnIndex.StandardDuration++;
            this.columnIndex.OvertimeDuration++;
            this.columnIndex.Employee++;
            this.columnIndex.EmployeeSurname++;
            premiseAdjustObj = {
                'align': 'center',
                'width': '100px',
                'index': this.columnIndex.PremiseNumber - 1
            };
        }
        if (this.searchType !== 'PremiseVisitInd') {
            if (this.productCode === '') {
                this.maxColumn += 3;
                this.columnIndex.ProductCode++;
                this.columnIndex.ServiceVisitFrequency += 3;
                this.columnIndex.ServiceDateStart += 3;
                this.columnIndex.VisitTypeCode += 3;
                this.columnIndex.PrintTreatment += 3;
                this.columnIndex.Information += 3;
                this.columnIndex.VisitDetail += 3;
                this.columnIndex.Recommendation += 3;
                this.columnIndex.VisitReference += 3;
                this.columnIndex.StandardDuration += 3;
                this.columnIndex.OvertimeDuration += 3;
                this.columnIndex.Employee += 3;
                this.columnIndex.EmployeeSurname += 3;
                productAdjustObj = {
                    'align': 'center',
                    'width': '100px',
                    'index': this.columnIndex.ProductCode - 1
                };
            }
            else if (this.showFreqIndChecked) {
                this.maxColumn++;
                this.columnIndex.ServiceVisitFrequency++;
                this.columnIndex.ServiceDateStart++;
                this.columnIndex.VisitTypeCode++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.VisitDetail++;
                this.columnIndex.Recommendation++;
                this.columnIndex.VisitReference++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
                this.columnIndex.Employee++;
                this.columnIndex.EmployeeSurname++;
            }
        }
        if (this.searchType === 'PremiseVisitInd' || this.searchType === 'DetailInd') {
            this.maxColumn++;
            this.columnIndex.VisitTypeCode++;
            this.columnIndex.PrintTreatment++;
            this.columnIndex.Information++;
            this.columnIndex.VisitDetail++;
            this.columnIndex.Recommendation++;
            this.columnIndex.ServiceDateStart++;
            this.columnIndex.VisitReference++;
            this.columnIndex.StandardDuration++;
            this.columnIndex.OvertimeDuration++;
            this.columnIndex.Employee++;
            this.columnIndex.EmployeeSurname++;
            if (this.searchType === 'DetailInd') {
                if (this.enableVisitDetail === 'True') {
                    this.maxColumn += 2;
                    this.columnIndex.VisitTypeCode++;
                    this.columnIndex.PrintTreatment += 2;
                    this.columnIndex.Information += 2;
                    this.columnIndex.VisitDetail += 1;
                    this.columnIndex.Recommendation += 2;
                    this.columnIndex.VisitReference++;
                    this.columnIndex.StandardDuration += 2;
                    this.columnIndex.OvertimeDuration += 2;
                    this.columnIndex.Employee += 2;
                    this.columnIndex.EmployeeSurname += 1;
                }
                if (this.enableVisitRef === 'True') {
                    this.maxColumn++;
                    this.columnIndex.VisitTypeCode++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.VisitDetail++;
                    this.columnIndex.VisitReference++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                    this.columnIndex.Employee++;
                    this.columnIndex.EmployeeSurname++;
                    this.columnIndex.Recommendation++;
                }
                this.maxColumn += 6;
                this.columnIndex.VisitTypeCode += 2;
                this.columnIndex.PrintTreatment += 6;
                this.columnIndex.Information += 6;
                this.columnIndex.VisitDetail += 6;
                this.columnIndex.StandardDuration += 5;
                this.columnIndex.OvertimeDuration += 5;
                this.columnIndex.EmployeeSurname += 4;
                this.columnIndex.Employee += 5;
                this.columnIndex.Recommendation += 6;
                visitTypeAdjustObj = {
                    'align': 'center',
                    'width': '100px',
                    'index': this.columnIndex.VisitTypeCode - 1
                };
                if (this.enableWED === 'True') {
                    this.maxColumn++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.VisitDetail++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                    this.columnIndex.Employee++;
                    this.columnIndex.EmployeeSurname++;
                    this.columnIndex.Recommendation++;
                }
                employeeSurnameAdjustObj = {
                    'align': 'center',
                    'width': '200px',
                    'index': this.columnIndex.EmployeeSurname - 1
                };
            }
            if (this.enableServCoverDispLevel === 'True') {
                if (this.searchType === 'DetailInd' && this.productCode !== '' && this.isDisplayLevelInd === true) {
                    this.maxColumn += 6;
                    this.columnIndex.PrintTreatment += 6;
                    this.columnIndex.Information += 6;
                    this.columnIndex.Recommendation += 6;
                    this.columnIndex.StandardDuration += 6;
                    this.columnIndex.OvertimeDuration += 6;
                    this.columnIndex.Employee += 6;
                }
            }
            if (this.searchType === 'PremiseVisitInd') {
                this.maxColumn += 2;
                this.columnIndex.PrintTreatment += 2;
                this.columnIndex.Information += 2;
                this.columnIndex.Recommendation += 2;
                this.columnIndex.VisitReference += 2;
                this.columnIndex.StandardDuration += 2;
                this.columnIndex.OvertimeDuration += 2;
                this.columnIndex.Employee++;
                employeeAdjustObj = {
                    'align': 'center',
                    'width': '200px',
                    'index': this.columnIndex.Employee - 1
                };
                if (this.enableVisitRef === 'True') {
                    this.maxColumn++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.Recommendation++;
                    this.columnIndex.VisitReference++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                }
                if (this.enableBarcodes === 'True') {
                    this.maxColumn++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.Recommendation++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                }
                if (this.enableNoServiceReasons === 'True') {
                    this.maxColumn++;
                    this.columnIndex.PrintTreatment++;
                    this.columnIndex.Information++;
                    this.columnIndex.Recommendation++;
                    this.columnIndex.StandardDuration++;
                    this.columnIndex.OvertimeDuration++;
                }
                this.maxColumn += 2;
                this.columnIndex.PrintTreatment += 2;
                this.columnIndex.Information += 2;
                this.columnIndex.Recommendation += 2;
                this.columnIndex.StandardDuration += 2;
                this.columnIndex.OvertimeDuration += 2;
            }
            if (this.enableInfestations === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
            }
            if (this.searchType === 'DetailInd' && this.enableServDocketNoVisitEntry === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
            }
            if (this.searchType !== 'DetailInd' && this.enableServCoverDispLevel === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
            }
            if (this.enablePreps === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
            }
            if (this.enablePreps === 'True' && this.enableVisitCostings === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
                this.columnIndex.StandardDuration++;
                this.columnIndex.OvertimeDuration++;
            }
            if (this.enableVisitDurations === 'True') {
                this.maxColumn += 2;
                this.columnIndex.PrintTreatment += 2;
                this.columnIndex.Information += 2;
                this.columnIndex.Recommendation += 2;
                this.columnIndex.StandardDuration += 1;
                this.columnIndex.OvertimeDuration += 2;
            }
            if (this.enableVisitCostings === 'True') {
                this.maxColumn += 2;
                this.columnIndex.PrintTreatment += 2;
                this.columnIndex.Information += 2;
                this.columnIndex.Recommendation += 2;
            }
            if (this.enableDrivingCharges === 'True' && this.searchType === 'PremiseVisitInd') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
            }
            if (this.enableWorkLoadIndex === 'True') {
                this.maxColumn++;
                this.columnIndex.PrintTreatment++;
                this.columnIndex.Information++;
                this.columnIndex.Recommendation++;
            }
            if (this.searchType === 'PremiseVisitInd') {
                this.maxColumn++;
                this.columnIndex.Information++;
                this.columnIndex.PrintTreatment++;
            }
        }
        else {
            this.maxColumn += 4;
            this.columnIndex.Information += 4;
        }
        if (this.searchType !== 'PremiseVisitInd') {
            this.maxColumn += 2;
            this.columnIndex.PrintTreatment = 0;
        }
        if (this.searchType === 'DetailInd' && this.enableServiceEntryUserCodeLog === 'True') {
            this.maxColumn += 2;
        }
        if (this.sortUpdate) {
            this.gridSortHeaders = [];
            if (this.premiseNumber === '') {
                var premiseNumberRow = {
                    'fieldName': 'PremiseNumber',
                    'index': this.columnIndex.PremiseNumber - 1,
                    'sortType': 'ASC'
                };
                this.gridSortHeaders.push(premiseNumberRow);
            }
            if (this.productCode === '' && this.searchType !== 'PremiseVisitInd') {
                var productCodeRow = {
                    'fieldName': 'ProductCode',
                    'index': this.columnIndex.ProductCode - 1,
                    'sortType': 'ASC'
                };
                this.gridSortHeaders.push(productCodeRow);
            }
            if (this.showFreqIndChecked && this.searchType !== 'PremiseVisitInd') {
                var ServiceVisitFrequencyRow = {
                    'fieldName': 'ServiceVisitFrequency',
                    'index': this.columnIndex.ServiceVisitFrequency - 1,
                    'sortType': 'ASC'
                };
                this.gridSortHeaders.push(ServiceVisitFrequencyRow);
            }
            if (this.searchType === 'DetailInd') {
                var ServiceDateStartRow = {
                    'fieldName': 'ServiceDateStart',
                    'index': this.columnIndex.ServiceDateStart - 1,
                    'sortType': 'ASC'
                };
                var VisitTypeCodeRow = {
                    'fieldName': 'VisitTypeCode',
                    'index': this.columnIndex.VisitTypeCode - 1,
                    'sortType': 'ASC'
                };
                this.gridSortHeaders.push(ServiceDateStartRow);
                this.gridSortHeaders.push(VisitTypeCodeRow);
                if (this.enableVisitRef === 'True') {
                    var VisitReferenceRow = {
                        'fieldName': 'VisitReference',
                        'index': this.columnIndex.VisitReference - 1,
                        'sortType': 'ASC'
                    };
                    this.gridSortHeaders.push(VisitReferenceRow);
                }
            }
            this.sortUpdate = false;
        }
        this.headerProperties.push(premiseAdjustObj);
        this.headerProperties.push(productAdjustObj);
        this.headerProperties.push(visitTypeAdjustObj);
        this.headerProperties.push(employeeAdjustObj);
        this.headerProperties.push(employeeSurnameAdjustObj);
        this.formatData.timeFormatIndex = { StandardDuration: this.columnIndex.StandardDuration - 1, OvertimeDuration: this.columnIndex.OvertimeDuration - 1 };
        this.validateProperties = [
            {
                'type': MntConst.eTypeCode,
                'index': this.columnIndex.ProductCode - 1
            }
        ];
    };
    ServiceVisitSummaryComponent.prototype.sortGrid = function (data) {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.updateView(this.inputParams);
    };
    ServiceVisitSummaryComponent.prototype.loadSystemCharacters = function () {
        var _this = this;
        var sysCharList = [
            this.systemCharacterConstant.SystemCharEnablePreps,
            this.systemCharacterConstant.SystemCharEnableInfestations,
            this.systemCharacterConstant.SystemCharEnableDrivingCharges,
            this.systemCharacterConstant.SystemCharEnableWorkLoadIndex,
            this.systemCharacterConstant.SystemCharEnableEntryOfVisitRefInVisitEntry,
            this.systemCharacterConstant.SystemCharEnableVisitDetail,
            this.systemCharacterConstant.SystemCharEnableServiceEntryUserCodeLog,
            this.systemCharacterConstant.SystemCharEnableWED,
            this.systemCharacterConstant.SystemCharEnableServiceCoverDisplayLevel,
            this.systemCharacterConstant.SystemCharEnableServiceDocketNumberVisitEnty,
            this.systemCharacterConstant.SystemCharEnableNoServiceReasons,
            this.systemCharacterConstant.SystemCharEnableBarcodes
        ];
        var sysNumbers = sysCharList.join(',');
        this.fetchSysChar(sysNumbers).subscribe(function (data) {
            if (data.records[0]) {
                if (data.records[0].Required) {
                    _this.enablePreps = 'True';
                }
            }
            if (data.records[1]) {
                if (data.records[1].Required) {
                    _this.enableInfestations = 'True';
                }
            }
            if (data.records[2]) {
                if (data.records[2].Required) {
                    _this.enableDrivingCharges = 'True';
                }
            }
            if (data.records[3]) {
                if (data.records[3].Required) {
                    _this.enableWorkLoadIndex = 'True';
                }
            }
            if (data.records[4]) {
                if (data.records[4].Required) {
                    _this.enableVisitRef = 'True';
                }
            }
            if (data.records[5]) {
                if (data.records[5].Required) {
                    _this.enableVisitDetail = 'True';
                }
            }
            if (data.records[6]) {
                if (data.records[6].Required) {
                    _this.enableServiceEntryUserCodeLog = 'True';
                }
            }
            if (data.records[7]) {
                if (data.records[7].Required) {
                    _this.enableWED = 'True';
                }
            }
            if (data.records[8]) {
                if (data.records[8].Required) {
                    _this.enableServCoverDispLevel = 'True';
                }
            }
            if (data.records[9]) {
                if (data.records[9].Required) {
                    _this.enableServDocketNoVisitEntry = 'True';
                }
            }
            if (data.records[10]) {
                if (data.records[10].Required) {
                    _this.enableNoServiceReasons = 'True';
                }
            }
            if (data.records[11]) {
                if (data.records[11].Required) {
                    _this.enableBarcodes = 'True';
                }
            }
            _this.sortUpdate = true;
            _this.searchTypeChange(_this.searchType);
            _this.setUI(_this.inputParams);
            _this.setMaxColumn();
            _this.historyGrid.clearGridData();
            _this.pageCurrent = '1';
            _this.historyGridPagination.setPage(1);
            _this.updateView(_this.inputParams);
        });
    };
    ServiceVisitSummaryComponent.prototype.setDisplayMax = function () {
        var _this = this;
        var querySearch = new URLSearchParams();
        querySearch.set(this.serviceConstants.Action, '0');
        querySearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        querySearch.set('Function', 'DisplayLevelProduct');
        querySearch.set('ProductCode', this.productCode);
        querySearch.set('countryCode', this.countryCode);
        this.ajaxSubscription = this._httpService.makeGetRequest(this.method, this.module, this.operation, querySearch).subscribe(function (data) {
            try {
                var vbDisplayLevelInd = '';
                vbDisplayLevelInd = data.DisplayLevelInd;
                if (vbDisplayLevelInd === 'yes' && _this.searchType === 'DetailInd') {
                    _this.isDisplayLevelInd = true;
                    _this.setMaxColumn();
                    _this.historyGrid.clearGridData();
                    _this.pageCurrent = '1';
                    _this.historyGridPagination.setPage(1);
                    _this.updateView(_this.inputParams);
                }
            }
            catch (error) {
                _this.errorService.emitError(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceVisitSummaryComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode);
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode);
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this._httpService.sysCharRequest(this.querySysChar);
    };
    ServiceVisitSummaryComponent.prototype.clientValidation = function () {
        var isValid = true;
        var dateFromArr = this.dateFrom.split('/');
        var dateToArr = this.dateTo.split('/');
        var dateFromObj = new Date(dateFromArr[2], dateFromArr[1] - 1, dateFromArr[0]);
        var dateToObj = new Date(dateToArr[2], dateToArr[1] - 1, dateToArr[0]);
        if (this.dateFrom === '' || this.dateTo === '') {
            isValid = false;
        }
        else if (dateFromObj.getTime() > dateToObj.getTime()) {
            isValid = false;
        }
        return isValid;
    };
    ServiceVisitSummaryComponent.prototype.generateReport = function () {
        if (this.clientValidation()) {
            if (this.blnInstantReport)
                this.instantReport();
            else
                this.batchReport();
        }
        else {
            this.showAlert(MessageConstant.Message.dateSelectionWarning);
        }
    };
    ServiceVisitSummaryComponent.prototype.instantReport = function () {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ContractNumber', this.contractNumber);
        this.search.set('PremiseNumber', this.premiseNumber);
        this.search.set('ProductCode', this.productCode);
        this.search.set('ServiceDateFrom', this.dateFrom);
        this.search.set('ServiceDateTo', this.dateTo);
        this.search.set('countryCode', this.countryCode);
        this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
            try {
                window.open(data.url, '_blank');
            }
            catch (error) {
                _this.errorService.emitError(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceVisitSummaryComponent.prototype.batchReport = function () {
    };
    ServiceVisitSummaryComponent.prototype.effectiveDateSelectedValue = function (value) {
        if (value && value.value) {
            this.dateFrom = value.value;
        }
        else {
            this.dateFrom = '';
        }
        this.pageCurrent = '1';
        this.historyGridPagination.setPage(1);
        this.historyGrid.clearGridData();
        this.updateView(this.inputParams);
    };
    ServiceVisitSummaryComponent.prototype.toDateSelectedValue = function (value) {
        if (value && value.value) {
            this.dateTo = value.value;
        }
        else {
            this.dateTo = '';
        }
        this.pageCurrent = '1';
        this.historyGridPagination.setPage(1);
        this.historyGrid.clearGridData();
        this.updateView(this.inputParams);
    };
    ServiceVisitSummaryComponent.prototype.showFreqIndGet = function (checkedVal) {
        this.showFreqIndChecked = (checkedVal === true) ? true : false;
    };
    ServiceVisitSummaryComponent.prototype.menuChanges = function (optionValue) {
        switch (optionValue) {
            case 'AddVisit':
                break;
            default:
                break;
        }
        this.menuType = '';
    };
    ServiceVisitSummaryComponent.prototype.setFilterValues = function (params) {
        this.search = new URLSearchParams();
        var premiseVisitInd = 'False';
        var detailInd = 'False';
        var showFreqInd = 'False';
        if (this.showFreqIndChecked)
            showFreqInd = 'True';
        if (this.searchType === 'PremiseVisitInd') {
            premiseVisitInd = 'True';
        }
        else if (this.searchType === 'DetailInd') {
            detailInd = 'True';
        }
        this.setMaxColumn();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('countryCode', this.countryCode);
        this.search.set('ContractNumber', this.contractNumber);
        this.search.set('PremiseNumber', this.premiseNumber);
        this.search.set('ProductCode', this.productCode);
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.pageCurrent);
        this.search.set('ServiceDateFrom', this.dateFrom);
        this.search.set('ServiceDateTo', this.dateTo);
        this.search.set('ShowFreqInd', showFreqInd);
        this.search.set('PremiseVisitInd', premiseVisitInd);
        this.search.set('DetailInd', detailInd);
        this.search.set('EnablePreps', this.enablePreps);
        this.search.set('EnableInfestations', this.enableInfestations);
        this.search.set('EnableVisitDurations', this.enableVisitDurations);
        this.search.set('EnableVisitCostings', this.enableVisitCostings);
        this.search.set('EnableDrivingCharges', this.enableDrivingCharges);
        this.search.set('EnableWorkLoadIndex', this.enableWorkLoadIndex);
        this.search.set('EnableVisitRef', this.enableVisitRef);
        this.search.set('EnableUserCode', this.enableServiceEntryUserCodeLog);
        this.search.set('EnableWED', this.enableWED);
        this.search.set('EnableServCoverDispLevel', this.enableServCoverDispLevel);
        this.search.set('EnableServDocketNoVisitEntry', this.enableServDocketNoVisitEntry);
        this.search.set('EnableBarcodes', this.enableBarcodes);
        this.search.set('EnableNoServiceReasons', this.enableNoServiceReasons);
        if (this.serviceCoverRowID)
            this.search.set('serviceCoverRowID', this.serviceCoverRowID);
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
    };
    ServiceVisitSummaryComponent.prototype.createRepDest = function () {
        this.repDestOptions = [
            { text: 'Report Viewer', value: 'direct' },
            { text: 'Email', value: 'Email' }
        ];
    };
    ServiceVisitSummaryComponent.prototype.showAlert = function (msgTxt) {
        this.messageModal.show({ msg: msgTxt, title: this.pageTitle }, false);
    };
    ServiceVisitSummaryComponent.prototype.ngOnInit = function () {
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.store.dispatch({
            type: ''
        });
        this.contractLabel = 'Contract';
        this.loadSystemCharacters();
        this.translateService.setUpTranslation();
        this.createRepDest();
        this.componentInteractionService.emitMessage(false);
        this.setButtonText();
        this.titleService.setTitle(this.contractLabel + this.pageTitle);
    };
    ServiceVisitSummaryComponent.prototype.ngAfterViewInit = function () {
        this.titleService.setTitle(this.contractLabel + this.pageTitle);
    };
    ServiceVisitSummaryComponent.prototype.ngOnDestroy = function () {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.subscription)
            this.subscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        delete this;
    };
    ServiceVisitSummaryComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    ServiceVisitSummaryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceVisitSummary.html'
                },] },
    ];
    ServiceVisitSummaryComponent.ctorParameters = [
        { type: Router, },
        { type: ComponentInteractionService, },
        { type: LocaleTranslationService, },
        { type: TranslateService, },
        { type: Store, },
        { type: Title, },
        { type: NgZone, },
        { type: ServiceConstants, },
        { type: Utils, },
        { type: HttpService, },
        { type: ElementRef, },
        { type: ErrorService, },
        { type: ActivatedRoute, },
        { type: SysCharConstants, },
        { type: Location, },
    ];
    ServiceVisitSummaryComponent.propDecorators = {
        'historyGrid': [{ type: ViewChild, args: ['historyGrid',] },],
        'historyGridPagination': [{ type: ViewChild, args: ['historyGridPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'productCodeSearchEllipsis': [{ type: ViewChild, args: ['productCodeSearchEllipsis',] },],
    };
    return ServiceVisitSummaryComponent;
}());
