import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpService } from './../../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';
import { ActionTypes } from './../../../actions/prospect';
import { RiExchange } from './../../../../shared/services/riExchange';
import { ErrorService } from '../../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../../shared/services/translation.service';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
export var MaintenanceTypeAccountComponent = (function () {
    function MaintenanceTypeAccountComponent(zone, fb, route, store, serviceConstants, httpService, riExchange, el, errorService, translateService, router, utils) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.store = store;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.riExchange = riExchange;
        this.el = el;
        this.errorService = errorService;
        this.translateService = translateService;
        this.router = router;
        this.utils = utils;
        this.showMessageHeader = true;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
        this.inputParamsEmployeeSearch = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
        this.postcodeSearchComponent = PostCodeSearchComponent;
        this.inputAccountParamsPostcode = { parentMode: 'Prospect', PostCode: '', AddressLine5: '', AddressLine4: '' };
        this.allFormControls = [];
        this.queryParam = new URLSearchParams();
        this.poscodeSearchDisable = false;
        this.poscodeSearchHide = false;
        this.queryParamsProspect = {
            action: '0',
            operation: 'ContactManagement/iCABSCMPipelineProspectMaintenance',
            module: 'prospect',
            method: 'prospect-to-contract/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.fieldVisibility = {
            'isHiddenProspectName': false,
            'isHiddenAddressLine1': false,
            'isHiddenAddressLine2': false,
            'isHiddenAddressLine3': false,
            'isHiddenAddressLine4': false,
            'isHiddenAddressLine5': false,
            'isHiddenPostcode': false,
            'isHiddenContactName': false,
            'isHiddenContactPosition': false,
            'isHiddenContactMobile': false,
            'isHiddenContactTelephone': false,
            'isHiddenContactFax': false,
            'isHiddenContactEmail': false,
            'isHiddencmdGetAddress': false,
            'isHiddenCopyPremise': false
        };
        this.fieldRequired = {
            'ProspectName': false,
            'AddressLine1': false,
            'AddressLine2': false,
            'AddressLine3': false,
            'AddressLine4': false,
            'AddressLine5': false,
            'Postcode': false,
            'ContactName': false,
            'ContactPosition': false,
            'ContactMobile': false,
            'ContactFax': false,
            'ContactEmail': false,
            'ContactTelephone': false
        };
        this.fieldDisable = {
            'ProspectName': false,
            'AddressLine1': false,
            'AddressLine2': false,
            'AddressLine3': true,
            'AddressLine4': false,
            'AddressLine5': false,
            'Postcode': false,
            'ContactName': false,
            'ContactPosition': false,
            'ContactMobile': false,
            'ContactFax': false,
            'ContactEmail': false,
            'ContactTelephone': false
        };
        this.companyList = [];
        this.dateObjectsEnabled = {
            contractResignDate: false
        };
        this.buttonDisable = {
            cp: false,
            getaddress: false
        };
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.searchModalRoute = '';
        this.showHeader = true;
        this.showButton = true;
        this.queryLookUp = new URLSearchParams();
        this.systemParametersFromParent = { ttBusiness: [{}], systemChars: {} };
        this.maintenanceAccountFormGroup = this.fb.group({
            ProspectName: [{ value: '', disabled: false }],
            AddressLine1: [{ value: '', disabled: false }],
            AddressLine2: [{ value: '', disabled: false }],
            AddressLine3: [{ value: '', disabled: false }],
            AddressLine4: [{ value: '', disabled: false }],
            AddressLine5: [{ value: '', disabled: false }],
            Postcode: [{ value: '', disabled: false }],
            ContactName: [{ value: '', disabled: false }],
            ContactPosition: [{ value: '', disabled: false }],
            ContactMobile: [{ value: '', disabled: false }],
            ContactTelephone: [{ value: '', disabled: false }],
            ContactFax: [{ value: '', disabled: false }],
            ContactEmail: [{ value: '', disabled: false }]
        });
        this.storeSubscription = store.select('prospect').subscribe(function (data) {
            if (data['action']) {
                if (data['action'].toString() === ActionTypes.SAVE_SYSTEM_PARAMETER) {
                    _this.systemParametersFromParent['systemChars'] = data['data']['systemChars'];
                    _this.parentControls = data['data']['formParentControl'];
                    _this.setUI();
                }
                else if (data['action'].toString() === ActionTypes.EXCHANGE_METHOD) {
                    for (var _i = 0, _a = data['data']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        if (_this[m]) {
                            _this[m]();
                        }
                    }
                }
                else if (data['action'].toString() === ActionTypes.FORM_CONTROLS) {
                    _this.allFormControls.push(data['data']);
                }
            }
        });
    }
    MaintenanceTypeAccountComponent.prototype.setUI = function () {
        if (!this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF && !this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF) {
            this.fieldVisibility.isHiddencmdGetAddress = true;
        }
        this.poscodeSearchHide = !((this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF || this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF));
        this.fieldRequired['ProspectName'] = true;
        this.fieldRequired['AddressLine1'] = true;
        this.fieldRequired['AddressLine2'] = false;
        this.fieldRequired['AddressLine4'] = true;
        this.fieldRequired['Postcode'] = true;
        this.fieldRequired['ContactName'] = true;
        this.fieldRequired['ContactPosition'] = true;
        this.fieldRequired['ContactTelephone'] = true;
        this.fieldRequired['Postcode'] = true;
        this.fieldRequired['ContactName'] = true;
        var parentMode = this.riExchange.ParentMode(this.systemParametersFromParent.systemChars.routeParams);
        if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3) {
            this.fieldVisibility.isHiddenAddressLine3 = false;
            this.fieldRequired['AddressLine3'] = true;
        }
        else {
            this.fieldRequired['AddressLine3'] = false;
            this.fieldVisibility.isHiddenAddressLine3 = true;
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine5Required) {
            this.fieldRequired['AddressLine5'] = true;
        }
        else {
            this.fieldRequired['AddressLine5'] = false;
        }
        if (parentMode === 'CallCentreSearchNewExisting') {
            this.maintenanceAccountFormGroup.controls['ProspectName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountName'));
            this.maintenanceAccountFormGroup.controls['AddressLine1'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine1'));
            this.maintenanceAccountFormGroup.controls['AddressLine2'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine2'));
            this.maintenanceAccountFormGroup.controls['AddressLine3'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine3'));
            this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine4'));
            this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountAddressLine5'));
            this.maintenanceAccountFormGroup.controls['Postcode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'AccountPostcode'));
        }
        if (parentMode === 'LostBusinessRequest') {
            this.populateAccountService();
        }
        if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('Prospect', 'i'))) {
            this.setAccountRelatedInfo();
        }
        this.updateValidators();
    };
    MaintenanceTypeAccountComponent.prototype.updateValidators = function () {
        for (var f in this.fieldRequired) {
            if (this.fieldRequired.hasOwnProperty(f)) {
                if (this.maintenanceAccountFormGroup.controls[f]) {
                    if (this.fieldRequired[f] && this.fieldRequired[f] === true) {
                        this.maintenanceAccountFormGroup.controls[f].setValidators([Validators.required]);
                    }
                    else {
                        this.maintenanceAccountFormGroup.controls[f].clearValidators();
                    }
                    this.maintenanceAccountFormGroup.controls[f].updateValueAndValidity();
                }
            }
        }
    };
    MaintenanceTypeAccountComponent.prototype.updateDisable = function () {
        for (var f in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(f)) {
                if (this.fieldDisable[f] && this.maintenanceAccountFormGroup.controls[f]) {
                    this.maintenanceAccountFormGroup.controls[f].disable();
                }
                else {
                    this.maintenanceAccountFormGroup.controls[f].enable();
                }
                this.maintenanceAccountFormGroup.controls[f].updateValueAndValidity();
            }
        }
    };
    MaintenanceTypeAccountComponent.prototype.populateAccountService = function () {
    };
    MaintenanceTypeAccountComponent.prototype.setAccountRelatedInfo = function () {
        if (this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true) {
            if (this.parentControls.controls['AccountNumber'].value) {
                this.fieldVisibility.isHiddenCopyPremise = true;
                this.fieldVisibility.isHiddencmdGetAddress = true;
                this.fieldRequired.ProspectName = false;
                this.fieldRequired.AddressLine1 = false;
                this.fieldRequired.AddressLine2 = false;
                this.fieldRequired.AddressLine3 = false;
                this.fieldRequired.AddressLine4 = false;
                this.fieldRequired.AddressLine5 = false;
                this.fieldRequired.Postcode = false;
                this.fieldRequired.ContactName = false;
                this.fieldRequired.ContactPosition = false;
                this.fieldRequired.ContactTelephone = false;
                this.fieldRequired.ContactFax = false;
                this.fieldRequired.ContactEmail = false;
                this.fieldRequired.ContactMobile = false;
                this.fieldDisable.ProspectName = true;
                this.fieldDisable.AddressLine1 = true;
                this.fieldDisable.AddressLine2 = true;
                this.fieldDisable.AddressLine3 = true;
                this.fieldDisable.AddressLine4 = true;
                this.fieldDisable.AddressLine5 = true;
                this.fieldDisable.Postcode = true;
                this.fieldDisable.ContactName = true;
                this.fieldDisable.ContactPosition = true;
                this.fieldDisable.ContactTelephone = true;
                this.fieldDisable.ContactFax = true;
                this.fieldDisable.ContactEmail = true;
                this.fieldDisable.ContactMobile = true;
            }
            else {
                this.fieldVisibility.isHiddenCopyPremise = false;
                this.fieldVisibility.isHiddencmdGetAddress = false;
                this.fieldRequired.ProspectName = true;
                this.fieldRequired.AddressLine1 = true;
                this.fieldRequired.AddressLine4 = true;
                this.fieldRequired.Postcode = true;
                this.fieldRequired.ContactName = true;
                this.fieldRequired.ContactPosition = true;
                this.fieldRequired.ContactTelephone = true;
                if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3) {
                    this.fieldRequired.AddressLine3 = true;
                }
                if (this.systemParametersFromParent.systemChars.vSCAddressLine5Required) {
                    this.fieldRequired.AddressLine3 = true;
                }
                this.fieldDisable.ProspectName = false;
                this.fieldDisable.AddressLine1 = false;
                this.fieldDisable.AddressLine2 = false;
                this.fieldDisable.AddressLine3 = false;
                this.fieldDisable.AddressLine4 = false;
                this.fieldDisable.AddressLine5 = false;
                this.fieldDisable.Postcode = false;
                this.fieldDisable.ContactName = false;
                this.fieldDisable.ContactPosition = false;
                this.fieldDisable.ContactTelephone = false;
                this.fieldDisable.ContactFax = false;
                this.fieldDisable.ContactEmail = false;
                this.fieldDisable.ContactMobile = false;
            }
            this.updateValidators();
            this.updateDisable();
        }
    };
    MaintenanceTypeAccountComponent.prototype.onGetAddressClick = function (data) {
        if (this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF) {
            this.messageModal.show({ msg: 'Screen is yet not developed', title: 'Message' }, false);
        }
        else if (this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF) {
            this.inputAccountParamsPostcode = {
                parentMode: 'Prospect',
                PostCode: this.maintenanceAccountFormGroup.controls['Postcode'].value,
                AddressLine5: this.maintenanceAccountFormGroup.controls['AddressLine5'].value,
                AddressLine4: this.maintenanceAccountFormGroup.controls['AddressLine4'].value
            };
            this.postcodeAccountSearchEllipsis.childConfigParams = this.inputAccountParamsPostcode;
            this.postcodeAccountSearchEllipsis.openModal();
        }
    };
    MaintenanceTypeAccountComponent.prototype.addressLine4Onfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine4'].value));
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine4Required && this.maintenanceAccountFormGroup.controls['AddressLine4'].value === '' && this.systemParametersFromParent.systemChars.SystemCharEnableValidatePostcodeSuburb)
            this.el.nativeElement.querySelector('#cmdGetAddress').click();
    };
    MaintenanceTypeAccountComponent.prototype.addressLine5onfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine5'].value));
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine5Required && this.maintenanceAccountFormGroup.controls['AddressLine5'].value === '' && this.systemParametersFromParent.systemChars.SystemCharEnableValidatePostcodeSuburb)
            this.el.nativeElement.querySelector('#cmdGetAddress').click();
    };
    MaintenanceTypeAccountComponent.prototype.postcodeOnfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenanceAccountFormGroup.controls['Postcode'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['Postcode'].value));
        }
        if (this.systemParametersFromParent.systemChars.vSCPostCodeRequired && this.maintenanceAccountFormGroup.controls['Postcode'].value === '')
            this.el.nativeElement.querySelector('#cmdGetAddress').click();
    };
    MaintenanceTypeAccountComponent.prototype.accountContactPositiononfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenanceAccountFormGroup.controls['ProspectName'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ProspectName'].value));
            this.maintenanceAccountFormGroup.controls['AddressLine1'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine1'].value));
            this.maintenanceAccountFormGroup.controls['AddressLine2'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine2'].value));
            this.maintenanceAccountFormGroup.controls['AddressLine3'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['AddressLine3'].value));
            this.maintenanceAccountFormGroup.controls['ContactName'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactName'].value));
            this.maintenanceAccountFormGroup.controls['ContactPosition'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactPosition'].value));
            this.maintenanceAccountFormGroup.controls['ContactTelephone'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactTelephone'].value));
            this.maintenanceAccountFormGroup.controls['ContactFax'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactFax'].value));
            this.maintenanceAccountFormGroup.controls['ContactMobile'].setValue(this.utils.capitalizeFirstLetter(this.maintenanceAccountFormGroup.controls['ContactMobile'].value));
        }
    };
    MaintenanceTypeAccountComponent.prototype.cmdCopyFromPremiseOnClick = function () {
        this.maintenanceAccountFormGroup.controls['ProspectName'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseName'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine1'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine1'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine2'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine2'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine3'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine3'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine4'].value);
        this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseAddressLine5'].value);
        this.maintenanceAccountFormGroup.controls['Postcode'].setValue(this.allFormControls[0]['formPremise'].controls['PremisePostcode'].value);
        this.maintenanceAccountFormGroup.controls['ContactName'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactName'].value);
        this.maintenanceAccountFormGroup.controls['ContactPosition'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactPosition'].value);
        this.maintenanceAccountFormGroup.controls['ContactTelephone'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactTelephone'].value);
        this.maintenanceAccountFormGroup.controls['ContactFax'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactFax'].value);
        this.maintenanceAccountFormGroup.controls['ContactEmail'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactEmail'].value);
        this.maintenanceAccountFormGroup.controls['ContactMobile'].setValue(this.allFormControls[0]['formPremise'].controls['PremiseContactMobile'].value);
    };
    MaintenanceTypeAccountComponent.prototype.postcodeOnchange = function (postCode) {
        var _this = this;
        this.inputAccountParamsPostcode = {
            parentMode: 'Prospect',
            PostCode: this.maintenanceAccountFormGroup.controls['Postcode'].value,
            AddressLine5: this.maintenanceAccountFormGroup.controls['AddressLine5'].value,
            AddressLine4: this.maintenanceAccountFormGroup.controls['AddressLine4'].value
        };
        this.postcodeAccountSearchEllipsis.childConfigParams = this.inputAccountParamsPostcode;
        this.postcodeAccountSearchEllipsis.updateComponent();
        if (postCode && this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF && this.systemParametersFromParent.systemChars.vSCEnablePostcodeDefaulting) {
            this.queryParam.set(this.serviceConstants.Action, '0');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('Postcode', postCode);
            this.queryParam.set('Town', this.maintenanceAccountFormGroup.controls['AddressLine4'].value);
            this.queryParam.set('State', this.maintenanceAccountFormGroup.controls['AddressLine5'].value);
            this.queryParam.set('Function', 'GetPostCodeTownAndState');
            this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
                try {
                    if (data.UniqueRecordFound === 'yes') {
                    }
                    else {
                        _this.maintenanceAccountFormGroup.controls['Postcode'].setValue(data.Postcode);
                        _this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(data.Town);
                        _this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(data.State);
                    }
                }
                catch (error) {
                    _this.errorService.emitError(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    MaintenanceTypeAccountComponent.prototype.onAccountPostcodeDataReturn = function (data) {
        this.maintenanceAccountFormGroup.controls['Postcode'].setValue(data.Postcode);
        this.maintenanceAccountFormGroup.controls['AddressLine4'].setValue(data.AddressLine4);
        this.maintenanceAccountFormGroup.controls['AddressLine5'].setValue(data.AddressLine5);
    };
    MaintenanceTypeAccountComponent.prototype.updateAccountData = function () {
        this.postcodeOnchange(this.maintenanceAccountFormGroup.controls['Postcode'].value);
    };
    MaintenanceTypeAccountComponent.prototype.updateStoreControl = function (action) {
        this.store.dispatch({
            type: ActionTypes[action],
            payload: { formAccount: this.maintenanceAccountFormGroup }
        });
    };
    MaintenanceTypeAccountComponent.prototype.ngOnInit = function () {
        this.updateStoreControl(ActionTypes.FORM_CONTROLS);
        this.translateService.setUpTranslation();
        this.disableAllAccount();
    };
    MaintenanceTypeAccountComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    MaintenanceTypeAccountComponent.prototype.disableAllAccount = function () {
        for (var d in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(d)) {
                this.fieldDisable[d] = true;
            }
        }
        for (var d in this.buttonDisable) {
            if (this.buttonDisable.hasOwnProperty(d)) {
                this.buttonDisable[d] = true;
            }
        }
        this.updateDisable();
        this.poscodeSearchDisable = true;
    };
    MaintenanceTypeAccountComponent.prototype.enableAllAccount = function () {
        for (var d in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(d)) {
                this.fieldDisable[d] = false;
            }
        }
        for (var d in this.buttonDisable) {
            if (this.buttonDisable.hasOwnProperty(d)) {
                this.buttonDisable[d] = false;
            }
        }
        this.updateDisable();
        this.poscodeSearchDisable = false;
        this.setUI();
    };
    MaintenanceTypeAccountComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-type-c',
                    templateUrl: 'maintenanceTabAccount.html'
                },] },
    ];
    MaintenanceTypeAccountComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Store, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: RiExchange, },
        { type: ElementRef, },
        { type: ErrorService, },
        { type: LocaleTranslationService, },
        { type: Router, },
        { type: Utils, },
    ];
    MaintenanceTypeAccountComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'postcodeAccountSearchEllipsis': [{ type: ViewChild, args: ['postcodeAccountSearchEllipsis',] },],
    };
    return MaintenanceTypeAccountComponent;
}());
