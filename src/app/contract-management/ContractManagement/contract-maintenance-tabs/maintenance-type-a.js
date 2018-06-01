import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { ContractActionTypes } from '../../../actions/contract';
import { PostCodeSearchComponent } from '../../../internal/search/iCABSBPostcodeSearch.component';
import { MarktSelectSearchComponent } from '../../../internal/search/iCABSMarktSelectSearch.component';
import { ScreenNotReadyComponent } from '../../../../shared/components/screenNotReady';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';
export var MaintenanceTypeAComponent = (function () {
    function MaintenanceTypeAComponent(zone, fb, route, router, store, httpService, utils, serviceConstants) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.store = store;
        this.httpService = httpService;
        this.utils = utils;
        this.serviceConstants = serviceConstants;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
        this.inputParamsZipCode = { 'parentMode': 'Contract', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
        this.fieldVisibility = {
            'contractAddressLine1': true,
            'cmdGetAddress': true,
            'contractAddressLine2': true,
            'contractAddressLine3': false,
            'contractAddressLine4': true,
            'contractAddressLine5': true,
            'contractPostcode': true,
            'countryCode': true,
            'countryDesc': true,
            'gpsCoordinateX': false,
            'gpsCoordinateY': false,
            'contractContactName': true,
            'btnAmendContact': false,
            'contractContactPosition': true,
            'contractContactDepartment': true,
            'contractContactTelephone': true,
            'contractContactMobile': true,
            'contractContactEmail': true,
            'contractContactFax': true
        };
        this.fieldRequired = {
            'contractAddressLine1': true,
            'contractAddressLine2': false,
            'contractAddressLine3': false,
            'contractAddressLine4': true,
            'contractAddressLine5': false,
            'contractPostcode': true,
            'countryCode': true,
            'gpsCoordinateX': true,
            'gpsCoordinateY': true,
            'contractContactName': true,
            'btnAmendContact': false,
            'contractContactPosition': false,
            'contractContactDepartment': false,
            'contractContactTelephone': true,
            'contractContactMobile': false,
            'contractContactEmail': false,
            'contractContactFax': false
        };
        this.zipSearchComponent = PostCodeSearchComponent;
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.searchModalRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.isCountryCodeDisabled = true;
        this.isZipCodeEllipsisDisabled = true;
        this.countrySelected = {
            id: '',
            text: ''
        };
        this.postCodeAutoOpen = false;
        this.sysCharParams = {};
        this.queryParamsContract = {
            action: '0',
            operation: 'Application/iCABSAContractMaintenance',
            module: 'contract',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.queryContract = new URLSearchParams();
        this.fieldRequiredClone = {};
        this.fieldVisibilityClone = {};
        this.zipCodeHide = false;
        this.countryValidate = false;
        this.closePostCodeModal = false;
        this.maintenanceAFormGroup = this.fb.group({
            ContractAddressLine1: [{ value: '', disabled: true }, Validators.required],
            ContractAddressLine2: [{ value: '', disabled: true }],
            ContractAddressLine3: [{ value: '', disabled: true }],
            ContractAddressLine4: [{ value: '', disabled: true }, Validators.required],
            ContractAddressLine5: [{ value: '', disabled: true }],
            ContractPostcode: [{ value: '', disabled: true }, Validators.required],
            GetAddress: [{ disabled: true }],
            CountryCode: [{ value: '', disabled: true }],
            CountryDesc: [{ value: '', disabled: true }],
            GPSCoordinateX: [{ value: '', disabled: true }, Validators.required],
            GPSCoordinateY: [{ value: '', disabled: true }, Validators.required],
            ContractContactName: [{ value: '', disabled: true }, Validators.required],
            BtnAmendContact: [{ value: 'Contact Details', disabled: true }],
            ContractContactPosition: [{ value: '', disabled: true }, Validators.required],
            ContractContactDepartment: [{ value: '', disabled: true }],
            ContractContactTelephone: [{ value: '', disabled: true }, Validators.required],
            ContractContactMobile: [{ value: '', disabled: true }, Validators.required],
            ContractContactEmail: [{ value: '', disabled: true }],
            ContractContactFax: [{ value: '', disabled: true }]
        });
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data && data['action']) {
                _this.storeData = data;
                _this.sysCharParams = data['syschars'];
                switch (data['action']) {
                    case ContractActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.setFormData(data);
                        }
                        break;
                    case ContractActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && (Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.inputParams = Object.assign({}, _this.inputParams, {
                                'ContractPostcode': _this.maintenanceAFormGroup.controls['ContractPostcode'] ? _this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
                                'ContractAddressLine4': _this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? _this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
                                'ContractAddressLine5': _this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? _this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
                            });
                            _this.inputParamsZipCode = Object.assign({}, _this.inputParams, {
                                'ContractPostcode': _this.maintenanceAFormGroup.controls['ContractPostcode'] ? _this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
                                'ContractAddressLine4': _this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? _this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
                                'ContractAddressLine5': _this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? _this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
                            });
                        }
                        break;
                    case ContractActionTypes.SAVE_MODE:
                        _this.mode = data['mode'];
                        _this.processForm();
                        break;
                    case ContractActionTypes.SAVE_SYSCHAR:
                        if (data['syschars']) {
                            _this.sysCharParams = data['syschars'];
                            _this.processSysChar();
                        }
                        break;
                    case ContractActionTypes.SAVE_PARAMS:
                        _this.params = data['params'];
                        _this.inputParams = data['params'];
                        break;
                    case ContractActionTypes.SAVE_OTHER_PARAMS:
                        _this.otherParams = data['otherParams'];
                        if (_this.otherParams['postCodeAutoOpen'] === true) {
                            _this.postCodeAutoOpen = true;
                            setTimeout(function () {
                                _this.postCodeAutoOpen = false;
                            }, 100);
                        }
                        else {
                            _this.postCodeAutoOpen = false;
                        }
                        if (_this.otherParams['vDisableFields'].indexOf('DisableAddressLine3') > -1) {
                            _this.fieldVisibility['contractAddressLine3'] = false;
                        }
                        break;
                    case ContractActionTypes.SAVE_CODE:
                        break;
                    case ContractActionTypes.FORM_RESET:
                        _this.fieldRequired = JSON.parse(JSON.stringify(_this.fieldRequiredClone));
                        _this.fieldVisibility = JSON.parse(JSON.stringify(_this.fieldVisibilityClone));
                        _this.storeData['fieldRequired'].typeA = _this.fieldRequired;
                        _this.storeData['fieldVisibility'].typeA = _this.fieldVisibility;
                        for (var i in _this.maintenanceAFormGroup.controls) {
                            if (_this.maintenanceAFormGroup.controls.hasOwnProperty(i)) {
                                _this.maintenanceAFormGroup.controls[i].clearValidators();
                            }
                        }
                        _this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValidators(Validators.required);
                        _this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                        _this.maintenanceAFormGroup.controls['ContractPostcode'].setValidators(Validators.required);
                        _this.maintenanceAFormGroup.controls['GPSCoordinateX'].setValidators(Validators.required);
                        _this.maintenanceAFormGroup.controls['GPSCoordinateY'].setValidators(Validators.required);
                        _this.maintenanceAFormGroup.controls['ContractContactName'].setValidators(Validators.required);
                        _this.maintenanceAFormGroup.controls['ContractContactPosition'].setValidators(Validators.required);
                        _this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValidators(Validators.required);
                        _this.maintenanceAFormGroup.controls['ContractContactMobile'].setValidators(Validators.required);
                        _this.fieldRequired.contractAddressLine2 = true;
                        _this.fieldRequired.contractAddressLine4 = true;
                        _this.fieldRequired.contractPostcode = true;
                        _this.fieldRequired.gpsCoordinateX = true;
                        _this.fieldRequired.gpsCoordinateY = true;
                        _this.fieldRequired.contractContactName = true;
                        _this.fieldRequired.contractContactPosition = true;
                        _this.fieldRequired.contractContactTelephone = true;
                        _this.fieldRequired.contractContactMobile = true;
                        _this.maintenanceAFormGroup.reset();
                        break;
                    case ContractActionTypes.SAVE_FIELD:
                        break;
                    case ContractActionTypes.SAVE_SENT_FROM_PARENT:
                        break;
                    case ContractActionTypes.SAVE_SERVICE:
                        _this.storeData['services'].localeTranslateService.setUpTranslation();
                        _this.translateSubscription = _this.storeData['services'].localeTranslateService.ajaxSource$.subscribe(function (event) {
                            if (event !== 0) {
                                _this.fetchTranslationContent();
                            }
                        });
                        break;
                    case ContractActionTypes.VALIDATE_FORMS:
                        if (data['validate'].typeA) {
                            _this.validateForm();
                        }
                        break;
                    case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
                        if (data['parentToChildComponent'] && data['parentToChildComponent']['CountryCode']) {
                            _this.countrySelected = {
                                id: '',
                                text: _this.utils.getCountryDesc(data['parentToChildComponent']['CountryCode'])
                            };
                            _this.maintenanceAFormGroup.controls['CountryCode'].setValue(data['parentToChildComponent']['CountryCode']);
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    }
    MaintenanceTypeAComponent.prototype.ngOnInit = function () {
    };
    MaintenanceTypeAComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.parentQueryParams = params;
            switch (params['parent']) {
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
                    _this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValidators(Validators.required);
                    _this.maintenanceAFormGroup.controls['ContractAddressLine2'].clearValidators();
                    _this.maintenanceAFormGroup.updateValueAndValidity();
                    break;
                case 'ServiceCover':
                case 'Premise':
                case 'ServiceVisitWorkIndex':
                    break;
                case 'Portfolio General Maintenance':
                    break;
                default:
                    break;
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeA: this.maintenanceAFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
                typeA: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                typeA: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.INITIALIZATION, payload: {
                typeA: true
            }
        });
        setTimeout(function () {
            if (_this.storeData && _this.storeData['data'] && !(Object.keys(_this.storeData['data']).length === 0 && _this.storeData['data'].constructor === Object)) {
                _this.setFormData(_this.storeData);
            }
        }, 0);
        this.fieldRequiredClone = JSON.parse(JSON.stringify(this.fieldRequired));
        this.fieldVisibilityClone = JSON.parse(JSON.stringify(this.fieldVisibility));
    };
    MaintenanceTypeAComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    MaintenanceTypeAComponent.prototype.zipCodeModalHidden = function (event) {
        if (this.storeData['otherParams'] && this.storeData['otherParams'].zipCodeFromOther) {
            setTimeout(function () {
                var elem = document.querySelector('#Copy');
                if (elem) {
                    elem['focus']();
                }
            }, 0);
        }
        this.storeData['otherParams'].zipCodeFromOther = false;
    };
    MaintenanceTypeAComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Get Address', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.maintenanceAFormGroup.controls['GetAddress'].setValue(res);
                }
            });
        });
        this.getTranslatedValue('Contact Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.maintenanceAFormGroup.controls['BtnAmendContact'].setValue(res);
                }
            });
        });
    };
    MaintenanceTypeAComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.storeData['services'].translate.get(key, { value: params });
        }
        else {
            return this.storeData['services'].translate.get(key);
        }
    };
    MaintenanceTypeAComponent.prototype.processSysChar = function () {
        if (!(this.sysCharParams['vSCEnableHopewiserPAF'] || this.sysCharParams['vSCEnableDatabasePAF'] || this.sysCharParams['vSCEnableMarktSelect'])) {
            this.fieldVisibility.cmdGetAddress = false;
        }
        if (!this.sysCharParams['vSCEnableGPSCoordinates']) {
            this.fieldVisibility.gpsCoordinateX = false;
            this.fieldVisibility.gpsCoordinateY = false;
        }
        else {
            this.fieldVisibility.gpsCoordinateX = true;
            this.fieldVisibility.gpsCoordinateY = true;
        }
        if (this.sysCharParams['vSCHidePostcode']) {
            this.fieldVisibility.contractPostcode = false;
        }
        else {
            this.fieldVisibility.contractPostcode = true;
        }
        if (!this.sysCharParams['vSCEnableAddressLine3']) {
            this.fieldVisibility.contractAddressLine3 = false;
        }
        else {
            this.fieldVisibility.contractAddressLine3 = true;
        }
        if (this.sysCharParams['vSCMultiContactInd']) {
            this.fieldVisibility.btnAmendContact = false;
        }
        this.maintenanceAFormGroup.controls['GetAddress'].disable();
        if (this.parentQueryParams) {
            switch (this.parentQueryParams['parent']) {
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
                    this.maintenanceAFormGroup.controls['ContractAddressLine2'].clearValidators();
                    if (this.sysCharParams['vSCAddressLine3Logical'] && this.fieldVisibility.contractAddressLine3) {
                        this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValidators(Validators.required);
                        this.fieldRequired.contractAddressLine3 = true;
                    }
                    else {
                        if (this.maintenanceAFormGroup.controls['ContractAddressLine3'])
                            this.maintenanceAFormGroup.controls['ContractAddressLine3'].clearValidators();
                        this.fieldRequired.contractAddressLine3 = false;
                    }
                    if (this.sysCharParams['vSCAddressLine4Logical']) {
                        this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                        this.fieldRequired.contractAddressLine4 = true;
                    }
                    else {
                        if (!this.sysCharParams['vSCEnablePostcodeSuburbLog'] && !this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
                            if (this.maintenanceAFormGroup.controls['ContractAddressLine4'])
                                this.maintenanceAFormGroup.controls['ContractAddressLine4'].clearValidators();
                            this.fieldRequired.contractAddressLine4 = false;
                        }
                        else {
                            this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                            this.fieldRequired.contractAddressLine4 = true;
                        }
                    }
                    if (this.sysCharParams['vSCAddressLine5Logical']) {
                        this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValidators(Validators.required);
                        this.fieldRequired.contractAddressLine5 = true;
                    }
                    else {
                        if (this.maintenanceAFormGroup.controls['ContractAddressLine5'])
                            this.maintenanceAFormGroup.controls['ContractAddressLine5'].clearValidators();
                        this.fieldRequired.contractAddressLine5 = false;
                    }
                    if (this.sysCharParams['vSCHidePostcode']) {
                        this.maintenanceAFormGroup.controls['ContractPostcode'].setValidators(Validators.required);
                        this.fieldRequired.contractPostcode = true;
                    }
                    else {
                        if (this.maintenanceAFormGroup.controls['ContractPostcode'])
                            this.maintenanceAFormGroup.controls['ContractPostcode'].clearValidators();
                        this.fieldRequired.contractPostcode = false;
                    }
                    this.maintenanceAFormGroup.updateValueAndValidity();
                    break;
                default:
                    if (!this.sysCharParams['vSCCapitalFirstLtr']) {
                        this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValidators(Validators.required);
                        if (this.maintenanceAFormGroup.controls['ContractAddressLine2'])
                            this.maintenanceAFormGroup.controls['ContractAddressLine2'].clearValidators();
                        this.fieldRequired.contractAddressLine1 = true;
                        this.fieldRequired.contractAddressLine2 = false;
                        this.fieldRequired.contractContactName = true;
                        this.fieldRequired.contractContactPosition = true;
                        this.maintenanceAFormGroup.controls['ContractContactPosition'].setValidators(Validators.required);
                        this.maintenanceAFormGroup.controls['ContractContactName'].setValidators(Validators.required);
                        if (this.sysCharParams['vSCAddressLine3Logical'] && this.fieldVisibility.contractAddressLine3) {
                            this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValidators(Validators.required);
                            this.fieldRequired.contractAddressLine3 = true;
                        }
                        else {
                            if (this.maintenanceAFormGroup.controls['ContractAddressLine3'])
                                this.maintenanceAFormGroup.controls['ContractAddressLine3'].clearValidators();
                            this.fieldRequired.contractAddressLine3 = false;
                        }
                        if (this.sysCharParams['vSCAddressLine4Logical']) {
                            this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                            this.fieldRequired.contractAddressLine4 = true;
                        }
                        else {
                            if (!this.sysCharParams['vSCEnablePostcodeSuburbLog'] && !this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
                                if (this.maintenanceAFormGroup.controls['ContractAddressLine4'])
                                    this.maintenanceAFormGroup.controls['ContractAddressLine4'].clearValidators();
                                this.fieldRequired.contractAddressLine4 = false;
                            }
                            else {
                                this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                                this.fieldRequired.contractAddressLine4 = true;
                            }
                        }
                        if (this.sysCharParams['vSCAddressLine5Logical']) {
                            this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValidators(Validators.required);
                            this.fieldRequired.contractAddressLine5 = true;
                        }
                        else {
                            if (this.maintenanceAFormGroup.controls['ContractAddressLine5'])
                                this.maintenanceAFormGroup.controls['ContractAddressLine5'].clearValidators();
                            this.fieldRequired.contractAddressLine5 = false;
                        }
                    }
                    else {
                        this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValidators(Validators.required);
                        if (this.maintenanceAFormGroup.controls['ContractAddressLine2'])
                            this.maintenanceAFormGroup.controls['ContractAddressLine2'].clearValidators();
                        this.fieldRequired.contractAddressLine1 = true;
                        this.fieldRequired.contractAddressLine2 = false;
                        this.fieldRequired.contractContactName = true;
                        this.fieldRequired.contractContactPosition = true;
                        this.fieldRequired.contractContactDepartment = false;
                        if (this.maintenanceAFormGroup.controls['ContractContactName'])
                            this.maintenanceAFormGroup.controls['ContractContactName'].setValidators(Validators.required);
                        if (this.maintenanceAFormGroup.controls['ContractContactPosition'])
                            this.maintenanceAFormGroup.controls['ContractContactPosition'].setValidators(Validators.required);
                        if (this.maintenanceAFormGroup.controls['ContractContactDepartment'])
                            this.maintenanceAFormGroup.controls['ContractContactDepartment'].clearValidators();
                        if (this.sysCharParams['vSCAddressLine3Logical']) {
                            this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValidators(Validators.required);
                            this.fieldRequired.contractAddressLine3 = true;
                        }
                        else {
                            if (this.maintenanceAFormGroup.controls['ContractAddressLine3'])
                                this.maintenanceAFormGroup.controls['ContractAddressLine3'].clearValidators();
                            this.fieldRequired.contractAddressLine3 = false;
                        }
                        if (this.sysCharParams['vSCAddressLine4Logical']) {
                            this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                            this.fieldRequired.contractAddressLine4 = true;
                        }
                        else {
                            if (!this.sysCharParams['vSCEnablePostcodeSuburbLog'] && !this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
                                if (this.maintenanceAFormGroup.controls['ContractAddressLine4'])
                                    this.maintenanceAFormGroup.controls['ContractAddressLine4'].clearValidators();
                                this.fieldRequired.contractAddressLine4 = false;
                            }
                            else {
                                this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                                this.fieldRequired.contractAddressLine4 = true;
                            }
                        }
                    }
                    if (this.sysCharParams['vSCHidePostcode']) {
                        if (this.maintenanceAFormGroup.controls['ContractPostcode'])
                            this.maintenanceAFormGroup.controls['ContractPostcode'].clearValidators();
                        this.fieldRequired.contractPostcode = false;
                    }
                    else {
                        this.maintenanceAFormGroup.controls['ContractPostcode'].setValidators(Validators.required);
                        this.fieldRequired.contractPostcode = true;
                    }
                    break;
            }
        }
        this.fieldRequired.contractContactTelephone = true;
        this.fieldRequired.contractContactMobile = false;
        this.fieldRequired.contractContactEmail = false;
        this.fieldRequired.contractContactFax = false;
        this.fieldRequired.gpsCoordinateY = false;
        this.fieldRequired.gpsCoordinateX = false;
        this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValidators(Validators.required);
        if (this.maintenanceAFormGroup.controls['ContractContactMobile'])
            this.maintenanceAFormGroup.controls['ContractContactMobile'].clearValidators();
        if (this.maintenanceAFormGroup.controls['ContractContactEmail'])
            this.maintenanceAFormGroup.controls['ContractContactEmail'].clearValidators();
        if (this.maintenanceAFormGroup.controls['ContractContactFax'])
            this.maintenanceAFormGroup.controls['ContractContactFax'].clearValidators();
        if (this.maintenanceAFormGroup.controls['GPSCoordinateY'])
            this.maintenanceAFormGroup.controls['GPSCoordinateY'].clearValidators();
        if (this.maintenanceAFormGroup.controls['GPSCoordinateX'])
            this.maintenanceAFormGroup.controls['GPSCoordinateX'].clearValidators();
        if (this.sysCharParams['vSCEnableHopewiserPAF']) {
            this.zipSearchComponent = ScreenNotReadyComponent;
            this.zipCodeHide = false;
        }
        else if (this.sysCharParams['vSCEnableMarktSelect']) {
            this.zipSearchComponent = MarktSelectSearchComponent;
            this.zipCodeHide = false;
        }
        else if (this.sysCharParams['vSCEnableDatabasePAF']) {
            this.zipSearchComponent = PostCodeSearchComponent;
            this.zipCodeHide = false;
        }
        else {
            this.zipCodeHide = true;
        }
        this.maintenanceAFormGroup.updateValueAndValidity();
    };
    MaintenanceTypeAComponent.prototype.setFormData = function (data) {
        if (!this.storeData['data']['isCopyClicked']) {
            this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValue(this.checkFalsy(data['data'].ContractAddressLine1));
            this.maintenanceAFormGroup.controls['ContractAddressLine2'].setValue(this.checkFalsy(data['data'].ContractAddressLine2));
            this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValue(this.checkFalsy(data['data'].ContractAddressLine3));
            this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValue(this.checkFalsy(data['data'].ContractAddressLine4));
            this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValue(this.checkFalsy(data['data'].ContractAddressLine5));
            this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(this.checkFalsy(data['data'].ContractPostcode));
            this.maintenanceAFormGroup.controls['GPSCoordinateX'].setValue(this.checkFalsy(data['data'].GPSCoordinateX));
            this.maintenanceAFormGroup.controls['GPSCoordinateY'].setValue(this.checkFalsy(data['data'].GPSCoordinateY));
            this.maintenanceAFormGroup.controls['ContractContactName'].setValue(this.checkFalsy(data['data'].ContractContactName));
            this.maintenanceAFormGroup.controls['ContractContactPosition'].setValue(this.checkFalsy(data['data'].ContractContactPosition));
            this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValue(this.checkFalsy(data['data'].ContractContactDepartment));
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValue(this.checkFalsy(data['data'].ContractContactTelephone));
            this.maintenanceAFormGroup.controls['ContractContactMobile'].setValue(this.checkFalsy(data['data'].ContractContactMobile));
            this.maintenanceAFormGroup.controls['ContractContactEmail'].setValue(this.checkFalsy(data['data'].ContractContactEmail));
            this.maintenanceAFormGroup.controls['ContractContactFax'].setValue(this.checkFalsy(data['data'].ContractContactFax));
        }
        this.countrySelected = {
            id: '',
            text: this.utils.getCountryDesc(this.storeData['code'].country)
        };
        this.maintenanceAFormGroup.controls['CountryCode'].setValue(data['data'].CountryCode);
    };
    MaintenanceTypeAComponent.prototype.checkFalsy = function (value) {
        if (value === null || value === undefined) {
            return '';
        }
        else {
            return value.toString().trim();
        }
    };
    MaintenanceTypeAComponent.prototype.validateForm = function () {
        if (this.fieldVisibility) {
            for (var j in this.fieldVisibility) {
                if (this.fieldVisibility.hasOwnProperty(j)) {
                    var key = j['capitalizeFirstLetter']();
                    if (!this.fieldVisibility[j]) {
                        if (this.maintenanceAFormGroup.controls[key]) {
                            this.maintenanceAFormGroup.controls[key].clearValidators();
                        }
                    }
                }
            }
        }
        if (this.maintenanceAFormGroup.controls) {
            for (var i in this.maintenanceAFormGroup.controls) {
                if (this.maintenanceAFormGroup.controls.hasOwnProperty(i)) {
                    if (this.maintenanceAFormGroup.controls[i].enabled) {
                        this.maintenanceAFormGroup.controls[i].markAsTouched();
                    }
                    else {
                        this.maintenanceAFormGroup.controls[i].clearValidators();
                    }
                }
            }
        }
        this.maintenanceAFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.maintenanceAFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.maintenanceAFormGroup.valid;
        }
        if (this.fieldRequired.countryCode) {
            if (!this.maintenanceAFormGroup.controls['CountryCode'].value) {
                this.countryValidate = true;
                formValid = false;
            }
        }
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeA: this.maintenanceAFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
                typeA: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                typeA: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_VALIDITY, payload: {
                typeA: formValid
            }
        });
    };
    MaintenanceTypeAComponent.prototype.onContractContactPositionChange = function (event) {
        if (!this.sysCharParams['vSCCapitalFirstLtr']) {
            this.maintenanceAFormGroup.controls['ContractContactPosition'].setValue(this.maintenanceAFormGroup.controls['ContractContactPosition'].value.toString().capitalizeFirstLetter());
        }
    };
    MaintenanceTypeAComponent.prototype.onContractContactDespartmentChange = function (event) {
        if (!this.sysCharParams['vSCCapitalFirstLtr']) {
            this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValue(this.maintenanceAFormGroup.controls['ContractContactDepartment'].value.toString().capitalizeFirstLetter());
        }
    };
    MaintenanceTypeAComponent.prototype.onContractContactNameChange = function (event) {
        if (!this.sysCharParams['vSCCapitalFirstLtr']) {
            this.maintenanceAFormGroup.controls['ContractContactName'].setValue(this.maintenanceAFormGroup.controls['ContractContactName'].value.toString().capitalizeFirstLetter());
        }
    };
    MaintenanceTypeAComponent.prototype.onCapitalize = function (control) {
        if (!this.sysCharParams['vSCCapitalFirstLtr']) {
            this.maintenanceAFormGroup.controls[control].setValue(this.maintenanceAFormGroup.controls[control].value.toString().capitalizeFirstLetter());
        }
    };
    MaintenanceTypeAComponent.prototype.processForm = function () {
        var _this = this;
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.maintenanceAFormGroup.controls['ContractAddressLine1'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine2'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine3'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine4'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine5'].enable();
            this.maintenanceAFormGroup.controls['ContractPostcode'].enable();
            this.maintenanceAFormGroup.controls['GPSCoordinateX'].enable();
            this.maintenanceAFormGroup.controls['GPSCoordinateY'].enable();
            this.maintenanceAFormGroup.controls['ContractContactName'].enable();
            this.maintenanceAFormGroup.controls['ContractContactPosition'].enable();
            this.maintenanceAFormGroup.controls['ContractContactDepartment'].enable();
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].enable();
            this.maintenanceAFormGroup.controls['ContractContactMobile'].enable();
            this.maintenanceAFormGroup.controls['ContractContactEmail'].enable();
            this.maintenanceAFormGroup.controls['ContractContactFax'].enable();
            this.isCountryCodeDisabled = false;
            this.isZipCodeEllipsisDisabled = false;
            if (this.sysCharParams['vSCMultiContactInd']) {
                this.fieldVisibility.btnAmendContact = true;
                this.maintenanceAFormGroup.controls['BtnAmendContact'].enable();
                this.sensitiseContactDetails(false);
            }
            if (!this.sysCharParams['vSCEnableMarktSelect']) {
                this.maintenanceAFormGroup.controls['ContractAddressLine1'].disable();
                this.maintenanceAFormGroup.controls['ContractAddressLine2'].disable();
                this.maintenanceAFormGroup.controls['ContractAddressLine3'].disable();
                this.maintenanceAFormGroup.controls['ContractAddressLine4'].disable();
                this.maintenanceAFormGroup.controls['ContractAddressLine5'].disable();
                this.maintenanceAFormGroup.controls['ContractPostcode'].disable();
                this.isZipCodeEllipsisDisabled = true;
                this.maintenanceAFormGroup.controls['GPSCoordinateX'].disable();
                this.maintenanceAFormGroup.controls['GPSCoordinateY'].disable();
                if (this.countrySelected['text']) {
                    this.isCountryCodeDisabled = true;
                }
            }
            if (this.sysCharParams['vSCEnableMarktSelect']) {
                this.maintenanceAFormGroup.controls['GetAddress'].enable();
            }
            else {
                this.maintenanceAFormGroup.controls['GetAddress'].disable();
            }
            this.fetchContractData('GetContactPersonChanges', { action: '6', ContractNumber: this.storeData['data'].ContractNumber }).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                }
                else {
                    if (e && e.ContactPersonFound === 'Y') {
                        _this.maintenanceAFormGroup.controls['ContractContactName'].setValue(e.ContactPersonName);
                        _this.maintenanceAFormGroup.controls['ContractContactPosition'].setValue(e.ContactPersonPosition);
                        _this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValue(e.ContactPersonDepartment);
                        _this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValue(e.ContactPersonTelephone);
                        _this.maintenanceAFormGroup.controls['ContractContactMobile'].setValue(e.ContactPersonMobile);
                        _this.maintenanceAFormGroup.controls['ContractContactEmail'].setValue(e.ContactPersonEmail);
                        _this.maintenanceAFormGroup.controls['ContractContactFax'].setValue(e.ContactPersonFax);
                    }
                }
            }, function (error) {
            });
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.maintenanceAFormGroup.controls['ContractAddressLine1'].disable();
            this.maintenanceAFormGroup.controls['ContractAddressLine2'].disable();
            this.maintenanceAFormGroup.controls['ContractAddressLine3'].disable();
            this.maintenanceAFormGroup.controls['ContractAddressLine4'].disable();
            this.maintenanceAFormGroup.controls['ContractAddressLine5'].disable();
            this.maintenanceAFormGroup.controls['ContractPostcode'].disable();
            this.maintenanceAFormGroup.controls['GPSCoordinateX'].disable();
            this.maintenanceAFormGroup.controls['GPSCoordinateY'].disable();
            this.maintenanceAFormGroup.controls['ContractContactName'].disable();
            this.maintenanceAFormGroup.controls['ContractContactPosition'].disable();
            this.maintenanceAFormGroup.controls['ContractContactDepartment'].disable();
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].disable();
            this.maintenanceAFormGroup.controls['ContractContactMobile'].disable();
            this.maintenanceAFormGroup.controls['ContractContactEmail'].disable();
            this.maintenanceAFormGroup.controls['ContractContactFax'].disable();
            this.isCountryCodeDisabled = true;
            this.isZipCodeEllipsisDisabled = true;
            if (this.storeData['data'] && (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
                this.maintenanceAFormGroup.controls['BtnAmendContact'].disable();
                this.fieldVisibility.btnAmendContact = false;
            }
            else {
                if (this.sysCharParams['vSCMultiContactInd']) {
                    this.fieldVisibility.btnAmendContact = true;
                    this.maintenanceAFormGroup.controls['BtnAmendContact'].enable();
                }
            }
            this.maintenanceAFormGroup.controls['GetAddress'].disable();
            if (this.storeData['data'] && (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
                this.countrySelected = {
                    id: '',
                    text: ''
                };
            }
            this.fetchTranslationContent();
        }
        if (this.mode['addMode'] && !this.mode['searchMode'] && !this.mode['updateMode']) {
            this.maintenanceAFormGroup.controls['ContractAddressLine1'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine2'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine3'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine4'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine5'].enable();
            this.maintenanceAFormGroup.controls['ContractPostcode'].enable();
            this.maintenanceAFormGroup.controls['GPSCoordinateX'].enable();
            this.maintenanceAFormGroup.controls['GPSCoordinateY'].enable();
            this.maintenanceAFormGroup.controls['ContractContactName'].enable();
            this.maintenanceAFormGroup.controls['ContractContactPosition'].enable();
            this.maintenanceAFormGroup.controls['ContractContactDepartment'].enable();
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].enable();
            this.maintenanceAFormGroup.controls['ContractContactMobile'].enable();
            this.maintenanceAFormGroup.controls['ContractContactEmail'].enable();
            this.maintenanceAFormGroup.controls['ContractContactFax'].enable();
            this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValue('');
            this.maintenanceAFormGroup.controls['ContractAddressLine2'].setValue('');
            this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValue('');
            this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValue('');
            this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValue('');
            this.maintenanceAFormGroup.controls['ContractPostcode'].setValue('');
            this.maintenanceAFormGroup.controls['GPSCoordinateX'].setValue('');
            this.maintenanceAFormGroup.controls['GPSCoordinateY'].setValue('');
            this.maintenanceAFormGroup.controls['ContractContactName'].setValue('');
            this.maintenanceAFormGroup.controls['ContractContactPosition'].setValue('');
            this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValue('');
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValue('');
            this.maintenanceAFormGroup.controls['ContractContactMobile'].setValue('');
            this.maintenanceAFormGroup.controls['ContractContactEmail'].setValue('');
            this.maintenanceAFormGroup.controls['ContractContactFax'].setValue('');
            this.maintenanceAFormGroup.controls['GetAddress'].enable();
            if (this.sysCharParams['vSCMultiContactInd']) {
                this.fieldVisibility.btnAmendContact = false;
                this.maintenanceAFormGroup.controls['BtnAmendContact'].disable();
                this.sensitiseContactDetails(true);
            }
            if (!this.sysCharParams['vSCDisableDefaultCountryCode']) {
                this.countrySelected = {
                    id: '',
                    text: this.utils.getCountryDesc(this.storeData['code'].country)
                };
                this.maintenanceAFormGroup.controls['CountryCode'].setValue(this.storeData['code'].country);
            }
            this.isCountryCodeDisabled = false;
            this.isZipCodeEllipsisDisabled = false;
            if (this.storeData['sentFromParent']) {
                switch (this.storeData['sentFromParent'].parentMode) {
                    case 'AddContractFromAccount':
                    case 'AddJobFromAccount':
                    case 'AddProductFromAccount':
                        this.maintenanceAFormGroup.controls['GetAddress'].disable();
                        break;
                    default:
                        this.maintenanceAFormGroup.controls['GetAddress'].enable();
                }
            }
            this.store.dispatch({
                type: ContractActionTypes.FORM_GROUP, payload: {
                    typeA: this.maintenanceAFormGroup
                }
            });
        }
        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode(),
                'businessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(),
                'parentMode': 'Contract',
                'ContractPostcode': this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
                'ContractAddressLine4': this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
                'ContractAddressLine5': this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
            });
            this.inputParamsZipCode = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode(),
                'businessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(),
                'parentMode': 'Contract',
                'ContractPostcode': this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
                'ContractAddressLine4': this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
                'ContractAddressLine5': this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
            });
        }
        this.fetchTranslationContent();
    };
    MaintenanceTypeAComponent.prototype.onBtnAmendClick = function (event) {
        this.router.navigate(['/application/ContactPersonMaintenance'], { queryParams: { parentMode: 'Contract', contractNumber: this.storeData['data'].ContractNumber } });
    };
    MaintenanceTypeAComponent.prototype.onGetAddressClick = function (event) {
        var _this = this;
        if (this.sysCharParams['vSCEnableHopewiserPAF']) {
            this.zipSearchComponent = ScreenNotReadyComponent;
            this.zipCodeHide = false;
        }
        else if (this.sysCharParams['vSCEnableMarktSelect']) {
            this.zipSearchComponent = MarktSelectSearchComponent;
            this.zipCodeHide = false;
        }
        else if (this.sysCharParams['vSCEnableDatabasePAF']) {
            this.zipSearchComponent = PostCodeSearchComponent;
            this.zipCodeHide = false;
        }
        setTimeout(function () {
            _this.postCodeAutoOpen = true;
            setTimeout(function () {
                _this.postCodeAutoOpen = false;
            }, 100);
        }, 0);
    };
    MaintenanceTypeAComponent.prototype.onContractAddressLine4Blur = function (event) {
        this.setZipCodeParams();
        if (this.sysCharParams['vSCAddressLine4Required'] && this.maintenanceAFormGroup.controls['ContractAddressLine4'].value.trim() === '' && this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
            this.onGetAddressClick({});
        }
    };
    MaintenanceTypeAComponent.prototype.onContractAddressLine5Blur = function (event) {
        this.setZipCodeParams();
        if (this.sysCharParams['vSCAddressLine5Required'] && this.maintenanceAFormGroup.controls['ContractAddressLine5'].value.trim() === '' && this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
            this.onGetAddressClick({});
        }
    };
    MaintenanceTypeAComponent.prototype.onContractPostcodeChange = function (event) {
        var _this = this;
        if (this.maintenanceAFormGroup.controls['ContractPostcode'].value !== '' && this.sysCharParams['vEnablePostcodeDefaulting'] && this.sysCharParams['vSCEnableDatabasePAF']) {
            this.fetchContractData('GetPostCodeTownAndState', {
                action: '0',
                Postcode: this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
                State: this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : '',
                Town: this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : ''
            }).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                }
                else {
                    if (e && (!e.UniqueRecordFound || e.UniqueRecordFound.toString().toUpperCase() === GlobalConstant.Configuration.No)) {
                        _this.zipSearchComponent = PostCodeSearchComponent;
                        setTimeout(function () {
                            _this.postCodeAutoOpen = true;
                            setTimeout(function () {
                                _this.postCodeAutoOpen = false;
                            }, 100);
                        }, 0);
                    }
                    else {
                        if (_this.maintenanceAFormGroup.controls['ContractPostcode']) {
                            _this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(e.Postcode);
                        }
                        if (_this.maintenanceAFormGroup.controls['ContractAddressLine5']) {
                            _this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValue(e.State);
                        }
                        if (_this.maintenanceAFormGroup.controls['ContractAddressLine4']) {
                            _this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValue(e.Town);
                        }
                    }
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeAComponent.prototype.setZipCodeParams = function () {
        this.inputParamsZipCode = Object.assign({}, this.inputParams, {
            'ContractPostcode': this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
            'ContractAddressLine4': this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
            'ContractAddressLine5': this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
        });
    };
    MaintenanceTypeAComponent.prototype.onContractPostcodeBlur = function (event) {
        var _this = this;
        this.setZipCodeParams();
        var upperCaseVal = this.maintenanceAFormGroup.controls['ContractPostcode'].value.toUpperCase();
        this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(upperCaseVal);
        if (this.sysCharParams['vSCPostCodeRequired'] && this.maintenanceAFormGroup.controls['ContractPostcode'].value.trim() === '') {
            this.onGetAddressClick({});
        }
        if (this.sysCharParams['vSCConnectContrPostcodeNegEmp'] && this.storeData['formGroup'].typeC.controls['SalesEmployee'] && this.storeData['formGroup'].typeC.controls['SalesEmployee'].value === '' && this.mode['addMode']) {
            this.fetchContractData('DefaultFromPostcode', {
                action: '6',
                BranchNumber: this.storeData['formGroup'].main.controls['NegBranchNumber'] ? this.storeData['formGroup'].main.controls['NegBranchNumber'].value : this.otherParams['currentBranchNumber'],
                ContractPostcode: this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
                ContractAddressLine5: this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : '',
                ContractAddressLine4: this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : ''
            }).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                }
                else {
                    if (e) {
                        if (_this.storeData['formGroup'].typeC.controls['SalesEmployee']) {
                            _this.storeData['formGroup'].typeC.controls['SalesEmployee'].setValue(e.ContractSalesEmployee);
                        }
                        if (_this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname']) {
                            _this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(e.SalesEmployeeSurname);
                        }
                    }
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeAComponent.prototype.fetchContractData = function (functionName, params) {
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        this.queryContract.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryContract.set(this.serviceConstants.CountryCode, countryCode);
        this.queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
        if (functionName !== '') {
            this.queryContract.set(this.serviceConstants.Action, '6');
            this.queryContract.set('Function', functionName);
        }
        for (var key in params) {
            if (key && params.hasOwnProperty(key)) {
                this.queryContract.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract);
    };
    MaintenanceTypeAComponent.prototype.sensitiseContactDetails = function (sensitise) {
        if (sensitise) {
            this.maintenanceAFormGroup.controls['ContractContactName'].enable();
            this.maintenanceAFormGroup.controls['ContractContactPosition'].enable();
            this.maintenanceAFormGroup.controls['ContractContactDepartment'].enable();
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].enable();
            this.maintenanceAFormGroup.controls['ContractContactMobile'].enable();
            this.maintenanceAFormGroup.controls['ContractContactEmail'].enable();
            this.maintenanceAFormGroup.controls['ContractContactFax'].enable();
            this.fieldRequired.contractContactName = true;
            this.fieldRequired.contractContactPosition = true;
            this.fieldRequired.contractContactTelephone = true;
            this.maintenanceAFormGroup.controls['ContractContactName'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractContactPosition'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValidators(Validators.required);
        }
        else {
            this.maintenanceAFormGroup.controls['ContractContactName'].disable();
            this.maintenanceAFormGroup.controls['ContractContactPosition'].disable();
            this.maintenanceAFormGroup.controls['ContractContactDepartment'].disable();
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].disable();
            this.maintenanceAFormGroup.controls['ContractContactMobile'].disable();
            this.maintenanceAFormGroup.controls['ContractContactEmail'].disable();
            this.maintenanceAFormGroup.controls['ContractContactFax'].disable();
            this.fieldRequired.contractContactName = false;
            this.fieldRequired.contractContactPosition = false;
            this.fieldRequired.contractContactTelephone = false;
            this.maintenanceAFormGroup.controls['ContractContactName'].clearValidators();
            this.maintenanceAFormGroup.controls['ContractContactPosition'].clearValidators();
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].clearValidators();
        }
    };
    MaintenanceTypeAComponent.prototype.onZipDataReceived = function (data) {
        if (data)
            this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(data.ContractPostcode);
    };
    MaintenanceTypeAComponent.prototype.onCountryCodeReceived = function (data) {
        this.maintenanceAFormGroup.controls['CountryCode'].setValue(data.riCountryCode);
        this.maintenanceAFormGroup.controls['CountryCode'].markAsDirty();
        this.countryValidate = false;
    };
    MaintenanceTypeAComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-type-a',
                    templateUrl: 'maintenance-type-a.html'
                },] },
    ];
    MaintenanceTypeAComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: Store, },
        { type: HttpService, },
        { type: Utils, },
        { type: ServiceConstants, },
    ];
    return MaintenanceTypeAComponent;
}());
