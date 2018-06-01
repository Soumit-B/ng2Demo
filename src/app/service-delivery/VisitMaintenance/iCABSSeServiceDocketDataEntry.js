var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ServiceDocketDataEntryComponent = (function (_super) {
    __extends(ServiceDocketDataEntryComponent, _super);
    function ServiceDocketDataEntryComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'Barcode' },
            { name: 'BranchServiceAreaCode', required: true },
            { name: 'BranchServiceAreaDesc', disabled: true, required: false },
            { name: 'BarcodeOK' },
            { name: 'ServicePlanNumber', required: true },
            { name: 'EmployeeCode', required: true },
            { name: 'EmployeeSurname', disabled: true, required: false },
            { name: 'ContractNumber', required: true },
            { name: 'ContractName', disabled: true, required: false },
            { name: 'PremiseNumber', required: true },
            { name: 'PremiseName', disabled: true, required: false },
            { name: 'VisitDate', required: true },
            { name: 'ServiceDate', required: true },
            { name: 'ServiceDNPremiseRowID' },
            { name: 'ServiceBranchNumber' },
            { name: 'ProductCode' },
            { name: 'DateFrom' },
            { name: 'DateTo' },
            { name: 'ServiceCoverRowID' },
            { name: 'ContractRowID' }
        ];
        this.createServiceVisits = false;
        this.ellipsisParams = {
            serviceAreaSearchParams: {},
            employeeSearchParams: {
                parentMode: 'LookUp-Service-All'
            }
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.serviceAreaSearchComponent = BranchServiceAreaSearchComponent;
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.showMessageHeader = true;
        this.headerParams = {
            method: 'service-delivery/grid',
            module: 'delivery-note',
            operation: 'Service/iCABSSeServiceDocketDataEntry'
        };
        this.acceptAllDisabled = true;
        this.showAcceptedLabel = false;
        this.gridParams = {
            totalRecords: 0,
            maxColumn: 11,
            itemsPerPage: 10,
            currentPage: 1,
            riGridMode: 0,
            riGridHandle: 16582842,
            riSortOrder: 'Descending'
        };
        this.messages = {
            barcodeError: 'Barcode Error',
            barcodeDateError: 'Date In Barcode Is Invalid',
            barcodeOkInvalidError: 'Invalid Acceptance Barcode',
            gridNotLoadedError: 'Grid Not Loaded'
        };
        this.barcodeReceivedFromAPI = false;
        this.dateFormat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        this.pageId = PageIdentifier.ICABSSESERVICEDOCKETDATAENTRY;
        this.pageTitle = 'Service Docket Data Entry';
    }
    ServiceDocketDataEntryComponent.prototype.ngAfterViewInit = function () {
        this.currentContractType = this.riExchange.setCurrentContractType();
        this.setErrorCallback(this);
        this.fetchTranslatedContent();
        if (this.formData.ContractNumber) {
            this.populateUIFromFormData();
            this.loadGrid();
        }
    };
    ServiceDocketDataEntryComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    };
    ServiceDocketDataEntryComponent.prototype.onBranchServiceAreaChange = function () {
        var _this = this;
        var branchServiceArea = this.getControlValue('BranchServiceAreaCode');
        var lookupQuery;
        var urlParams = this.getURLSearchParamObject();
        var formData = {};
        this.keyFieldChanged();
        if (!branchServiceArea) {
            this.setControlValue('BranchServiceAreaDesc', '');
            return;
        }
        lookupQuery = [{
                'table': 'BranchServiceArea',
                'query': { 'BranchServiceAreaCode': branchServiceArea },
                'fields': ['BranchServiceAreaDesc']
            }];
        this.lookupDetails(lookupQuery, 'BranchServiceAreaDesc', 'BranchServiceAreaDesc');
        urlParams.set(this.serviceConstants.Action, '6');
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData[this.serviceConstants.Function] = 'GetEmployee';
        formData['BranchServiceAreaCode'] = branchServiceArea;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, urlParams, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (!data.EmployeeCode) {
                _this.displayError(MessageConstant.Message.noRecordFound);
                return;
            }
            _this.setControlValue('EmployeeCode', data.EmployeeCode);
            _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ServiceDocketDataEntryComponent.prototype.onServiceAreaSearchDataReceieved = function (data) {
        this.keyFieldChanged();
        this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
        this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
    };
    ServiceDocketDataEntryComponent.prototype.onContractNumberChange = function () {
        var contractNumber = this.getControlValue('ContractNumber');
        var lookupQuery;
        this.keyFieldChanged();
        if (!contractNumber) {
            this.setControlValue('ContractName', '');
            return;
        }
        lookupQuery = [{
                'table': 'Contract',
                'query': { 'ContractNumber': contractNumber },
                'fields': ['ContractName']
            }];
        this.lookupDetails(lookupQuery, 'ContractName', 'ContractName');
    };
    ServiceDocketDataEntryComponent.prototype.onPremiseNumberChange = function () {
        var premiseNumber = this.getControlValue('PremiseNumber');
        var contractNumber = this.getControlValue('ContractNumber');
        var lookupQuery;
        this.keyFieldChanged();
        if (!premiseNumber || !contractNumber) {
            this.setControlValue('PremiseName', '');
            return;
        }
        lookupQuery = [{
                'table': 'Premise',
                'query': { 'PremiseNumber': premiseNumber, 'ContractNumber': contractNumber },
                'fields': ['PremiseName']
            }];
        this.lookupDetails(lookupQuery, 'PremiseName', 'PremiseName');
    };
    ServiceDocketDataEntryComponent.prototype.onEmployeeCodeChange = function () {
        var employeeCode = this.getControlValue('EmployeeCode');
        var lookupQuery;
        if (!employeeCode) {
            this.setControlValue('EmployeeSurname', '');
            return;
        }
        lookupQuery = [{
                'table': 'Employee',
                'query': { 'EmployeeCode': employeeCode },
                'fields': ['EmployeeSurname']
            }];
        this.lookupDetails(lookupQuery, 'EmployeeSurname', 'EmployeeSurname');
    };
    ServiceDocketDataEntryComponent.prototype.onEmployeeDataReceieved = function (data) {
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
    };
    ServiceDocketDataEntryComponent.prototype.lookupDetails = function (query, field, control) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (!data[0].length) {
                _this.displayError(MessageConstant.Message.noRecordFound);
                return;
            }
            _this.setControlValue(control, data[0][0][field]);
        }).catch(function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ServiceDocketDataEntryComponent.prototype.onVisitDateSelect = function (data) {
        if (!data.value) {
            return;
        }
        this.setControlValue('VisitDate', data.value);
        this.setControlValue('ServiceDate', data.value);
        if (this.dateFormat.test(data.value)) {
            this.serviceDate = this.utils.convertDate(data.value);
        }
        else {
            this.serviceDate = this.utils.formatDate(data.value);
        }
    };
    ServiceDocketDataEntryComponent.prototype.onServiceDateSelect = function (data) {
        this.setControlValue('ServiceDate', data.value);
    };
    ServiceDocketDataEntryComponent.prototype.loadGrid = function () {
        var gridURLParams = this.getURLSearchParamObject();
        var gridInputParams = {};
        var formData = {};
        gridURLParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridURLParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridURLParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridURLParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridURLParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridURLParams.set(this.serviceConstants.Action, '2');
        if (this.createServiceVisits) {
            gridURLParams.set(this.serviceConstants.Function, 'CreateServiceVisits');
        }
        gridURLParams.set('ServiceDNPremiseRowID', this.getControlValue('ServiceDNPremiseRowID'));
        gridURLParams.set('BranchNumber', this.utils.getBranchCode());
        gridURLParams.set(this.serviceConstants.ContractNumber, this.getControlValue(this.serviceConstants.ContractNumber));
        gridURLParams.set(this.serviceConstants.PremiseNumber, this.getControlValue(this.serviceConstants.PremiseNumber));
        gridURLParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        gridURLParams.set('VisitDate', this.getControlValue('VisitDate'));
        gridURLParams.set('ServiceDate', this.getControlValue('VisitDate'));
        gridInputParams = this.headerParams;
        gridInputParams['search'] = gridURLParams;
        this.serviceDocketGrid.update = true;
        this.serviceDocketGrid.loadGridData(gridInputParams);
    };
    ServiceDocketDataEntryComponent.prototype.getCurrentPage = function (curPage) {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.loadGrid();
    };
    ServiceDocketDataEntryComponent.prototype.refresh = function () {
        this.gridParams.currentPage = 1;
        if (!this.getControlValue('Barcode')) {
            this.fetchBarCode();
        }
        else {
            this.serviceDocketGrid.clearGridData();
        }
    };
    ServiceDocketDataEntryComponent.prototype.getGridInfo = function (info) {
        var gridTotalItems = this.gridParams.itemsPerPage;
        var footerRows = [];
        var footerInfo = [];
        var enable = false;
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
        footerRows = this.serviceDocketGrid.getFooterInfo();
        if (!footerRows || !footerRows.length) {
            return;
        }
        footerInfo = footerRows[0].text.split('|');
        if (footerInfo[1] === GlobalConstant.Configuration.Yes) {
            enable = true;
            this.setControlValue('EmployeeCode', footerInfo[3]);
            this.onEmployeeCodeChange();
        }
        this.enableAccept(enable);
    };
    ServiceDocketDataEntryComponent.prototype.enableAccept = function (flag) {
        this.acceptAllDisabled = flag;
        this.disableControl('BarcodeOK', flag);
        this.disableControl('EmployeeCode', flag);
        this.serviceDatepicker.isDisabled = flag;
        this.showAcceptedLabel = flag;
    };
    ServiceDocketDataEntryComponent.prototype.fetchBarCode = function () {
        var _this = this;
        var urlParams = this.getURLSearchParamObject();
        var formData = {};
        urlParams.set(this.serviceConstants.Action, '6');
        formData[this.serviceConstants.Function] = 'GetBarcode';
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['ServicePlanNumber'] = this.getControlValue('ServicePlanNumber');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['VisitDate'] = this.getControlValue('VisitDate');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, urlParams, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.setControlValue('Barcode', data.Barcode);
            _this.setControlValue('ServiceDNPremiseRowID', data.ServiceDNPremiseRowID);
            _this.barcodeReceivedFromAPI = true;
            if (_this.validateInputs() && _this.getControlValue('Barcode') && _this.getControlValue('ServiceDNPremiseRowID')) {
                _this.loadGrid();
            }
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ServiceDocketDataEntryComponent.prototype.validateInputs = function () {
        var isValid = true;
        var controls = [
            'BranchServiceAreaCode',
            'ServicePlanNumber',
            'ContractNumber',
            'PremiseNumber',
            'VisitDate'
        ];
        for (var i = 0; i < controls.length; i++) {
            if (!this.hasNoError(controls[i])) {
                isValid = false;
            }
        }
        return isValid;
    };
    ServiceDocketDataEntryComponent.prototype.serviceVisitFocus = function (data) {
        var rowData = data.trRowData;
        var columnClicked = data.columnClicked.text;
        switch (rowData[1]['additionalData']) {
            case 'J':
                this.currentContractType = '<job>';
                break;
            case 'C':
                this.currentContractType = '';
                break;
        }
        if (columnClicked === 'Visit Qty') {
            this.logger.log('Editable herer');
        }
    };
    ServiceDocketDataEntryComponent.prototype.onGridRowDoubleClick = function (data) {
        var columnClicked = data.columnClicked.text;
        var rowData = data.trRowData;
        var serviceCoverRowID = rowData[4]['rowID'];
        var contractRowId = rowData[1]['rowID'];
        if (columnClicked === 'Shared Visit' || columnClicked === 'Service Visit Exists') {
            return;
        }
        this.serviceVisitFocus(data);
        switch (columnClicked) {
            case 'Seq Number':
                this.setControlValue('DateFrom', this.getControlValue('ServiceDate'));
                this.setControlValue('DateTo', this.getControlValue('ServiceDate'));
                this.setControlValue('ServiceCoverRowID', serviceCoverRowID);
                this.attributes['ServiceCoverRowID'] = serviceCoverRowID;
                this.navigate('Entitlement', '/grid/contractmanagement/maintenance/contract/visitsummary', {
                    parentMode: 'Entitlement',
                    DateFrom: this.getControlValue('ServiceDate'),
                    DateTo: this.getControlValue('ServiceDate'),
                    ServiceCoverRowID: serviceCoverRowID,
                    ContractNumber: this.getControlValue('ContractNumber'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    currentContractTypeURLParameter: this.currentContractType
                });
                break;
            case 'Contract Number':
                var contractRowId_1 = '';
                this.setControlValue('ContractRowID', contractRowId_1);
                this.navigate('FlatRateIncrease', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    parentMode: 'FlatRateIncrease',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    currentContractType: this.currentContractType
                });
                break;
            case 'Premise Name':
                this.navigate('GridSearch', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    currentContractType: this.currentContractType
                });
                break;
            case 'Product Code':
                this.setControlValue('ProductCode', data['cellData']['text']);
                this.setControlValue('ServiceCoverRowID', serviceCoverRowID);
                this.attributes['ServiceCoverRowID'] = serviceCoverRowID;
                this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    currentContractType: this.currentContractType
                });
                break;
        }
    };
    ServiceDocketDataEntryComponent.prototype.onBarcodeChange = function () {
        var _this = this;
        var barcode = this.getControlValue('Barcode');
        var barcodeParts;
        var reportNumber;
        var serviceDNPremise;
        var serviceDNPremisePage;
        var visitDate;
        var searchParams;
        var formData = {};
        if (this.barcodeReceivedFromAPI) {
            return;
        }
        if (!barcode) {
            this.clearAllButBarcode();
            this.disableControls(false);
            return;
        }
        this.clearAllButBarcode();
        barcodeParts = barcode.split('/');
        if (barcodeParts.length < 3) {
            this.serviceDocketGrid.clearGridData();
            this.errorService.emitError(this.messages.barcodeError);
            return;
        }
        reportNumber = barcodeParts[0];
        serviceDNPremise = barcodeParts[1];
        serviceDNPremisePage = barcodeParts[2];
        visitDate = barcodeParts[3];
        if (visitDate.length < 8 || isNaN(visitDate)) {
            this.errorService.emitError(this.messages.barcodeDateError);
            return;
        }
        visitDate = window['moment'](visitDate, 'YYYYMMDD', true);
        if (!visitDate.isValid()) {
            this.errorService.emitError(this.messages.barcodeDateError);
            return;
        }
        this.planVisitDate = this.serviceDate = visitDate.toDate();
        visitDate = this.utils.formatDate(visitDate.toDate());
        this.setControlValue('VisitDate', visitDate);
        this.setControlValue('ServiceDate', visitDate);
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '2');
        formData[this.serviceConstants.Function] = 'GetFromBarcode';
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData['ReportNumber'] = reportNumber;
        formData['ServiceDNPremise'] = serviceDNPremise;
        formData['ServiceDNPremisePage'] = serviceDNPremisePage;
        formData['VisitDate'] = this.getControlValue('VisitDate');
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, formData).subscribe(function (data) {
            if (data.errorMessage) {
                _this.clearAllButBarcode();
                _this.displayError(data.errorMessage);
                return;
            }
            for (var key in data) {
                if (!key) {
                    continue;
                }
                _this.setControlValue(key, data[key]);
            }
            _this.disableControls(true);
            _this.loadGrid();
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
            _this.clearAllButBarcode();
            _this.disableControls(false);
        });
    };
    ServiceDocketDataEntryComponent.prototype.onBarcodeOkChange = function () {
        var barcodeOk = this.getControlValue('BarcodeOK');
        if (!barcodeOk) {
            return;
        }
        if (barcodeOk !== 'OK/') {
            this.errorService.emitError(this.messages.barcodeOkInvalidError);
            this.setControlValue('BarcodeOK', '');
            return;
        }
        if (!this.gridParams.totalRecords) {
            this.displayError(this.messages.gridNotLoadedError);
            return;
        }
        this.acceptAll();
    };
    ServiceDocketDataEntryComponent.prototype.acceptAll = function () {
        var _this = this;
        var searchParams;
        var formData = {};
        if (!this.hasNoError('EmployeeCode') && !this.hasNoError('ServiceDate')) {
            this.displayError(this.messages.gridNotLoadedError);
            return;
        }
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        formData[this.serviceConstants.Function] = 'ValidateInputData';
        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        formData['ServiceDate'] = this.getControlValue('ServiceDate');
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, formData).subscribe(function (data) {
            if (data.errorMessage) {
                _this.displayError(data.errorMessage);
                return;
            }
            _this.createServiceVisits = true;
            _this.loadGrid();
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ServiceDocketDataEntryComponent.prototype.fetchTranslatedContent = function () {
        var _this = this;
        this.getTranslatedValue(this.messages.barcodeError, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.messages.barcodeError = res;
                }
            });
        });
        this.getTranslatedValue(this.messages.barcodeDateError, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.messages.barcodeDateError = res;
                }
            });
        });
        this.getTranslatedValue(this.messages.barcodeOkInvalidError, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.messages.barcodeOkInvalidError = res;
                }
            });
        });
        this.getTranslatedValue(this.messages.gridNotLoadedError, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.messages.gridNotLoadedError = res;
                }
            });
        });
    };
    ServiceDocketDataEntryComponent.prototype.clearAllButBarcode = function () {
        this.clearControls(['Barcode']);
        this.serviceDate = null;
        this.planVisitDate = null;
        this.serviceDocketGrid.clearGridData();
        this.acceptAllDisabled = true;
        this.showAcceptedLabel = false;
    };
    ServiceDocketDataEntryComponent.prototype.disableControls = function (disable) {
        this.disableControl('BranchServiceAreaCode', disable);
        this.disableControl('ServicePlanNumber', disable);
        this.disableControl('ContractNumber', disable);
        this.disableControl('PremiseNumber', disable);
        this.visitDatepicker.isDisabled = disable;
    };
    ServiceDocketDataEntryComponent.prototype.keyFieldChanged = function () {
        this.setControlValue('Barcode', '');
        this.setControlValue('BarcodeOK', '');
        this.setControlValue('ServiceDNPremiseRowID', '');
        this.serviceDocketGrid.clearGridData();
    };
    ServiceDocketDataEntryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeServiceDocketDataEntry.html'
                },] },
    ];
    ServiceDocketDataEntryComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceDocketDataEntryComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'visitDatepicker': [{ type: ViewChild, args: ['visitDatepicker',] },],
        'serviceDatepicker': [{ type: ViewChild, args: ['serviceDatepicker',] },],
        'serviceDocketGrid': [{ type: ViewChild, args: ['serviceDocketGrid',] },],
    };
    return ServiceDocketDataEntryComponent;
}(BaseComponent));
