var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { ContractSearchComponent } from '../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from '../../../internal/search/iCABSAServiceCoverSearch';
import { MessageConstant } from './../../../../shared/constants/message.constant';
export var ServiceCoverFirstVisitComponent = (function (_super) {
    __extends(ServiceCoverFirstVisitComponent, _super);
    function ServiceCoverFirstVisitComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber' },
            { name: 'ContractName' },
            { name: 'status' },
            { name: 'PremiseNumber' },
            { name: 'PremiseName' },
            { name: 'ProductCode' },
            { name: 'ProductDesc' },
            { name: 'ServiceVisitFrequency' },
            { name: 'ServiceAnnualValue' },
            { name: 'ServiceQuantity' },
            { name: 'InvoiceOnFirstVisitInd' }
        ];
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.isRequesting = false;
        this.isSaveEnabled = false;
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.showMessageHeader = true;
        this.dateObjectsEnabled = {
            contractCommenceDate: false,
            annivDate: false
        };
        this.fieldRequired = {
            contractCommenceDate: true,
            annivDate: true
        };
        this.contractSearchComponent = ContractSearchComponent;
        this.ellipsis = {
            contractSearch: {
                disabled: false,
                showCloseButton: true,
                childConfigParams: {
                    parentMode: 'Search',
                    currentContractType: 'J',
                    currentContractTypeURLParameter: 'Job',
                    showAddNew: false,
                    contractNumber: ''
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                showHeader: true,
                showAddNew: false,
                autoOpenSearch: false,
                setFocus: false,
                component: ContractSearchComponent
            },
            premiseSearch: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'Search',
                    'ContractNumber': '',
                    'ContractName': '',
                    'currentContractType': 'J',
                    'currentContractTypeURLParameter': 'Job',
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PremiseSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            serviceCoverSearch: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'Search',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': '',
                    'currentContractType': 'J',
                    'currentContractTypeURLParameter': 'Job',
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: ServiceCoverSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.promptContent = '';
        this.isSaveDisabled = true;
        this.isCancelDisabled = true;
        this.pageId = PageIdentifier.ICABSASERVICECOVERINVOICEONFIRSTVISITMAINTENANCE;
    }
    ServiceCoverFirstVisitComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        var title = 'Service Cover Invoice On First/Last Visit Maintenance';
        this.pageParams.currentContractType = 'J';
        this.pageParams.currentContractTypeURLParameter = 'Job';
        this.getTranslatedValue(title, null).subscribe(function (res) {
            if (res) {
                title = res;
            }
            _this.pageTitle = title;
        });
        this.getTranslatedValue(this.pageParams.currentContractTypeURLParameter, null).subscribe(function (res) {
            if (res) {
                console.log(res);
                _this.pageParams.currentContractTypeURLParameter = res;
            }
        });
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.window_onload();
    };
    ServiceCoverFirstVisitComponent.prototype.ngAfterViewInit = function () {
        this.ellipsis.contractSearch.autoOpenSearch = true;
    };
    ServiceCoverFirstVisitComponent.prototype.window_onload = function () {
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceVisitFrequency');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceAnnualValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceQuantity');
        this.riExchange.riInputElement.Disable(this.uiForm, 'status');
        this.riExchange.riInputElement.Disable(this.uiForm, 'invoiceOnFirstVisitIndStatus');
    };
    ServiceCoverFirstVisitComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverFirstVisitComponent.prototype.contractNumberOnChange = function (obj) {
        this.setFormMode(this.c_s_MODE_SELECT);
        if (obj.value !== '') {
            this.setControlValue('ContractNumber', this.utils.numberPadding(obj.value, 8));
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
        this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
        this.clearData();
        this.callLookupData('Contract');
    };
    ServiceCoverFirstVisitComponent.prototype.premiseNumberOnChange = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
        this.clearData();
        if (/^[0-9]+$/.test(this.getControlValue('PremiseNumber'))) {
            this.callLookupData('Premise');
        }
    };
    ServiceCoverFirstVisitComponent.prototype.productCodeOnChange = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.uiForm.controls['ProductCode'].value.toUpperCase());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.clearData();
        this.callLookupData('Product');
    };
    ServiceCoverFirstVisitComponent.prototype.contractNumberOnKeyDown = function (event) {
        if (event.keyCode === 34) {
            this.ellipsis.contractSearch.autoOpenSearch = true;
        }
    };
    ServiceCoverFirstVisitComponent.prototype.premiseNumberOnKeyDown = function (event) {
        if (event.keyCode === 34) {
            this.ellipsis.premiseSearch.autoOpenSearch = true;
        }
    };
    ServiceCoverFirstVisitComponent.prototype.productCodeOnKeyDown = function (event) {
        if (event.keyCode === 34) {
            this.ellipsis.serviceCoverSearch.autoOpenSearch = true;
        }
    };
    ServiceCoverFirstVisitComponent.prototype.callLookupData = function (type) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.riExchange.riInputElement.Disable(this.uiForm, 'invoiceOnFirstVisitIndStatus');
        this.isSaveEnabled = false;
        var lookupIP = [];
        if (type === 'Contract') {
            lookupIP = [
                {
                    'table': 'Contract',
                    'query': {
                        'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        'BusinessCode': this.businessCode
                    },
                    'fields': ['ContractNumber', 'ContractName']
                }
            ];
        }
        else if (type === 'Premise') {
            lookupIP = [
                {
                    'table': 'Premise',
                    'query': {
                        'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        'BusinessCode': this.businessCode,
                        'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                    },
                    'fields': ['PremiseNumber', 'PremiseName']
                }
            ];
        }
        else if (type === 'Product') {
            lookupIP = [
                {
                    'table': 'Product',
                    'query': {
                        'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                        'BusinessCode': this.businessCode
                    },
                    'fields': ['ProductCode', 'ProductDesc']
                }
            ];
        }
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0].length > 0) {
                if (type === 'Contract') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', data[0][0].ContractName);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                    _this.clearData();
                    _this.ellipsis.premiseSearch.childConfigParams.ContractNumber = data[0][0].ContractNumber;
                    _this.ellipsis.premiseSearch.childConfigParams.ContractName = data[0][0].ContractName;
                    _this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = data[0][0].ContractNumber;
                    _this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = data[0][0].ContractName;
                }
                else if (type === 'Premise') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', data[0][0].PremiseName);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                    _this.clearData();
                    _this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = _this.getControlValue('ContractNumber');
                    _this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = data[0][0].PremiseNumber;
                    _this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = _this.getControlValue('ContractName');
                    _this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = data[0][0].PremiseName;
                }
                else if (type === 'Product') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', data[0][0].ProductDesc);
                    _this.clearData();
                    _this.fetchAllDetails();
                }
            }
            else {
                if (type === 'Contract') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                    _this.clearData();
                    _this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
                    _this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
                    _this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
                    _this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
                }
                else if (type === 'Premise') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                    _this.clearData();
                    _this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
                    _this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
                    _this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
                    _this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
                }
                else if (type === 'Product') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                    _this.clearData();
                    _this.fetchAllDetails();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverFirstVisitComponent.prototype.setActiveParams = function () {
        this.clearData();
        if (this.formData.ContractName && this.formData.ContractNumber) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.formData.ContractNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.formData.ContractName);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.formData.ContractNumber;
            this.ellipsis.premiseSearch.childConfigParams.ContractName = this.formData.ContractName;
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.formData.ContractNumber;
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.formData.ContractName;
            this.fetchAllDetails();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
        }
        if (this.formData.PremiseName && this.formData.PremiseNumber) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.formData.PremiseName);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.formData.PremiseNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = this.formData.PremiseNumber;
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = this.formData.PremiseName;
            this.fetchAllDetails();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
        }
        if (this.formData.ProductDesc && this.formData.ProductCode) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.formData.ProductDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.formData.ProductCode);
            this.fetchAllDetails();
        }
    };
    ServiceCoverFirstVisitComponent.prototype.onContractDataReceived = function (data) {
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
        this.clearData();
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.premiseSearch.childConfigParams.ContractName = data.ContractName;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = data.ContractName;
    };
    ServiceCoverFirstVisitComponent.prototype.onPremiseDataReceived = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', null);
        this.clearData();
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = data.PremiseNumber;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = data.PremiseName;
    };
    ServiceCoverFirstVisitComponent.prototype.onProductDataReceived = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.row.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.row.ProductDesc);
        this.clearData();
        this.fetchAllDetails();
    };
    ServiceCoverFirstVisitComponent.prototype.disableButtons = function (disable) {
        this.isSaveDisabled = disable;
        this.isCancelDisabled = disable;
    };
    ServiceCoverFirstVisitComponent.prototype.fetchAllDetails = function () {
        var _this = this;
        var queryParams = {
            operation: 'Application/iCABSAServiceCoverInvoiceOnFirstVisitMaintenance',
            module: 'invoicing',
            method: 'bill-to-cash/maintenance'
        };
        var searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        searchParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        searchParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        searchParams.set('ContractTypeCode', this.pageParams.currentContractType);
        if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber') && this.getControlValue('ProductCode')) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(queryParams.method, queryParams.module, queryParams.operation, searchParams)
                .subscribe(function (data) {
                if (data.errorMessage || data.errorNumber === 0) {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                    else {
                    }
                }
                else {
                    var invoiceOnFirstVisitInd = data.InvoiceOnFirstVisitInd === 'no' ? false : true;
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceOnFirstVisitInd', invoiceOnFirstVisitInd);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PortfolioStatusCode', data.PortfolioStatusCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceQuantity', data.ServiceQuantity);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', data.ServiceVisitFrequency);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceAnnualValue', data.ServiceAnnualValue);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'status', data.Status);
                    _this.isSaveEnabled = true;
                    _this.riExchange.riInputElement.Enable(_this.uiForm, 'InvoiceOnFirstVisitInd');
                    _this.formData.serviceCover = data.ServiceCover;
                    var getDate = data.ServiceCommenceDate;
                    if (window['moment'](getDate, 'DD/MM/YYYY', true).isValid()) {
                        getDate = _this.utils.convertDate(getDate);
                    }
                    else {
                        getDate = _this.utils.formatDate(getDate);
                    }
                    _this.contractCommenceDate = new Date(getDate);
                    _this.disableButtons(false);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    ServiceCoverFirstVisitComponent.prototype.commenceDateSelectedValue = function (value) {
    };
    ServiceCoverFirstVisitComponent.prototype.updateAllDetails = function () {
        this.promptModal.show();
    };
    ServiceCoverFirstVisitComponent.prototype.promptSave = function (event) {
        var _this = this;
        var queryParams = {
            operation: 'Application/iCABSAServiceCoverInvoiceOnFirstVisitMaintenance',
            module: 'invoicing',
            method: 'bill-to-cash/maintenance'
        };
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        postParams.ServiceCoverROWID = this.formData.serviceCover;
        postParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        postParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        postParams.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        postParams.ServiceVisitFrequency = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency');
        postParams.ServiceQuantity = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity');
        postParams.ServiceAnnualValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAnnualValue');
        postParams.ServiceCommenceDate = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCommenceDate');
        postParams.InvoiceOnFirstVisitInd = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceOnFirstVisitInd') ? 'yes' : 'no';
        postParams.ContractTypeCode = this.pageParams.currentContractType;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(queryParams.method, queryParams.module, queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverFirstVisitComponent.prototype.modalHidden = function (e) {
        this.ellipsis.contractSearch.autoOpenSearch = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceOnFirstVisitInd');
    };
    ServiceCoverFirstVisitComponent.prototype.onCancel = function () {
        this.fetchAllDetails();
    };
    ServiceCoverFirstVisitComponent.prototype.clearData = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'status', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceAnnualValue', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceQuantity', null);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceOnFirstVisitInd', null);
        this.isSaveEnabled = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceOnFirstVisitInd');
        this.contractCommenceDate = null;
        this.disableButtons(true);
    };
    ServiceCoverFirstVisitComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverInvoiceOnFirstVisitMaintenance.html'
                },] },
    ];
    ServiceCoverFirstVisitComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverFirstVisitComponent.propDecorators = {
        'contractNumber': [{ type: ViewChild, args: ['contractNumber',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'ContractSearchComponent': [{ type: ViewChild, args: ['ContractSearchComponent',] },],
        'premisesNumberEllipsis': [{ type: ViewChild, args: ['premisesNumberEllipsis',] },],
        'productcodeEllipsis': [{ type: ViewChild, args: ['productcodeEllipsis',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return ServiceCoverFirstVisitComponent;
}(BaseComponent));
