var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
export var RenewalGenerateComponent = (function (_super) {
    __extends(RenewalGenerateComponent, _super);
    function RenewalGenerateComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber' },
            { name: 'ContractName', disabled: true },
            { name: 'TermiteRenewal' },
            { name: 'APIOnTermiteRenewal' },
            { name: 'IncludeNationalAccounts' },
            { name: 'FromDate' },
            { name: 'ToDate' }
        ];
        this.dateReadOnly = false;
        this.DateTo = new Date();
        this.DateFrom = new Date();
        this.inputParamsBranch = {};
        this.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.isRequesting = false;
        this.showMessageHeader = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.ellipsis = {
            contractSearch: {
                disabled: false,
                showCloseButton: true,
                childConfigParams: {
                    parentMode: 'Search',
                    currentContractType: 'C',
                    currentContractTypeURLParameter: '<contract>',
                    showAddNew: true,
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
            }
        };
        this.pageId = PageIdentifier.ICABSRENEWALGENERATE;
        this.pageTitle = 'Renewal Generation';
    }
    RenewalGenerateComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.window_onload();
    };
    RenewalGenerateComponent.prototype.window_onload = function () {
        var _this = this;
        setTimeout(function () {
            _this.setFormMode(_this.c_s_MODE_UPDATE);
        }, 100);
        this.branchNumber = this.utils.getBranchCode();
        this.lookupBranchName();
        var getFromDate = firstOfNextMonth(1);
        this.DateFrom = getFromDate;
        this.FromdtDisplayed = this.utils.formatDate(this.DateFrom);
        var getToDate = firstOfNextMonth(2);
        getToDate.setDate(getToDate.getDate() - 1);
        this.DateTo = getToDate;
        this.TodtDisplayed = this.utils.formatDate(this.DateTo);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIOnTermiteRenewal', 'true');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeNationalAccounts', 'true');
    };
    RenewalGenerateComponent.prototype.lookupBranchName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.utils.getBranchCode()
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Branch = data[0][0];
            if (Branch) {
                _this.negBranchNumberSelected = {
                    id: _this.branchNumber,
                    text: _this.branchNumber + ' - ' + Branch.BranchName
                };
            }
        });
    };
    RenewalGenerateComponent.prototype.onBranchDataReceived = function (obj) {
        this.branchNumber = obj.BranchNumber;
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    };
    RenewalGenerateComponent.prototype.onContractDataReceived = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
    };
    RenewalGenerateComponent.prototype.onContractNumberKeyDown = function (e) {
        if (e.keyCode === 34) {
            this.ellipsis.contractSearch.autoOpenSearch = true;
        }
    };
    RenewalGenerateComponent.prototype.onContractNumberChange = function () {
        var _this = this;
        if (!this.getControlValue('ContractNumber') || this.getControlValue('ContractNumber') === '') {
            this.setControlValue('ContractName', '');
        }
        else {
            var queryParams = {
                operation: 'ApplicationReport/iCABSRenewalGenerate',
                module: 'letters',
                method: 'ccm/maintenance'
            };
            var postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '0');
            var postParams = {};
            postParams.Function = 'GetContractName';
            postParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(queryParams.method, queryParams.module, queryParams.operation, postSearchParams, postParams)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.errorService.emitError(e['oResponse']);
                }
                else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        _this.messageModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                    }
                    else {
                        _this.setControlValue('ContractName', e.ContractName);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    RenewalGenerateComponent.prototype.onSubmit = function (e) {
        var _this = this;
        if (this.FromdtDisplayed === '' || this.TodtDisplayed === '') {
        }
        else {
            var queryParams = {
                operation: 'ApplicationReport/iCABSRenewalGenerate',
                module: 'letters',
                method: 'ccm/maintenance'
            };
            var postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '0');
            var postParams = {};
            postParams.TabSelected = 'ALL';
            postParams.BranchNumber = this.branchNumber;
            postParams.IncludeNationalAccounts = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeNationalAccounts') ? 'yes' : 'no';
            postParams.OnlyTermiteContracts = this.riExchange.riInputElement.GetValue(this.uiForm, 'TermiteRenewal') ? 'yes' : 'no';
            postParams.TermiteAPI = this.riExchange.riInputElement.GetValue(this.uiForm, 'APIOnTermiteRenewal') ? 'yes' : 'no';
            postParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            postParams.RNDateFrom = this.FromdtDisplayed;
            postParams.RNDateTo = this.TodtDisplayed;
            postParams.IncludeRN = 'yes';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(queryParams.method, queryParams.module, queryParams.operation, postSearchParams, postParams)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.errorService.emitError(e['oResponse']);
                }
                else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        _this.messageModal.show({ msg: e['errorMessage'], title: '' }, false);
                    }
                    else {
                        _this.messageModal.show({ msg: e.ReturnHTML, title: '' }, false);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    RenewalGenerateComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.FromdtDisplayed = value.value;
        }
        else {
            this.FromdtDisplayed = '';
        }
    };
    RenewalGenerateComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            this.TodtDisplayed = value.value;
        }
        else {
            this.TodtDisplayed = '';
        }
    };
    RenewalGenerateComponent.prototype.modalHidden = function (e) {
        this.ellipsis.contractSearch.autoOpenSearch = false;
    };
    RenewalGenerateComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    RenewalGenerateComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSRenewalGenerate.html'
                },] },
    ];
    RenewalGenerateComponent.ctorParameters = [
        { type: Injector, },
    ];
    RenewalGenerateComponent.propDecorators = {
        'ContractSearchComponent': [{ type: ViewChild, args: ['ContractSearchComponent',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return RenewalGenerateComponent;
}(BaseComponent));
function firstOfNextMonth(m) {
    var d = new Date();
    d.setMonth(d.getMonth() + m, 1);
    return d;
}
