import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'ng2-webstorage';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { HttpService } from './../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { Utils } from '../../../shared/services/utility';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var AccountAssignComponent = (function () {
    function AccountAssignComponent(httpService, fb, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, translate, ls, http, localeTranslateService, componentInteractionService, utils, routeAwayGlobals, cbb) {
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
        this.zone = zone;
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
        this.hideEllipsis = false;
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountAssign';
        this.functionName = 'Assign';
        this.function = 'GetMergeFromAddress';
        this.contentType = 'application/x-www-form-urlencoded';
        this.addNew = false;
        this.search = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.searchModalRoute = '/contractmanagement/account/assign/search';
        this.searchPageRoute = '/contractmanagement/account/assign';
        this.showHeader = true;
        this.showCloseButton = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.inputParams = {
            'parentMode': 'LookUp-MergeFrom',
            'methodType': 'maintenance',
            'action': '1',
            'pageTitle': 'Account Assign',
            'showAddNewDisplay': false
        };
        this.buttonTranslatedText = {
            'save': 'Save',
            'cancel': 'Cancel'
        };
        this.promptTitle = 'Confirm Record?';
        this.promptContent = '';
        this.isFormEnabled = false;
    }
    AccountAssignComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
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
        this.lookupComponent = AccountSearchComponent;
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.routerSubscription = this.router.events.subscribe(function (event) {
            if (event.url.indexOf('/account/assign/search') !== -1) {
                _this.searchModalRoute = '';
                _this.autoOpen = true;
            }
        });
        this.accountFormGroup = this.fb.group({
            fromAccountNumber: [{ value: '', disabled: false }, Validators.required],
            accountName: [{ value: '', disabled: true }],
            address1: [{ value: '', disabled: true }],
            address2: [{ value: '', disabled: true }],
            address3: [{ value: '', disabled: true }],
            address4: [{ value: '', disabled: true }],
            address5: [{ value: '', disabled: true }],
            postcode: [{ value: '', disabled: true }],
            toAccountNumber: [{ value: '', disabled: false }, Validators.required]
        });
        this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
    };
    AccountAssignComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
        this.translateSubscription.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    AccountAssignComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Assign Account', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.titleService.setTitle(res);
                }
                else {
                    _this.titleService.setTitle(_this.inputParams.pageTitle);
                }
            });
        });
    };
    AccountAssignComponent.prototype.onSubmit = function (data, valid, event) {
        event.preventDefault();
        this.formData = data;
        this.promptModal.show();
    };
    AccountAssignComponent.prototype.onDataReceived = function (data, route) {
        this.accountFormGroup.controls['fromAccountNumber'].setValue(data.AccountNumber);
        this.accountFormGroup.controls['accountName'].setValue(data.AccountName);
        this.accountFormGroup.controls['address1'].setValue(data.AccountAddressLine1);
        this.accountFormGroup.controls['address2'].setValue(data.AccountAddressLine2);
        this.accountFormGroup.controls['address3'].setValue(data.AccountAddressLine3);
        this.accountFormGroup.controls['address4'].setValue(data.AccountAddressLine4);
        this.accountFormGroup.controls['address5'].setValue(data.AccountAddressLine5);
        this.accountFormGroup.controls['postcode'].setValue(data.AccountPostcode);
        this.accountFormGroup.controls['fromAccountNumber'].enable();
        this.accountFormGroup.controls['toAccountNumber'].enable();
        this.inputParams.businessCode = data.BusinessCode;
        this.inputParams.countryCode = data.CountryCode;
        this.cbb.disableComponent(true);
        if (route === true) {
            this.preRoute(data);
        }
    };
    AccountAssignComponent.prototype.preRoute = function (data) {
        this.routeAwayGlobals.setEllipseOpenFlag(true);
        this.pageData.saveData(data);
        this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTASSIGN]);
    };
    AccountAssignComponent.prototype.onBlur = function (event) {
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 9) {
            var _paddedValue = this.numberPadding(elementValue, 9);
            if (event.target.id === 'fromAccountNumber') {
                this.accountFormGroup.controls['fromAccountNumber'].setValue(_paddedValue);
            }
            else if (event.target.id === 'toAccountNumber') {
                this.accountFormGroup.controls['toAccountNumber'].setValue(_paddedValue);
            }
        }
    };
    ;
    AccountAssignComponent.prototype.onFromAccountBlur = function (event) {
        var _this = this;
        if (this.accountFormGroup.controls['fromAccountNumber'] && this.accountFormGroup.controls['fromAccountNumber'].value !== '') {
            var data = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': this.accountFormGroup.controls['fromAccountNumber'].value },
                    'fields': ['AccountNumber', 'AccountName', 'AccountAddressLine1', 'AccountAddressLine2',
                        'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
                }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.accountFormGroup.controls['accountName'].setValue(e['results'][0][0].AccountName);
                    _this.accountFormGroup.controls['address1'].setValue(e['results'][0][0].AccountAddressLine1);
                    _this.accountFormGroup.controls['address2'].setValue(e['results'][0][0].AccountAddressLine2);
                    _this.accountFormGroup.controls['address3'].setValue(e['results'][0][0].AccountAddressLine3);
                    _this.accountFormGroup.controls['address4'].setValue(e['results'][0][0].AccountAddressLine4);
                    _this.accountFormGroup.controls['address5'].setValue(e['results'][0][0].AccountAddressLine5);
                    _this.accountFormGroup.controls['postcode'].setValue(e['results'][0][0].AccountPostcode);
                    _this.inputParams.businessCode = e['results'][0][0].BusinessCode;
                    _this.inputParams.countryCode = e['results'][0][0].CountryCode;
                    _this.cbb.disableComponent(true);
                }
                else {
                    _this.accountFormGroup.controls['accountName'].setValue('');
                    _this.accountFormGroup.controls['address1'].setValue('');
                    _this.accountFormGroup.controls['address2'].setValue('');
                    _this.accountFormGroup.controls['address3'].setValue('');
                    _this.accountFormGroup.controls['address4'].setValue('');
                    _this.accountFormGroup.controls['address5'].setValue('');
                    _this.accountFormGroup.controls['postcode'].setValue('');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    _this.errorService.emitError(e);
                }
                _this.autoOpen = false;
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.accountFormGroup.controls['accountName'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    ;
    AccountAssignComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    AccountAssignComponent.prototype.enableForm = function () {
        this.isFormEnabled = true;
        this.accountFormGroup.controls['fromAccountNumber'].enable();
        this.accountFormGroup.controls['toAccountNumber'].enable();
        this.fromAccountInput.nativeElement.focus();
    };
    AccountAssignComponent.prototype.disableForm = function () {
        this.isFormEnabled = false;
        this.accountFormGroup.reset();
        this.hideEllipsis = false;
        this.cbb.disableComponent(false);
    };
    AccountAssignComponent.prototype.promptSave = function (event) {
        var _this = this;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        var formdata = this.formData, fromAccountNumber = formdata['fromAccountNumber'], toAccountNumber = formdata['toAccountNumber'], userCode = this.authService.getSavedUserCode();
        this.search.set(this.serviceConstants.Action, this.inputParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('functionName', this.functionName);
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
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountAssignComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    AccountAssignComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    AccountAssignComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    AccountAssignComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.accountFormGroup.statusChanges.subscribe(function (value) {
            if (_this.accountFormGroup.valid === true) {
                _this.routeAwayGlobals.setEllipseOpenFlag(false);
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    AccountAssignComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-assign',
                    templateUrl: 'iCABSAAccountAssign.html',
                    providers: [ErrorService, MessageService, ComponentInteractionService]
                },] },
    ];
    AccountAssignComponent.ctorParameters = [
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
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: ComponentInteractionService, },
        { type: Utils, },
        { type: RouteAwayGlobals, },
        { type: CBBService, },
    ];
    AccountAssignComponent.propDecorators = {
        'fromAccountInput': [{ type: ViewChild, args: ['fromAccountNumber',] },],
        'toAccountInput': [{ type: ViewChild, args: ['toAccountNumber',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return AccountAssignComponent;
}());
