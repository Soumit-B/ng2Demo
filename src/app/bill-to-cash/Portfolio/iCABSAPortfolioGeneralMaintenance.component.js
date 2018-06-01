import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { Logger } from '@nsalaun/ng2-logger';
import { Utils } from '../../../shared/services/utility';
import { PostCodeUtils } from '../../../shared/services/postCode-utility';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { Location } from '@angular/common';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var PortfolioGeneralMaintenanceComponent = (function () {
    function PortfolioGeneralMaintenanceComponent(PostCodeUtils, utils, fb, router, httpService, serviceConstants, zone, global, ajaxconstant, authService, _fb, _logger, errorService, messageService, titleService, componentInteractionService, translate, localeTranslateService, store, sysCharConstants, _router, route, location, routeAwayGlobals) {
        var _this = this;
        this.PostCodeUtils = PostCodeUtils;
        this.utils = utils;
        this.fb = fb;
        this.router = router;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.zone = zone;
        this.global = global;
        this.ajaxconstant = ajaxconstant;
        this.authService = authService;
        this._fb = _fb;
        this._logger = _logger;
        this.errorService = errorService;
        this.messageService = messageService;
        this.titleService = titleService;
        this.componentInteractionService = componentInteractionService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.store = store;
        this.sysCharConstants = sysCharConstants;
        this._router = _router;
        this.route = route;
        this.location = location;
        this.routeAwayGlobals = routeAwayGlobals;
        this.inputParamsPremise = {
            'parentMode': 'LookUp'
        };
        this.inputParamsProduct = {
            'parentMode': 'PortfolioGeneralMaintenance'
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.promptTitle = 'Portfolio Selection';
        this.showMessageHeader = true;
        this.varCheckCorrectEntryType = '';
        this.varCheckContractType = '';
        this.CurrentContractTypeURLParameter = '';
        this.showHeader = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseComponent = ContractSearchComponent;
        this.productComponent = ContractSearchComponent;
        this.showErrorHeader = true;
        this.blnAllTypesValid = '';
        this.showCloseButton = true;
        this.Numberlab = 'Number';
        this.AddContractButton = false;
        this.AddJobButton = false;
        this.AddProductSaleButton = false;
        this.ajaxSource = new BehaviorSubject(0);
        this.headerParams = {
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAPortfolioGeneralMaintenance',
            module: 'contract-admin'
        };
        this.search = new URLSearchParams();
        this.searchname = new URLSearchParams();
        this.searchtype = new URLSearchParams();
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
    }
    PortfolioGeneralMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.AddContractButton = false;
        this.AddJobButton = false;
        this.AddProductSaleButton = false;
        this.blnAllTypesValid = '';
        this.CurrentContractTypeURLParameter = '';
        this.CurrentContractTypeURLParameter = this.routeParams.CurrentContractTypeURLParameter;
        this.blnAllTypesValid = this.routeParams.blnAllTypesValid;
        this.localeTranslateService.setUpTranslation();
        this.CurrentContractType = this.utils.getCurrentContractType(this.CurrentContractTypeURLParameter);
        this._logger.warn(this.CurrentContractTypeURLParameter + '``' + this.CurrentContractType);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);
        this.generalMaintenanceFormGroup = this.fb.group({
            ContractNumber: ['', Validators.required],
            PremiseNumber: [''],
            ProductCode: [''],
            ContractName: [''],
            PremiseName: [''],
            ProductDesc: ['']
        });
        if (this.CurrentContractTypeURLParameter === undefined || this.CurrentContractTypeURLParameter === null || this.CurrentContractTypeURLParameter === '') {
            this.AddContractButton = false;
            this.blnAllTypesValid = 'TRUE';
        }
        if (this.blnAllTypesValid === 'TRUE') {
            this.title = 'Portfolio General';
            this.inputParamsContract = {
                'parentMode': 'LookUp-All'
            };
        }
        else {
            this.inputParamsContract = {
                'parentMode': 'LookUp',
                'currentContractType': this.CurrentContractTypeURLParameter
            };
            if (this.CurrentContractType === 'C') {
                this.AddContractButton = true;
            }
            if (this.CurrentContractType === 'J') {
                this.AddJobButton = true;
            }
            if (this.CurrentContractType === 'P') {
                this.AddProductSaleButton = true;
            }
            this.Numberlab = this.CurrentContractTypeLabel + ' ' + 'Number';
            this.title = this.CurrentContractTypeLabel;
        }
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
        this.routeAwayUpdateSaveFlag();
    };
    PortfolioGeneralMaintenanceComponent.prototype.onContractDataReceived = function (data) {
        this.flag = '';
        this.generalMaintenanceFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.generalMaintenanceFormGroup.controls['ContractName'].setValue(data.ContractName);
        this.formContractNumber.nativeElement.focus();
    };
    PortfolioGeneralMaintenanceComponent.prototype.onpremiseChanged = function (data) {
        this.generalMaintenanceFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.generalMaintenanceFormGroup.controls['PremiseName'].setValue(data.PremiseName);
    };
    PortfolioGeneralMaintenanceComponent.prototype.onproductChanged = function (data) {
        this.generalMaintenanceFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        this.generalMaintenanceFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
    };
    PortfolioGeneralMaintenanceComponent.prototype.ContractNumberFormatOnChange = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    PortfolioGeneralMaintenanceComponent.prototype.onBlurContract = function (event) {
        this.flag = '';
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            var _paddedValue = this.ContractNumberFormatOnChange(elementValue, 8);
            if (event.target.id === 'ContractNumber') {
                this.generalMaintenanceFormGroup.controls['ContractNumber'].setValue(_paddedValue);
            }
        }
        this.GetName('getContractName');
        this.CheckContractType();
    };
    PortfolioGeneralMaintenanceComponent.prototype.onBlurPremise = function (event) {
        this.GetName('getPremiseName');
    };
    PortfolioGeneralMaintenanceComponent.prototype.onBlurProduct = function (event) {
        this.GetName('getProductDesc');
    };
    PortfolioGeneralMaintenanceComponent.prototype.AddMode = function (ModeType) {
        this.Clear_OnClick();
        switch (ModeType) {
            case 'C':
                this.strParam = '<pgm>';
                this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { strParam: this.strParam, parentMode: 'SearchAdd', ReDirectOnCancel: true } });
                break;
            case 'J':
                this.strParam = '<job-pgm>';
                this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: { strParam: this.strParam, parentMode: 'SearchAdd', ReDirectOnCancel: true } });
                break;
            case 'P':
                this.strParam = '<product-pgm>';
                this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: { strParam: this.strParam, parentMode: 'SearchAdd', ReDirectOnCancel: true } });
                break;
            default:
        }
    };
    PortfolioGeneralMaintenanceComponent.prototype.AddContract_OnClick = function () {
        this.AddMode('C');
    };
    PortfolioGeneralMaintenanceComponent.prototype.AddJob_OnClick = function () {
        this.AddMode('J');
    };
    PortfolioGeneralMaintenanceComponent.prototype.AddProductSale_OnClick = function () {
        this.AddMode('P');
    };
    PortfolioGeneralMaintenanceComponent.prototype.Clear_OnClick = function () {
        this.generalMaintenanceFormGroup.controls['ContractNumber'].setValue('');
        this.generalMaintenanceFormGroup.controls['ContractName'].setValue('');
        this.generalMaintenanceFormGroup.controls['PremiseNumber'].setValue('');
        this.generalMaintenanceFormGroup.controls['PremiseName'].setValue('');
        this.generalMaintenanceFormGroup.controls['ProductCode'].setValue('');
        this.generalMaintenanceFormGroup.controls['ProductDesc'].setValue('');
        this.ContractNumberSetAttributeServiceCoverRowID = '';
        this.formContractNumber.nativeElement.focus();
    };
    PortfolioGeneralMaintenanceComponent.prototype.CheckCorrectEntryType = function (event) {
        if (this.blnAllTypesValid !== 'TRUE' && this.strSelectedContractTypeCode !== this.CurrentContractType) {
            switch (this.strSelectedContractTypeCode) {
                case 'C':
                    this.strIncorrectType = 'Contract';
                    break;
                case 'J':
                    this.strIncorrectType = 'Job';
                    break;
                case 'P':
                    this.strIncorrectType = 'Product Sale';
                    break;
                default:
            }
            this.promptContent = 'You are in' + ' ' + this.CurrentContractTypeLabel + ' ' + 'General Maintenance But Have Selected A' + ' ' + this.strIncorrectType + '- Do you wish to continue ?';
            if (this.flag === 'fetch')
                this.promptModal.show();
            if (event.value === 'save') {
                this.varCheckCorrectEntryType = '';
                this.eventvalue = 'save';
                this.Fetch_OnClick();
            }
            if (event.value === 'cancel') {
                this.varCheckCorrectEntryType = 'ERROR';
                this.eventvalue = 'cancel';
            }
            this._logger.warn('varCheckCorrectEntryType + this.eventvalue ', this.varCheckCorrectEntryType.toString() + this.eventvalue);
            return this.varCheckCorrectEntryType;
        }
    };
    PortfolioGeneralMaintenanceComponent.prototype.CheckContractType = function () {
        var _this = this;
        this.searchtype = new URLSearchParams();
        this.searchtype.set(this.serviceConstants.Action, '0');
        this.searchtype.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchtype.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchtype.set('ContractNumber', this.generalMaintenanceFormGroup.controls['ContractNumber'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.searchtype)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
                _this.strParamList = 'ERROR';
                _this.varCheckContractType = _this.strParamList;
                return _this.varCheckContractType;
            }
            else {
                if (e) {
                    _this.zone.run(function () {
                        _this.strSelectedContractTypeCode = e.ContractTypeCode;
                        _this.CheckCorrectEntryType(_this.strSelectedContractTypeCode);
                        _this._logger.warn('dfdfsdfdf', e);
                        _this.ContractTypeDesc = e.ContractTypeDesc;
                        _this.ErrorMessageDesc = e.ErrorMessageDesc;
                        switch (_this.strSelectedContractTypeCode) {
                            case 'C':
                                _this.strParamList = '<pgm>';
                                break;
                            case 'J':
                                _this.strParamList = '<job-pgm>';
                                break;
                            case 'P':
                                _this.strParamList = '<product-pgm>';
                                break;
                            default:
                        }
                        _this.CheckCorrectEntryType(_this.strSelectedContractTypeCode);
                        _this.varCheckContractType = _this.strParamList;
                        return _this.varCheckContractType;
                    });
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        return this.varCheckContractType;
    };
    PortfolioGeneralMaintenanceComponent.prototype.GetName = function (GeneralEntryMode) {
        var _this = this;
        this.searchname = new URLSearchParams();
        this.searchname.set(this.serviceConstants.Action, '0');
        this.searchname.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchname.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchname.set('GeneralEntryMode', GeneralEntryMode);
        this.searchname.set('ContractNumber', this.generalMaintenanceFormGroup.controls['ContractNumber'].value);
        this.searchname.set('PremiseNumber', this.generalMaintenanceFormGroup.controls['PremiseNumber'].value);
        this.searchname.set('ProductCode', this.generalMaintenanceFormGroup.controls['ProductCode'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.searchname)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                _this.strNameValue = e.NameValue;
                if (GeneralEntryMode === 'getContractName' && _this.generalMaintenanceFormGroup.controls['ContractNumber'].value != null) {
                    _this.generalMaintenanceFormGroup.controls['ContractName'].setValue(_this.strNameValue);
                }
                if (GeneralEntryMode === 'getPremiseName' && _this.generalMaintenanceFormGroup.controls['PremiseNumber'].value != null) {
                    _this.generalMaintenanceFormGroup.controls['PremiseName'].setValue(_this.strNameValue);
                }
                if (GeneralEntryMode === 'getProductDesc' && _this.generalMaintenanceFormGroup.controls['ProductCode'].value != null) {
                    _this.generalMaintenanceFormGroup.controls['ProductDesc'].setValue(_this.strNameValue);
                }
                return _this.strNameValue;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        return this.strNameValue;
    };
    PortfolioGeneralMaintenanceComponent.prototype.Fetch_OnClick = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.flag = 'fetch';
        this.CheckContractType();
        var strParamfetch = this.varCheckContractType;
        this.CheckCorrectEntryType('');
        var strCheck = this.varCheckCorrectEntryType;
        this._logger.warn(strParamfetch + ' + ' + strCheck);
        if (strParamfetch !== 'ERROR' && strCheck !== 'ERROR') {
            if (this.eventvalue === 'save' && this.blnAllTypesValid !== 'TRUE') {
                if (this.generalMaintenanceFormGroup.controls['ProductCode'].value !== null && this.generalMaintenanceFormGroup.controls['ProductCode'].value !== undefined && this.generalMaintenanceFormGroup.controls['ProductCode'].value !== '') {
                    if (this.ContractNumberSetAttributeServiceCoverRowID === '' || this.ContractNumberSetAttributeServiceCoverRowID === undefined || this.ContractNumberSetAttributeServiceCoverRowID === null) {
                        this._router.navigate(['Application/iCABSAServiceCoverSearch.htm'], { queryParams: { strMode: 'PortfolioGeneralMaintenance' } });
                    }
                    else {
                        this._router.navigate(['Application/iCABSAServiceCoverMaintenance.htm'], { queryParams: { strMode: 'Search', strParam: strParamfetch } });
                    }
                }
                else if (this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== null && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== undefined && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== '') {
                    this._router.navigate(['Application/iCABSAPremiseMaintenance.htm'], { queryParams: { strMode: 'LoadByKeyFields', strParam: strParamfetch } });
                }
                else if ((!this.generalMaintenanceFormGroup.controls['PremiseNumber'].value) && (strParamfetch !== '' && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== null && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== undefined && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== '')) {
                    if (strParamfetch === '<pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                    if (strParamfetch === '<job-pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                    if (strParamfetch === '<product-pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                }
            }
            if (this.blnAllTypesValid === 'TRUE') {
                if (this.generalMaintenanceFormGroup.controls['ProductCode'].value !== null && this.generalMaintenanceFormGroup.controls['ProductCode'].value !== undefined && this.generalMaintenanceFormGroup.controls['ProductCode'].value !== '') {
                    if (this.ContractNumberSetAttributeServiceCoverRowID === '' || this.ContractNumberSetAttributeServiceCoverRowID === undefined || this.ContractNumberSetAttributeServiceCoverRowID === null) {
                        this._router.navigate(['Application/iCABSAServiceCoverSearch.htm'], { queryParams: { strMode: 'PortfolioGeneralMaintenance' } });
                    }
                    else {
                        this._router.navigate(['Application/iCABSAServiceCoverMaintenance.htm'], { queryParams: { strMode: 'Search', strParam: strParamfetch } });
                    }
                }
                else if (this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== null && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== undefined && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== '') {
                    this._router.navigate(['Application/iCABSAPremiseMaintenance.htm'], { queryParams: { strMode: 'LoadByKeyFields', strParam: strParamfetch } });
                }
                else if ((!this.generalMaintenanceFormGroup.controls['PremiseNumber'].value) && (strParamfetch !== '' && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== null && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== undefined && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== '')) {
                    if (strParamfetch === '<pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                    if (strParamfetch === '<job-pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                    if (strParamfetch === '<product-pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                }
            }
        }
    };
    PortfolioGeneralMaintenanceComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    PortfolioGeneralMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    PortfolioGeneralMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.generalMaintenanceFormGroup.statusChanges.subscribe(function (value) {
            if (_this.generalMaintenanceFormGroup.valid === true) {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    PortfolioGeneralMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPortfolioGeneralMaintenance.html',
                    providers: [ErrorService, MessageService, PostCodeUtils]
                },] },
    ];
    PortfolioGeneralMaintenanceComponent.ctorParameters = [
        { type: PostCodeUtils, },
        { type: Utils, },
        { type: FormBuilder, },
        { type: Router, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: NgZone, },
        { type: GlobalConstant, },
        { type: AjaxObservableConstant, },
        { type: AuthService, },
        { type: FormBuilder, },
        { type: Logger, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: Title, },
        { type: ComponentInteractionService, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Store, },
        { type: SysCharConstants, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: Location, },
        { type: RouteAwayGlobals, },
    ];
    PortfolioGeneralMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'formContractNumber': [{ type: ViewChild, args: ['ContractNumber',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return PortfolioGeneralMaintenanceComponent;
}());
