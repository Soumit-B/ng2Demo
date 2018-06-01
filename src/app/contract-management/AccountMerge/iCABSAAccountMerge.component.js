import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { HttpService } from './../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ActionTypes } from '../../actions/account';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Utils } from '../../../shared/services/utility';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
export var AccountMergeComponent = (function () {
    function AccountMergeComponent(httpService, _fb, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, localeTranslateService, componentInteractionService, utils, routeAwayGlobals, cbb) {
        var _this = this;
        this.httpService = httpService;
        this._fb = _fb;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.router = router;
        this.pageData = pageData;
        this.titleService = titleService;
        this.zone = zone;
        this.store = store;
        this.translate = translate;
        this.ls = ls;
        this.http = http;
        this.localeTranslateService = localeTranslateService;
        this.componentInteractionService = componentInteractionService;
        this.utils = utils;
        this.routeAwayGlobals = routeAwayGlobals;
        this.cbb = cbb;
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.showCloseButton = true;
        this.functionName = 'Merge';
        this.function = 'GetMergeToAddress';
        this.hideEllipsis = false;
        this.autoOpenFrom = false;
        this.autoOpenTo = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMerge';
        this.contentType = 'application/x-www-form-urlencoded';
        this.promptTitle = 'Confirm Record?';
        this.promptContent = '';
        this.search = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.searchModalRoute = '/contractmanagement/account/merge/search';
        this.searchPageRoute = '/contractmanagement/account/merge';
        this.showHeader = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.inputParams = {
            'parentMode': 'LookUp-MergeFrom',
            'businessCode': '',
            'countryCode': '',
            'methodType': 'maintenance',
            'action': '1',
            'pageTitle': 'Merge Account'
        };
        this.fromComponent = AccountSearchComponent;
        this.toComponent = AccountSearchComponent;
        this.fromIdentifier = 'from';
        this.toIdentifier = 'to';
        this.buttonTranslatedText = {
            'save': 'Save',
            'cancel': 'Cancel'
        };
        this.storeSubscription = store.select('account').subscribe(function (data) {
            _this.storeData = data;
        });
    }
    AccountMergeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        this._isFormEnabled = false;
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
        var pageTitle = '';
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.routerSubscription = this.router.events.subscribe(function (event) {
            if (event.url.indexOf('/contractmanagement/account/merge/search') !== -1) {
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
                setTimeout(function () {
                    _this.autoOpenFrom = false;
                    _this.autoOpenTo = false;
                }, 100);
            }
        });
        this.form_group = this._fb.group({
            fromAccountNumber: [{ value: '', disabled: false }, Validators.required],
            toAccountNumber: [{ value: '', disabled: false }, Validators.required],
            FromAccountName: [{ value: '', disabled: true }],
            FromAccountAddressLine1: [{ value: '', disabled: true }],
            FromAccountAddressLine2: [{ value: '', disabled: true }],
            FromAccountAddressLine3: [{ value: '', disabled: true }],
            FromAccountAddressLine4: [{ value: '', disabled: true }],
            FromAccountAddressLine5: [{ value: '', disabled: true }],
            FromPostcode: [{ value: '', disabled: true }],
            ToAccountName: [{ value: '', disabled: true }],
            ToAccountAddressLine1: [{ value: '', disabled: true }],
            ToAccountAddressLine2: [{ value: '', disabled: true }],
            ToAccountAddressLine3: [{ value: '', disabled: true }],
            ToAccountAddressLine4: [{ value: '', disabled: true }],
            ToAccountAddressLine5: [{ value: '', disabled: true }],
            ToPostcode: [{ value: '', disabled: true }]
        });
        this.routeAwayUpdateSaveFlag();
    };
    AccountMergeComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
        this.storeSubscription.unsubscribe();
        this.translateSubscription.unsubscribe();
        this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    AccountMergeComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Merge Account', null).subscribe(function (res) {
            if (res) {
                _this.titleService.setTitle(res);
            }
            else {
                _this.titleService.setTitle(_this.inputParams.pageTitle);
            }
        });
    };
    AccountMergeComponent.prototype.onSubmit = function (data, valid, event) {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        event.preventDefault();
        this.formData = data;
        this.promptModal.show();
    };
    AccountMergeComponent.prototype.promptSave = function () {
        var _this = this;
        var formdata = this.formData, fromAccountNumber = formdata['fromAccountNumber'], toAccountNumber = formdata['toAccountNumber'];
        var userCode = this.authService.getSavedUserCode();
        if (this.storeData && this.storeData.from.CountryCode) {
            this.inputParams.countryCode = this.storeData.from.CountryCode;
        }
        else {
            this.inputParams.countryCode = this.utils.getCountryCode();
        }
        if (this.storeData && this.storeData.from.BusinessCode) {
            this.inputParams.businessCode = this.storeData.from.BusinessCode;
        }
        else {
            this.inputParams.businessCode = this.utils.getBusinessCode();
        }
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        this.search.set(this.serviceConstants.Action, this.inputParams.action);
        this.search.set('function', this.function);
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
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
                    _this.messageService.emitMessage(e);
                    _this.disableForm();
                    _this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM });
                    _this.store.dispatch({ type: ActionTypes.CLEAR_DATA_TO });
                    _this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = { errorMessage: error };
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountMergeComponent.prototype.enableForm = function () {
        this._isFormEnabled = true;
        this.form_group.controls['fromAccountNumber'].enable();
        this.form_group.controls['toAccountNumber'].enable();
        this.fromAccountNumber.nativeElement.focus();
    };
    AccountMergeComponent.prototype.disableForm = function () {
        this.routeAwayGlobals.resetRouteAwayFlags();
        this.resetFields();
        this._isFormEnabled = false;
        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM });
        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_TO });
        this.cbb.disableComponent(false);
    };
    AccountMergeComponent.prototype.resetFields = function () {
        this.form_group.reset();
    };
    AccountMergeComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    AccountMergeComponent.prototype.preRoute = function (data, toData) {
        this.routeAwayGlobals.setEllipseOpenFlag(true);
        if (toData) {
            this.store.dispatch({ type: ActionTypes.SAVE_DATA_TO, payload: data });
        }
        else {
            this.store.dispatch({ type: ActionTypes.SAVE_DATA_FROM, payload: data });
        }
    };
    AccountMergeComponent.prototype.onFromAccountBlur = function (event) {
        var _this = this;
        if (this.form_group.controls['fromAccountNumber'] && this.form_group.controls['fromAccountNumber'].value !== '') {
            var data = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': this.form_group.controls['fromAccountNumber'].value },
                    'fields': ['AccountNumber', 'AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
                }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.form_group.controls['FromAccountName'].setValue(e['results'][0][0].AccountName);
                    _this.form_group.controls['FromAccountAddressLine1'].setValue(e['results'][0][0].AccountAddressLine1);
                    _this.form_group.controls['FromAccountAddressLine2'].setValue(e['results'][0][0].AccountAddressLine2);
                    _this.form_group.controls['FromAccountAddressLine3'].setValue(e['results'][0][0].AccountAddressLine3);
                    _this.form_group.controls['FromAccountAddressLine4'].setValue(e['results'][0][0].AccountAddressLine4);
                    _this.form_group.controls['FromAccountAddressLine5'].setValue(e['results'][0][0].AccountAddressLine5);
                    _this.form_group.controls['FromPostcode'].setValue(e['results'][0][0].AccountPostcode);
                    _this.cbb.disableComponent(true);
                }
                else {
                    _this.form_group.controls['FromAccountName'].setValue('');
                    _this.form_group.controls['FromAccountAddressLine1'].setValue('');
                    _this.form_group.controls['FromAccountAddressLine2'].setValue('');
                    _this.form_group.controls['FromAccountAddressLine3'].setValue('');
                    _this.form_group.controls['FromAccountAddressLine4'].setValue('');
                    _this.form_group.controls['FromAccountAddressLine5'].setValue('');
                    _this.form_group.controls['FromPostcode'].setValue('');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    _this.errorService.emitError(e);
                }
                _this.autoOpenFrom = false;
            }, function (error) {
                _this.form_group.controls['FromAccountName'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            });
        }
        else {
        }
    };
    ;
    AccountMergeComponent.prototype.onToAccountBlur = function (event) {
        var _this = this;
        if (this.form_group.controls['toAccountNumber'] && this.form_group.controls['toAccountNumber'].value !== '') {
            var data = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': this.form_group.controls['toAccountNumber'].value },
                    'fields': ['AccountNumber', 'AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
                }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.form_group.controls['ToAccountName'].setValue(e['results'][0][0].AccountName);
                    _this.form_group.controls['ToAccountAddressLine1'].setValue(e['results'][0][0].AccountAddressLine1);
                    _this.form_group.controls['ToAccountAddressLine2'].setValue(e['results'][0][0].AccountAddressLine2);
                    _this.form_group.controls['ToAccountAddressLine3'].setValue(e['results'][0][0].AccountAddressLine3);
                    _this.form_group.controls['ToAccountAddressLine4'].setValue(e['results'][0][0].AccountAddressLine4);
                    _this.form_group.controls['ToAccountAddressLine5'].setValue(e['results'][0][0].AccountAddressLine5);
                    _this.form_group.controls['ToPostcode'].setValue(e['results'][0][0].AccountPostcode);
                    _this.cbb.disableComponent(true);
                }
                else {
                    _this.form_group.controls['ToAccountName'].setValue('');
                    _this.form_group.controls['ToAccountAddressLine1'].setValue('');
                    _this.form_group.controls['ToAccountAddressLine2'].setValue('');
                    _this.form_group.controls['ToAccountAddressLine3'].setValue('');
                    _this.form_group.controls['ToAccountAddressLine4'].setValue('');
                    _this.form_group.controls['ToAccountAddressLine5'].setValue('');
                    _this.form_group.controls['ToPostcode'].setValue('');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    _this.errorService.emitError(e);
                }
                _this.autoOpenTo = false;
            }, function (error) {
                _this.form_group.controls['ToAccountName'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            });
        }
        else {
        }
    };
    ;
    AccountMergeComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    AccountMergeComponent.prototype.onDataReceived = function (data, route) {
        this.form_group.controls['fromAccountNumber'].setValue(data.AccountNumber);
        this.form_group.controls['FromAccountName'].setValue(data.AccountName);
        this.form_group.controls['FromAccountAddressLine1'].setValue(data.AccountAddressLine1);
        this.form_group.controls['FromAccountAddressLine2'].setValue(data.AccountAddressLine2);
        this.form_group.controls['FromAccountAddressLine3'].setValue(data.AccountAddressLine3);
        this.form_group.controls['FromAccountAddressLine4'].setValue(data.AccountAddressLine4);
        this.form_group.controls['FromAccountAddressLine5'].setValue(data.AccountAddressLine5);
        this.form_group.controls['FromPostcode'].setValue(data.AccountPostcode);
        this.cbb.disableComponent(true);
        if (route === true) {
            this.preRoute(data, false);
        }
    };
    AccountMergeComponent.prototype.onDataReceivedTo = function (data, route) {
        this.form_group.controls['toAccountNumber'].setValue(data.AccountNumber);
        this.form_group.controls['ToAccountName'].setValue(data.AccountName);
        this.form_group.controls['ToAccountAddressLine1'].setValue(data.AccountAddressLine1);
        this.form_group.controls['ToAccountAddressLine2'].setValue(data.AccountAddressLine2);
        this.form_group.controls['ToAccountAddressLine3'].setValue(data.AccountAddressLine3);
        this.form_group.controls['ToAccountAddressLine4'].setValue(data.AccountAddressLine4);
        this.form_group.controls['ToAccountAddressLine5'].setValue(data.AccountAddressLine5);
        this.form_group.controls['ToPostcode'].setValue(data.AccountPostcode);
        this.cbb.disableComponent(true);
        if (route === true) {
            this.preRoute(data, true);
        }
    };
    AccountMergeComponent.prototype.onBlur = function (event) {
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 9) {
            var _paddedValue = this.numberPadding(elementValue, 9);
            if (event.target.id === 'fromAccountNumber') {
                this.form_group.controls['fromAccountNumber'].setValue(_paddedValue);
            }
            else if (event.target.id === 'toAccountNumber') {
                this.form_group.controls['toAccountNumber'].setValue(_paddedValue);
            }
        }
    };
    ;
    AccountMergeComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    AccountMergeComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    AccountMergeComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.form_group.valueChanges.subscribe(function (value) {
            if ((value.fromAccountNumber !== undefined) && (value.toAccountNumber !== undefined) && (value.fromAccountNumber !== '') && (value.toAccountNumber !== '' && (value.fromAccountNumber !== null) && (value.toAccountNumber !== null))) {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
        });
    };
    AccountMergeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-merge',
                    templateUrl: 'iCABSAAccountMerge.html',
                    providers: [ErrorService, MessageService, ComponentInteractionService]
                },] },
    ];
    AccountMergeComponent.ctorParameters = [
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
        { type: NgZone, },
        { type: Store, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: ComponentInteractionService, },
        { type: Utils, },
        { type: RouteAwayGlobals, },
        { type: CBBService, },
    ];
    AccountMergeComponent.propDecorators = {
        'fromAccountNumber': [{ type: ViewChild, args: ['fromAccountNumber',] },],
        'toAccountInput': [{ type: ViewChild, args: ['toAccountNumber',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return AccountMergeComponent;
}());
