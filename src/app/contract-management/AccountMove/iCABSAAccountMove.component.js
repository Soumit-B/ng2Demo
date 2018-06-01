import { Utils } from './../../../shared/services/utility';
import { LookUp } from './../../../shared/services/lookup';
import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'ng2-webstorage';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ActionTypes } from '../../actions/account';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var AccountMoveComponent = (function () {
    function AccountMoveComponent(httpService, fb, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, LookUp, zone, store, translate, ls, http, utils, localeTranslateService, componentInteractionService, routeAwayGlobals, cbb) {
        var _this = this;
        this.httpService = httpService;
        this.fb = fb;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.router = router;
        this.pageData = pageData;
        this.titleService = titleService;
        this.LookUp = LookUp;
        this.zone = zone;
        this.store = store;
        this.translate = translate;
        this.ls = ls;
        this.http = http;
        this.utils = utils;
        this.localeTranslateService = localeTranslateService;
        this.componentInteractionService = componentInteractionService;
        this.routeAwayGlobals = routeAwayGlobals;
        this.cbb = cbb;
        this.contractSearchComponent = ContractSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.fromIdentifier = 'from';
        this.toIdentifier = 'to';
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.hideEllipsis = false;
        this.autoOpenFrom = false;
        this.autoOpenTo = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.inputParams = {
            'parentMode': '',
            'currentContractType': 'C',
            'action': '1'
        };
        this.inputParamsContract = {
            'parentMode': 'LookUp-AccountMove'
        };
        this.inputParamsAccount = {
            'parentMode': 'LookUp-MergeTo',
            'showBusinessCode': false,
            'showCountryCode': false,
            'showAddNew': false
        };
        this.dateObjectsEnabled = {
            ContractCommenceDate: false
        };
        this.queryParamsForMoveToAccount = {
            module: 'account',
            operation: 'Application/iCABSAAccountMove',
            method: 'contract-management/maintenance',
            AccountNumber: '',
            action: 1,
            table: 'Account'
        };
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMove';
        this.function = 'GetToAccount';
        this.contentType = 'application/x-www-form-urlencoded';
        this.addNew = false;
        this.currentContractType = 'C';
        this.search = new URLSearchParams();
        this.searchForMoveToAccount = new URLSearchParams();
        this.searchModalRoute = '/contractmanagement/account/move/search';
        this.searchPageRoute = '/contractmanagement/account/move';
        this.showHeader = true;
        this.showCloseButton = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.promptTitle = 'Confirm Record?';
        this.promptContent = '';
        this.isFormEnabled = false;
        this.storeSubscription = store.select('account').subscribe(function (data) {
            _this.storeData = data;
        });
    }
    AccountMoveComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        this.contractSearchComponent = ContractSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.queryParamsForMoveToAccount.countryCode = this.utils.getCountryCode();
        this.queryParamsForMoveToAccount.businessCode = this.utils.getBusinessCode();
        this.localeTranslateService.setUpTranslation();
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data['errorMessage']) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    _this.messageModal.show({ msg: data['msg'], title: data['info'] }, false);
                });
            }
        });
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.routerSubscription = this.router.events.subscribe(function (event) {
            if (event.url === '/contractmanagement/account/move/search') {
                _this.accountMoveFormGroup.controls['toAccountNumber'].disable();
                _this.inputParams.parentMode = _this.inputParamsContract.parentMode;
                _this.inputParams.currentContractType = _this.inputParamsContract.currentContractType;
                _this.searchModalRoute = '';
                if (_this.storeData && _this.storeData.from) {
                    _this.onDataReceived(_this.storeData.from, false);
                }
                if (_this.storeData && _this.storeData.to) {
                    _this.onDataReceivedTo(_this.storeData.to, false);
                }
                var identifier = _this.pageData.getEllipsisIdentifier();
                if (identifier) {
                    if (identifier === 'from') {
                        _this.autoOpenFrom = true;
                        _this.autoOpenTo = false;
                    }
                    else if (identifier === 'to') {
                        _this.autoOpenFrom = false;
                        _this.autoOpenTo = true;
                    }
                }
                else {
                    _this.autoOpenFrom = true;
                    _this.autoOpenTo = false;
                }
            }
            else if (event.url === '/contractmanagement/account/move') {
                _this.accountMoveFormGroup.controls['toAccountNumber'].enable();
                _this.inputParams.parentMode = _this.inputParamsAccount.parentMode;
                _this.searchModalRoute = '/contractmanagement/account/move/search';
                if (_this.storeData && (typeof _this.storeData.from !== 'undefined' || typeof _this.storeData.to !== 'undefined')) {
                    if (typeof _this.storeData.from !== 'undefined') {
                        _this.onDataReceived(_this.storeData.from, false);
                    }
                    if (typeof _this.storeData.to !== 'undefined') {
                        _this.onDataReceivedTo(_this.storeData.to, false);
                    }
                }
                else {
                    _this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMOVE]);
                }
            }
        });
        this.accountMoveFormGroup = this.fb.group({
            formContractNumber: [{ value: '', disabled: false }, Validators.required],
            fromContractName: [{ value: '', disabled: false }],
            fromAccountNumber: [{ value: '', disabled: false }],
            ContractAnnualValue: [{ value: '', disabled: false }],
            ContractCommenceDate: [{ value: '', disabled: false }],
            NegBranchNumber: [{ value: '', disabled: false }],
            CurrentPremises: [{ value: '', disabled: false }],
            FromAccountAddressLine1: [{ value: '', disabled: false }],
            FromAccountAddressLine2: [{ value: '', disabled: false }],
            FromAccountAddressLine3: [{ value: '', disabled: false }],
            FromAccountAddressLine4: [{ value: '', disabled: false }],
            FromAccountAddressLine5: [{ value: '', disabled: false }],
            FromAccountPostcode: [{ value: '', disabled: false }],
            toAccountNumber: [{ value: '', disabled: false }, Validators.required],
            toAccountName: [{ value: '', disabled: false }],
            ToAccountAddressLine1: [{ value: '', disabled: false }],
            ToAccountAddressLine2: [{ value: '', disabled: false }],
            ToAccountAddressLine3: [{ value: '', disabled: false }],
            ToAccountAddressLine4: [{ value: '', disabled: false }],
            ToAccountAddressLine5: [{ value: '', disabled: false }],
            ToAccountPostcode: [{ value: '', disabled: false }]
        });
        this.routeAwayUpdateSaveFlag();
    };
    AccountMoveComponent.prototype.ngOnDestroy = function () {
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.routeAwayGlobals)
            this.routeAwayGlobals.resetRouteAwayFlags();
        if (this.lookUpSubscription)
            this.lookUpSubscription.unsubscribe();
    };
    AccountMoveComponent.prototype.onDataReceived = function (data, route) {
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        if (data && data.ContractNumber) {
            this.accountMoveFormGroup.controls['formContractNumber'].setValue(data.ContractNumber);
            this.accountMoveFormGroup.controls['fromContractName'].setValue(data.ContractName);
            this.accountMoveFormGroup.controls['fromAccountNumber'].setValue(data.AccountNumber);
            if (data.AccountAddressLine1)
                this.accountMoveFormGroup.controls['FromAccountAddressLine1'].setValue(data.AccountAddressLine1);
            if (data.AccountAddressLine2)
                this.accountMoveFormGroup.controls['FromAccountAddressLine2'].setValue(data.AccountAddressLine2);
            if (data.AccountAddressLine3)
                this.accountMoveFormGroup.controls['FromAccountAddressLine3'].setValue(data.AccountAddressLine3);
            this.fetchContractDetails();
        }
    };
    AccountMoveComponent.prototype.onContractDataReceived = function (data, route) {
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        this.cbb.disableComponent(true);
        this.accountMoveFormGroup.controls['ContractAnnualValue'].setValue(data.ContractAnnualValue);
        this.accountMoveFormGroup.controls['NegBranchNumber'].setValue(data.NegBranchNumber);
        this.accountMoveFormGroup.controls['CurrentPremises'].setValue(data.CurrentPremises);
        this.accountMoveFormGroup.controls['fromAccountNumber'].setValue(data.AccountNumber);
        this.accountMoveFormGroup.controls['fromContractName'].setValue(data.ContractName);
        var date = '';
        if (window['moment'](data.ContractCommenceDate, 'DD/MM/YYYY', true).isValid()) {
            date = this.utils.convertDate(data.ContractCommenceDate);
        }
        else {
            date = this.utils.formatDate(data.ContractCommenceDate);
        }
        this.accountMoveFormGroup.controls['ContractCommenceDate'].setValue(date);
        this.fetchMoveFromAccountDetails();
    };
    AccountMoveComponent.prototype.onDataReceivedFrom = function (data, route) {
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        this.accountMoveFormGroup.controls['FromAccountAddressLine1'].setValue(data.AccountAddressLine1);
        this.accountMoveFormGroup.controls['FromAccountAddressLine2'].setValue(data.AccountAddressLine2);
        this.accountMoveFormGroup.controls['FromAccountAddressLine3'].setValue(data.AccountAddressLine3);
        this.accountMoveFormGroup.controls['FromAccountAddressLine4'].setValue(data.AccountAddressLine4);
        this.accountMoveFormGroup.controls['FromAccountAddressLine5'].setValue(data.AccountAddressLine5);
        this.accountMoveFormGroup.controls['FromAccountPostcode'].setValue(data.AccountPostcode);
        this.enableForm();
    };
    AccountMoveComponent.prototype.onDataReceivedTo = function (data, route) {
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        if (typeof data !== 'undefined') {
            if (data.AccountNumber) {
                this.accountMoveFormGroup.controls['toAccountNumber'].setValue(data.AccountNumber);
            }
            this.accountMoveFormGroup.controls['toAccountName'].setValue(data.AccountName);
            this.accountMoveFormGroup.controls['ToAccountAddressLine1'].setValue(data.AccountAddressLine1);
            this.accountMoveFormGroup.controls['ToAccountAddressLine2'].setValue(data.AccountAddressLine2);
            this.accountMoveFormGroup.controls['ToAccountAddressLine3'].setValue(data.AccountAddressLine3);
            this.accountMoveFormGroup.controls['ToAccountAddressLine4'].setValue(data.AccountAddressLine4);
            this.accountMoveFormGroup.controls['ToAccountAddressLine5'].setValue(data.AccountAddressLine5);
            this.accountMoveFormGroup.controls['ToAccountPostcode'].setValue(data.AccountPostcode);
            this.store.dispatch({ type: ActionTypes.SAVE_DATA_TO, payload: data });
        }
        else {
            this.accountMoveFormGroup.controls['toAccountName'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine1'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine2'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine3'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine4'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountAddressLine5'].setValue('');
            this.accountMoveFormGroup.controls['ToAccountPostcode'].setValue('');
        }
    };
    AccountMoveComponent.prototype.preRoute = function (data) {
        this.pageData.saveData(data);
        this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMOVE]);
    };
    AccountMoveComponent.prototype.enableForm = function () {
        this.isFormEnabled = true;
        this.accountMoveFormGroup.controls['toAccountNumber'].enable();
    };
    AccountMoveComponent.prototype.disableForm = function () {
        this.routeAwayGlobals.resetRouteAwayFlags();
        this.isFormEnabled = false;
        this.accountMoveFormGroup.controls['toAccountNumber'].disable();
        this.accountMoveFormGroup.reset();
        this.hideEllipsis = false;
        this.cbb.disableComponent(false);
        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM });
    };
    AccountMoveComponent.prototype.promptSave = function (event) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var formdata = this.formData;
        var fromAccountNumber = this.accountMoveFormGroup.controls['fromAccountNumber'].value;
        var toAccountNumber = this.accountMoveFormGroup.controls['toAccountNumber'].value;
        var ContractNumber = this.accountMoveFormGroup.controls['formContractNumber'].value;
        this.inputParams.countryCode = this.utils.getCountryCode();
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        this.search.set('FromAccountNumber', fromAccountNumber);
        this.search.set('ToAccountNumber', toAccountNumber);
        this.search.set('ContractNumber', ContractNumber);
        this.search.set('Function', this.function);
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                }
                else {
                    _this.disableForm();
                    _this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM });
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountMoveComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    AccountMoveComponent.prototype.onBlur = function (event) {
        var elementValue = event.target.value;
        if (elementValue.length > 0) {
            var _paddedValue = void 0;
            ;
            if (event.target.id === 'formContractNumber') {
                _paddedValue = this.numberPadding(elementValue, 8);
                this.accountMoveFormGroup.controls['formContractNumber'].setValue(_paddedValue);
                this.fetchContractDetails();
            }
            else if (event.target.id === 'toAccountNumber') {
                _paddedValue = this.numberPadding(elementValue, 9);
                this.accountMoveFormGroup.controls['toAccountNumber'].setValue(_paddedValue);
                this.fetchMoveToAccountDetails();
            }
        }
    };
    ;
    AccountMoveComponent.prototype.fetchMoveToAccountDetails = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.searchForMoveToAccount = new URLSearchParams();
        this.queryParamsForMoveToAccount.AccountNumber = this.accountMoveFormGroup.controls['toAccountNumber'].value;
        this.searchForMoveToAccount.set(this.serviceConstants.Action, this.queryParamsForMoveToAccount.action);
        this.searchForMoveToAccount.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchForMoveToAccount.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchForMoveToAccount.set('AccountNumber', this.queryParamsForMoveToAccount.AccountNumber);
        this.httpService.makeGetRequest(this.queryParamsForMoveToAccount.method, this.queryParamsForMoveToAccount.module, this.queryParamsForMoveToAccount.operation, this.searchForMoveToAccount)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.fetchAccountDetails('To', e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.fetchAccountDetails('To', e);
                }
                else if (e.records.length > 0) {
                    _this.onDataReceivedTo(e.records[0], true);
                }
                else {
                    _this.fetchAccountDetails('To', { msg: MessageConstant.Message.noRecordFound });
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountMoveComponent.prototype.fetchAccountDetails = function (type, errMsg) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': type === 'To' ? this.accountMoveFormGroup.controls['toAccountNumber'].value : this.accountMoveFormGroup.controls['fromAccountNumber'].value
                },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (type === 'To') {
                if (data[0] && data[0].length > 0) {
                    _this.onDataReceivedTo(data[0][0], true);
                }
                else {
                    _this.onDataReceivedTo(undefined, true);
                    _this.errorService.emitError(errMsg);
                }
            }
            else if (type === 'From') {
                if (data[0] && data[0].length > 0) {
                    _this.onDataReceivedFrom(data[0][0], true);
                }
                else {
                    _this.errorService.emitError(errMsg);
                }
            }
        });
    };
    AccountMoveComponent.prototype.fetchMoveFromAccountDetails = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': this.accountMoveFormGroup.controls['fromAccountNumber'].value
                },
                'fields': ['AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.onDataReceivedFrom(data[0][0], true);
        });
    };
    AccountMoveComponent.prototype.fetchContractDetails = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.searchForMoveToAccount = new URLSearchParams();
        this.queryParamsForMoveToAccount.ContractNumber = this.accountMoveFormGroup.controls['formContractNumber'].value;
        var lookupIP_contract = [{
                'table': 'Contract',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.accountMoveFormGroup.controls['formContractNumber'].value },
                'fields': ['BusinessCode', 'ContractNumber', 'ContractName', 'ContractCommenceDate', 'NegBranchNumber', 'ContractAnnualValue', 'CurrentPremises', 'AccountNumber']
            }];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_contract).subscribe(function (data) {
            if (data.length > 0) {
                var resp = data[0];
                if (resp.length > 0) {
                    var record = resp[0];
                    _this.onContractDataReceived(record, true);
                }
                else {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.messageService.emitMessage({ msg: 'Record not found' });
                }
            }
        });
    };
    AccountMoveComponent.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    AccountMoveComponent.prototype.onSubmit = function (data, valid, event) {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        event.preventDefault();
        this.formData = data;
        this.promptModal.show();
    };
    AccountMoveComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    AccountMoveComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.accountMoveFormGroup.statusChanges.subscribe(function (value) {
            if (_this.accountMoveFormGroup.valid === true) {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    AccountMoveComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-move',
                    templateUrl: 'iCABSAAccountMove.html',
                    styles: ['input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0;}'],
                    providers: [ErrorService, MessageService, ComponentInteractionService]
                },] },
    ];
    AccountMoveComponent.ctorParameters = [
        { type: HttpService, },
        { type: FormBuilder, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: AuthService, },
        { type: AjaxObservableConstant, },
        { type: Router, },
        { type: PageDataService, },
        { type: Title, },
        { type: LookUp, },
        { type: NgZone, },
        { type: Store, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: Utils, },
        { type: LocaleTranslationService, },
        { type: ComponentInteractionService, },
        { type: RouteAwayGlobals, },
        { type: CBBService, },
    ];
    AccountMoveComponent.propDecorators = {
        'formContractNumber': [{ type: ViewChild, args: ['formContractNumber',] },],
        'fromAccountInput': [{ type: ViewChild, args: ['fromAccountNumber',] },],
        'toAccountInput': [{ type: ViewChild, args: ['toAccountNumber',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return AccountMoveComponent;
}());
