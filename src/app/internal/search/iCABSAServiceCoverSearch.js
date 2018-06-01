var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PremiseSearchComponent } from './iCABSAPremiseSearch';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ContractSearchComponent } from './iCABSAContractSearch';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ServiceCoverSearchComponent = (function (_super) {
    __extends(ServiceCoverSearchComponent, _super);
    function ServiceCoverSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.showAddNew = false;
        this.pageId = '';
        this.muleConfig = {
            'method': 'contract-management/search',
            'module': 'service-cover',
            'operation': 'Application/iCABSAServiceCoverSearch',
            'action': '0'
        };
        this.search = new URLSearchParams();
        this.itemsPerPage = '10';
        this.page = '1';
        this.totalItem = '11';
        this.inputParams = {};
        this.columns = new Array();
        this.rowmetadata = new Array();
        this.optionsList = [];
        this.lineOfService = [];
        this.salesCoverModel = {
            'CopyContractNumber': '',
            'CopyPremiseNumber': '',
            'ContractNumber': '',
            'ContractName': '',
            'PremiseNumber': '',
            'PremiseName': '',
            'ProductCodeSCProductCode': '',
            'ParentProductCodeProductCode': '',
            'ParentProductDescProductDesc': '',
            'DispenserInd': '',
            'ConsumableInd': ''
        };
        this.ellipsisConfig = {
            premise: {
                disabled: false,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'ServiceCoverCopy',
                    'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'ContractNumber': '',
                    'ContractName': '',
                    'showAddNew': false
                },
                component: PremiseSearchComponent
            }
        };
        this.fieldVisibility = {
            'tdStatusSearch': true,
            'trContract': true,
            'trPremise': true,
            'trCopyContract': false,
            'trCopyPremise': false,
            'trProduct': true
        };
        this.contractSearchComponent = ContractSearchComponent;
        this.contractSearchParams = {
            'parentMode': 'ContractSearch',
            'currentContractType': '',
            'currentContractTypeURLParameter': '',
            'showAddNew': false
        };
        this.showHeader = true;
        this.showCloseButton = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.isContractEllipsisDisabled = false;
        this.labelContractNumber = '';
        this.tableTitle = '';
        this.displayMenu = false;
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: true },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'StatusSearchType', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: true },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'LOSCode', readonly: false, disabled: false, required: false },
            { name: 'CopyContractNumber', readonly: true, disabled: false, required: false },
            { name: 'CopyPremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: true },
            { name: 'ProductDesc', readonly: true, disabled: false, required: false },
            { name: 'menu', readonly: true, disabled: false, required: false, value: 'Options' },
            { name: 'DispenserInd', readonly: true, disabled: false, required: false },
            { name: 'ConsumableInd', readonly: true, disabled: false, required: false },
            { name: 'SCProductCode', readonly: true, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERSEARCH;
    }
    ServiceCoverSearchComponent.prototype.ngOnInit = function () {
        this.logger.warn('Service cover ngOnInit');
        _super.prototype.ngOnInit.call(this);
        this.populateUIFromFormData();
        try {
            this.localeTranslateService.setUpTranslation();
        }
        catch (e) {
            this.logger.warn('Service cover ngOnInit');
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'StatusSearchType', 'All');
        this.labelContractNumber = this.translatedText('Contract Number');
        this.tableTitle = this.translatedText('Service Cover Search');
        this.setCurrentContractType();
        this.getSysCharDtetails();
        this.buildStatusOptions();
        this.lineOfServiceLookupData();
    };
    ServiceCoverSearchComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    ServiceCoverSearchComponent.prototype.pageInit = function () {
        var _this = this;
        if (this.currentContractType === 'C') {
            this.fieldVisibility.tdStatusSearch = true;
        }
        else {
            this.fieldVisibility.tdStatusSearch = false;
        }
        this.setDefaultValues();
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')) {
            this.fieldVisibility.trProduct = false;
        }
        var strInpTitle;
        var strDocTitle;
        var strTabTitle;
        this.getTranslatedValue('^1^ Number', null).subscribe(function (res) {
            if (res) {
                strInpTitle = res;
                strInpTitle = (_this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strInpTitle.replace('^1^', '')
                    : strInpTitle.replace('^1^', _this.currentContractTypeLabel);
            }
            else {
                strInpTitle = '^1^ Number';
                strInpTitle = (_this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strInpTitle.replace('^1^', '')
                    : strInpTitle.replace('^1^', _this.currentContractTypeLabel);
            }
        });
        this.getTranslatedValue('^1^ Service Cover Search', null).subscribe(function (res) {
            if (res) {
                strDocTitle = res;
                strDocTitle = (_this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strDocTitle.replace('^1^', '')
                    : strDocTitle.replace('^1^', _this.currentContractTypeLabel);
            }
            else {
                strDocTitle = '^1^ Service Cover Search';
                strDocTitle = (_this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strDocTitle.replace('^1^', '')
                    : strDocTitle.replace('^1^', _this.currentContractTypeLabel);
            }
        });
        this.getTranslatedValue('^1^ Service Cover Details', null).subscribe(function (res) {
            if (res) {
                strTabTitle = res;
                strTabTitle = (_this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strTabTitle.replace('^1^', '')
                    : strTabTitle.replace('^1^', _this.currentContractTypeLabel);
            }
            else {
                strTabTitle = '^1^ Service Cover Details';
                strTabTitle = (_this.inputParams.parentMode === 'PortfolioGeneralMaintenance')
                    ? strTabTitle.replace('^1^', '')
                    : strTabTitle.replace('^1^', _this.currentContractTypeLabel);
            }
        });
        this.labelContractNumber = strInpTitle;
        this.tableTitle = strTabTitle;
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
    };
    ServiceCoverSearchComponent.prototype.right = function (str, length) {
        var lastvalue = str;
        if (str && str.length >= length) {
            lastvalue = str.substr(str.length - length);
        }
        return lastvalue;
    };
    ServiceCoverSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.columns = [];
        if (this.inputParams.ProductCode === '') {
            switch (this.inputParams.parentMode) {
                case 'LinkedSearch':
                case 'ParentLinkedSearch':
                case 'ChildLinkedSearch':
                    break;
                case 'Search':
                    this.getTranslatedValue('Product Code', null).subscribe(function (res) {
                        if (res) {
                            _this.columns.push({ title: res, name: 'ProductCode' });
                        }
                        else {
                            _this.columns.push({ title: 'Product Code', name: 'ProductCode' });
                        }
                    });
                    this.getTranslatedValue('Description', null).subscribe(function (res) {
                        if (res) {
                            _this.columns.push({ title: res, name: 'ProductDesc' });
                        }
                        else {
                            _this.columns.push({ title: 'Description', name: 'ProductDesc' });
                        }
                    });
                    break;
            }
        }
        else {
            this.getTranslatedValue('Product Code', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'ProductCode' });
                }
                else {
                    _this.columns.push({ title: 'Product Code', name: 'ProductCode' });
                }
            });
            this.getTranslatedValue('Description', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'ProductDesc' });
                }
                else {
                    _this.columns.push({ title: 'Description', name: 'ProductDesc' });
                }
            });
        }
        if ((this.inputParams.parentMode === 'CallCentreSearch') ||
            (this.inputParams.parentMode === 'ParentLinkedSearch') ||
            (this.inputParams.parentMode === 'ChildLinkedSearch') ||
            (this.inputParams.parentMode === 'LinkedSearch') ||
            (this.inputParams.parentMode === 'LookUpBasic-Ext')) {
            this.getTranslatedValue('Number', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'ServiceCoverNumber' });
                }
                else {
                    _this.columns.push({ title: 'Number', name: 'ServiceCoverNumber' });
                }
            });
        }
        if (this.inputParams.parentMode === 'LookUp-ContractHistory') {
            this.getTranslatedValue('Premise Number', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'PremiseNumber' });
                }
                else {
                    _this.columns.push({ title: 'Premise Number', name: 'PremiseNumber' });
                }
            });
        }
        this.getTranslatedValue('Visit Frequency', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ServiceVisitFrequency' });
            }
            else {
                _this.columns.push({ title: 'Visit Frequency', name: 'ServiceVisitFrequency' });
            }
        });
        this.getTranslatedValue('Status', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'PortfolioStatusDesc' });
            }
            else {
                _this.columns.push({ title: 'Status', name: 'PortfolioStatusDesc' });
            }
        });
        this.getTranslatedValue('Line of Service', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'LOSName' });
            }
            else {
                _this.columns.push({ title: 'Line of Service', name: 'LOSName' });
            }
        });
        this.loadTableData();
    };
    ServiceCoverSearchComponent.prototype.translatedText = function (key) {
        this.getTranslatedValue(key, null).subscribe(function (res) {
            if (res) {
                return res;
            }
            else {
                return key;
            }
        });
    };
    ServiceCoverSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ServiceCoverSearchComponent.prototype.setCurrentContractType = function () {
        this.currentContractType =
            this.utils.getCurrentContractType(this.inputParams['CurrentContractTypeURLParameter']);
        this.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.currentContractType);
    };
    ServiceCoverSearchComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel];
        var sysCharIP = {
            module: this.muleConfig.module,
            operation: this.muleConfig.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            if (record && record.length > 0) {
                _this.pageParams.vEnableServiceCoverDispLev = (record[0]['Required']) ? record[0]['Required'] : false;
            }
        });
    };
    ServiceCoverSearchComponent.prototype.buildStatusOptions = function () {
        this.optionsList = [
            { value: 'All', text: 'All' },
            { value: 'L', text: 'Current' },
            { value: 'FL', text: 'Forward Current' },
            { value: 'D', text: 'Deleted' },
            { value: 'FD', text: 'Forward Deleted' },
            { value: 'PT', text: 'Pending Deletion' },
            { value: 'T', text: 'Terminated' },
            { value: 'FT', text: 'Forward Terminated' },
            { value: 'PT', text: 'Pending Termination' },
            { value: 'C', text: 'Cancelled' }
        ];
    };
    ServiceCoverSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        returnObj = {
            row: event.row,
            ProductCode: event.row.ProductCode,
            ProductDesc: event.row.ProductDesc
        };
        switch (this.inputParams.parentMode) {
            case 'Premise':
                if (this.currentContractType === 'C' || this.currentContractType === 'J') {
                    this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
                }
                else {
                    alert('Open iCABSAProductSalesServiceCoverMaintenance');
                }
                break;
            case 'ServiceCoverCopy':
                this.getServiceCoverCopyData(event.row);
                break;
            default:
                this.ellipsis.sendDataToParent(returnObj);
                break;
        }
    };
    ServiceCoverSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    ServiceCoverSearchComponent.prototype.updateView = function (params) {
        this.logger.warn('- service cover -updateView-', params);
        this.inputParams = params || this.inputParams;
        this.setCurrentContractType();
        if (params) {
            this.pageInit();
        }
        if (this.inputParams && this.inputParams.showAddNew !== undefined) {
            this.showAddNew = params.showAddNew ? params.showAddNew : false;
        }
        else {
            this.showAddNew = false;
        }
        this.refresh();
    };
    ServiceCoverSearchComponent.prototype.loadTableData = function () {
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('SCProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SCProductCode'));
        this.search.set('LOSCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSCode'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        if (this.inputParams.parentMode === 'ServiceCoverCopy') {
            this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyContractNumber'));
            this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyPremiseNumber'));
        }
        this.search.set('ContractHistory', this.riExchange.riInputElement.GetValue(this.uiForm, 'ConsumableInd') ? 'True' : 'False');
        this.search.set('PortfolioStatusCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusSearchType'));
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('DisplayLevel', this.riExchange.riInputElement.GetValue(this.uiForm, 'DispenserInd') ? 'True' : 'False');
        this.search.set('CurrentContractType', this.currentContractType);
        this.search.set(this.serviceConstants.PageCurrent, this.page);
        this.inputParams.search = this.search;
        this.searchCovertable.loadTableData(this.inputParams);
    };
    ServiceCoverSearchComponent.prototype.setDefaultValues = function () {
        switch (this.inputParams.parentMode) {
            case 'ProductCode01':
            case 'ProductCode02':
            case 'ProductCode03':
            case 'ProductCode04':
            case 'ProductCode05':
            case 'ProductCode06':
            case 'ProductCode07':
            case 'ProductCode08':
            case 'ProductCode09':
            case 'ProductCode10':
            case 'ProductCode11':
            case 'ProductCode12':
            case 'ProductCode13':
            case 'ProductCode14':
                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams['ContractNumber' + this.right(this.inputParams.parentMode, 2)]);
                this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams['PremiseNumber' + this.right(this.inputParams.parentMode, 2)]);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                break;
            case 'ServiceCoverCopy':
                this.fieldVisibility.trContract = false;
                this.fieldVisibility.trPremise = false;
                this.fieldVisibility.trCopyContract = true;
                this.fieldVisibility.trCopyPremise = true;
                var obj = document.getElementById('CopyContractNumber');
                if (obj) {
                    obj.focus();
                }
                this.salesCoverModel.CopyContractNumber = this.getFieldValue(this.inputParams.CopyContractNumber);
                this.salesCoverModel.CopyPremiseNumber = this.getFieldValue(this.inputParams.CopyPremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyContractNumber', this.salesCoverModel.CopyContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyPremiseNumber', this.salesCoverModel.CopyPremiseNumber);
                break;
            case 'ParentLinkedSearch':
                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams.ContractNumber);
                this.salesCoverModel.ContractName = this.getFieldValue(this.inputParams.ContractName);
                this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams.PremiseNumber);
                this.salesCoverModel.PremiseName = this.getFieldValue(this.inputParams.PremiseName);
                this.salesCoverModel.ProductCode = this.getFieldValue(this.inputParams.SCProductCode);
                this.salesCoverModel.ParentProductCode = this.getFieldValue(this.inputParams.ProductCode);
                this.salesCoverModel.ParentProductDesc = this.getFieldValue(this.inputParams.ProductDesc);
                this.salesCoverModel.DispenserInd = this.getFieldValue(this.inputParams.DispenserInd);
                this.salesCoverModel.ConsumableInd = this.getFieldValue(this.inputParams.ConsumableInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.salesCoverModel.ContractName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.salesCoverModel.PremiseName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.salesCoverModel.ProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DispenserInd', this.salesCoverModel.DispenserInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ConsumableInd', this.salesCoverModel.ConsumableInd);
                break;
            case 'ChildLinkedSearch':
                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams.ContractNumber);
                this.salesCoverModel.ContractName = this.getFieldValue(this.inputParams.ContractName);
                this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams.PremiseNumber);
                this.salesCoverModel.PremiseName = this.getFieldValue(this.inputParams.PremiseName);
                this.salesCoverModel.ProductCode = this.getFieldValue(this.inputParams.SCProductCode);
                this.salesCoverModel.ChildProductCode = this.getFieldValue(this.inputParams.ProductCode);
                this.salesCoverModel.ChildProductDesc = this.getFieldValue(this.inputParams.ProductDesc);
                this.salesCoverModel.DispenserInd = this.getFieldValue(this.inputParams.DispenserInd);
                this.salesCoverModel.ConsumableInd = this.getFieldValue(this.inputParams.ConsumableInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.salesCoverModel.ContractName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.salesCoverModel.PremiseName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.salesCoverModel.ProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ChildProductCode', this.salesCoverModel.ChildProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ChildProductDesc', this.salesCoverModel.ChildProductDesc);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DispenserInd', this.salesCoverModel.DispenserInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ConsumableInd', this.salesCoverModel.ConsumableInd);
                break;
            case 'LinkedSearch':
                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams.ContractNumber);
                this.salesCoverModel.ContractName = this.getFieldValue(this.inputParams.ContractName);
                this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams.PremiseNumber);
                this.salesCoverModel.PremiseName = this.getFieldValue(this.inputParams.PremiseName);
                this.salesCoverModel.ProductCode = this.getFieldValue(this.inputParams.SCProductCode);
                this.salesCoverModel.LinkedProductCode = this.getFieldValue(this.inputParams.ProductCode);
                this.salesCoverModel.LinkedProductDesc = this.getFieldValue(this.inputParams.ProductDesc);
                this.salesCoverModel.DispenserInd = this.getFieldValue(this.inputParams.DispenserInd);
                this.salesCoverModel.ConsumableInd = this.getFieldValue(this.inputParams.ConsumableInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.salesCoverModel.ContractName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.salesCoverModel.PremiseName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.salesCoverModel.ProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DispenserInd', this.salesCoverModel.DispenserInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ConsumableInd', this.salesCoverModel.ConsumableInd);
                break;
            default:
                this.salesCoverModel.ContractNumber = this.getFieldValue(this.inputParams.ContractNumber);
                this.salesCoverModel.ContractName = this.getFieldValue(this.inputParams.ContractName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.salesCoverModel.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.salesCoverModel.ContractName);
                if (this.inputParams.parentMode === 'LookUp-ContractHistory') {
                    this.fieldVisibility.trPremise = false;
                }
                else {
                    this.salesCoverModel.PremiseNumber = this.getFieldValue(this.inputParams.PremiseNumber);
                    this.salesCoverModel.PremiseName = this.getFieldValue(this.inputParams.PremiseName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.salesCoverModel.PremiseNumber);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.salesCoverModel.PremiseName);
                    if ((this.inputParams.parentMode !== 'CallCentreSearch') && (this.inputParams.parentMode !== 'LookUp-PremiseHistory')
                        && (this.inputParams.parentMode !== 'LookUp-ServiceCoverProd') && (this.inputParams.parentMode !== 'ParentLinkedSearch')
                        && (this.inputParams.parentMode !== 'ChildLinkedSearch')) {
                        this.salesCoverModel.ProductCode = this.getFieldValue(this.inputParams.ProductCode);
                        this.salesCoverModel.ProductDesc = this.getFieldValue(this.inputParams.ProductDesc);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.salesCoverModel.ProductCode);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.salesCoverModel.ProductDesc);
                    }
                }
        }
    };
    ServiceCoverSearchComponent.prototype.lineOfServiceLookupData = function () {
        var _this = this;
        this.lineOfService = [];
        var lookupIP = [
            {
                'table': 'LineOfService',
                'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
                'fields': ['LOSCode', 'LOSName']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data && data[0]) {
                var _loop_1 = function(i) {
                    if (data[0][i].LOSName && data[0][i].LOSName) {
                        _this.zone.run(function () {
                            _this.lineOfService.push({ 'LOSCode': data[0][i].LOSCode, 'LOSName': data[0][i].LOSName });
                        });
                    }
                };
                for (var i = 0; i < data[0].length; i++) {
                    _loop_1(i);
                }
            }
        });
    };
    ServiceCoverSearchComponent.prototype.refresh = function () {
        this.searchCovertable.clearTable();
        this.search.set(this.serviceConstants.Action, '0');
        this.buildTableColumns();
    };
    ServiceCoverSearchComponent.prototype.getFieldValue = function (value) {
        return (value) ? value : '';
    };
    ServiceCoverSearchComponent.prototype.onChangeOption = function (value) {
        if (value === 'AddRecord') {
            if (this.currentContractType === 'C' || this.currentContractType === 'J') {
                this.navigate('SearchAdd', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
            }
            else {
                alert('Open iCABSAProductSalesServiceCoverMaintenance');
            }
        }
    };
    ServiceCoverSearchComponent.prototype.add = function () {
        this.ellipsis.sendDataToParent({
            parentMode: 'SearchAdd'
        });
    };
    ServiceCoverSearchComponent.prototype.onContractDataReceived = function (data, route, mode) {
        if (data && data.ContractNumber) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyContractNumber', data.ContractNumber);
        }
    };
    ServiceCoverSearchComponent.prototype.modalHidden = function () {
    };
    ServiceCoverSearchComponent.prototype.onPremiseDataReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CopyPremiseNumber', data.PremiseNumber);
        }
    };
    ServiceCoverSearchComponent.prototype.getServiceCoverCopyData = function (event) {
        var _this = this;
        var returnObj;
        var postdata = {};
        var query = new URLSearchParams();
        query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        query.set(this.serviceConstants.Action, '0');
        query.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyContractNumber'));
        query.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CopyPremiseNumber'));
        query.set('ServiceCoverRowID', event.ttServiceCover);
        query.set('FunctionName', 'ServiceCoverCopy');
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.errorMessage) {
                    _this.errorService.emitError(e.errorMessage);
                }
                else {
                    returnObj = {
                        row: event.row,
                        ServiceCoverCopy: e
                    };
                    _this.ellipsis.sendDataToParent(returnObj);
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverSearch.html'
                },] },
    ];
    ServiceCoverSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    ServiceCoverSearchComponent.propDecorators = {
        'searchCovertable': [{ type: ViewChild, args: ['searchCovertable',] },],
        'showAddNew': [{ type: Input },],
    };
    return ServiceCoverSearchComponent;
}(BaseComponent));
