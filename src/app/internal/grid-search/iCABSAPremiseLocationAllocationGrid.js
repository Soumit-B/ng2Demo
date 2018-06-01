var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
export var PremiseLocationAllocationGridComponent = (function (_super) {
    __extends(PremiseLocationAllocationGridComponent, _super);
    function PremiseLocationAllocationGridComponent(injector) {
        _super.call(this, injector);
        this.gridOptions = [{}];
        this.gridOptionsDisabled = false;
        this.menuOptions = [{}];
        this.menuOptionsDisabled = false;
        this.querySysChar = new URLSearchParams();
        this.pageId = '';
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 0;
        this.search = new URLSearchParams();
        this.autoOpen = '';
        this.autoOpenSearch = false;
        this.riGrid = {};
        this.showHeader = true;
        this.currDate = new Date();
        this.currentContractType = '';
        this.validateProperties = [];
        this.hiddenMode = {
            'labelIncludeInactive': true,
            'productDetails': false,
            'grdContractInformation1': false,
            'menu': false,
            'gridOption': false,
            'atDate': false
        };
        this.legend = [
            { label: 'Empty Locations', color: '#CCFFCC' },
            { label: 'Unallocated', color: '#FFCCCC' },
            { label: 'In Hold', color: '#FFFFCC' },
            { label: 'Located', color: '#E8F4F6' }
        ];
        this.riExchangeMode = '';
        this.queryParams = {
            operation: 'Application/iCABSAPremiseLocationAllocationGrid',
            module: 'locations',
            method: 'service-delivery/maintenance'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: false, value: '' },
            { name: 'ContractName', readonly: false, disabled: false, required: false, value: '' },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: true, value: '' },
            { name: 'PremiseName', readonly: false, disabled: false, required: false, value: '' },
            { name: 'ProductCode', readonly: false, disabled: false, required: false, value: '' },
            { name: 'ProductDesc', readonly: false, disabled: false, required: false, value: '' },
            { name: 'AtDate', readonly: false, disabled: false, required: false, value: '' },
            { name: 'GridOption', readonly: false, disabled: false, required: false, value: '' },
            { name: 'IncludeInactive', readonly: false, disabled: false, required: false, value: '' },
            { name: 'menu', readonly: false, disabled: false, required: false, value: '' },
            { name: 'PremiseLocationNumber', readonly: false, disabled: false, required: false, value: '' },
            { name: 'PremiseLocationDesc', readonly: false, disabled: false, required: false, value: '' },
            { name: 'TransferQuantity', readonly: false, disabled: false, required: false, value: '' }
        ];
        this.pageId = PageIdentifier.ICABSAPREMISELOCATIONALLOCATIONGRID;
    }
    PremiseLocationAllocationGridComponent.prototype.loadSystemCharacters = function () {
        var _this = this;
        var sysNumbers = this.sysCharConstants.SystemCharEnableLocations;
        this.lookUpSubscription = this.fetchSysChar(sysNumbers).subscribe(function (data) {
            try {
                if (data.records[0]) {
                    _this.pageParams.vSCEnableDetailLocations = data.records[0].Logical;
                    _this.pageParams.vBlank = data.records[0].Logical;
                }
                _this.setUI();
            }
            catch (e) {
                _this.logger.warn('System variable response error' + e);
            }
        });
    };
    PremiseLocationAllocationGridComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    PremiseLocationAllocationGridComponent.prototype.atDateSelectedValue = function (event) {
        this.uiForm.controls['AtDate'].setValue(event.value);
        this.currentPage = 1;
        this.buildGrid();
    };
    PremiseLocationAllocationGridComponent.prototype.initData = function () {
        this.pageParams.parentMode = this.riExchange.getParentMode();
        this.pageParams.labelatDate = 'As At Date';
        this.pageParams.titles = {
            'Title1': 'Premises Allocation',
            'Title2': 'Location Search',
            'Title3': 'System Allocation',
            'TableTitle1': 'Premises Details'
        };
        this.createGridOptions();
        this.createMenuOptions();
        this.loadSystemCharacters();
    };
    PremiseLocationAllocationGridComponent.prototype.setUI = function () {
        this.pageParams.CurrentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.CurrentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        if (this.pageParams.parentMode === 'Verification' || this.pageParams.parentMode === 'NewLocationGrid' || this.pageParams.parentMode === 'Premise-Allocate') {
            this.pageParams.tempSource = 'Premise-Allocate';
        }
        else {
            this.pageParams.tempSource = this.pageParams.parentMode;
        }
        switch (this.pageParams.parentMode) {
            case 'Verification':
                this.attributes.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
                break;
            case 'Move-From':
            case 'Move-To':
                this.attributes.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ContractNumberServiceCoverRowID');
                break;
            case 'ServiceCover-Increase':
                this.attributes.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ContractNumberServiceCoverRowID');
                this.attributes.ServiceCoverQuantityChange = this.riExchange.getParentAttributeValue('ContractNumberQuantityChange');
                this.attributes['ContractNumberAmendedServiceCoverRowID'] = this.attributes.ServiceCoverRowID;
                this.attributes['ContractNumberServiceCoverQuantityChange'] = this.attributes.ServiceCoverQuantityChange;
                break;
            case 'NewLocationGrid':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentAttributeValue('ContractNumber'));
                this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentAttributeValue('ContractName'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentAttributeValue('PremiseNumber'));
                this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentAttributeValue('PremiseName'));
                break;
            default:
                break;
        }
        if (this.pageParams.tempSource === 'Premise-Allocate' || this.pageParams.tempSource === 'ServiceCover-Increase') {
            this.hiddenMode.labelIncludeInactive = false;
        }
        switch (this.pageParams.parentMode) {
            case 'Verification':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.pageParams.titleSuffix = this.pageParams.CurrentContractTypeLabel;
                this.pageTitle = this.pageParams.titles['TableTitle1'];
                this.hiddenMode.productDetails = true;
                this.setNamesFromId(this.uiForm.controls['ContractNumber'].value, this.uiForm.controls['PremiseNumber'].value);
                break;
            case 'Premise-Allocate':
            case 'ServiceCover-Increase':
            case 'Premise-Add':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
                this.pageTitle = this.pageParams.CurrentContractTypeLabel + ' ' + this.pageParams.titles['Title1'];
                if (this.pageParams.parentMode === 'ServiceCover-Increase') {
                    this.hiddenMode.productDetails = true;
                }
                else {
                    this.hiddenMode.productDetails = false;
                    this.uiForm.controls['ProductDesc'].disable();
                }
                this.hiddenMode.labelIncludeInactive = false;
                break;
            case 'Product-Allocate':
            case 'Move-From':
            case 'Move-To':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
                this.uiForm.controls['ProductCode'].setValue(this.riExchange.getParentHTMLValue('ProductCode'));
                this.uiForm.controls['ProductDesc'].setValue(this.riExchange.getParentHTMLValue('ProductDesc'));
                this.pageTitle = this.pageParams.CurrentContractTypeLabel + ' ' + this.pageParams.titles['Title2'];
                this.uiForm.controls['ProductCode'].disable();
                this.uiForm.controls['ProductDesc'].disable();
                this.hiddenMode.productDetails = false;
                break;
            case 'ServiceCoverDetailsAllocate':
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
                this.uiForm.controls['ProductCode'].setValue(this.riExchange.getParentHTMLValue('ProductCode'));
                this.uiForm.controls['ProductDesc'].setValue(this.riExchange.getParentHTMLValue('ProductDesc'));
                this.uiForm.controls['ProductCode'].disable();
                this.uiForm.controls['ProductDesc'].disable();
                break;
            default:
                this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
                this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
                this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
                this.uiForm.controls['ProductCode'].setValue(this.riExchange.getParentHTMLValue('ProductCode'));
                this.uiForm.controls['ProductDesc'].setValue(this.riExchange.getParentHTMLValue('ProductDesc'));
                this.setNamesFromId(this.uiForm.controls['ContractNumber'].value, this.uiForm.controls['PremiseNumber'].value);
                this.productCodeOnChange(this.uiForm.controls['ProductCode'].value);
                break;
        }
        if (this.pageParams.parentMode === 'Move-From' || this.pageParams.parentMode === 'Move-To' || this.pageParams.parentMode === 'LookUp') {
            this.hiddenMode.atDate = true;
            this.hiddenMode.gridOption = true;
            this.hiddenMode.menu = true;
        }
        this.uiForm.controls['ContractNumber'].disable();
        this.uiForm.controls['ContractName'].disable();
        this.uiForm.controls['PremiseNumber'].disable();
        this.uiForm.controls['PremiseName'].disable();
        if (this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDate')) {
            this.attributes['ContractNumberDefaultEffectiveDate'] = this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDate');
            this.attributes['ContractNumberDefaultEffectiveDateProduct'] = this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDate');
        }
        if (this.pageParams.vSCEnableDetailLocations) {
            this.hiddenMode.gridOption = true;
            this.hiddenMode.atDate = true;
        }
        this.buildGrid();
    };
    PremiseLocationAllocationGridComponent.prototype.setNamesFromId = function (contractNumber, premiseNumber) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ContractNumber', contractNumber);
        this.search.set('PremiseNumber', premiseNumber);
        this.search.set('Function', 'GetNames');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(function (data) {
            try {
                _this.uiForm.controls['ContractName'].setValue(data.ContractName);
                _this.uiForm.controls['PremiseName'].setValue(data.PremiseName);
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    PremiseLocationAllocationGridComponent.prototype.createGridOptions = function () {
        this.gridOptions = [
            { text: 'Summary', value: 'Summary' },
            { text: 'Detail', value: 'Detail' }
        ];
    };
    PremiseLocationAllocationGridComponent.prototype.menuOptionsChange = function (event) {
        this.uiForm.controls['menu'].setValue(event);
        switch (event) {
            case 'AddLocation':
                this.addLocationClick();
                break;
            case 'Move':
                this.moveLocationClick();
                break;
            case 'Empty':
                this.emptyLocationClick();
                break;
            default:
                break;
        }
    };
    PremiseLocationAllocationGridComponent.prototype.addLocationClick = function () {
        if (this.pageParams.parentMode === 'Premise-Allocate' || this.pageParams.parentMode === 'Verification'
            || this.pageParams.parentMode === 'ServiceCover-Increase') {
            this.riExchangeMode = 'PremiseAllocateAdd';
        }
        else {
            this.riExchangeMode = 'ProductAllocateAdd';
        }
        this.navigate(this.riExchangeMode, 'maintenance/premiseLocationMaintenance', {
            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
            'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeUrlParam()
        });
        if (this.pageParams.parentMode === 'Product-Allocate') {
            this.onGridRowDblClick(null);
        }
    };
    PremiseLocationAllocationGridComponent.prototype.moveLocationClick = function () {
        if (this.pageParams.parentMode !== 'Product-Allocate' || this.pageParams.parentMode !== 'Move-From'
            || this.pageParams.parentMode !== 'Move-To') {
            this.riExchangeMode = this.pageParams.parentMode;
            this.navigate(this.riExchangeMode, 'maintenance/ServiceCoverLocationMoveMaintenance', {
                ContractNumber: this.riExchange.getParentAttributeValue('ContractNumber'),
                ContractName: this.riExchange.getParentAttributeValue('ContractName'),
                PremiseNumber: this.riExchange.getParentAttributeValue('PremiseNumber'),
                PremiseName: this.riExchange.getParentAttributeValue('PremiseName'),
                ProductCode: this.riExchange.getParentAttributeValue('ProductCode'),
                ProductDesc: this.riExchange.getParentAttributeValue('ProductDesc'),
                currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
            });
        }
    };
    PremiseLocationAllocationGridComponent.prototype.emptyLocationClick = function () {
        this.riExchangeMode = this.pageParams.parentMode;
        this.navigate(this.riExchangeMode, 'grid/application/EmptyPremiseLocationSearchGrid');
    };
    PremiseLocationAllocationGridComponent.prototype.createMenuOptions = function () {
        this.menuOptions = [
            { text: 'Options', value: 'Options' },
            { text: 'Add Location', value: 'AddLocation' },
            { text: 'Transfer', value: 'Move' },
            { text: 'Maintain Locations', value: 'Empty' }
        ];
    };
    PremiseLocationAllocationGridComponent.prototype.gridOptionsChange = function (event) {
        this.uiForm.controls['GridOption'].setValue(event);
        switch (event) {
            case 'Summary':
                this.pageParams.labelatDate = 'As At Date';
                break;
            case 'Detail':
                this.pageParams.labelatDate = 'Include From Date';
                break;
            default:
                break;
        }
        this.currentPage = 1;
        this.buildGrid();
    };
    PremiseLocationAllocationGridComponent.prototype.setIncludeInactive = function (checkedVal) {
        this.uiForm.controls['IncludeInactive'].setValue(checkedVal);
        this.currentPage = 1;
        this.buildGrid();
    };
    PremiseLocationAllocationGridComponent.prototype.productCodeOnChange = function (pcode) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('Function', 'GetPremiseDetails');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(function (data) {
            try {
                _this.uiForm.controls['ProductDesc'].setValue(data.ProductDesc);
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    PremiseLocationAllocationGridComponent.prototype.buildGrid = function () {
        this.setMaxColumn();
        var includeInactive = 'False';
        if (this.uiForm.controls['IncludeInactive'].value === true) {
            includeInactive = 'True';
        }
        if (this.uiForm.controls['ContractNumber'].value !== '' && this.uiForm.controls['PremiseNumber'].value !== '') {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
            this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
            this.search.set('ContractTypeCode', this.pageParams.CurrentContractType);
            this.search.set('AtDate', this.uiForm.controls['AtDate'].value);
            this.search.set('GridOption', this.uiForm.controls['GridOption'].value);
            this.search.set('Source', this.pageParams.tempSource);
            this.search.set('IncludeInactive', includeInactive);
            this.search.set('ServiceCoverRowID', this.attributes.ServiceCoverRowID);
            this.search.set('PremiseLocationRowID', this.pageParams.PremiseLocationRowID);
            this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
            this.queryParams.search = this.search;
            this.premiseAllocationGrid.loadGridData(this.queryParams);
        }
    };
    PremiseLocationAllocationGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    PremiseLocationAllocationGridComponent.prototype.getGridInfo = function (info) {
        this.premiseAllocationGridPagination.totalItems = info.totalRows;
    };
    PremiseLocationAllocationGridComponent.prototype.setMaxColumn = function () {
        this.maxColumn = 0;
        if (this.uiForm.controls['GridOption'].value === 'Detail') {
            this.maxColumn += 3;
        }
        this.maxColumn += 4;
        if (this.pageParams.vSCEnableDetailLocations === false) {
            this.maxColumn += 2;
            if (this.pageParams.CurrentContractType !== 'p') {
                this.maxColumn++;
            }
            if (this.pageParams.parentMode !== 'Product-Allocate' && this.pageParams.parentMode !== 'Move-From'
                && this.pageParams.parentMode !== 'Move-To') {
                this.maxColumn++;
            }
        }
        if (this.pageParams.parentMode !== 'Product-Allocate' && this.pageParams.parentMode !== 'Move-From'
            && this.pageParams.parentMode !== 'Move-To') {
            this.maxColumn++;
            this.validateProperties = [
                {
                    'type': MntConst.eTypeImage,
                    'index': this.maxColumn - 1,
                    'align': 'center'
                }
            ];
            if (this.uiForm.controls['GridOption'].value === 'Summary' && this.pageParams.vSCEnableDetailLocations === false) {
                this.maxColumn++;
            }
        }
        if (this.pageParams.parentMode !== 'Product-Allocate' && this.pageParams.parentMode !== 'Move-From'
            && this.pageParams.parentMode !== 'Move-To' && this.uiForm.controls['IncludeInactive'].value === true) {
            this.maxColumn++;
        }
    };
    PremiseLocationAllocationGridComponent.prototype.onGridRowClick = function (event) {
        if (this.pageParams.vSCEnableDetailLocations === false) {
            this.attributes['ContractNumberServiceVisitFrequency'] = event.rowData['Service Visit Frequency'];
            this.attributes['ContractNumberProductCode'] = event.rowData['Product Code'];
            this.attributes['ContractNumberProductDesc'] = event.rowData['Product Description'];
        }
        else {
            this.attributes['ContractNumberRecordType'] = event.cellData['additionalData'];
            this.attributes['ContractNumberPremiseLocationNumber'] = event.rowData['Premises Location'];
            this.attributes['ContractNumberPremiseLocationDesc'] = event.rowData['Description'];
        }
        var tempProductCode = '', tempPremiseLocation = '', tempPremiseLocationDesc = '', tempServiceVisitFrequency = '', vRowIDServiceCover = '', vROWIDPremiseLocation = '', AdditionalInfo, tempProductDesc = '';
        AdditionalInfo = event.trRowData[2].additionalData.split('|');
        vRowIDServiceCover = AdditionalInfo[0];
        vROWIDPremiseLocation = AdditionalInfo[1];
        this.pageParams.PremiseLocationRowID = vROWIDPremiseLocation;
        if (this.uiForm.controls['GridOption'].value === 'Summary') {
            this.attributes['ContractNumberServiceCoverRowID'] = event.trRowData[0].additionalData;
            this.attributes['ContractNumberServiceCoverLocationRowID'] = event.trRowData[0].additionalData;
        }
        switch (this.riExchange.getParentAttributeValue('ContractNumberRecordType')) {
            case 'PremiseLocation':
                if (this.uiForm.controls['Gridoption'].value === 'Summary') {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                }
                else {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[1]['rowID'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                }
                break;
            case 'ServiceCover':
                if (this.uiForm.controls['Gridoption'].value === 'Summary') {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempProductCode = event.rowData['Product Code'];
                    tempPremiseLocationDesc = event.rowData['Product Description'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                    tempServiceVisitFrequency = event.rowData['Service Visit Frequency'];
                }
                else {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempProductCode = event.rowData['Product Code'];
                    tempPremiseLocationDesc = event.rowData['Product Description'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                    tempServiceVisitFrequency = event.rowData['Service Visit Frequency'];
                }
                break;
            case 'ServiceCoverLocation':
                if (this.uiForm.controls['Gridoption'].value === 'Summary') {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempProductCode = event.rowData['Product Code'];
                    tempPremiseLocationDesc = event.rowData['Product Description'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                    tempServiceVisitFrequency = event.rowData['Service Visit Frequency'];
                }
                else {
                    this.attributes['ContractNumberPremiseLocationRowID'] = event.trRowData[0]['rowID'];
                    tempProductCode = event.rowData['Product Code'];
                    tempPremiseLocationDesc = event.rowData['Product Description'];
                    tempPremiseLocation = event.rowData['Premises Location'];
                    tempPremiseLocationDesc = event.rowData['Description'];
                    tempServiceVisitFrequency = event.rowData['Service Visit Frequency'];
                }
                break;
            default:
                break;
        }
        if (tempServiceVisitFrequency !== '') {
            this.attributes('ContractNumberServiceVisitFrequency', tempServiceVisitFrequency);
        }
        if (tempProductCode !== '') {
            this.attributes['ContractNumberProductCode'] = tempProductCode;
            this.attributes['ContractNumberProductDesc'] = tempProductDesc;
        }
        else if (this.pageParams.parentMode === 'Product-Allocate' || this.pageParams.parentMode !== 'Move-From' || this.pageParams.parentMode !== 'Move-To') {
            this.attributes['ContractNumberPremiseLocationNumber'] = tempPremiseLocation;
            this.attributes['ContractNumberPremiseLocationDesc'] = tempPremiseLocationDesc;
        }
    };
    PremiseLocationAllocationGridComponent.prototype.onGridRowDblClick = function (event) {
        var vbRowIDString, returnObj = {};
        switch (this.pageParams.parentMode) {
            case 'Product-Allocate':
            case 'Move-From':
                this.riExchange.setParentHTMLValue('PremiseLocationNumber', this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationNumber'));
                this.riExchange.setParentHTMLValue('PremiseLocationDesc', this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationDesc'));
                this.riExchange.setParentHTMLValue('TransferQuantity', this.riExchange.getParentAttributeValue('ContractNumberQuantityAtLocation'));
                returnObj['PremiseLocationNumber'] = event.trRowData[0].text;
                returnObj['PremiseLocationDesc'] = event.trRowData[2].text;
                returnObj['TransferQuantity'] = event.trRowData[1].text;
                this.emitSelectedData(returnObj);
                break;
            case 'Move-To':
                this.riExchange.setParentHTMLValue('PremiseLocationNumberTo', this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationNumber'));
                this.riExchange.setParentHTMLValue('PremiseLocationDescTo', this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationDesc'));
                returnObj['PremiseLocationNumber'] = event.trRowData[0].text;
                returnObj['PremiseLocationDesc'] = event.trRowData[2].text;
                this.emitSelectedData(returnObj);
                break;
            default:
                if (event.cellIndex === 0) {
                    this.riExchangeMode = this.pageParams.tempSource;
                    if (this.pageParams.vSCEnableDetailLocations) {
                        this.messageModal.show({ msg: 'iCABSAServiceCoverLocationDetailGrid is not yet developed', title: this.pageTitle }, false);
                    }
                    else {
                        if ((!this.attributes.ServiceCoverRowID || this.attributes.ServiceCoverRowID === '') && event.trRowData[2].additionalData !== '') {
                            vbRowIDString = event.trRowData[2].additionalData.split('|');
                            this.attributes.ServiceCoverRowID = vbRowIDString[0];
                        }
                        this.attributes['ServiceCoverRowID'] = this.attributes.ServiceCoverRowID;
                        this.attributes['ServiceCoverLocationRowID'] = event.trRowData[4].additionalData;
                        this.navigate(this.riExchangeMode, 'maintenance/servicecoverlocationmaintenance', { ServiceCoverRowID: this.attributes.ServiceCoverRowID, ServiceCoverLocationRowID: this.attributes['ServiceCoverLocationRowID'] });
                    }
                }
                break;
        }
    };
    PremiseLocationAllocationGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.riExchange.getBackRoute();
        this.getUnallocated();
    };
    PremiseLocationAllocationGridComponent.prototype.getUnallocated = function () {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('CheckType', 'Premise');
        this.search.set('DefaultEffectiveDate', this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDate'));
        this.search.set('DefaultEffectiveDateProduct', this.riExchange.getParentAttributeValue('ContractNumberDefaultEffectiveDateProduct'));
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(function (data) {
            try {
                if (data.errorMessage)
                    _this.messageModal.show({ msg: data.errorMessage, title: _this.pageTitle }, false);
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    PremiseLocationAllocationGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageParams.titleSuffix = 'Contract';
        this.pageTitle = 'Premises Details';
        this.initData();
    };
    PremiseLocationAllocationGridComponent.prototype.ngOnDestroy = function () {
        this.lookUpSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        _super.prototype.ngOnDestroy.call(this);
    };
    PremiseLocationAllocationGridComponent.prototype.updateView = function (params) {
        this.pageParams.parentMode = params.parentMode;
        if (params.ContractNumber)
            this.setControlValue('ContractNumber', params.ContractNumber);
        if (params.ContractName)
            this.setControlValue('ContractName', params.ContractName);
        if (params.PremiseNumber)
            this.setControlValue('PremiseNumber', params.PremiseNumber);
        if (params.PremiseName)
            this.setControlValue('PremiseName', params.PremiseName);
        if (params.ProductCode)
            this.setControlValue('ProductCode', params.ProductCode);
        if (params.ProductDesc)
            this.setControlValue('ProductDesc', params.ProductDesc);
        if (params.ServiceCoverRowID)
            this.attributes.ServiceCoverRowID = params.ServiceCoverRowID;
    };
    PremiseLocationAllocationGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPremiseLocationAllocationGrid.html'
                },] },
    ];
    PremiseLocationAllocationGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    PremiseLocationAllocationGridComponent.propDecorators = {
        'gridOptionSelectDropdown': [{ type: ViewChild, args: ['gridOptionSelectDropdown',] },],
        'menuOptionSelectDropdown': [{ type: ViewChild, args: ['menuOptionSelectDropdown',] },],
        'premiseAllocationGrid': [{ type: ViewChild, args: ['premiseAllocationGrid',] },],
        'premiseAllocationGridPagination': [{ type: ViewChild, args: ['premiseAllocationGridPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return PremiseLocationAllocationGridComponent;
}(BaseComponent));
