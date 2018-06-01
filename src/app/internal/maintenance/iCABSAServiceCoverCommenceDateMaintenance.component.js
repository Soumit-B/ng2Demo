var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ServiceCoverCommenceDateMaintenanceComponent = (function (_super) {
    __extends(ServiceCoverCommenceDateMaintenanceComponent, _super);
    function ServiceCoverCommenceDateMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.method = 'contract-management/maintenance';
        this.module = 'service-cover';
        this.operation = 'Application/iCABSAServiceCoverCommenceDateMaintenance';
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.isContractEllipsisDisabled = true;
        this.isPremisesEllipsisDisabled = true;
        this.isProductEllipsisDisabled = true;
        this.autoOpenSearch = false;
        this.showCloseButton = true;
        this.showMessageHeader = true;
        this.showCancel = true;
        this.pageId = '';
        this.confirmdata = {};
        this.regex = /^\d{4}-\d{2}-\d{2}$/;
        this.commenceDate = new Date();
        this.anniversaryDate = new Date();
        this.checkDTLoading = true;
        this.backUpObject = {};
        this.controls = [
            { name: 'ContractNumber', disabled: true, required: false },
            { name: 'ContractName', disabled: true, required: false },
            { name: 'Status', disabled: true, required: false },
            { name: 'PremiseNumber', disabled: true, required: false },
            { name: 'PremiseName', disabled: true, required: false },
            { name: 'ProductCode', disabled: true, required: true },
            { name: 'ProductDesc', disabled: true, required: false },
            { name: 'AccountNumber', disabled: true, required: false },
            { name: 'AccountName', disabled: true, required: false },
            { name: 'ContractAddressLine1', disabled: true, required: false },
            { name: 'ContractAddressLine2', disabled: true, required: false },
            { name: 'ContractAddressLine3', disabled: true, required: false },
            { name: 'ContractAddressLine4', disabled: true, required: false },
            { name: 'ContractAddressLine5', disabled: true, required: false },
            { name: 'ContractPostcode', disabled: true, required: false },
            { name: 'ContractAnnualValue', disabled: true, required: false },
            { name: 'ServiceCover', disabled: true, required: false },
            { name: 'ServiceCommenceDate', disabled: false, required: true },
            { name: 'ServiceVisitAnnivDate', disabled: false, required: true }
        ];
        this.fieldRequired = {
            contractCommenceDate: true,
            annivDate: true
        };
        this.defaultCode = {
            country: 'ZA',
            business: 'D'
        };
        this.dateObjectsEnabled = {
            contractCommenceDate: true,
            annivDate: true
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.queryParamsContract = {
            action: '0',
            operation: 'Application/iCABSAContractMaintenance',
            module: 'contract',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.queryParamsContractCommenceDate = {
            action: '0',
            operation: 'Application/iCABSAContractCommenceDateMaintenanceEx',
            module: 'contract',
            method: '/contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.showHeader = true;
        this.showErrorHeader = true;
        this.contractSearchParams = {
            'parentMode': 'LookUp',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': true,
            'contractNumber': ''
        };
        this.premisesSearchParams = {
            'parentMode': 'LookUp',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<premise>',
            'showAddNew': true,
            'contractNumber': ''
        };
        this.pageId = PageIdentifier.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCE;
    }
    ServiceCoverCommenceDateMaintenanceComponent.prototype.promptSave = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        var formdata = {};
        formdata['ServiceCoverROWID'] = this.getControlValue('ServiceCover');
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
        formdata['ServiceVisitAnnivDate'] = this.getControlValue('ServiceVisitAnnivDate');
        formdata['ServiceAnnualValue'] = this.getControlValue('ContractAnnualValue');
        formdata['Function'] = 'GetStatus';
        formdata['SCRowID'] = this.getControlValue('ServiceCover');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
            }
            else {
                _this.errorModal.show({
                    msg: MessageConstant.Message.RecordSavedSuccessfully
                }, false);
                _this.backUpObject['ServiceCommenceDate'] = _this.getControlValue('ServiceCommenceDate');
                _this.backUpObject['ServiceVisitAnnivDate'] = _this.getControlValue('ServiceVisitAnnivDate');
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            if (error.errorMessage) {
                _this.errorModal.show(error, true);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('Status', this.riExchange.getParentHTMLValue('Status'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName'));
        this.setControlValue('ServiceCover', this.riExchange.getParentAttributeValue('ContractNumberServiceCoverRowID'));
        this.fetchContractCommenceData();
        this.fetchOtherData();
        this.riMaintenance_Search();
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.riMaintenance_Search = function () {
        if (this.getControlValue('ContractNumber') === '') {
            this.isContractEllipsisDisabled = false;
        }
        if (this.getControlValue('ContractNumber') !== '' && this.getControlValue('PremiseNumber') === '') {
            this.isPremisesEllipsisDisabled = false;
        }
        if (this.getControlValue('ContractNumber') !== '' && this.getControlValue('PremiseNumber') !== '') {
            this.isProductEllipsisDisabled = true;
        }
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.modalHidden = function () {
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.onContractDataReceived = function (data) {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.premisesSearchParams.ContractNumber = this.getControlValue('ContractNumber');
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.riMaintenance_Search();
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.callAccountDetails = function () {
        var _this = this;
        var data = [{
                'table': 'Account',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.getControlValue('AccountNumber') },
                'fields': ['AccountNumber', 'AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(data).subscribe(function (data) {
            var Account = data[0][0];
            if (Account) {
                _this.setControlValue('AccountName', Account.AccountName);
                _this.setControlValue('ContractAddressLine1', Account.AccountAddressLine1);
                _this.setControlValue('ContractAddressLine2', Account.AccountAddressLine2);
                _this.setControlValue('ContractAddressLine3', Account.AccountAddressLine3);
                _this.setControlValue('ContractAddressLine4', Account.AccountAddressLine4);
                _this.setControlValue('ContractAddressLine5', Account.AccountAddressLine5);
                _this.setControlValue('ContractPostcode', Account.AccountPostcode);
            }
        });
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.onPremiseDataReceived = function (data) {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.fetchContractCommenceData = function () {
        var _this = this;
        var data = [{
                'table': 'ServiceCover',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.getControlValue('ContractNumber'), 'PremiseNumber': this.getControlValue('PremiseNumber'), 'ProductCode': this.getControlValue('ProductCode'), 'ttServiceCover': this.getControlValue('ServiceCover') },
                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCommenceDate', 'ServiceVisitAnnivDate', 'ServiceAnnualValue', 'ServiceCoverRowID']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(data).subscribe(function (data) {
            if (data.length > 0) {
                var serviceCoverData = data[0];
                var contractData = data[1];
                var premiseData = data[2];
                if (serviceCoverData.length > 0) {
                    for (var i = 0; i < serviceCoverData.length; i++) {
                        if (serviceCoverData[i].ttServiceCover === _this.getControlValue('ServiceCover')) {
                            _this.setControlValue('ServiceCover', serviceCoverData[i].ttServiceCover);
                            _this.setControlValue('ContractAnnualValue', serviceCoverData[i].ServiceAnnualValue);
                            _this.getStatus();
                            _this.backUpObject['ServiceCommenceDate'] = serviceCoverData[i].ServiceCommenceDate;
                            _this.backUpObject['ServiceVisitAnnivDate'] = serviceCoverData[i].ServiceVisitAnnivDate;
                            _this.setCommenceDate(serviceCoverData[i].ServiceCommenceDate);
                            _this.setAnniversaryeDate(serviceCoverData[i].ServiceVisitAnnivDate);
                            break;
                        }
                    }
                }
            }
        });
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.getStatus = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        var formdata = {};
        formdata['Function'] = 'GetStatus';
        formdata['SCRowID'] = this.getControlValue('ServiceCover');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            _this.setControlValue('Status', data.Status);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            if (error.errorMessage) {
                _this.errorModal.show(error, true);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.CheckCommenceDate = function () {
        var _this = this;
        if (this.checkDTLoading === true) {
            this.search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, '6');
            var formdata = {};
            formdata['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
            formdata['Function'] = 'GetAnniversaryDate,WarnCommenceDate';
            formdata['SCRowID'] = this.getControlValue('ServiceCover');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(function (data) {
                if (data.hasOwnProperty('errorMessage')) {
                    _this.errorModal.show(data, true);
                }
                else {
                    if (data.hasOwnProperty('ErrorMessage')) {
                        if (data.ErrorMessage !== '')
                            _this.errorModal.show({ msg: data.ErrorMessage, title: 'Error' }, false);
                        _this.setAnniversaryeDate(data.ServiceVisitAnnivDate);
                    }
                    else {
                        _this.setAnniversaryeDate(data.ServiceVisitAnnivDate);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                if (error.errorMessage) {
                    _this.errorModal.show(error, true);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        this.checkDTLoading = true;
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.fetchOtherData = function () {
        var _this = this;
        var data = [
            {
                'table': 'Product',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ProductCode': this.getControlValue('ProductCode') },
                'fields': ['ProductCode', 'ProductDesc']
            },
            {
                'table': 'Premise',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.getControlValue('ContractNumber'), 'PremiseNumber': this.getControlValue('PremiseNumber') },
                'fields': ['PremiseNumber', 'PremiseName']
            },
            {
                'table': 'Contract',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.getControlValue('ContractNumber') },
                'fields': ['ContractName', 'AccountNumber']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(data).subscribe(function (data) {
            var Product = data[0][0];
            if (Product) {
                _this.setControlValue('ProductDesc', Product.ProductDesc);
            }
            var Premise = data[1][0];
            if (Premise) {
                _this.setControlValue('PremiseName', Premise.PremiseName);
            }
            var Contract = data[2][0];
            if (Contract) {
                _this.setControlValue('ContractName', Contract.ContractName);
                _this.setControlValue('AccountNumber', Contract.AccountNumber);
            }
        });
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.onSubmit = function (e) {
        e.preventDefault();
        this.CommencePicker.validateDateField();
        this.annivDatePicker.validateDateField();
        if (this.uiForm.valid) {
            this.callAccountDetails();
            this.promptTitle = 'Confirm';
            this.promptContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.isValidDate = function (date) {
        return date.match(this.regex) != null;
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.setCommenceDate = function (date) {
        if (date) {
            this.setDateDisplay = date;
        }
        else {
            this.setDateDisplay = null;
        }
        if (!this.setDateDisplay) {
            this.commenceDate = null;
            this.setControlValue('ServiceCommenceDate', '');
        }
        else {
            if (this.isValidDate(this.setDateDisplay))
                this.commenceDate = new Date(this.setDateDisplay);
            else
                this.commenceDate = new Date(this.utils.convertDate(this.setDateDisplay));
            this.setControlValue('ServiceCommenceDate', this.utils.formatDate(this.commenceDate));
        }
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.setAnniversaryeDate = function (date) {
        if (date) {
            this.setDateDisplay = date;
        }
        else {
            this.setDateDisplay = null;
        }
        if (!this.setDateDisplay) {
            this.anniversaryDate = null;
            this.setControlValue('ServiceVisitAnnivDate', '');
        }
        else {
            if (this.isValidDate(this.setDateDisplay))
                this.anniversaryDate = new Date(this.setDateDisplay);
            else
                this.anniversaryDate = new Date(this.utils.convertDate(this.setDateDisplay));
            this.setControlValue('ServiceVisitAnnivDate', this.utils.formatDate(this.anniversaryDate));
        }
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.commenceDateSelectedValue = function (value) {
        if (value && value.value) {
            if (this.getControlValue('ServiceCommenceDate') !== '' && value.value !== this.getControlValue('ServiceCommenceDate')) {
                this.setControlValue('ServiceCommenceDate', value.value);
                this.CheckCommenceDate();
            }
        }
        this.setDateDisplay = value.value;
        this.setControlValue('ServiceCommenceDate', this.setDateDisplay);
        this.setCommenceDate(this.setDateDisplay);
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.annivDateSelectedValue = function (value) {
        this.setDateDisplay = value.value;
        this.setControlValue('ServiceVisitAnnivDate', this.setDateDisplay);
        this.setAnniversaryeDate(this.setDateDisplay);
    };
    ServiceCoverCommenceDateMaintenanceComponent.prototype.oncancel = function (event) {
        this.setCommenceDate(this.backUpObject['ServiceCommenceDate']);
        this.setAnniversaryeDate(this.backUpObject['ServiceVisitAnnivDate']);
    };
    ServiceCoverCommenceDateMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverCommenceDateMaintenance.html'
                },] },
    ];
    ServiceCoverCommenceDateMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverCommenceDateMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'CommencePicker': [{ type: ViewChild, args: ['CommencePicker',] },],
        'annivDatePicker': [{ type: ViewChild, args: ['annivDatePicker',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptModal',] },],
    };
    return ServiceCoverCommenceDateMaintenanceComponent;
}(BaseComponent));
