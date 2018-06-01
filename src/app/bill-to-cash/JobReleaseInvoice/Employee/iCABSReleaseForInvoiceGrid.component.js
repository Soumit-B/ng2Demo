var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ServiceCoverSearchComponent } from './../../../internal/search/iCABSAServiceCoverSearch';
import { PremiseSearchComponent } from './../../../internal/search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
export var ReleaseForInvoiceGridComponent = (function (_super) {
    __extends(ReleaseForInvoiceGridComponent, _super);
    function ReleaseForInvoiceGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.dtDateTo = new Date();
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalRecords = 0;
        this.maxColumn = 13;
        this.inputParams = {};
        this.srcElementName = '';
        this.serviceCommenceDate = '';
        this.serviceDateStart = '';
        this.legend = [];
        this.gridSortHeaders = [];
        this.headerClicked = '';
        this.sortType = 'ASC';
        this.ellipsisConfig = {
            contract: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': '',
                    'currentContractTypeURLParameter': '',
                    'showAddNew': false
                },
                modalConfig: '',
                contentComponent: ContractSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            premises: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'currentContractType': '',
                    'currentContractTypeURLParameter': '',
                    'showAddNew': false
                },
                modalConfig: '',
                contentComponent: PremiseSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            product: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-Freq',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': '',
                    'currentContractType': '',
                    'currentContractTypeURLParameter': '',
                    'showAddNew': false
                },
                modalConfig: '',
                contentComponent: ServiceCoverSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.muleConfig = {
            method: 'bill-to-cash/maintenance',
            module: 'invoicing',
            operation: 'Application/iCABSReleaseForInvoiceGrid',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.datePickerConfig = {
            DateTo: {
                isDisabled: false,
                isRequired: true
            }
        };
        this.promptConfig = {
            OKCancel: {
                showPromptMessageHeader: true,
                promptConfirmTitle: '',
                promptConfirmContent: ''
            }
        };
        this.promptMode = '';
        this.msgDateText = '';
        this.msgDateTitle = '';
        this.isCmdReleaseAllDisabled = false;
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'ServiceType', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'DateFilter', value: 'ServiceDate', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ContractType', value: 'All', readonly: true, disabled: false, required: false },
            { name: 'ContractSuspendInd', value: true, readonly: false, disabled: false, required: false },
            { name: 'PremiseSuspendInd', value: true, readonly: false, disabled: false, required: false },
            { name: 'ServiceCover', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
            { name: 'ContractRowID', readonly: false, disabled: false, required: false },
            { name: 'DateTo', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSRELEASEFORINVOICEGRID;
    }
    ReleaseForInvoiceGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Release For Invoicing';
        this.isCmdReleaseAllDisabled = true;
        this.formControlContractNumber.nativeElement.focus();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.dtDateTo = this.utils.convertDate(this.formData.DateTo);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.utils.formatDate(this.dtDateTo));
        }
        this.getDateMessageStrings();
        this.applyGridFilter();
        this.displayLegend();
    };
    ReleaseForInvoiceGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ReleaseForInvoiceGridComponent.prototype.onContractNumberSearchDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        if (data.ContractName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        }
        this.updateEllipsisConfig();
    };
    ReleaseForInvoiceGridComponent.prototype.onPremiseNumberSearchDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        if (data.PremiseName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
        }
        this.updateEllipsisConfig();
    };
    ReleaseForInvoiceGridComponent.prototype.onProductCodeSearchDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.row.ProductCode);
        if (data.row.ProductDesc) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.row.ProductDesc);
        }
    };
    ReleaseForInvoiceGridComponent.prototype.updateEllipsisConfig = function () {
        this.ellipsisConfig.premises.childConfigParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') || '';
        this.ellipsisConfig.premises.childConfigParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName') || '';
        this.ellipsisConfig.product.childConfigParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName') || '';
        this.ellipsisConfig.product.childConfigParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') || '';
        this.ellipsisConfig.product.childConfigParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') || '';
        this.ellipsisConfig.product.childConfigParams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName') || '';
    };
    ReleaseForInvoiceGridComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ReleaseForInvoiceGridComponent.prototype.modalHidden = function () {
        this.promptMode = '';
    };
    ReleaseForInvoiceGridComponent.prototype.onSelectedDateValue = function (data) {
        if (data && data['value']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', data.value);
            this.dtDateTo = this.utils.convertDate(data.value);
        }
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.dtDateTo = this.utils.convertDate(this.formData.DateTo);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.utils.formatDate(this.dtDateTo));
        }
    };
    ReleaseForInvoiceGridComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * this.itemsPerPage;
        }
        else {
            this.totalRecords = 0;
        }
    };
    ReleaseForInvoiceGridComponent.prototype.displayLegend = function () {
        this.legend = [];
        this.legend = [
            { color: '#FFFFCC', label: 'Contract Suspended' },
            { color: '#CCFFCC', label: 'Premises Suspended' },
            { color: '#FFCCCC', label: 'Not Authorised' }
        ];
    };
    ReleaseForInvoiceGridComponent.prototype.getCurrentPage = function (data) {
        this.currentPage = data.value;
        this.buildGrid();
    };
    ReleaseForInvoiceGridComponent.prototype.buildGrid = function () {
        this.search = new URLSearchParams();
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('riGridMode', '0');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
        this.search.set('riSortOrder', 'Descending');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('DateTo', this.utils.formatDate(this.dtDateTo));
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('ContractType', this.uiForm.controls['ContractType'].value);
        this.search.set('ServiceType', this.uiForm.controls['ServiceType'].value);
        this.search.set('DateFilter', this.uiForm.controls['DateFilter'].value);
        this.search.set('IncludeContract', (this.uiForm.controls['ContractSuspendInd'].value === true) ? 'True' : 'False');
        this.search.set('IncludePremise', (this.uiForm.controls['PremiseSuspendInd'].value === true) ? 'True' : 'False');
        if (this.attributes && this.attributes.hasOwnProperty('ProductCodeServiceCoverRowID') && this.attributes['ProductCodeServiceCoverRowID']) {
            this.search.set('ServiceCoverRowID', this.attributes['ProductCodeServiceCoverRowID']);
        }
        else {
            this.search.set('ServiceCoverRowID', '');
        }
        this.inputParams.search = this.search;
        this.riGrid.loadGridData(this.inputParams);
        this.riGrid_AfterExecute();
    };
    ReleaseForInvoiceGridComponent.prototype.sortGrid = function (obj) {
        this.headerClicked = obj.fieldname;
        this.sortType = obj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    };
    ReleaseForInvoiceGridComponent.prototype.applyGridFilter = function () {
        var objContractNumber = {
            'fieldName': 'ContractNumber',
            'index': 0,
            'colName': 'Contract Job Number',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objContractNumber);
        var objServiceDateStart = {
            'fieldName': 'ServiceDateStart',
            'index': 7,
            'colName': 'Service Date',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objServiceDateStart);
    };
    ReleaseForInvoiceGridComponent.prototype.promptCancel = function (event) {
    };
    ReleaseForInvoiceGridComponent.prototype.confirmOKCancel = function (event) {
        switch (this.promptMode) {
            case 'riGrid_BodyOnClick':
                this.promptMode = '';
                this.riGrid_BodyOnClickConfirm();
                break;
            case 'cmdReleaseAll_onClick':
                this.promptMode = '';
                this.cmdReleaseAll_onClickConfirm();
                break;
            default:
                break;
        }
    };
    ReleaseForInvoiceGridComponent.prototype.riGrid_AfterExecute = function () {
        if (this.uiForm.controls['ContractNumber'].value) {
            this.isCmdReleaseAllDisabled = false;
        }
        else {
            this.isCmdReleaseAllDisabled = true;
        }
    };
    ReleaseForInvoiceGridComponent.prototype.refresh = function () {
        this.headerClicked = '';
        this.buildGrid();
    };
    ReleaseForInvoiceGridComponent.prototype.selectedDataOnDoubleClick = function (event) {
        if (event) {
            this.serviceCoverFocus(event);
            var drillDownData = event.trRowData[4].drillDown;
            var tempData = event.trRowData[0].text;
            var tempDataList = tempData.split('/');
            var contractNumber = (tempDataList && (tempDataList.length > 1)) ? tempDataList[1] : '';
            var premiseNumber = event.trRowData[1].text;
            var productCode = event.trRowData[5].text;
            var contractCommenceDate = event.trRowData[4].text;
            var serviceCommenceDate = event.trRowData[8].text;
            switch (event.cellIndex) {
                case 0:
                    if (event.trRowData[0].additionalData === 'J') {
                        this.navigate('Release', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                            parentMode: 'Release',
                            currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                            ContractNumber: contractNumber,
                            currentContractType: event.trRowData[0].additionalData
                        });
                    }
                    if (event.trRowData[0].additionalData === 'C') {
                        this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                            parentMode: 'Release',
                            currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                            ContractNumber: contractNumber,
                            currentContractType: event.trRowData[0].additionalData
                        });
                    }
                    if (event.trRowData[0].additionalData === 'P') {
                        this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                            parentMode: 'Release',
                            currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                            ContractNumber: contractNumber,
                            currentContractType: event.trRowData[0].additionalData
                        });
                    }
                    break;
                case 1:
                    this.navigate('Release', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                        parentMode: 'Release',
                        currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                        ContractNumber: contractNumber,
                        PremiseNumber: premiseNumber,
                        PremiseRowID: this.attributes['ContractNumberPremiseRowID'] || '',
                        ContractTypeCode: event.trRowData[0].additionalData
                    });
                    break;
                case 5:
                    this.navigate('Release', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                        currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                        ContractNumber: contractNumber,
                        PremiseNumber: premiseNumber,
                        ProductCode: productCode,
                        ServiceCoverRowID: this.getAttribute('ContractNumberServiceCoverRowID') || '',
                        currentContractType: event.trRowData[0].additionalData
                    });
                    break;
                case 4:
                    if (drillDownData === true) {
                        this.navigate('Release', '/contractmanagement/maintenance/commencedate', {
                            parentMode: 'Release',
                            CurrentContractTypeURLParameter: this.currentContractTypeURLParameter,
                            ContractNumber: contractNumber,
                            PremiseNumber: premiseNumber,
                            ProductCode: productCode,
                            ContractCommenceDate: contractCommenceDate,
                            ServiceVisitRowID: this.getAttribute('ContractNumberServiceCoverRowID') || '',
                            CurrentContractType: event.trRowData[0].additionalData
                        });
                    }
                    break;
                case 8:
                    this.navigate('Release', '/application/serviceCoverCommencedate', {
                        ContractNumber: contractNumber,
                        PremiseNumber: premiseNumber,
                        ProductCode: productCode,
                        ServiceCommenceDate: serviceCommenceDate
                    });
                    break;
                default:
                    break;
            }
        }
    };
    ReleaseForInvoiceGridComponent.prototype.selectedDataOnCellFocus = function (event) {
        this.serviceDateStart = '';
        this.serviceCommenceDate = '';
        if (event.columnClicked) {
            this.srcElementName = event.columnClicked.text;
        }
        if (event.trRowData) {
            this.serviceDateStart = event.trRowData[7].text ? event.trRowData[7].text : '';
            this.serviceCommenceDate = event.trRowData[8].text ? event.trRowData[8].text : '';
        }
        if ((event.cellIndex === 12) && (event.cellData.text)) {
            this.serviceCoverFocus(event);
            if (this.serviceCommenceDate.toString() !== this.serviceDateStart.toString()) {
                this.promptMode = 'riGrid_BodyOnClick';
                this.promptConfig.OKCancel.promptConfirmTitle = this.msgDateTitle;
                this.promptConfig.OKCancel.promptConfirmContent = this.msgDateText;
                this.promptOKCancelModal.show();
            }
        }
    };
    ReleaseForInvoiceGridComponent.prototype.riGrid_BodyOnClickConfirm = function () {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');
        var postObj = {};
        postObj.Function = 'Unsuspend';
        postObj.ServiceCoverRowID = this.getAttribute('ContractNumberServiceCoverRowID');
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                _this.msgDateText = e.MessageText ? e.MessageText : '';
                _this.msgDateTitle = e.MessageTitle ? e.MessageTitle : '';
                _this.buildGrid();
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ReleaseForInvoiceGridComponent.prototype.serviceCoverFocus = function (event) {
        if (event.cellData) {
            this.attributes.ContractNumberRow = event.cellData.rowIndex;
            this.attributes.ContractNumberContractRowID = event.trRowData[0].rowID;
            this.attributes.ContractNumberPremiseRowID = event.trRowData[1].rowID;
            this.attributes.ContractNumberServiceCoverRowID = event.trRowData[5].rowID;
            this.attributes.grdServiceCoverServiceCoverRowID = event.trRowData[5].rowID;
            this.attributes.grdServiceCoverRow = event.cellData.rowIndex;
            switch (event.cellData.additionalData) {
                case 'C':
                    this.currentContractTypeURLParameter = '';
                    break;
                case 'J':
                    this.currentContractTypeURLParameter = '<job>';
                    break;
                case 'P':
                    this.currentContractTypeURLParameter = '<product>';
                    break;
                default:
                    break;
            }
        }
    };
    ReleaseForInvoiceGridComponent.prototype.onCellClickBlur = function (data) {
    };
    ReleaseForInvoiceGridComponent.prototype.getDateMessageStrings = function () {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');
        var postObj = {};
        postObj.Function = 'GetDateString';
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                _this.msgDateText = e.MessageText ? e.MessageText : '';
                _this.msgDateTitle = e.MessageTitle ? e.MessageTitle : '';
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ReleaseForInvoiceGridComponent.prototype.cmdReleaseAll_onClick = function (event) {
        this.promptMode = 'cmdReleaseAll_onClick';
        this.promptConfig.OKCancel.promptConfirmTitle = this.msgDateTitle;
        this.promptConfig.OKCancel.promptConfirmContent = this.msgDateText;
        this.promptOKCancelModal.show();
    };
    ReleaseForInvoiceGridComponent.prototype.cmdReleaseAll_onClickConfirm = function () {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');
        var postObj = {};
        postObj.Function = 'UnsuspendAll';
        postObj.BranchCode = this.utils.getBranchCode();
        if (this.uiForm.controls['ContractNumber'].value) {
            postObj.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        }
        if (this.uiForm.controls['PremiseNumber'].value) {
            postObj.ContractNumber = this.uiForm.controls['PremiseNumber'].value;
        }
        if (this.uiForm.controls['ProductCode'].value) {
            postObj.ContractNumber = this.uiForm.controls['ProductCode'].value;
        }
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e['errorMessage']) {
                    _this.messageModal.show({ msg: e['errorMessage'], title: _this.pageTitle }, false);
                }
                _this.buildGrid();
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ReleaseForInvoiceGridComponent.prototype.onChange = function (event) {
        if (!event)
            return;
        var elementValue = event.target.value;
        var _paddedValue = elementValue;
        if (event.target.id === 'ContractNumber') {
            if (elementValue.length > 0) {
                event.target.value = this.utils.numberPadding(elementValue, 8);
                this.uiForm.controls['ContractNumber'].setValue(event.target.value);
            }
            this.populateDescriptions(event);
        }
        else if (event.target.id === 'PremiseNumber') {
            this.populateDescriptions(event);
        }
        else if (event.target.id === 'ProductCode') {
            if (this.attributes && this.attributes.hasOwnProperty('ProductCodeServiceCoverRowID') && this.attributes['ProductCodeServiceCoverRowID']) {
                this.attributes['ProductCodeServiceCoverRowID'] = '';
            }
            this.populateDescriptions(event);
        }
    };
    ;
    ReleaseForInvoiceGridComponent.prototype.onKeyDown = function (event) {
        if (event && event.target) {
            var elementValue = event.target.value;
            var _paddedValue = elementValue;
            if (event.target.id === 'ContractNumber') {
                if (this.contractNumberEllipsis)
                    this.contractNumberEllipsis.openModal();
            }
            else if (event.target.id === 'PremiseNumber') {
                if (this.premisesNumberEllipsis)
                    this.premisesNumberEllipsis.openModal();
            }
            else if (event.target.id === 'ProductCode') {
                if (this.productcodeEllipsis)
                    this.productcodeEllipsis.openModal();
            }
        }
    };
    ;
    ReleaseForInvoiceGridComponent.prototype.populateDescriptions = function (event) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');
        var postObj = {};
        postObj.Function = 'SetDisplayFields';
        if (this.uiForm.controls['ContractNumber'].value) {
            postObj.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        }
        if (this.uiForm.controls['PremiseNumber'].value) {
            postObj.PremiseNumber = this.uiForm.controls['PremiseNumber'].value;
        }
        if (this.uiForm.controls['ProductCode'].value) {
            postObj.ProductCode = this.uiForm.controls['ProductCode'].value;
        }
        if (this.attributes && this.attributes.hasOwnProperty('ProductCodeServiceCoverRowID') && this.attributes['ProductCodeServiceCoverRowID']) {
            postObj.ServiceCoverRowID = this.attributes['ProductCodeServiceCoverRowID'];
        }
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    var contractNumber = (e.ContractNumber) ? _this.utils.numberPadding(e.ContractNumber, 8) : '';
                    _this.uiForm.controls['ContractName'].setValue(e.ContractName);
                    _this.uiForm.controls['PremiseName'].setValue(e.PremiseName);
                    _this.uiForm.controls['ProductDesc'].setValue(e.ProductDesc);
                }
                else {
                    _this.uiForm.controls['ContractNumber'].setValue('');
                    _this.uiForm.controls['ContractName'].setValue('');
                    _this.uiForm.controls['PremiseNumber'].setValue('');
                    _this.uiForm.controls['PremiseName'].setValue('');
                    _this.uiForm.controls['ProductCode'].setValue('');
                    _this.uiForm.controls['ProductDesc'].setValue('');
                }
            }
            _this.buildGrid();
            _this.updateEllipsisConfig();
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ReleaseForInvoiceGridComponent.prototype.getAttribute = function (attributeName) {
        var attrValue = '';
        if (this.attributes && this.attributes.hasOwnProperty(attributeName) && this.attributes[attributeName]) {
            attrValue = this.attributes[attributeName];
        }
        return attrValue;
    };
    ReleaseForInvoiceGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSReleaseForInvoiceGrid.html',
                    styles: ["\n    :host /deep/ .gridtable tbody tr td input.form-control\n    {\n        cursor: pointer;\n    }"]
                },] },
    ];
    ReleaseForInvoiceGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ReleaseForInvoiceGridComponent.propDecorators = {
        'contractNumberEllipsis': [{ type: ViewChild, args: ['contractNumberEllipsis',] },],
        'premisesNumberEllipsis': [{ type: ViewChild, args: ['premisesNumberEllipsis',] },],
        'productcodeEllipsis': [{ type: ViewChild, args: ['productcodeEllipsis',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'riPagination': [{ type: ViewChild, args: ['riPagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'formControlContractNumber': [{ type: ViewChild, args: ['contractNumber',] },],
        'promptOKCancelModal': [{ type: ViewChild, args: ['promptOKCancelModal',] },],
    };
    return ReleaseForInvoiceGridComponent;
}(BaseComponent));
