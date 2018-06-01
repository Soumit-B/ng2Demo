import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { AuthService } from '../../../shared/services/auth.service';
import { Title } from '@angular/platform-browser';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { Utils } from '../../../shared/services/utility';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
export var ContractAPIMaintenanceComponent = (function () {
    function ContractAPIMaintenanceComponent(zone, fb, store, serviceConstants, httpService, authService, errorService, translate, localeTranslateService, titleService, router, route, utils, routeAwayGlobals, cbb) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.store = store;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.authService = authService;
        this.errorService = errorService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.titleService = titleService;
        this.router = router;
        this.route = route;
        this.utils = utils;
        this.routeAwayGlobals = routeAwayGlobals;
        this.cbb = cbb;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'C', 'businessCode': 'D' };
        this.contractSearchComponent = ContractSearchComponent;
        this.fieldVisibility = {
            APIExemptText: false
        };
        this.fieldRequired = {
            contractCommenceDate: true,
            annivDate: true
        };
        this.dateObjectsEnabled = {
            contractCommenceDate: false,
            annivDate: false
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
        this.queryParamsAPIExempt = {
            action: '0',
            operation: 'Application/iCABSAContractAPIMaintenance',
            module: 'api',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.storeData = {};
        this.autoOpenSearch = false;
        this.showCloseButton = true;
        this.showHeader = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.isContractEllipsisDisabled = false;
        this.serviceVisitRowID = '';
        this.queryLookUp = new URLSearchParams();
        this.queryContract = new URLSearchParams();
        this.contractCommenceDate = new Date();
        this.annivDate = new Date();
        this.parentRoute = '';
        this.contractSearchParams = {
            'parentMode': 'ContractSearch',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': false,
            'contractNumber': ''
        };
        this.promptTitle = '';
        this.promptContent = '';
        this.contractData = {};
        this.contractAPIFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: false }, Validators.required],
            ContractName: [{ value: '', disabled: true }],
            Status: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: true }],
            AccountName: [{ value: '', disabled: true }],
            ContractAddressLine1: [{ value: '', disabled: true }],
            ContractAddressLine2: [{ value: '', disabled: true }],
            ContractAddressLine3: [{ value: '', disabled: true }],
            ContractAddressLine4: [{ value: '', disabled: true }],
            ContractAddressLine5: [{ value: '', disabled: true }],
            ContractPostcode: [{ value: '', disabled: true }],
            ContractAnnualValue: [{ value: '', disabled: true }],
            APIExemptInd: [{ value: '', disabled: false }],
            APIExemptText: [{ value: '', disabled: false }]
        });
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.parentQueryParams = params;
            switch (params['contractType']) {
                case 'C':
                    _this.contractSearchParams.currentContractType = 'C';
                    _this.isContractEllipsisDisabled = true;
                    break;
                case 'J':
                    _this.contractSearchParams.currentContractType = 'J';
                    _this.isContractEllipsisDisabled = true;
                    break;
                case 'P':
                    _this.contractSearchParams.currentContractType = 'P';
                    _this.isContractEllipsisDisabled = true;
                    break;
                default:
                    break;
            }
            _this.parentRoute = params['parentRoute'];
            if (params['contractNumber']) {
                _this.contractSearchParams.contractNumber = params['contractNumber'];
            }
        });
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['data'] && data['data'].ContractNumber) {
                _this.contractAPIFormGroup.controls['ContractNumber'].setValue(_this.storeData['data'].ContractNumber);
                _this.contractAPIFormGroup.controls['ContractName'].setValue(_this.storeData['data'].ContractName);
                _this.contractAPIFormGroup.controls['Status'].setValue(_this.storeData['data'].Status);
                _this.contractAPIFormGroup.controls['AccountNumber'].setValue(_this.storeData['data'].AccountNumber);
                _this.contractAPIFormGroup.controls['ContractAddressLine1'].setValue(_this.storeData['data'].ContractAddressLine1);
                _this.contractAPIFormGroup.controls['ContractAddressLine2'].setValue(_this.storeData['data'].ContractAddressLine2);
                _this.contractAPIFormGroup.controls['ContractAddressLine3'].setValue(_this.storeData['data'].ContractAddressLine3);
                _this.contractAPIFormGroup.controls['ContractAddressLine4'].setValue(_this.storeData['data'].ContractAddressLine4);
                _this.contractAPIFormGroup.controls['ContractAddressLine5'].setValue(_this.storeData['data'].ContractAddressLine5);
                _this.contractAPIFormGroup.controls['ContractPostcode'].setValue(_this.storeData['data'].ContractPostcode);
                _this.contractAPIFormGroup.controls['ContractAnnualValue'].setValue(_this.storeData['data'].ContractAnnualValue);
                if (_this.storeData['data'].ContractCommenceDate) {
                    if (window['moment'](_this.storeData['data'].ContractCommenceDate, 'DD/MM/YYYY', true).isValid()) {
                        _this.commenceDateDisplay = _this.utils.convertDate(_this.storeData['data'].ContractCommenceDate);
                    }
                    else {
                        _this.commenceDateDisplay = _this.utils.formatDate(new Date(_this.storeData['data'].ContractCommenceDate));
                    }
                }
                else {
                    _this.commenceDateDisplay = null;
                }
                _this.contractCommenceDate = new Date(_this.commenceDateDisplay);
                if (_this.storeData['data'].InvoiceAnnivDate) {
                    if (window['moment'](_this.storeData['data'].InvoiceAnnivDate, 'DD/MM/YYYY', true).isValid()) {
                        _this.annivDateDisplay = _this.utils.convertDate(_this.storeData['data'].InvoiceAnnivDate);
                    }
                    else {
                        _this.annivDateDisplay = _this.utils.formatDate(new Date(_this.storeData['data'].InvoiceAnnivDate));
                    }
                }
                else {
                    _this.annivDateDisplay = null;
                }
                _this.annivDate = new Date(_this.annivDateDisplay);
                if (_this.storeData['data'].APIExemptInd) {
                    if (_this.storeData['data'].APIExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                        _this.contractAPIFormGroup.controls['APIExemptInd'].setValue(true);
                        _this.fieldVisibility.APIExemptText = true;
                        _this.contractAPIFormGroup.controls['APIExemptText'].setValue(_this.storeData['data'].APIExemptText);
                    }
                    else {
                        _this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                        _this.fieldVisibility.APIExemptText = false;
                    }
                }
                else {
                    _this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                    _this.fieldVisibility.APIExemptText = false;
                }
                _this.fetchContractData('GetStatus', { action: '6', ContractNumber: _this.storeData['data'].ContractNumber }).subscribe(function (e) {
                    if (e.status === 'failure') {
                        _this.errorService.emitError(e.oResponse);
                    }
                    else {
                        _this.contractAPIFormGroup.controls['Status'].setValue(e.Status);
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
            }
        });
    }
    ContractAPIMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.routerSubscription = this.router.events.subscribe(function (event) {
            switch (event.url) {
                case '/billtocash/contract/apiexempt':
                    _this.contractSearchParams.currentContractType = _this.utils.getCurrentContractType('<contract>');
                    break;
                case '/billtocash/job/apiexempt':
                    _this.contractSearchParams.currentContractType = _this.utils.getCurrentContractType('<job>');
                    break;
                default:
                    break;
            }
        });
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
    };
    ContractAPIMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.autoOpenSearch = true;
    };
    ContractAPIMaintenanceComponent.prototype.ngOnDestroy = function () {
        this.routeAwayGlobals.resetRouteAwayFlags();
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
    };
    ContractAPIMaintenanceComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Contract API Maintenance', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.titleService.setTitle(res);
                }
            });
        });
    };
    ContractAPIMaintenanceComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ContractAPIMaintenanceComponent.prototype.modalHidden = function () {
        this.fetchTranslationContent();
    };
    ContractAPIMaintenanceComponent.prototype.onContractDataReceived = function (data) {
        var _this = this;
        this.storeData['code'] = {
            country: this.utils.getCountryCode(),
            business: this.utils.getBusinessCode()
        };
        this.cbb.disableComponent(true);
        if (data) {
            this.fetchContractData('', { ContractNumber: data.ContractNumber, ContractTypeCode: data.ContractTypePrefix, action: 0 }).subscribe(function (e) {
                if (e['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else {
                    _this.applyFormData(e);
                    _this.contractData = e;
                    _this.storeData = e;
                }
            });
        }
    };
    ContractAPIMaintenanceComponent.prototype.applyFormData = function (e) {
        this.contractAPIFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
        this.contractAPIFormGroup.controls['ContractName'].setValue(e.ContractName);
        this.contractAPIFormGroup.controls['Status'].setValue(e.Status);
        this.contractAPIFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
        this.contractAPIFormGroup.controls['ContractAddressLine1'].setValue(e.ContractAddressLine1);
        this.contractAPIFormGroup.controls['ContractAddressLine2'].setValue(e.ContractAddressLine2);
        this.contractAPIFormGroup.controls['ContractAddressLine3'].setValue(e.ContractAddressLine3);
        this.contractAPIFormGroup.controls['ContractAddressLine4'].setValue(e.ContractAddressLine4);
        this.contractAPIFormGroup.controls['ContractAddressLine5'].setValue(e.ContractAddressLine5);
        this.contractAPIFormGroup.controls['ContractPostcode'].setValue(e.ContractPostcode);
        this.contractAPIFormGroup.controls['ContractAnnualValue'].setValue(e.ContractAnnualValue);
        if (e.ContractCommenceDate) {
            if (window['moment'](e.ContractCommenceDate, 'DD/MM/YYYY', true).isValid()) {
                this.commenceDateDisplay = this.utils.convertDate(e.ContractCommenceDate);
            }
            else {
                this.commenceDateDisplay = this.utils.formatDate(new Date(e.ContractCommenceDate));
            }
        }
        else {
            this.commenceDateDisplay = null;
        }
        this.contractCommenceDate = new Date(this.commenceDateDisplay);
        if (e.InvoiceAnnivDate) {
            if (window['moment'](e.InvoiceAnnivDate, 'DD/MM/YYYY', true).isValid()) {
                this.annivDateDisplay = this.utils.convertDate(e.InvoiceAnnivDate);
            }
            else {
                this.annivDateDisplay = this.utils.formatDate(new Date(e.InvoiceAnnivDate));
            }
        }
        else {
            this.annivDateDisplay = null;
        }
        this.annivDate = new Date(this.annivDateDisplay);
        if (e.APIExemptInd) {
            if (e.APIExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.contractAPIFormGroup.controls['APIExemptInd'].setValue(true);
                this.fieldVisibility.APIExemptText = true;
                this.contractAPIFormGroup.controls['APIExemptText'].setValue(e.APIExemptText);
            }
            else {
                this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                this.fieldVisibility.APIExemptText = false;
            }
        }
        else {
            this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
            this.fieldVisibility.APIExemptText = false;
        }
        this.fetchOtherData();
    };
    ContractAPIMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    ContractAPIMaintenanceComponent.prototype.fetchOtherData = function () {
        var _this = this;
        var data = [{
                'table': 'Account',
                'query': { 'BusinessCode': this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractAPIFormGroup.controls['AccountNumber'].value },
                'fields': ['AccountNumber', 'AccountName']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.contractAPIFormGroup.controls['AccountName'].setValue(e['results'][0][0].AccountName);
                }
            }
        }, function (error) {
        });
    };
    ContractAPIMaintenanceComponent.prototype.fetchContractData = function (functionName, params) {
        this.queryContract = new URLSearchParams();
        this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            this.queryContract.set(this.serviceConstants.Action, '6');
            this.queryContract.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryContract.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract);
    };
    ContractAPIMaintenanceComponent.prototype.postAPIExemptData = function (functionName, params) {
        var formdata = {};
        this.queryContract = new URLSearchParams();
        this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            this.queryContract.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryContract.set(key, params[key]);
            }
        }
        formdata['ContractROWID'] = this.storeData['Contract'];
        formdata['ContractNumber'] = this.contractAPIFormGroup.controls['ContractNumber'].value;
        formdata['ContractName'] = this.contractAPIFormGroup.controls['ContractName'].value;
        formdata['ContractCommenceDate'] = this.commenceDateDisplay;
        formdata['InvoiceAnnivDate'] = this.annivDateDisplay;
        formdata['AccountNumber'] = this.contractAPIFormGroup.controls['AccountNumber'].value;
        formdata['ContractAnnualValue'] = this.contractAPIFormGroup.controls['ContractAnnualValue'].value;
        if (this.contractAPIFormGroup.controls['APIExemptInd'].value) {
            formdata['APIExemptInd'] = GlobalConstant.Configuration.Yes;
        }
        else {
            formdata['APIExemptInd'] = GlobalConstant.Configuration.No;
        }
        formdata['APIExemptText'] = this.contractAPIFormGroup.controls['APIExemptText'].value;
        return this.httpService.makePostRequest(this.queryParamsAPIExempt.method, this.queryParamsAPIExempt.module, this.queryParamsAPIExempt.operation, this.queryContract, formdata);
    };
    ContractAPIMaintenanceComponent.prototype.commenceDateSelectedValue = function (value) {
        if (value && value.value) {
            this.commenceDateDisplay = value.value;
        }
    };
    ContractAPIMaintenanceComponent.prototype.annivDateSelectedValue = function (value) {
        if (value && value.value) {
            this.annivDateDisplay = value.value;
        }
    };
    ContractAPIMaintenanceComponent.prototype.onSubmit = function (data, valid, event) {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        event.preventDefault();
        this.promptModal.show();
    };
    ContractAPIMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        this.postAPIExemptData('GetStatus', { action: '2' }).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.errorMessage) {
                    _this.errorService.emitError(e);
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ContractAPIMaintenanceComponent.prototype.onCancelClick = function (event) {
        if (this.contractData['APIExemptInd']) {
            if (this.contractData['APIExemptInd'].toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.contractAPIFormGroup.controls['APIExemptInd'].setValue(true);
                this.fieldVisibility.APIExemptText = true;
                this.contractAPIFormGroup.controls['APIExemptText'].setValue(this.contractData['APIExemptText']);
            }
            else {
                this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                this.contractAPIFormGroup.controls['APIExemptText'].setValue('');
                this.fieldVisibility.APIExemptText = false;
            }
        }
        else {
            this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
            this.contractAPIFormGroup.controls['APIExemptText'].setValue('');
            this.fieldVisibility.APIExemptText = false;
        }
    };
    ContractAPIMaintenanceComponent.prototype.onContractNumberBlur = function (event) {
        var _this = this;
        if (this.contractAPIFormGroup.controls['ContractNumber'].value !== '') {
            var paddedValue = this.numberPadding(event.target.value, 8);
            this.contractAPIFormGroup.controls['ContractNumber'].setValue(paddedValue);
            this.fetchContractData('', { ContractNumber: this.contractAPIFormGroup.controls['ContractNumber'].value, ContractTypeCode: this.contractSearchParams.currentContractType, action: 0 }).subscribe(function (e) {
                if (e['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else {
                    if (e['errorMessage']) {
                        _this.errorService.emitError(e);
                        _this.contractAPIFormGroup.reset();
                        _this.commenceDateDisplay = null;
                        _this.contractCommenceDate = new Date(_this.commenceDateDisplay);
                        _this.annivDateDisplay = null;
                        _this.annivDate = new Date(_this.annivDateDisplay);
                        _this.cbb.disableComponent(false);
                        return;
                    }
                    _this.cbb.disableComponent(true);
                    _this.storeData = e;
                    _this.contractAPIFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
                    _this.contractAPIFormGroup.controls['ContractName'].setValue(e.ContractName);
                    _this.contractAPIFormGroup.controls['Status'].setValue(e.Status);
                    _this.contractAPIFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
                    _this.contractAPIFormGroup.controls['ContractAddressLine1'].setValue(e.ContractAddressLine1);
                    _this.contractAPIFormGroup.controls['ContractAddressLine2'].setValue(e.ContractAddressLine2);
                    _this.contractAPIFormGroup.controls['ContractAddressLine3'].setValue(e.ContractAddressLine3);
                    _this.contractAPIFormGroup.controls['ContractAddressLine4'].setValue(e.ContractAddressLine4);
                    _this.contractAPIFormGroup.controls['ContractAddressLine5'].setValue(e.ContractAddressLine5);
                    _this.contractAPIFormGroup.controls['ContractPostcode'].setValue(e.ContractPostcode);
                    _this.contractAPIFormGroup.controls['ContractAnnualValue'].setValue(e.ContractAnnualValue);
                    if (e.ContractCommenceDate) {
                        if (window['moment'](e.ContractCommenceDate, 'DD/MM/YYYY', true).isValid()) {
                            _this.commenceDateDisplay = _this.utils.convertDate(e.ContractCommenceDate);
                        }
                        else {
                            _this.commenceDateDisplay = _this.utils.formatDate(new Date(e.ContractCommenceDate));
                        }
                    }
                    else {
                        _this.commenceDateDisplay = null;
                    }
                    _this.contractCommenceDate = new Date(_this.commenceDateDisplay);
                    if (e.InvoiceAnnivDate) {
                        if (window['moment'](e.InvoiceAnnivDate, 'DD/MM/YYYY', true).isValid()) {
                            _this.annivDateDisplay = _this.utils.convertDate(e.InvoiceAnnivDate);
                        }
                        else {
                            _this.annivDateDisplay = _this.utils.formatDate(new Date(e.InvoiceAnnivDate));
                        }
                    }
                    else {
                        _this.annivDateDisplay = null;
                    }
                    _this.annivDate = new Date(_this.annivDateDisplay);
                    if (e.APIExemptInd) {
                        if (e.APIExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                            _this.contractAPIFormGroup.controls['APIExemptInd'].setValue(true);
                            _this.fieldVisibility.APIExemptText = true;
                            _this.contractAPIFormGroup.controls['APIExemptText'].setValue(e.APIExemptText);
                        }
                        else {
                            _this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                            _this.fieldVisibility.APIExemptText = false;
                        }
                    }
                    else {
                        _this.contractAPIFormGroup.controls['APIExemptInd'].setValue(false);
                        _this.fieldVisibility.APIExemptText = false;
                    }
                    _this.fetchOtherData();
                }
            });
        }
    };
    ContractAPIMaintenanceComponent.prototype.onAPIExemptChange = function (event) {
        if (event.target.checked) {
            this.fieldVisibility.APIExemptText = true;
        }
        else {
            this.fieldVisibility.APIExemptText = false;
        }
    };
    ContractAPIMaintenanceComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    ContractAPIMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ContractAPIMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.contractAPIFormGroup.statusChanges.subscribe(function (value) {
            if (_this.contractAPIFormGroup.valid === true) {
                _this.routeAwayGlobals.setEllipseOpenFlag(false);
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    ContractAPIMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-contract-commence-date-maintenance',
                    templateUrl: 'iCABSAContractAPIMaintenance.html',
                    providers: [ErrorService]
                },] },
    ];
    ContractAPIMaintenanceComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: Store, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: AuthService, },
        { type: ErrorService, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Title, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: RouteAwayGlobals, },
        { type: CBBService, },
    ];
    ContractAPIMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ContractAPIMaintenanceComponent;
}());
