var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
export var CustomerInformationMaintenanceComponent = (function (_super) {
    __extends(CustomerInformationMaintenanceComponent, _super);
    function CustomerInformationMaintenanceComponent(injector, titleService) {
        _super.call(this, injector);
        this.titleService = titleService;
        this.pageId = '';
        this.promptTitle = '';
        this.promptContent = '';
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.showHeader = true;
        this.requestParams = {
            operation: 'Application/iCABSACustomerInformationMaintenance',
            module: 'customer',
            method: 'contract-management/maintenance'
        };
        this.search = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.querySysChar = new URLSearchParams();
        this.controls = [{
                name: 'GroupAccountNumber',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'GroupName',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'AccountNumber',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'AccountName',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'ContractNumber',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'ContractName',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'CustomerInfoNumber',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'BranchNumber',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'CustomerInfoName',
                readonly: false,
                disabled: true,
                required: false
            }, {
                name: 'ContractInfo',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'ContractPrices',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'JobInfo',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'JobPrices',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'ProductSalesInfo',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'ProductSalesPrices',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'EntitlementInfo',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'EntitlementPrice',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'ServiceInfo',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'OtherInfo',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'ConfidentialInfo',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'Save',
                readonly: false,
                disabled: false,
                required: false
            }, {
                name: 'Cancel',
                readonly: false,
                disabled: false,
                required: false
            }
        ];
        this.fieldVisibility = {};
        this.dropdownList = {};
        this.fieldRequired = {
            CustomerInfoNumber: false
        };
        this.syschars = {};
        this.otherVariables = {
            Mode: '',
            CallingProg: '',
            InfoLevel: '',
            FunctionUpdate: true,
            CustomerInformationDetailROWID: ''
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.uiDisplay = {
            tab: {
                tab1: {
                    visible: true,
                    active: true,
                    error: false,
                    highlight: false
                },
                tab2: {
                    visible: true,
                    active: false,
                    error: false,
                    highlight: false
                },
                tab3: {
                    visible: true,
                    active: false,
                    error: false,
                    highlight: false
                },
                tab4: {
                    visible: true,
                    active: false,
                    error: false,
                    highlight: false
                },
                tab5: {
                    visible: true,
                    active: false,
                    error: false,
                    highlight: false
                },
                tab6: {
                    visible: true,
                    active: false,
                    error: false,
                    highlight: false
                },
                tab7: {
                    visible: true,
                    active: false,
                    error: false,
                    highlight: false
                }
            }
        };
        this.showCloseButton = true;
        this.formRawClone = {};
        this.pageId = PageIdentifier.ICABSACUSTOMERINFORMATIONMAINTENANCE;
    }
    CustomerInformationMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Customer Information Maintenance';
        this.queryParams = this.riExchange.getRouterParams();
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName'));
        this.setControlValue('GroupAccountNumber', this.riExchange.getParentHTMLValue('GroupAccountNumber'));
        this.setControlValue('GroupName', this.riExchange.getParentHTMLValue('GroupName'));
        this.setControlValue('CustomerInfoNumber', this.riExchange.getParentHTMLValue('CustomerInfoNumber'));
        this.setControlValue('CustomerInfoName', this.riExchange.getParentHTMLValue('CustomerInfoName'));
        this.otherVariables['Mode'] = this.riExchange.getParentHTMLValue('Mode');
        this.otherVariables['CallingProg'] = this.riExchange.getParentHTMLValue('CallingProg');
        this.otherVariables['InfoLevel'] = this.riExchange.getParentHTMLValue('InfoLevel');
        if (this.otherVariables['CallingProg'] === 'ServiceCover' || (this.otherVariables['CallingProg'] === 'GroupAccount' && this.otherVariables['InfoLevel'] !== 'GroupAccount') || (this.otherVariables['CallingProg'] === 'Account' && this.otherVariables['InfoLevel'] !== 'Account') || (this.otherVariables['CallingProg'] === 'Contract' && this.otherVariables['InfoLevel'] !== 'Contract')) {
            this.otherVariables['FunctionUpdate'] = false;
        }
        if (this.otherVariables['CallingProg'] === 'CustomerInfoMaint') {
            this.otherVariables['FunctionUpdate'] = true;
        }
        if (this.parentMode.toUpperCase() === 'NEW' || this.parentMode.toUpperCase() === 'UPDATE') {
            this.otherVariables['FunctionUpdate'] = true;
        }
        if (this.otherVariables['CallingProg'] === 'GroupAccount') {
            this.setControlValue('CustomerInfoName', this.riExchange.getParentHTMLValue('GroupName'));
        }
        if (this.getControlValue('CustomerInfoName') === '') {
            this.setControlValue('CustomerInfoName', this.riExchange.getParentHTMLValue('AccountName'));
        }
        if (this.parentMode.toUpperCase() === 'NEW' && (this.getControlValue('BranchNumber') === '0' || this.getControlValue('BranchNumber') === '')) {
            this.setControlValue('BranchNumber', this.utils.getBranchCode());
        }
        setTimeout(function () {
            var elem = document.querySelector('#ContractInfo');
            if (elem) {
                elem['focus']();
            }
        }, 0);
        this.fetchTranslationContent();
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.postInit();
        this.routeAwayGlobals.setDirtyFlag(true);
    };
    CustomerInformationMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    CustomerInformationMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    CustomerInformationMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.errorModal.show(data, false);
    };
    CustomerInformationMaintenanceComponent.prototype.renderTab = function (tabindex) {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 4:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = true;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 5:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = true;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 6:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = true;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 7:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = true;
                break;
        }
    };
    CustomerInformationMaintenanceComponent.prototype.onCancel = function (event) {
        this.uiForm.setValue(this.formRawClone);
        this.fetchTranslationContent();
        if (this.parentMode.toUpperCase() === 'NEW') {
            this.uiForm.disable();
            this.setControlValue('CustomerInfoNumber', '');
            this.setControlValue('CustomerInfoName', '');
            this.setControlValue('BranchNumber', '');
            this.otherVariables['FunctionUpdate'] = false;
        }
        this.formPristine();
    };
    CustomerInformationMaintenanceComponent.prototype.onSaveKey = function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('#tabCont .nav-tabs li:not(.hidden) a');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('#tabCont .nav-tabs li:not(.hidden) a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            elemList[currentSelectedIndex + 1]['click']();
            setTimeout(function () {
                var elem = document.querySelector('#tabCont .tab-content .tab-pane.active .ui-select-toggle, #tabCont .tab-content .tab-pane.active input:not([disabled]), #tabCont .tab-content .tab-pane.active select:not([disabled]), #tabCont .tab-content .tab-pane.active textarea:not([disabled])');
                if (elem) {
                    elem['focus']();
                }
            }, 0);
        }
        return;
    };
    CustomerInformationMaintenanceComponent.prototype.onSave = function (event) {
        var _this = this;
        var obj = {};
        var action = 0;
        if (this.parentMode.toUpperCase() === 'NEW') {
            obj = {
                ContractNumber: this.getControlValue('ContractNumber'),
                AccountNumber: this.getControlValue('AccountNumber'),
                GroupAccountNumber: this.getControlValue('GroupAccountNumber'),
                CallingProg: this.otherVariables['CallingProg'],
                Mode: this.otherVariables['Mode']
            };
            action = 1;
        }
        else {
            obj = {
                CustomerInformationDetailROWID: this.otherVariables['CustomerInformationDetailROWID']
            };
            action = 2;
        }
        this.fetchCustomerInformationPost('', {
            action: action
        }, Object.assign({}, obj, {
            CustomerInfoNumber: this.getControlValue('CustomerInfoNumber'),
            BranchNumber: this.getControlValue('BranchNumber'),
            CustomerInfoName: this.getControlValue('CustomerInfoName'),
            ContractInfo: this.getControlValue('ContractInfo'),
            ContractPrices: this.getControlValue('ContractPrices'),
            JobInfo: this.getControlValue('JobInfo'),
            JobPrices: this.getControlValue('JobPrices'),
            ProductSalesInfo: this.getControlValue('ProductSalesInfo'),
            ProductSalesPrices: this.getControlValue('ProductSalesPrices'),
            EntitlementInfo: this.getControlValue('EntitlementInfo'),
            EntitlementPrice: this.getControlValue('EntitlementPrice'),
            ServiceInfo: this.getControlValue('ServiceInfo'),
            OtherInfo: this.getControlValue('OtherInfo'),
            ConfidentialInfo: this.getControlValue('ConfidentialInfo')
        })).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data['errorMessage']) {
                    _this.errorService.emitError(data);
                }
                else {
                    if (_this.parentMode.toUpperCase() === 'NEW') {
                        _this.setControlValue('CustomerInfoNumber', data['CustomerInfoNumber']);
                        _this.otherVariables['FunctionUpdate'] = false;
                        _this.uiForm.disable();
                    }
                    _this.showMessageModal({
                        msg: MessageConstant.Message.RecordSavedSuccessfully,
                        title: 'Message'
                    });
                    _this.cloneForm();
                    _this.afterSave();
                    _this.formPristine();
                }
            }
        });
    };
    CustomerInformationMaintenanceComponent.prototype.afterSave = function () {
        this.highlightTabs();
    };
    CustomerInformationMaintenanceComponent.prototype.promptSave = function (event) {
    };
    CustomerInformationMaintenanceComponent.prototype.toTitleCase = function (control) {
        this.setControlValue(control, this.utils.toTitleCase(this.getControlValue(control)));
    };
    CustomerInformationMaintenanceComponent.prototype.fetchCustomerLookUp = function () {
        var _this = this;
        var data = [{
                'table': 'CustomerInformationDetail',
                'query': {
                    'CustomerInfoNumber': this.getControlValue('CustomerInfoNumber'),
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['BranchNumber', 'CustomerInfoName', 'ContractInfo', 'ContractPrices', 'JobInfo', 'JobPrices', 'ProductSalesInfo', 'ProductSalesPrices', 'EntitlementInfo', 'EntitlementPrice', 'ServiceInfo', 'OtherInfo', 'ConfidentialInfo']
            },
            {
                'table': 'Account',
                'query': {
                    'AccountNumber': this.getControlValue('AccountNumber'),
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['AccountName']
            }];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0 && _this.getControlValue('CustomerInfoNumber') !== '') {
                    _this.setControlValue('BranchNumber', e['results'][0][0].BranchNumber);
                    _this.setControlValue('CustomerInfoName', e['results'][0][0].CustomerInfoName);
                    _this.setControlValue('ContractInfo', e['results'][0][0].ContractInfo);
                    _this.setControlValue('ContractPrices', e['results'][0][0].ContractPrices);
                    _this.setControlValue('JobInfo', e['results'][0][0].JobInfo);
                    _this.setControlValue('JobPrices', e['results'][0][0].JobPrices);
                    _this.setControlValue('ProductSalesInfo', e['results'][0][0].ProductSalesInfo);
                    _this.setControlValue('ProductSalesPrices', e['results'][0][0].ProductSalesPrices);
                    _this.setControlValue('EntitlementInfo', e['results'][0][0].EntitlementInfo);
                    _this.setControlValue('EntitlementPrice', e['results'][0][0].EntitlementPrice);
                    _this.setControlValue('ServiceInfo', e['results'][0][0].ServiceInfo);
                    _this.setControlValue('OtherInfo', e['results'][0][0].OtherInfo);
                    _this.setControlValue('ConfidentialInfo', e['results'][0][0].ConfidentialInfo);
                    _this.otherVariables['CustomerInformationDetailROWID'] = e['results'][0][0].ttCustomerInformationDetail;
                    _this.highlightTabs();
                    if (_this.getControlValue('BranchNumber') === _this.utils.getBranchCode() || _this.getControlValue('BranchNumber') === '0' || _this.getControlValue('BranchNumber') === '') {
                        _this.otherVariables['FunctionUpdate'] = true;
                    }
                    else {
                        _this.otherVariables['FunctionUpdate'] = false;
                        _this.uiForm.disable();
                    }
                }
                if (e['results'][1].length > 0) {
                    _this.setControlValue('AccountName', e['results'][1][0].AccountName);
                }
                _this.cloneForm();
            }
            else {
            }
        }, function (error) {
        });
    };
    CustomerInformationMaintenanceComponent.prototype.postInit = function () {
        this.buildTabs();
        this.highlightTabs();
        this.cloneForm();
        if (this.parentMode.toUpperCase() === 'NEW') {
            this.fieldRequired['CustomerInfoNumber'] = false;
        }
        else {
            this.fieldRequired['CustomerInfoNumber'] = true;
        }
        this.fetchCustomerLookUp();
    };
    CustomerInformationMaintenanceComponent.prototype.cloneForm = function () {
        this.formRawClone = this.uiForm.getRawValue();
        for (var i in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(i) && (this.uiForm.controls[i].value === undefined || this.uiForm.controls[i].value === null)) {
                this.uiForm.controls[i].setValue('');
                this.formRawClone[i] = '';
            }
        }
    };
    CustomerInformationMaintenanceComponent.prototype.buildTabs = function () {
        if (this.getControlValue('BranchNumber') === this.utils.getBranchCode() || this.getControlValue('BranchNumber') === '0' || this.getControlValue('BranchNumber') === '') {
            this.uiDisplay.tab.tab7.visible = true;
        }
        else {
            this.uiDisplay.tab.tab7.visible = false;
        }
    };
    CustomerInformationMaintenanceComponent.prototype.highlightTabs = function () {
        this.clearHighlights();
        if (this.getControlValue('ContractInfo') !== '' || this.getControlValue('ContractPrices') !== '') {
            this.uiDisplay.tab.tab1.highlight = true;
        }
        if (this.getControlValue('JobInfo') !== '' || this.getControlValue('JobPrices') !== '') {
            this.uiDisplay.tab.tab2.highlight = true;
        }
        if (this.getControlValue('ProductSalesInfo') !== '' || this.getControlValue('ProductSalesPrices') !== '') {
            this.uiDisplay.tab.tab3.highlight = true;
        }
        if (this.getControlValue('EntitlementInfo') !== '' || this.getControlValue('EntitlementPrice') !== '') {
            this.uiDisplay.tab.tab4.highlight = true;
        }
        if (this.getControlValue('ServiceInfo') !== '') {
            this.uiDisplay.tab.tab5.highlight = true;
        }
        if (this.getControlValue('OtherInfo') !== '') {
            this.uiDisplay.tab.tab6.highlight = true;
        }
        if (this.getControlValue('BranchNumber') === this.utils.getBranchCode() || this.getControlValue('BranchNumber') === '0' || this.getControlValue('BranchNumber') === '') {
            if (this.getControlValue('ConfidentialInfo') !== '') {
                this.uiDisplay.tab.tab7.highlight = true;
            }
        }
    };
    CustomerInformationMaintenanceComponent.prototype.clearHighlights = function () {
        this.uiDisplay.tab.tab1.highlight = false;
        this.uiDisplay.tab.tab2.highlight = false;
        this.uiDisplay.tab.tab3.highlight = false;
        this.uiDisplay.tab.tab4.highlight = false;
        this.uiDisplay.tab.tab5.highlight = false;
        this.uiDisplay.tab.tab6.highlight = false;
        this.uiDisplay.tab.tab7.highlight = false;
    };
    CustomerInformationMaintenanceComponent.prototype.fetchCustomerInformationGet = function (functionName, params) {
        var queryCustomer = new URLSearchParams();
        queryCustomer.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryCustomer.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryCustomer.set(this.serviceConstants.Action, '6');
            queryCustomer.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                queryCustomer.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryCustomer);
    };
    CustomerInformationMaintenanceComponent.prototype.fetchCustomerInformationPost = function (functionName, params, formData) {
        var queryCustomer = new URLSearchParams();
        queryCustomer.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryCustomer.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryCustomer.set(this.serviceConstants.Action, '6');
            formData['Function'] = functionName;
        }
        for (var key in params) {
            if (key) {
                queryCustomer.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryCustomer, formData);
    };
    CustomerInformationMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    CustomerInformationMaintenanceComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Save', null).subscribe(function (res) {
            if (res) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Save', res);
            }
        });
        this.getTranslatedValue('Cancel', null).subscribe(function (res) {
            if (res) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Cancel', res);
            }
        });
    };
    CustomerInformationMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSACustomerInformationMaintenance.html',
                    styles: ["\n\n      textarea {\n        min-height: 200px;\n      }\n\n  "]
                },] },
    ];
    CustomerInformationMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: Title, },
    ];
    CustomerInformationMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return CustomerInformationMaintenanceComponent;
}(BaseComponent));
