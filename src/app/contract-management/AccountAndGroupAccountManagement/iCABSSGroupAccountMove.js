var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { ActionTypes } from '../../actions/account';
export var GroupAccountMoveComponent = (function (_super) {
    __extends(GroupAccountMoveComponent, _super);
    function GroupAccountMoveComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'GroupAccountNumber1', required: true },
            { name: 'GroupName1', readonly: true, disabled: true, required: false },
            { name: 'GroupAgreementNumber1', readonly: true, disabled: true, required: false },
            { name: 'GroupAgreementDate1', disabled: true },
            { name: 'GroupContactName1', disabled: true },
            { name: 'GroupContactTelephone1', disabled: true },
            { name: 'GroupContactEMail1', disabled: true },
            { name: 'GroupAccountNumber2', required: true },
            { name: 'GroupName2', readonly: true, disabled: true, required: false },
            { name: 'GroupAgreementNumber2', disabled: true },
            { name: 'GroupAgreementDate2', disabled: true },
            { name: 'GroupContactName2', disabled: true },
            { name: 'GroupContactTelephone2', disabled: true },
            { name: 'GroupContactEMail2', disabled: true }
        ];
        this.isRequesting = false;
        this.toGroupAccountAutoOpen = false;
        this.fromGroupAccountAutoOpen = false;
        this.toGroupAccountShowCloseButton = true;
        this.fromGroupAccountShowCloseButton = true;
        this.fromGroupAccountSearchComponent = GroupAccountNumberComponent;
        this.toGroupAccountSearchComponent = GroupAccountNumberComponent;
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.showHeader = true;
        this.isFormEnabled = false;
        this.statusMessage = 'This function moves all accounts attached to a given group account to another group account.';
        this.queryParams = {
            operation: 'System/iCABSSGroupAccountMove',
            module: 'group-account',
            method: 'contract-management/admin'
        };
        this.inputParamsGrpAccNumber = {
            'parentMode': 'LookUp',
            showAddNew: false
        };
        this.promptContent = '';
        this.pageId = PageIdentifier.ICABSSGROUPACCOUNTMOVE;
    }
    GroupAccountMoveComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    GroupAccountMoveComponent.prototype.onFromGroupAccountDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAccountNumber1', data.GroupAccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName1', data.GroupName);
        this.getDataForFromAccountNumber();
    };
    GroupAccountMoveComponent.prototype.onToGroupAccountDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAccountNumber2', data.GroupAccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName2', data.GroupName);
        this.getDataForToAccountNumber();
    };
    GroupAccountMoveComponent.prototype.getDataForFromAccountNumber = function () {
        var _this = this;
        this.statusMessage = 'This function moves all accounts attached to a given group account to another group account.';
        var searchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('GroupAccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber1'));
        searchParams.set('Function', 'GetGroupAccountName');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupName1', data.GroupName);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupAgreementNumber1', data.GroupAgreementNumber);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupAgreementDate1', data.GroupAgreementDate);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactName1', data.GroupContactName);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactTelephone1', data.GroupContactTelephone);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactEMail1', data.GroupContactEMail);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMoveComponent.prototype.getDataForToAccountNumber = function () {
        var _this = this;
        this.statusMessage = 'This function moves all accounts attached to a given group account to another group account.';
        var searchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('GroupAccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber2'));
        searchParams.set('Function', 'GetGroupAccountName');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupName2', data.GroupName);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupAgreementNumber2', data.GroupAgreementNumber);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupAgreementDate2', data.GroupAgreementDate);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactName2', data.GroupContactName);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactTelephone2', data.GroupContactTelephone);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactEMail2', data.GroupContactEMail);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMoveComponent.prototype.fromInputField_OnChange = function (e) {
        this.getDataForFromAccountNumber();
    };
    GroupAccountMoveComponent.prototype.toInputField_OnChange = function (e) {
        this.getDataForToAccountNumber();
    };
    GroupAccountMoveComponent.prototype.cmd_AccountMove_onclick = function () {
        var _this = this;
        var groupName1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName1');
        var groupName2 = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName2');
        var promptMsg = 'Are you sure you wish to move all accounts currently attached to group account ^1^ to the group account ^2^.';
        this.getTranslatedValue(promptMsg, null).subscribe(function (res) {
            if (res) {
                promptMsg = res;
            }
            var str1 = promptMsg.split('^1^');
            var str2 = str1[1].split('^2^');
            _this.promptTitle = str1[0] + ' ' + _this.getControlValue('GroupAccountNumber1') + ' ' + str2[0] + ' ' + _this.getControlValue('GroupAccountNumber2');
        });
        if (groupName1 !== '' && groupName2 !== '') {
            this.promptModal.show();
        }
        else {
            if (groupName1 === '') {
                this.uiForm.controls['GroupAccountNumber1'].setErrors({ required: true });
            }
            if (groupName2 === '') {
                this.uiForm.controls['GroupAccountNumber2'].setErrors({ required: true });
            }
        }
    };
    GroupAccountMoveComponent.prototype.promptSave = function (event) {
        var _this = this;
        var postSearchParams;
        postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '0');
        postSearchParams.set('content-type', 'application/x-www-form-urlencoded');
        var postParams = {};
        postParams.Function = 'MoveGroupAccount';
        postParams.GroupAccountNumber1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber1');
        postParams.GroupAccountNumber2 = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e.hasError) {
                _this.errorModal.show(e, true);
            }
            else {
                var changeCount_1 = e.ChangeCount;
                var fromAccount_1 = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'GroupAccountNumber1');
                var toAccount_1 = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'GroupAccountNumber2');
                var messageBody_1 = '^1^ accounts have been moved from group account ^2^ to group account ^3^.';
                _this.getTranslatedValue(messageBody_1, null).subscribe(function (res) {
                    if (res) {
                        messageBody_1 = res;
                    }
                    var str1 = messageBody_1.split('^1^');
                    var str2 = str1[1].split('^2^');
                    var str3 = str2[1].split('^3^');
                    messageBody_1 = changeCount_1 + ' ' + str2[0] + ' ' + fromAccount_1 + ' ' + str3[0] + ' ' + toAccount_1 + '.';
                    _this.statusMessage = messageBody_1;
                });
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMoveComponent.prototype.disableForm = function () {
        this.isFormEnabled = false;
        this.statusMessage = 'This function moves all accounts attached to a given group account to another group account.';
        this.uiForm.reset();
        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM });
        this.groupAccountNumber1.nativeElement.focus();
    };
    GroupAccountMoveComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSGroupAccountMove.html'
                },] },
    ];
    GroupAccountMoveComponent.ctorParameters = [
        { type: Injector, },
    ];
    GroupAccountMoveComponent.propDecorators = {
        'toGroupAccountMoveEllipsis': [{ type: ViewChild, args: ['toGroupAccountMoveEllipsis',] },],
        'fromGroupAccountMoveEllipsis': [{ type: ViewChild, args: ['fromGroupAccountMoveEllipsis',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'groupAccountNumber1': [{ type: ViewChild, args: ['groupAccountNumber1',] },],
    };
    return GroupAccountMoveComponent;
}(BaseComponent));
