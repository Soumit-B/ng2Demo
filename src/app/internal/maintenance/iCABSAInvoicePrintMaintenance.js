var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { InvoiceSearchComponent } from './../search/iCABSInvoiceSearch.component';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var InvoicePrintMaintenanceComponent = (function (_super) {
    __extends(InvoicePrintMaintenanceComponent, _super);
    function InvoicePrintMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'CompanyInvoiceNumber' },
            { name: 'CopyInvoice' },
            { name: 'InvoiceName' },
            { name: 'InvoiceAddressLine1' },
            { name: 'InvoiceAddressLine2' },
            { name: 'InvoiceAddressLine3' },
            { name: 'InvoiceAddressLine4' },
            { name: 'InvoiceAddressLine5' },
            { name: 'InvoicePostcode' },
            { name: 'CompanyVATNumber' },
            { name: 'InvoiceNumber' },
            { name: 'PrintLineNumber' },
            { name: 'CompanyCode' },
            { name: 'CompanyDesc' }
        ];
        this.tabs = {
            tab0: { active: true },
            tab1: { active: false },
            tab2: { active: false }
        };
        this.gridParams = {
            totalRecords: 0,
            maxColumn: 4,
            itemsPerPage: 10,
            currentPage: 1,
            riGridMode: 0,
            riGridHandle: 16582842,
            riSortOrder: 'Descending'
        };
        this.headerParams = {
            method: 'bill-to-cash/maintenance',
            module: 'invoicing',
            operation: 'Application/iCABSAInvoicePrintMaintenance'
        };
        this.companyInputParams = {};
        this.showMessageHeader = true;
        this.sysCharParams = {
            enableCompanyCode: false
        };
        this.showPromptHeader = true;
        this.companyDefault = {
            id: '',
            text: ''
        };
        this.isFormDisabled = true;
        this.invoiceSearchComponent = InvoiceSearchComponent;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.inputParams = {
            parentMode: 'InvoicePrintMaintenance'
        };
        this.pageId = PageIdentifier.ICABSAINVOICEPRINTMAINTENANCE;
        this.pageTitle = 'Invoice Print Maintenance';
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.companyInputParams[this.serviceConstants.CountryCode] = this.utils.getCountryCode();
        this.companyInputParams[this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
        this.companyInputParams['parentMode'] = 'LookUp';
    }
    InvoicePrintMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
        this.getSysChars();
        if (this.isReturning()) {
            this.onTabClick(1);
            this.populateUIFromFormData();
            this.companyDefault = {
                id: this.getControlValue('CompanyCode'),
                text: this.getControlValue('CompanyCode') + ' - ' + this.getControlValue('CompanyDesc')
            };
            this.loadGrid();
            this.enableForm(true, []);
            return;
        }
        if (this.riExchange.getParentHTMLValue('CompanyCode')) {
            this.populateControlsFromParent();
        }
        this.enableForm(false, []);
    };
    InvoicePrintMaintenanceComponent.prototype.onTabClick = function (index) {
        if (this.tabs['tab' + index].active) {
            return;
        }
        for (var key in this.tabs) {
            if (!key) {
                continue;
            }
            if (key === 'tab' + index) {
                this.tabs[key].active = true;
                continue;
            }
            this.tabs[key].active = false;
        }
    };
    InvoicePrintMaintenanceComponent.prototype.populateControlsFromParent = function () {
        var companyCode = this.riExchange.getParentHTMLValue('CompanyCode');
        var companyDesc = this.riExchange.getParentHTMLValue('CompanyDesc');
        var companyInvoiceNumber = this.riExchange.getParentHTMLValue('CompanyInvoiceNumber');
        this.companyDefault = {
            id: companyCode,
            text: companyCode + ' - ' + companyDesc
        };
        this.onCompanyChange({
            CompanyCode: companyCode,
            CompanyDesc: companyDesc
        });
        this.setControlValue('CompanyInvoiceNumber', companyInvoiceNumber);
        this.onCompanyInvoiceNumberChange();
    };
    InvoicePrintMaintenanceComponent.prototype.getInvoiceNumber = function () {
        var _this = this;
        var lookUpParam = [{
                'table': 'InvoiceHeader',
                'query': {
                    'CompanyCode': this.getControlValue('CompanyCode'),
                    'BusinessCode': this.utils.getBusinessCode(),
                    'CompanyInvoiceNumber': this.getControlValue('CompanyInvoiceNumber')
                },
                'fields': ['InvoiceNumber']
            }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookUpParam, 5).then(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (!data[0].length) {
                _this.errorService.emitError(MessageConstant.Message.noRecordFound);
                return;
            }
            if (data[0].length > 1) {
                _this.inputParams = {
                    parentMode: 'InvoicePrintMaintenance',
                    CompanyInvoiceNumber: _this.getControlValue('CompanyInvoiceNumber'),
                    companyCode: _this.getControlValue('CompanyCode')
                };
                _this.invoiceSearchEllipsis.childConfigParams = _this.inputParams;
                _this.invoiceSearchEllipsis.openModal();
                return;
            }
            _this.setControlValue('InvoiceNumber', data[0][0].InvoiceNumber);
            _this.getInvoiceDetails();
        }).catch(function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log(error);
            _this.errorService.emitError(MessageConstant.Message.GeneralError);
        });
    };
    InvoicePrintMaintenanceComponent.prototype.getInvoiceDetails = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('CompanyInvoiceNumber', this.getControlValue('CompanyInvoiceNumber'));
        searchParams.set('InvoiceNumber', this.getControlValue('InvoiceNumber'));
        searchParams.set('CompanyCode', this.getControlValue('CompanyCode'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
            var controls = ['InvoiceName', 'InvoiceAddressLine1', 'InvoiceAddressLine2', 'InvoiceAddressLine3', 'InvoiceAddressLine4', 'InvoiceAddressLine5', 'InvoicePostcode', 'CompanyVATNumber'];
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.formPristine();
            if (data.errorMessage) {
                _this.displayError(data.errorMessage);
                return;
            }
            controls.forEach(function (control) {
                if (control && data[control]) {
                    _this.setControlValue(control, data[control]);
                }
            });
            _this.pageParams.pageData = data;
            _this.loadGrid();
            _this.enableForm(true, []);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.formPristine();
            _this.logger.log(error);
            _this.errorService.emitError(MessageConstant.Message.GeneralError);
        });
    };
    InvoicePrintMaintenanceComponent.prototype.showErrorModal = function (msg) {
        this.errorModal.show({ msg: msg, title: 'Error' }, false);
    };
    InvoicePrintMaintenanceComponent.prototype.showMessageModal = function (msg) {
        this.messageModal.show({ msg: msg, title: 'Message' }, false);
    };
    InvoicePrintMaintenanceComponent.prototype.populateForm = function () {
        for (var key in this.pageParams.pageData) {
            if (!key) {
                continue;
            }
            this.setControlValue(key, this.pageParams.pageData[key]);
        }
        this.loadGrid();
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    InvoicePrintMaintenanceComponent.prototype.loadGrid = function () {
        var gridURLParams = this.getURLSearchParamObject();
        var gridInputParams = {};
        gridURLParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridURLParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridURLParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridURLParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridURLParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridURLParams.set('InvoiceNumber', this.getControlValue('InvoiceNumber'));
        gridURLParams.set(this.serviceConstants.Action, '2');
        gridInputParams = this.headerParams;
        gridInputParams['search'] = gridURLParams;
        this.invoicePrintLineGrid.loadGridData(gridInputParams);
    };
    InvoicePrintMaintenanceComponent.prototype.getSysChars = function () {
        var _this = this;
        var sysCharURLParams = this.getURLSearchParamObject();
        sysCharURLParams.set(this.serviceConstants.SystemCharNumber, '130');
        this.httpService.sysCharRequest(sysCharURLParams).subscribe(function (data) {
            var records;
            if (!data || !data.records.length) {
                return;
            }
            records = data.records;
            _this.sysCharParams['enableCompanyCode'] = records[0].Required;
            if (_this.sysCharParams['enableCompanyCode']) {
                return;
            }
            var lookUpParam = [{
                    'table': 'Company',
                    'query': {
                        'DefaultCompanyInd': 'TRUE',
                        'BusinessCode': _this.utils.getBusinessCode()
                    },
                    'fields': ['CompanyCode', 'CompanyDesc']
                }];
            _this.ajaxSource.next(_this.ajaxconstant.START);
            _this.LookUp.lookUpPromise(lookUpParam, 1).then(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (!data[0].length) {
                    return;
                }
                _this.setControlValue('CompanyCode', data[0][0]['CompanyCode']);
                _this.setControlValue('CompanyDesc', data[0][0]['CompanyDesc']);
                _this.disableControl('CompanyInvoiceNumber', false);
            }).catch(function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.logger.log(error);
                _this.errorService.emitError(MessageConstant.Message.GeneralError);
            });
        }, function (error) {
            _this.logger.log(error);
            _this.errorService.emitError(MessageConstant.Message.GeneralError);
        });
    };
    InvoicePrintMaintenanceComponent.prototype.onCompanyChange = function (data) {
        var companyCode = data.CompanyCode;
        this.setControlValue('CompanyCode', data.CompanyCode);
        this.setControlValue('CompanyDesc', data.CompanyDesc);
        if (!companyCode) {
            this.enableForm(false, []);
            return;
        }
        this.enableForm(false, ['CompanyInvoiceNumber']);
        if (this.getControlValue('CompanyInvoiceNumber')) {
            this.getInvoiceNumber();
        }
    };
    InvoicePrintMaintenanceComponent.prototype.onCompanyInvoiceNumberChange = function () {
        if (!this.getControlValue('CompanyInvoiceNumber')) {
            this.isFormDisabled = true;
            this.enableForm(false, ['CompanyInvoiceNumber', 'CompanyCode', 'CompanyDesc']);
            this.invoicePrintLineGrid.clearGridData();
            this.clearControls(['CompanyCode', 'CompanyDesc']);
            return;
        }
        if (this.getControlValue('CompanyCode')) {
            this.getInvoiceNumber();
            this.isFormDisabled = false;
        }
    };
    InvoicePrintMaintenanceComponent.prototype.getGridInfo = function (info) {
        var gridTotalItems = this.gridParams.itemsPerPage;
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    };
    InvoicePrintMaintenanceComponent.prototype.onRowSelect = function (data) {
        if (data.cellIndex !== 1) {
            return;
        }
        this.setControlValue('PrintLineNumber', data['trRowData'][0]['text']);
        this.navigate('InvoicePrintLineUpdate', 'maintenance/InvoicePrintLine');
    };
    InvoicePrintMaintenanceComponent.prototype.onInsertLineClick = function () {
        this.navigate('InvoicePrintLineAdd', 'maintenance/InvoicePrintLine');
    };
    InvoicePrintMaintenanceComponent.prototype.onMoveLineClick = function () {
        this.messageService.emitMessage('iCABSAMoveInvoicePrintLine screen is not yet developed!');
    };
    InvoicePrintMaintenanceComponent.prototype.getCurrentPage = function (curPage) {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.loadGrid();
    };
    InvoicePrintMaintenanceComponent.prototype.refresh = function () {
        this.gridParams.currentPage = 1;
        this.loadGrid();
    };
    InvoicePrintMaintenanceComponent.prototype.printInvoice = function () {
        var _this = this;
        var printURLParams = this.getURLSearchParamObject();
        printURLParams.set(this.serviceConstants.Action, '0');
        printURLParams.set(this.serviceConstants.Function, 'Single');
        printURLParams.set('InvoiceNumber', this.pageParams.pageData.ttInvoiceHeader);
        printURLParams.set('Copy', this.getControlValue('CopyInvoice') ? 'True' : 'False');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, printURLParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorService.emitError(MessageConstant.Message.GeneralError);
                return;
            }
            window.open(data.url, '_blank');
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log(error);
            _this.errorService.emitError(MessageConstant.Message.GeneralError);
        });
    };
    InvoicePrintMaintenanceComponent.prototype.saveData = function () {
        this.promptConfirmModal.show();
    };
    InvoicePrintMaintenanceComponent.prototype.confirmSave = function (event) {
        var _this = this;
        var isValidForm = this.riExchange.validateForm(this.uiForm);
        var formData = {};
        var saveQueryParams = this.getURLSearchParamObject();
        if (!isValidForm) {
            return;
        }
        for (var control in this.uiForm.controls) {
            if (!control) {
                continue;
            }
            if (control !== 'CopyInvoice' && control !== 'PrintLineNumber') {
                formData[control] = this.getControlValue(control);
            }
        }
        formData['CompanyCode'] = this.getControlValue('CompanyCode');
        formData['ROWID'] = this.pageParams.pageData.ttInvoiceHeader;
        saveQueryParams.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, saveQueryParams, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorService.emitError(data.errorMessage);
                return;
            }
            if (data.InfoMessage) {
                _this.messageService.emitMessage(data.InfoMessage);
                return;
            }
            _this.messageService.emitMessage(MessageConstant.Message.RecordSavedSuccessfully);
            _this.getInvoiceDetails();
            _this.formPristine();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log(error);
            _this.errorService.emitError(MessageConstant.Message.GeneralError);
        });
    };
    InvoicePrintMaintenanceComponent.prototype.cancelChanges = function () {
        this.populateForm();
    };
    InvoicePrintMaintenanceComponent.prototype.enableForm = function (enable, ignore) {
        if (enable) {
            this.isFormDisabled = false;
            this.uiForm.enable();
        }
        else {
            this.uiForm.disable();
            for (var i = 0; i < ignore.length; i++) {
                this.uiForm.controls[ignore[i]].enable();
            }
        }
    };
    InvoicePrintMaintenanceComponent.prototype.onSaveFocus = function (e) {
        var nextTab = 0;
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('.nav.nav-tabs li');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.nav.nav-tabs li.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            nextTab = currentSelectedIndex + 1;
            this.onTabClick(nextTab);
            setTimeout(function () {
                document.querySelector('.tab-content .tab-pane.active input:not([disabled]), .tab-content .tab-pane.active select:not([disabled])')['focus']();
            }, 100);
        }
        return;
    };
    InvoicePrintMaintenanceComponent.prototype.onInvoiceSearchDataReceived = function (data) {
        this.setControlValue('InvoiceNumber', data);
        this.getInvoiceDetails();
    };
    InvoicePrintMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoicePrintMaintenance.html',
                    styles: ["\n    :host /deep/ .gridtable tbody tr td:nth-child(2),\n    :host /deep/ .gridtable tbody tr td:nth-child(2) div,\n    :host /deep/ .gridtable tbody tr td:nth-child(2) div span {\n        cursor: pointer;\n    }"]
                },] },
    ];
    InvoicePrintMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    InvoicePrintMaintenanceComponent.propDecorators = {
        'companyDropdown': [{ type: ViewChild, args: ['companyDropdown',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'invoicePrintLineGrid': [{ type: ViewChild, args: ['invoicePrintLineGrid',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'invoiceSearchEllipsis': [{ type: ViewChild, args: ['invoiceSearchEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return InvoicePrintMaintenanceComponent;
}(BaseComponent));
