var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { AccountSearchComponent } from './../../search/iCABSASAccountSearch';
import { URLSearchParams } from '@angular/http';
import { AuthService } from '../../../../shared/services/auth.service';
import { ScreenNotReadyComponent } from '../../../../shared/components/screenNotReady';
export var AccountBankDetailsMaintenanceComponent = (function (_super) {
    __extends(AccountBankDetailsMaintenanceComponent, _super);
    function AccountBankDetailsMaintenanceComponent(injector, authService) {
        _super.call(this, injector);
        this.authService = authService;
        this.pageId = '';
        this.queryPost = new URLSearchParams();
        this.showMessageHeaderSave = true;
        this.showHeader = true;
        this.showPromptCloseButtonSave = true;
        this.promptTitleSave = '';
        this.promptContentSave = 'Confirm Record';
        this.promptModalConfigSave = {
            ignoreBackdropClick: true
        };
        this.isDisabled = true;
        this.headerDelete = true;
        this.closeButtonDelete = true;
        this.promptContentDelete = 'Delete Record?';
        this.controls = [
            { name: 'AccountNumber', disabled: false, required: false },
            { name: 'AccountName', disabled: true, required: false },
            { name: 'BankAccountTypeCode', readonly: true, disabled: false, required: false },
            { name: 'BankAccountSortCode', readonly: true, disabled: false, required: false },
            { name: 'BankAccountNumber', readonly: true, disabled: false, required: false },
            { name: 'VirtualBankAccountNumber', readonly: true, disabled: false, required: false },
            { name: 'BankAccountInfo', readonly: true, disabled: false, required: false }
        ];
        this.formControlErrorFlag = {
            AccountNumber: false,
            AccountName: false,
            BankAccountTypeCode: false,
            BankAccountSortCode: false,
            BankAccountNumber: false,
            VirtualBankAccountNumber: false,
            BankAccountInfo: false
        };
        this.ellipseDisplay = {
            accountNumberEllipse: true
        };
        this.inputParams = {
            operation: 'Application/iCABSAAccountBankDetailsMaintenance',
            module: 'payment',
            method: 'bill-to-cash/maintenance',
            action: '',
            parentMode: '',
            businessCode: '',
            countryCode: ''
        };
        this.accountSearchComponent = AccountSearchComponent;
        this.inputParamsAccSearch = { 'Mode': 'search' };
        this.ellipsisdata = {};
        this.pageId = PageIdentifier.ICABSAACCOUNTBANKDETAILSMAINTENANCE;
    }
    AccountBankDetailsMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Account Bank Details';
        this.screenNotReadyComponent = ScreenNotReadyComponent;
    };
    AccountBankDetailsMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.accountSearch.openModal();
    };
    AccountBankDetailsMaintenanceComponent.prototype.ngOnDestroy = function () {
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    AccountBankDetailsMaintenanceComponent.prototype.setAccountNumber = function (data) {
        this.ellipsisdata = data;
        this.rowid = data.ttAccount;
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('AccountName', data.AccountName);
        this.setControlValue('BankAccountTypeCode', data.BankAccountTypeCode);
        this.setControlValue('BankAccountSortCode', data.BankAccountSortCode);
        this.setControlValue('BankAccountNumber', data.BankAccountNumber);
        this.setControlValue('VirtualBankAccountNumber', data.VirtualBankAccountNumber);
        this.setControlValue('BankAccountInfo', data.BankAccountInfo);
        this.Accountname();
        this.BankAccountTypeDesc();
        this.isDisabled = false;
    };
    AccountBankDetailsMaintenanceComponent.prototype.accountNumberOnchange = function () {
        this.setControlValue('AccountNumber', this.utils.fillLeadingZeros(this.getControlValue('AccountNumber'), 9));
        this.Accountname();
    };
    AccountBankDetailsMaintenanceComponent.prototype.Accountname = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode,
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountName', 'BankAccountTypeCode', 'BankAccountSortCode', 'BankAccountNumber', 'VirtualBankAccountNumber', 'BankAccountInfo']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP, 1).subscribe(function (data) {
            var account;
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else if (data) {
                account = data[0][0];
                _this.setControlValue('AccountName', account.AccountName);
                _this.setControlValue('BankAccountTypeCode', account.BankAccountTypeCode);
                _this.setControlValue('BankAccountSortCode', account.BankAccountSortCode);
                _this.setControlValue('BankAccountNumber', account.BankAccountNumber);
                _this.setControlValue('VirtualBankAccountNumber', account.VirtualBankAccountNumber);
                _this.setControlValue('BankAccountInfo', account.BankAccountInfo);
                _this.accountrowid = account.ttAccount;
            }
            ;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountBankDetailsMaintenanceComponent.prototype.BankAccountTypeDesc = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'BankAccountType',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BankAccountTypeCode': this.getControlValue('BankAccountTypeCode')
                },
                'fields': ['BankAccountTypeDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var BankAccountTypeCode;
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountBankDetailsMaintenanceComponent.prototype.saveOnclick = function () {
        this.promptModalForSave.show();
    };
    AccountBankDetailsMaintenanceComponent.prototype.promptContentSaveData = function () {
        var _this = this;
        var formdata = {};
        this.queryPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryPost.set(this.serviceConstants.Action, '2');
        formdata['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;
        formdata['AccountName'] = this.uiForm.controls['AccountName'].value;
        formdata['BankAccountTypeCode'] = this.uiForm.controls['BankAccountTypeCode'].value;
        formdata['BankAccountSortCode'] = this.uiForm.controls['BankAccountSortCode'].value;
        formdata['BankAccountNumber'] = this.uiForm.controls['BankAccountNumber'].value;
        formdata['VirtualBankAccountNumber'] = this.uiForm.controls['VirtualBankAccountNumber'].value;
        formdata['BankAccountInfo'] = this.uiForm.controls['BankAccountInfo'].value;
        this.inputParams.search = this.queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.queryPost, formdata)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                _this.messageService.emitMessage(e);
                _this.uiForm.reset();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountBankDetailsMaintenanceComponent.prototype.cancelOnclick = function () {
        this.setControlValue('BankAccountTypeCode', '');
        this.setControlValue('BankAccountSortCode', '');
        this.setControlValue('BankAccountNumber', '');
        this.setControlValue('VirtualBankAccountNumber', '');
        this.setControlValue('BankAccountInfo', '');
        this.setAccountNumber(this.ellipsisdata);
    };
    AccountBankDetailsMaintenanceComponent.prototype.onDataChanged = function (data) {
        this.setControlValue(data.target.id, this.utils.capitalizeFirstLetter(data.target.value));
    };
    AccountBankDetailsMaintenanceComponent.prototype.deleteOnclick = function () {
        this.promptModalDelete.show();
    };
    AccountBankDetailsMaintenanceComponent.prototype.promptDelete = function () {
        var _this = this;
        var formdata = {};
        this.queryPost.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.queryPost.set(this.serviceConstants.CountryCode, this.countryCode());
        this.queryPost.set(this.serviceConstants.Action, '3');
        formdata['AccountROWID'] = this.accountrowid;
        formdata['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;
        this.inputParams.search = this.queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.queryPost, formdata)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                _this.messageService.emitMessage(e);
                _this.uiForm.reset();
                _this.isDisabled = true;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountBankDetailsMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAAccountBankDetailsMaintenance.html'
                },] },
    ];
    AccountBankDetailsMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: AuthService, },
    ];
    AccountBankDetailsMaintenanceComponent.propDecorators = {
        'accountSearch': [{ type: ViewChild, args: ['accountSearch',] },],
        'confirmOkModal': [{ type: ViewChild, args: ['confirmOkModal',] },],
        'promptModalForSave': [{ type: ViewChild, args: ['promptModalForSave',] },],
        'promptModalDelete': [{ type: ViewChild, args: ['promptModalDelete',] },],
    };
    return AccountBankDetailsMaintenanceComponent;
}(BaseComponent));
