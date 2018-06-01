import { ProRataMaintenanceTypeBComponent } from './proRataChargeMaintenance/proRatamaintenance-type-b.component';
import { ProRataMaintenanceTypeAComponent } from './proRataChargeMaintenance/proRatamaintenance-type-a.component';
import { Component, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../shared/services/http-service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { Store } from '@ngrx/store';
import { RiExchange } from './../../../shared/services/riExchange';
import { Logger } from '@nsalaun/ng2-logger';
import { FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { Utils } from './../../../shared/services/utility';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { ContractActionTypes } from '../../../app/actions/contract';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
export var ProRataChargeMaintenanceComponent = (function () {
    function ProRataChargeMaintenanceComponent(componentInteractionService, riExchange, store, activatedRoute, formBuilder, serviceConstants, httpService, SysCharConstants, utils, zone, authService, errorService, messageService, route, logger, routeAwayGlobals) {
        var _this = this;
        this.componentInteractionService = componentInteractionService;
        this.riExchange = riExchange;
        this.store = store;
        this.activatedRoute = activatedRoute;
        this.formBuilder = formBuilder;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.SysCharConstants = SysCharConstants;
        this.utils = utils;
        this.zone = zone;
        this.authService = authService;
        this.errorService = errorService;
        this.messageService = messageService;
        this.route = route;
        this.logger = logger;
        this.routeAwayGlobals = routeAwayGlobals;
        this.elementShoeHide = {};
        this.sysCharParams = {
            vSCEnableCompanyCode: '',
            vSCEnableUseProRataNarrative: '',
            vEnableCreateServiceValue: '',
            vSCDefaultExtractDate: '',
            vEnableDiscountCode: '',
            lRequiredNoniCABSInvoiceNumbers: '',
            lOriginalInvoiceNumberMandatory: '',
            lRequiredOriginalInvoiceNumber: '',
            lEnableAutoCreditNoteNarrative: '',
            lEnableCreateServiceValue: '',
            vSCEnableTaxInvoiceRanges: ''
        };
        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;
        this.querySysChar = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.queryRequest = new URLSearchParams();
        this.otherParams = {
            disableNameSearch: '',
            blnCIEnabled: '',
            vbEnablePayTypeAtInvGroupLevel: '',
            ReqAutoInvoiceFee: '',
            vbPaymentTypeCodeInd: '',
            vbCompanyCodeInd: '',
            SepaConfigInd: '',
            vDisableFields: '',
            lREGContactCentreReview: '',
            vTrialPeriodInd: '',
            vSaveUpdate: '',
            blnContractNameJustSet: false,
            currentBranchNumber: ''
        };
        this.showPromptMessageHeader = true;
        this.search = new URLSearchParams();
        this.blnSCEnableCompanyCode = false;
        this.blnSCEnableUseProRataNarrative = false;
        this.blnSCEnableCreateServiceValue = false;
        this.blnSCDefaultExtractDate = false;
        this.blnSCEnableDiscountCode = false;
        this.logAllowNoniCABSInvoiceNumbers = false;
        this.blnOriginalInvoiceNumberRequired = false;
        this.blnOriginalInvoiceNumberMandatory = false;
        this.blnEnableAutoCreditNoteNarrative = false;
        this.blnEnableCreateServiceValue = false;
        this.blnSCTaxInvoiceNumber = false;
        this.boolCreditApprovals = false;
        this.isProductRow = true;
        this.isPremiseRow = true;
        this.blnUpdatedRecord = false;
        this.tabs = [];
        this.tabComponentList = [];
        this.inputParamsProRata = {
            'parentMode': '',
            'mode': '',
            'businessCode': '',
            'countryCode': '',
            'CurrentContractType': '',
            'currentContractTypeURLParameter': ''
        };
        this.inputParamsContractSearch = {
            'parentMode': this.inputParamsProRata.parentMode,
            'currentContractType': this.inputParamsProRata.CurrentContractType
        };
        this.childConfigParams = {
            'mode': 'LookUp'
        };
        this.showCloseButton = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.showHeader = true;
        this.currentContractTypeLabel = '';
        this.beforeAddMode = true;
        this.beforeSysCharMode = true;
        this.queryParams = {
            action: '6',
            operation: 'Application/iCABSAProRataChargeMaintenance',
            module: 'charges',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            full: 'Full',
            sortOrder: 'Descending'
        };
        this.showInvoice = true;
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.storeData = data['data'];
            switch (data['action']) {
                case ContractActionTypes.SAVE_DATA:
                    if (data['data'] && !(Object.keys(data['data']).length === 0 && typeof data['data'].constructor === 'Object')) {
                        _this.storeData = data['data'];
                    }
                    break;
                case ContractActionTypes.SAVE_SYSCHAR:
                    if (data['syschars']) {
                        _this.sysCharParams = data['syschars'];
                    }
                    break;
                case ContractActionTypes.SAVE_PARAMS:
                    _this.paramsData = data['params'];
                    _this.inputParamsProRata.parentMode = _this.paramsData.parentMode;
                    _this.inputParamsContractSearch.parentMode = _this.paramsData.parentMode;
                    _this.inputParamsProRata.CurrentContractType = _this.paramsData.currentContractType;
                    _this.inputParamsContractSearch.currentContractType = _this.paramsData.currentContractType;
                    _this.inputParamsProRata.currentContractTypeURLParameter = _this.paramsData.currentContractTypeURLParameter;
                    break;
                case ContractActionTypes.SAVE_OTHER_PARAMS:
                    break;
                case ContractActionTypes.SAVE_SENT_FROM_PARENT:
                    _this.sentFromParent = data['sentFromParent'];
                    _this.inputParamsProRata.sentFromParent = _this.sentFromParent;
                    break;
                case ContractActionTypes.FORM_GROUP_PRORATA:
                    _this.formGroup = data['formGroup'];
                    if (_this.inputParamsProRata.parentMode === 'ServiceCoverAdd') {
                        _this.updateMode = false;
                        _this.addMode = true;
                        if (_this.beforeAddMode) {
                            _this.beforeAddMode = false;
                            _this.riMaintenanceBeforeAddMode();
                        }
                    }
                    if (_this.beforeSysCharMode) {
                        _this.beforeSysCharMode = false;
                        _this.UpdateSyschar();
                    }
                    break;
                default:
                    break;
            }
        });
        this.storeSubscription = activatedRoute.queryParams.subscribe(function (param) {
            _this.routeParams = param;
            _this.inputParamsProRata.parentMode = param['parentMode'];
            _this.inputParamsContractSearch.parentMode = param['parentMode'];
            _this.inputParamsProRata.CurrentContractType = param.CurrentContractType;
            _this.inputParamsContractSearch.currentContractType = param.CurrentContractType;
            _this.inputParamsProRata.currentContractTypeURLParameter = param.currentContractTypeURLParameter;
        });
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
    }
    ProRataChargeMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.buildTabs();
        this.setCurrentContractType();
        this.triggerFetchSysChar(false, true);
        this.labelInvoiceFrequencyCode = true;
        this.labelInvoiceAnnivDate = true;
        this.businessCode = this.utils.getBusinessCode();
        this.countryCode = this.utils.getCountryCode();
        this.routeSubscription = this.route.queryParams.subscribe(function (params) {
            _this.URLqueryParams = params;
        });
        this.contractFormGroup = this.formBuilder.group({
            ContractNumber: [{ value: '', disabled: true }],
            ContractName: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: true }],
            AccountName: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: true }],
            PremiseName: [{ value: '', disabled: true }],
            ProductCode: [{ value: '', disabled: true }],
            ProductDesc: [{ value: '', disabled: true }],
            InvoiceFrequencyCode: [{ value: '', disabled: true }],
            InvoiceAnnivDate: [{ value: '', disabled: true }],
            ServiceVisitFrequency: [{ value: '', disabled: true }]
        });
        switch (this.inputParamsProRata.parentMode) {
            case 'UninvoicedInstallation':
                if (this.storeData) {
                    this.contractFormGroup.controls['ContractNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber'));
                    this.contractFormGroup.controls['ContractName'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractName'));
                    this.contractFormGroup.controls['PremiseNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseNumber'));
                    this.contractFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseName'));
                }
                break;
            default:
                this.contractFormGroup.controls['ContractNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber'));
                this.contractFormGroup.controls['ContractName'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractName'));
                this.contractFormGroup.controls['PremiseNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseNumber'));
                this.contractFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseName'));
                this.contractFormGroup.controls['AccountNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'AccountNumber'));
                this.contractFormGroup.controls['AccountName'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'AccountName'));
        }
        switch (this.routeParams.CurrentContractType) {
            case 'C':
                this.labelInvoiceFrequencyCode = false;
                this.labelInvoiceAnnivDate = false;
                break;
            case 'J':
                if (this.formGroup) {
                    this.formGroup.showEndDate = false;
                    this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
                }
        }
        if (this.formGroup) {
            if (this.blnEnableCreateServiceValue) {
                this.formGroup.isServiceSalesEmployee = true;
            }
            else {
                this.formGroup.isServiceSalesEmployee = false;
            }
            this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
        }
        switch (this.inputParamsProRata.parentMode) {
            case 'ServiceCoverAdd':
                this.contractFormGroup.controls['ProductCode'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductCode'));
                this.contractFormGroup.controls['ProductDesc'].setValue(this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductDesc'));
                break;
            case 'ServiceCover':
                this.ServiceCoverRowID = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ServiceCoverRowID');
                break;
            case 'UninvoicedInstallation':
                this.serviceCoverRowID = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ServiceCoverRowID');
                break;
            case 'ProRataCharge':
                this.serviceCoverRowID = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ServiceCoverRowID');
                break;
            case 'ProRataChargeRO':
                this.serviceCoverRowID = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ServiceCoverRowID');
                break;
        }
        switch (this.inputParamsProRata.parentMode) {
            case 'ContractHistory':
            case 'Contract':
            case 'Premise':
            case 'UninvoicedInstallation':
            case 'ProRataCharge':
            case 'ProRataChargeRO':
                this.addMode = false;
                break;
            case 'ProRataChargeRO':
                this.updateMode = false;
        }
        switch (this.inputParamsProRata.parentMode) {
            case 'ServiceCoverAdd':
                this.updateMode = false;
                this.addMode = true;
                this.riMaintenanceBeforeAddMode();
                break;
            default:
                this.fetchRecord();
        }
        this.routeAwayUpdateSaveFlag();
    };
    ProRataChargeMaintenanceComponent.prototype.ngAfterViewInit = function () {
    };
    ProRataChargeMaintenanceComponent.prototype.UpdateSyschar = function () {
        if (this.blnSCEnableDiscountCode) {
            if (this.formGroup) {
                this.formGroup.isDiscountCode = true;
                this.getDefaultDiscountCode();
            }
        }
        else {
            if (this.formGroup)
                this.formGroup.isDiscountCode = false;
        }
        this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
    };
    ProRataChargeMaintenanceComponent.prototype.fetchRecord = function () {
        var _this = this;
        this.querySearchParams = new URLSearchParams();
        this.querySearchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySearchParams.set(this.serviceConstants.Action, '0');
        this.querySearchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        var formData = {};
        if (this.sentFromParent) {
            if (this.sentFromParent['ProRataChargeRowID'])
                formData['ProRataChargeROWID'] = this.sentFromParent['ProRataChargeRowID'];
            if (this.sentFromParent.PremiseNumber)
                formData['PremiseNumber'] = this.sentFromParent.PremiseNumber;
        }
        if (this.inputParamsProRata.parentMode) {
            if (this.inputParamsProRata.parentMode === 'ProRataCharge')
                formData['ProRataChargeROWID'] = this.routeParams['ProRataChargeRowID'];
        }
        formData['ContractNumber'] = this.contractFormGroup.controls['ContractNumber'].value;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.querySearchParams, formData)
            .subscribe(function (data) {
            if (!data.errorMessage) {
                _this.formGroupData = data;
                _this.setFormData();
                _this.invoiceCreditReasonCodeOndeactivate();
                _this.doLookupTab();
                _this.riMaintenanceAfterFetch();
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataChargeMaintenanceComponent.prototype.setFormData = function () {
        if (this.inputParamsProRata.parentMode === 'ServiceCoverAdd') {
            if (this.sentFromParent) {
                switch (this.sentFromParent['Level']) {
                    case 'Contract':
                        this.isProductRow = false;
                        this.isPremiseRow = false;
                        break;
                    case 'Premise':
                        this.contractFormGroup.controls['PremiseNumber'].setValue(this.formGroupData.PremiseNumber);
                        this.isProductRow = false;
                        break;
                    case 'ServiceCover':
                        this.contractFormGroup.controls['PremiseNumber'].setValue(this.formGroupData.PremiseNumber);
                        this.contractFormGroup.controls['ProductCode'].setValue(this.formGroupData.ProductCode);
                        break;
                    default:
                        this.contractFormGroup.controls['PremiseNumber'].setValue(this.formGroupData.PremiseNumber);
                        this.contractFormGroup.controls['ProductCode'].setValue(this.formGroupData.ProductCode);
                }
            }
        }
        else {
            this.contractFormGroup.controls['PremiseNumber'].setValue(this.formGroupData.PremiseNumber);
            this.contractFormGroup.controls['ProductCode'].setValue(this.formGroupData.ProductCode);
        }
        this.contractFormGroup.controls['ContractNumber'].setValue(this.formGroupData.ContractNumber);
        this.contractFormGroup.controls['AccountNumber'].setValue(this.formGroupData.AccountNumber);
        this.doLookupTab();
        if (this.formGroup) {
            this.formGroup.typeA.controls['InvoiceGroupNumber'].setValue(this.formGroupData.InvoiceGroupNumber);
            this.formGroup.typeA.controls['InvoiceCreditCode'].setValue(this.formGroupData.InvoiceCreditCode);
            if (this.formGroupData.InvoiceCreditCode === 'I')
                this.formGroup.typeA.controls['InvoiceCreditDesc'].setValue('Invoice');
            else if (this.formGroupData.InvoiceCreditCode === 'C')
                this.formGroup.typeA.controls['InvoiceCreditDesc'].setValue('Credit');
            this.formGroup.typeA.controls['ProRataChargeStatusCode'].setValue(this.formGroupData.ProRataChargeStatusCode);
            this.formGroup.typeA.controls['ProRataChargeStatusCode'].setValidators(Validators.required);
            this.riMaintenanceAfterFetch();
            if (this.formGroupData.ProRataChargeStatusCode === 'W')
                this.formGroup.typeA.controls['ProRataChargeStatusDesc'].setValue('Waiting');
            else if (this.formGroupData.ProRataChargeStatusCode === 'C')
                this.formGroup.typeA.controls['ProRataChargeStatusDesc'].setValue('Cancelled');
            else if (this.formGroupData.ProRataChargeStatusCode === 'P')
                this.formGroup.typeA.controls['ProRataChargeStatusDesc'].setValue('Produced');
            else if (this.formGroupData.ProRataChargeStatusCode === 'A')
                this.formGroup.typeA.controls['ProRataChargeStatusDesc'].setValue('Awaiting Approval');
            this.formGroup.typeA.controls['ServiceQuantity'].setValue(this.formGroupData.ServiceQuantity);
            this.formGroup.typeA.controls['ProRataChargeValue'].setValue(this.formGroupData.ProRataChargeValue);
            this.formGroup.typeA.controls['ProRataChargeValue'].setValidators(Validators.required);
            this.formGroup.typeA.controls['ProducedCompanyCode'].setValue(this.formGroupData.ProducedCompanyCode);
            this.formGroup.typeA.controls['CostValue'].setValue(this.formGroupData.CostValue);
            this.formGroup.typeA.controls['ProducedCompanyInvoiceNumber'].setValue(this.formGroupData.ProducedCompanyInvoiceNumber);
            this.formGroup.typeA.controls['ProducedInvoiceNumber'].setValue(this.formGroupData.ProducedInvoiceNumber);
            this.formGroup.typeA.controls['ServiceSalesEmployee'].setValue(this.formGroupData.ServiceSalesEmployee);
            if (this.formGroupData.ProducedInvoiceRun)
                this.formGroup.typeA.controls['ProducedInvoiceRun'].setValue(this.formGroupData.ProducedInvoiceRun);
            this.formGroup.typeA.controls['TaxCode'].setValue(this.formGroupData.TaxCode);
            this.formGroup.typeA.controls['InvoiceCreditReasonCode'].setValue(this.formGroupData.InvoiceCreditReasonCode);
            this.formGroup.typeA.controls['PurchaseOrderNo'].setValue(this.formGroupData.PurchaseOrderNo);
            this.formGroup.typeA.controls['TaxInvoiceNumber'].setValue(this.formGroupData.TaxInvoiceNumber);
            this.formGroup.typeA.controls['DiscountCode'].setValue(this.formGroupData.DiscountCode);
            this.formGroup.typeA.controls['CreditMissedServiceInd'].setValue(this.formGroupData.CreditMissedServiceInd);
            this.formGroup.typeA.controls['OutsortInvoice'].setValue(this.utils.convertResponseValueToCheckboxInput(this.formGroupData.OutsortInvoice));
            this.formGroup.typeA.controls['CreditNumberOfVisits'].setValue(this.formGroupData.CreditNumberOfVisits);
            if (this.blnOriginalInvoiceNumberMandatory) {
                this.formGroup.typeA.controls['OriginalInvoiceNumber'].setValue(this.formGroupData.OriginalInvoiceNumber || '0');
                this.formGroup.typeA.controls['OriginalInvoiceNumber'].setValidators(Validators.required);
            }
            else {
                this.formGroup.typeA.controls['OriginalInvoiceNumber'].setValue(this.formGroupData.OriginalInvoiceNumber || '0');
                this.formGroup.typeA.controls['OriginalInvoiceNumber'].clearValidators();
            }
            this.formGroup.typeA.controls['OriginalInvoiceItemNumber'].setValue(this.formGroupData.OriginalInvoiceItemNumber);
            this.formGroup.typeA.controls['OriginalInvoiceItemNumber'].clearValidators();
            var startDate = void 0;
            var endDate = void 0;
            var extractDate = void 0;
            var taxPointDate = void 0;
            var paidDate = void 0;
            var UserCode = void 0;
            var CompanyCode = void 0;
            var serviceBranchNumber = void 0;
            if (window['moment'](this.formGroupData['StartDate'], 'DD/MM/YYYY', true).isValid()) {
                startDate = this.utils.convertDate(this.formGroupData['StartDate']);
            }
            else {
                startDate = this.formGroupData['StartDate'];
            }
            if (window['moment'](this.formGroupData['EndDate'], 'DD/MM/YYYY', true).isValid()) {
                endDate = this.utils.convertDate(this.formGroupData['EndDate']);
            }
            else {
                endDate = this.formGroupData['EndDate'];
            }
            if (window['moment'](this.formGroupData['ToBeReleasedDate'], 'DD/MM/YYYY', true).isValid()) {
                extractDate = this.utils.convertDate(this.formGroupData['ToBeReleasedDate']);
            }
            else {
                extractDate = this.formGroupData['ToBeReleasedDate'];
            }
            if (window['moment'](this.formGroupData['TaxPointDate'], 'DD/MM/YYYY', true).isValid()) {
                taxPointDate = this.utils.convertDate(this.formGroupData['TaxPointDate']);
            }
            else {
                taxPointDate = this.formGroupData['TaxPointDate'];
            }
            if (window['moment'](this.formGroupData['PaidDate'], 'DD/MM/YYYY', true).isValid()) {
                paidDate = this.utils.convertDate(this.formGroupData['PaidDate']);
            }
            else {
                paidDate = this.formGroupData['PaidDate'];
            }
            serviceBranchNumber = this.formGroupData['ServiceBranchNumber'];
            if (this.formGroupData['UserCode'])
                UserCode = this.formGroupData['UserCode'];
            if (this.formGroupData['OriginalCompanyCode'])
                CompanyCode = this.formGroupData['OriginalCompanyCode'];
            var returnGrpObj = void 0;
            returnGrpObj = {
                'UpdateMode': this.updateMode,
                'AddMode': this.addMode,
                'StartDate': startDate,
                'EndDate': endDate,
                'ExtractDate': extractDate,
                'TaxPointDate': taxPointDate,
                'PaidDate': paidDate,
                'BranchNumber': serviceBranchNumber,
                'UserCode': UserCode,
                'CompanyCode': CompanyCode,
                'AccountNumber': this.formGroupData['AccountNumber'],
                'ProRataChargeStatusCode': this.formGroupData['ProRataChargeStatusCode']
            };
            this.store.dispatch({ type: ContractActionTypes.PARENT_TO_CHILD_COMPONENT, payload: returnGrpObj });
            this.formGroup.branchNumber = serviceBranchNumber;
            this.formGroup.companyCode = CompanyCode;
            this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
            this.formGroup.typeA.updateValueAndValidity();
            this.formGroup.typeB.controls['PrintCreditInd'].setValue(this.formGroupData.PrintCreditInd === 'yes');
            this.formGroup.typeB.controls['AdditionalCreditInfo'].setValue(this.formGroupData.AdditionalCreditInfo);
            this.formGroup.isAdditionalCreditInfo = true;
            this.formGroup.typeB.controls['UseProRataNarrative'].setValue(this.formGroupData.UseProRataNarrative === 'yes');
            if (this.blnEnableAutoCreditNoteNarrative) {
                this.formGroup.typeB.controls['ProRataNarrative'].setValue(this.formGroupData.ProRataNarrative);
                this.formGroup.typeB.controls['ProRataNarrative'].setValidators(Validators.required);
            }
            else {
                this.formGroup.typeB.controls['ProRataNarrative'].setValue(this.formGroupData.ProRataNarrative);
                this.formGroup.typeB.controls['ProRataNarrative'].clearValidators();
            }
            this.formGroup.typeB.updateValueAndValidity();
        }
        else {
            this.updateMode = false;
        }
    };
    ProRataChargeMaintenanceComponent.prototype.buildTabs = function () {
        this.tabs = [
            { title: 'General', active: true },
            { title: 'Narrative', active: false }
        ];
        this.tabComponentList = [ProRataMaintenanceTypeAComponent, ProRataMaintenanceTypeBComponent];
    };
    ProRataChargeMaintenanceComponent.prototype.setCurrentContractType = function () {
        this.contractTypeCode = this.inputParamsContractSearch.currentContractType;
        this.currentContractTypeLabel = this.utils.getCurrentContractLabel(this.inputParamsContractSearch.currentContractType);
        this.inputParamsContractSearch.currentContractType = this.currentContractTypeLabel;
    };
    ProRataChargeMaintenanceComponent.prototype.setContractNumber = function (event) {
        this.contractFormGroup.controls['ContractNumber'].setValue(event.ContractNumber);
        this.contractFormGroup.controls['ContractName'].setValue(event.ContractName);
        this.contractFormGroup.controls['InvoiceFrequencyCode'].setValue(event.InvoiceFrequencyCode);
        this.contractFormGroup.controls['AccountNumber'].setValue(event.AccountNumber);
    };
    ProRataChargeMaintenanceComponent.prototype.setSysChars = function () {
        if (this.syschars !== null) {
            this.blnSCEnableCompanyCode = this.sysCharParams['vSCEnableCompanyCode'];
            this.blnSCEnableUseProRataNarrative = this.sysCharParams['vSCEnableUseProRataNarrative'];
            this.blnSCEnableCreateServiceValue = this.sysCharParams['vEnableCreateServiceValue'];
            this.blnSCDefaultExtractDate = this.sysCharParams['vSCDefaultExtractDate'];
            this.blnSCEnableDiscountCode = this.sysCharParams['vEnableDiscountCode'];
            this.logAllowNoniCABSInvoiceNumbers = this.sysCharParams['lRequiredNoniCABSInvoiceNumbers'];
            this.blnOriginalInvoiceNumberMandatory = this.sysCharParams['lOriginalInvoiceNumberMandatory'];
            this.blnOriginalInvoiceNumberRequired = this.sysCharParams['lRequiredOriginalInvoiceNumber'];
            this.blnEnableAutoCreditNoteNarrative = this.sysCharParams['lEnableAutoCreditNoteNarrative'];
            this.blnEnableCreateServiceValue = this.sysCharParams['lEnableCreateServiceValue'];
            this.blnSCTaxInvoiceNumber = this.sysCharParams['vSCEnableTaxInvoiceRanges'];
            this.boolCreditApprovals = this.sysCharParams['vEnableCreditApprovals'];
        }
        if (this.formGroup && this.blnEnableCreateServiceValue) {
            this.formGroup.isServiceSalesEmployee = true;
        }
        else {
            this.formGroup.isServiceSalesEmployee = false;
        }
    };
    ProRataChargeMaintenanceComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.SysCharConstants.SystemCharEnableCompanyCode,
            this.SysCharConstants.SystemCharEnableProRataNarrativeOnInvoice,
            this.SysCharConstants.SystemCharDefaultProRataExtractDate,
            this.SysCharConstants.SystemCharCreditApprovals,
            this.SysCharConstants.SystemCharEnableDiscountCode,
            this.SysCharConstants.SystemCharEnableAutoCreditNoteNarrative,
            this.SysCharConstants.SystemCharAllowNoniCABSInvoiceNumberInProRataChargeMaint,
            this.SysCharConstants.SystemCharEnableAutoOriginalInvNumbersManCredits,
            this.SysCharConstants.SystemCharEnableProRataChargeToCreateServiceValue,
            this.SysCharConstants.SystemCharEnableTaxInvoiceRanges
        ];
        return sysCharList.join(',');
    };
    ProRataChargeMaintenanceComponent.prototype.onSysCharDataReceive = function (e) {
        if (e.records && e.records.length > 0) {
            this.sysCharParams['vSCEnableCompanyCode'] = e.records[0].Required;
            this.sysCharParams['vSCEnableUseProRataNarrative'] = e.records[1].Required;
            this.sysCharParams['vSCDefaultExtractDate'] = e.records[2].Required;
            this.sysCharParams['vEnableCreditApprovals'] = e.records[3].Required;
            this.sysCharParams['vEnableDiscountCode'] = e.records[4].Required;
            this.sysCharParams['lEnableAutoCreditNoteNarrative'] = e.records[5].Required;
            this.sysCharParams['lRequiredNoniCABSInvoiceNumbers'] = e.records[6].Required;
            this.sysCharParams['lRequiredOriginalInvoiceNumber'] = e.records[7].Required;
            this.sysCharParams['vEnableCreateServiceValue'] = e.records[8].Required;
            this.sysCharParams['vSCEnableTaxInvoiceRanges'] = e.records[9].Required;
            this.store.dispatch({ type: ContractActionTypes.SAVE_SYSCHAR, payload: this.sysCharParams });
            this.setSysChars();
        }
    };
    ProRataChargeMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    ProRataChargeMaintenanceComponent.prototype.triggerFetchSysChar = function (saveModeData, returnSubscription) {
        var _this = this;
        var sysCharNumbers = this.sysCharParameters();
        this.fetchSysChar(sysCharNumbers).subscribe(function (data) {
            _this.onSysCharDataReceive(data);
        });
    };
    ProRataChargeMaintenanceComponent.prototype.riMaintenanceBeforeAddMode = function () {
        var _this = this;
        this.blnUpdatedRecord = false;
        if (this.formGroup) {
            if (this.URLqueryParams.mode === 'AdditionalCharge') {
                if (this.formGroup.typeA.controls['InvoiceCreditCode'])
                    this.formGroup.typeA.controls['InvoiceCreditCode'].setValue('I');
                this.formGroup.isAdditionalCreditInfo = false;
                this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
            }
            else {
                if (this.formGroup.typeA.controls['InvoiceCreditCode'])
                    this.formGroup.typeA.controls['InvoiceCreditCode'].setValue('C');
                this.formGroup.allDate.extractDate = this.utils.formatDate(new Date());
                this.formGroup.isCreditMissedServiceInd = true;
                this.formGroup['isCreditNumberOfVisits'] = false;
                if (this.formGroup.typeA.controls['CreditMissedServiceInd'])
                    this.formGroup.typeA.controls['CreditMissedServiceInd'].setValue(false);
                this.formGroup.isAdditionalCreditInfo = true;
                this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
            }
            if (this.boolCreditApprovals) {
                this.riExchange.riInputElement.Disable(this.formGroup.typeA, 'ProRataChargeStatusCode');
            }
            if (this.blnSCDefaultExtractDate) {
                this.querySearchParams = new URLSearchParams();
                this.querySearchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                var formData = {};
                formData['Function'] = 'GetExtractDate';
                formData['ContractNumber'] = this.contractFormGroup.controls['ContractNumber'].value;
                this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.querySearchParams, formData).subscribe(function (e) {
                    if (e.errorMessage) {
                        _this.errorService.emitError(e);
                    }
                    else {
                    }
                });
            }
            if (this.formGroup.typeA.controls['InvoiceCreditCode'] && this.formGroup.typeA.controls['InvoiceCreditCode'].value === 'I') {
                this.formGroup.isDisableTaxPointDate = true;
                this.formGroup.isTaxPointDate = false;
            }
            else {
                this.formGroup.isTaxPointDate = true;
            }
            this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
            this.displayInvoiceCreditDesc();
            if (this.formGroup.typeA.controls['InvoiceCreditCode'] && this.formGroup.typeA.controls['InvoiceCreditCode'].value === 'C' && this.formGroup.typeB.controls['PrintCreditInd'])
                this.formGroup.typeB.controls['PrintCreditInd'].setValue(this.utils.convertCheckboxValueToRequestValue('yes'));
            else
                this.blnOriginalInvoiceNumberMandatory = false;
            if (this.blnEnableCreateServiceValue) {
                this.riExchange.riInputElement.Enable(this.formGroup.typeA, 'ServiceSalesEmployee');
                this.riExchange.riInputElement.SetRequiredStatus(this.formGroup.typeA, 'ServiceSalesEmployee', true);
            }
            else {
                this.riExchange.riInputElement.SetRequiredStatus(this.formGroup.typeA, 'ServiceSalesEmployee', false);
            }
            var returnGrpObj = {
                'UpdateMode': this.updateMode,
                'AddMode': this.addMode,
                'Mode': this.routeParams.mode,
                'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value
            };
            if (this.formGroup.typeA.controls['ProRataChargeValue'])
                this.formGroup.typeA.controls['ProRataChargeValue'].setValidators(Validators.required);
            this.store.dispatch({ type: ContractActionTypes.PARENT_TO_CHILD_COMPONENT, payload: returnGrpObj });
            this.formGroup.addMode = this.addMode;
            this.store.dispatch({ type: ContractActionTypes.FORM_GROUP, payload: this.formGroup });
            this.formGroup.typeA.updateValueAndValidity();
            this.getDefaults();
            this.getDefaultDiscountCode();
        }
    };
    ProRataChargeMaintenanceComponent.prototype.displayInvoiceCreditDesc = function () {
        if (this.formGroup.typeA.controls['InvoiceCreditCode'].value === 'I') {
            this.formGroup.typeA.controls['InvoiceCreditDesc'].setValue('Invoice');
            this.formGroup.isPrintCredit = false;
        }
        else if (this.formGroup.typeA.controls['InvoiceCreditCode'].value === 'C') {
            this.formGroup.typeA.controls['InvoiceCreditDesc'].setValue('Credit');
            this.formGroup.isPrintCredit = true;
        }
        this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
    };
    ProRataChargeMaintenanceComponent.prototype.riMaintenanceBeforeUpdateMode = function () {
        this.blnUpdatedRecord = false;
        if (this.formGroup) {
            this.formGroup.typeA.controls['CreditMissedServiceInd'].disabled();
            this.formGroup.typeA.controls['ServiceSalesEmployee'].disabled();
            if (this.formGroup.typeA.controls.InvoiceCreditCode.value === 'I') {
                this.formGroup.isDisableTaxPointDate = true;
                this.blnOriginalInvoiceNumberMandatory = false;
            }
            if (this.blnOriginalInvoiceNumberMandatory) {
                this.formGroup.typeA.controls['OriginalInvoiceNumber'].setValidators(Validators.required);
                this.formGroup.typeA.controls['OriginalCompanyCode'].setValidators(Validators.required);
            }
        }
        this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
    };
    ProRataChargeMaintenanceComponent.prototype.riMaintenanceAfterFetch = function () {
        if (this.formGroupData && this.formGroupData['ShowPaidDate'] === 'Y') {
            this.formGroup.isTaxPointDate = true;
        }
        if (this.formGroupData['InvoiceCreditCode'] === 'I') {
            this.formGroup.isTaxPointDate = false;
            this.blnOriginalInvoiceNumberMandatory = false;
            this.formGroup.typeA.updateValueAndValidity();
        }
        else {
            this.formGroup.isTaxPointDate = true;
            this.formGroup.typeA.updateValueAndValidity();
        }
        this.displayInvoiceCreditDesc();
        this.formGroup.isCreditMissedServiceInd = false;
        if (this.formGroupData.InvoiceCreditReasonCode && this.formGroupData.InvoiceCreditReasonCode !== '') {
            if (this.formGroup)
                this.OrigReasonCode = this.formGroup.typeA.controls['InvoiceCreditReasonDesc'].value;
        }
        else {
            this.OrigReasonCode = '';
        }
        this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
    };
    ProRataChargeMaintenanceComponent.prototype.riMaintenanceBeforeConfirm = function () {
        var lError;
        lError = false;
        if (this.formGroup.typeB.controls['ProRataNarrative'].value === '' || this.formGroup.typeB.controls['ProRataNarrative'].value === null)
            lError = true;
        if (lError === false && (this.formGroup.typeB.controls['ProRataNarrative'].value !== '' || this.formGroup.typeB.controls['ProRataNarrative'].value !== null) && this.formGroup.typeB.controls['ProRataNarrative'].value.length >= 500) {
            lError = true;
        }
        if (this.blnEnableAutoCreditNoteNarrative && lError === true) {
        }
        lError = false;
        if (this.formGroup.typeB.controls['AdditionalCreditInfo'].value) {
            if (this.formGroup.typeB.controls['AdditionalCreditInfo'].value.length() > 100) {
            }
        }
    };
    ProRataChargeMaintenanceComponent.prototype.riMaintenanceBeforeSave = function () {
        if (this.formGroup) {
            if (this.formGroup.typeA.controls['OriginalInvoiceNumber'].value === null || this.formGroup.typeA.controls['OriginalInvoiceNumber'].value === '') {
            }
            if (this.formGroup.typeA.controls['OriginalInvoiceNumber'].value && this.formGroup.typeA.controls['InvoiceCreditCode'].value === 'C') {
                this.checkInvoiceCredit();
            }
            if (this.contractTypeCode === 'J') {
                this.checkCreditValue();
            }
            if (this.formGroup.typeA.controls['ProRataChargeStatusCode'].value === 'W' && this.formGroup.typeA.controls['InvoiceCreditCode'].value === 'I') {
                if (this.blnEnableAutoCreditNoteNarrative && (this.formGroup.typeB.controls['ProRataNarrative'].value === null || this.formGroup.typeA.controls['ProRataNarrative'].value === '')) {
                    this.formGroup.typeB.controls['ProRataNarrative'].setValue(this.formGroup.typeA.controls['InvoiceCreditReasonDesc']);
                }
            }
        }
    };
    ProRataChargeMaintenanceComponent.prototype.checkInvoiceCredit = function () {
        var _this = this;
        this.queryRequest = new URLSearchParams();
        this.queryRequest.set(this.serviceConstants.Action, '6');
        this.queryRequest.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        var formData = {};
        formData['Function'] = 'CheckInvoiceCredit';
        formData['OriginalInvoiceNumber'] = this.formGroup.typeA.controls['OriginalInvoiceNumber'];
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryRequest, formData).subscribe(function (e) {
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
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataChargeMaintenanceComponent.prototype.riMaintenanceAfterSaveAdd = function () {
        this.blnUpdatedRecord = true;
        if (this.formGroup.typeA.controls['CreditMissedServiceInd'].value === true) {
        }
        this.formGroup.isCreditMissedServiceInd = false;
        this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: this.formGroup });
    };
    ProRataChargeMaintenanceComponent.prototype.riMaintenanceAfterAbandon = function () {
        if (this.formGroup.typeA.controls['InvoiceCreditCode'].value === '') {
            this.formGroup.typeA.controls['InvoiceCreditCode'].setValue('');
        }
        this.displayInvoiceCreditDesc();
    };
    ProRataChargeMaintenanceComponent.prototype.riExchangeCBORequest = function () {
        var query = {
            'action': '6',
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode()
        };
        var formData = {
            'InvoiceCreditCode': this.formGroup.typeA.controls['InvoiceCreditCode'].value,
            'ProRataChargeValue': this.formGroup.typeA.controls['ProRataChargeValue'].value
        };
        this.postProRataChargeMaintenanceData('WarnValue', query, formData);
    };
    ProRataChargeMaintenanceComponent.prototype.checkCreditValue = function () {
        var _this = this;
        this.queryRequest = new URLSearchParams();
        this.queryRequest.set(this.serviceConstants.Action, '6');
        this.queryRequest.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        var formData = {};
        formData['ProRataChargeValue'] = this.formGroup.typeA.controls['ProRataChargeValue'].value ? this.formGroup.typeA.controls['ProRataChargeValue'].value : '';
        formData['InvoiceCreditCode'] = this.formGroup.typeA.controls['InvoiceCreditCode'].value ? this.formGroup.typeA.controls['InvoiceCreditCode'].value : '';
        formData['ToBeReleasedDate'] = this.formGroup.extractDate;
        formData['Function'] = 'CheckCreditValue';
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryRequest, formData).subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
        });
    };
    ProRataChargeMaintenanceComponent.prototype.postProRataChargeMaintenanceData = function (functionName, queryParams, formParams) {
        var _this = this;
        var formdata = {};
        if (functionName !== '') {
            this.queryRequest.set('Function', functionName);
        }
        for (var key in queryParams) {
            if (key) {
                this.queryRequest.set(key, queryParams[key]);
            }
        }
        for (var key in formParams) {
            if (key) {
                formdata[key] = formParams[key];
            }
        }
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryRequest, formdata).subscribe(function (e) {
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
                    _this.messageModal.show({ msg: 'Update failed', title: 'Message' }, false);
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataChargeMaintenanceComponent.prototype.updateProRataChargeMaintenance = function () {
        this.formGroup.typeA.controls['InvoiceGroupNumber'].markAsTouched();
        this.formGroup.typeA.controls['InvoiceCreditCode'].markAsTouched();
        this.formGroup.typeA.controls['ProRataChargeStatusCode'].markAsTouched();
        this.formGroup.typeA.controls['ProRataChargeStatusDesc'].markAsTouched();
        this.formGroup.typeA.controls['ServiceQuantity'].markAsTouched();
        this.formGroup.typeA.controls['ProRataChargeValue'].markAsTouched();
        this.formGroup.typeA.controls['ProducedCompanyCode'].markAsTouched();
        this.formGroup.typeA.controls['CostValue'].markAsTouched();
        this.formGroup.typeA.controls['ProducedCompanyInvoiceNumber'].markAsTouched();
        this.formGroup.typeA.controls['ProducedInvoiceNumber'].markAsTouched();
        this.formGroup.typeA.controls['ServiceSalesEmployee'].markAsTouched();
        this.formGroup.typeA.controls['ProducedInvoiceRun'].markAsTouched();
        this.formGroup.typeA.controls['OriginalInvoiceNumber'].markAsTouched();
        this.formGroup.typeA.controls['TaxCode'].markAsTouched();
        this.formGroup.typeA.controls['OriginalInvoiceItemNumber'].markAsTouched();
        this.formGroup.typeA.controls['InvoiceCreditReasonCode'].markAsTouched();
        this.formGroup.typeA.controls['PurchaseOrderNo'].markAsTouched();
        this.formGroup.typeA.controls['TaxInvoiceNumber'].markAsTouched();
        this.formGroup.typeA.controls['DiscountCode'].markAsTouched();
        this.formGroup.typeA.controls['CreditMissedServiceInd'].markAsTouched();
        this.formGroup.typeA.controls['OutsortInvoice'].markAsTouched();
        this.formGroup.typeA.controls['CreditNumberOfVisits'].markAsTouched();
        this.formGroup.typeB.controls['PrintCreditInd'].markAsTouched();
        this.formGroup.typeB.controls['ProRataNarrative'].markAsTouched();
        this.formGroup.typeB.controls['AdditionalCreditInfo'].markAsTouched();
        this.formGroup.typeB.controls['UseProRataNarrative'].markAsTouched();
        this.formGroup.proRataStartDatePicker.validateDateField();
        this.formGroup.proRataExtractDatePicker.validateDateField();
        if (this.formGroup.allDate.startDate !== '' && this.formGroup.allDate.extractDate !== '' && this.formGroup.typeA.valid === true && this.formGroup.typeB.valid === true) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    };
    ProRataChargeMaintenanceComponent.prototype.promptConfirm = function (event) {
        if (this.formGroup.allDate.startDate !== '' && this.formGroup.allDate.extractDate !== '' && this.formGroup.typeA.valid === true && this.formGroup.typeB.valid === true) {
            if (this.updateMode) {
                this.updateAccountData('2');
            }
            else if (this.addMode) {
                this.updateAccountData('1');
            }
        }
    };
    ProRataChargeMaintenanceComponent.prototype.updateAccountData = function (actionValue) {
        var _this = this;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.queryRequest = new URLSearchParams();
        this.queryRequest.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryRequest.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryRequest.set(this.serviceConstants.Action, actionValue);
        var formData = {};
        formData = this.getFormDataForAccountNumber();
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryRequest, formData)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
                _this.messageModal.show({ msg: 'Update failed', title: 'Message' }, false);
            }
            else if (e.errorMessage && e.errorMessage !== '') {
                _this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
            }
            else if (e.message && e.message === 'invalid value') {
                _this.messageModal.show({ msg: e.message, title: 'Message' }, false);
            }
            else {
                _this.riMaintenanceAfterSaveAdd();
                _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.messageModal.show({ msg: 'Update failed', title: 'Message' }, false);
            return;
        });
    };
    ProRataChargeMaintenanceComponent.prototype.getFieldValue = function (controlObj, isCheckBox) {
        if (isCheckBox === true) {
            return (controlObj && controlObj.value) ? ((controlObj.value === true) ? 'Y' : 'N') : 'N';
        }
        return (controlObj && controlObj.value) ? controlObj.value : '';
    };
    ProRataChargeMaintenanceComponent.prototype.getFormDataForAccountNumber = function () {
        var formdata = {};
        if (this.updateMode) {
            try {
                formdata['ServiceCoverRowID'] = this.routeParams['ServiceCoverRowID'];
                if (this.routeParams['ProRataChargeRowID'])
                    formdata['ProRataChargeROWID'] = this.routeParams['ProRataChargeRowID'];
                formdata['LostBusinessRequestNumber'] = this.formGroupData['LostBusinessRequestNumber'];
                formdata['ShowPaidDate'] = this.formGroupData['ShowPaidDate'];
                formdata['ApprovedUser'] = this.formGroupData['ApprovedUser'];
                formdata['AccountNumber'] = this.getFieldValue(this.contractFormGroup.controls['AccountNumber']);
                formdata['ContractNumber'] = this.getFieldValue(this.contractFormGroup.controls['ContractNumber']);
                formdata['PremiseNumber'] = this.getFieldValue(this.contractFormGroup.controls['PremiseNumber']);
                formdata['ProductCode'] = this.getFieldValue(this.contractFormGroup.controls['ProductCode']);
                if (this.formGroup.typeA) {
                    if (this.formGroup.allDate.startDate && this.formGroup.allDate.startDate !== '')
                        formdata['StartDate'] = this.utils.formatDate(this.formGroup.allDate.startDate);
                    else
                        formdata['StartDate'] = '';
                    if (this.formGroup.allDate.endDate && this.formGroup.allDate.endDate !== '')
                        formdata['EndDate'] = this.utils.formatDate(this.formGroup.allDate.endDate);
                    else
                        formdata['EndDate'] = '';
                    if (this.formGroup.allDate.taxPointDate && this.formGroup.allDate.taxPointDate !== '')
                        formdata['TaxPointDate'] = this.utils.formatDate(this.formGroup.allDate.taxPointDate);
                    else
                        formdata['TaxPointDate'] = '';
                    if (this.formGroup.allDate.paidDate && this.formGroup.allDate.paidDate !== '')
                        formdata['PaidDate'] = this.utils.formatDate(this.formGroup.allDate.paidDate);
                    else
                        formdata['PaidDate'] = '';
                    if (this.formGroup.allDate.extractDate && this.formGroup.allDate.extractDate !== '')
                        formdata['ToBeReleasedDate '] = this.utils.formatDate(this.formGroup.allDate.extractDate);
                    else
                        formdata['ToBeReleasedDate '] = '';
                    if (this.formGroup.branchNumber !== '')
                        formdata['ServiceBranchNumber'] = this.formGroup.branchNumber;
                    else
                        formdata['ServiceBranchNumber'] = this.formGroupData['ServiceBranchNumber'];
                    if (this.formGroup.originalCompanyCode)
                        formdata['OriginalCompanyCode'] = this.formGroup.originalCompanyCode;
                    else
                        formdata['OriginalCompanyCode'] = this.formGroupData['OriginalCompanyCode'];
                    formdata['InvoiceGroupNumber'] = this.getFieldValue(this.formGroup.typeA.controls['InvoiceGroupNumber']);
                    formdata['InvoiceCreditCode'] = this.getFieldValue(this.formGroup.typeA.controls['InvoiceCreditCode']);
                    formdata['ProRataChargeStatusCode'] = this.getFieldValue(this.formGroup.typeA.controls['ProRataChargeStatusCode']);
                    formdata['ServiceQuantity'] = this.getFieldValue(this.formGroup.typeA.controls['ServiceQuantity']);
                    formdata['CostValue'] = this.getFieldValue(this.formGroup.typeA.controls['CostValue']);
                    formdata['ProducedCompanyCode'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedCompanyCode']);
                    formdata['ProducedCompanyInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedCompanyInvoiceNumber']);
                    formdata['ProducedInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedInvoiceNumber']);
                    formdata['ServiceSalesEmployee'] = this.getFieldValue(this.formGroup.typeA.controls['ServiceSalesEmployee']);
                    formdata['ProducedInvoiceRUN'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedInvoiceRun']);
                    formdata['TaxCode'] = this.getFieldValue(this.formGroup.typeA.controls['TaxCode']);
                    formdata['InvoiceCreditReasonCode'] = this.getFieldValue(this.formGroup.typeA.controls['InvoiceCreditReasonCode']);
                    formdata['PurchaseOrderNo'] = this.getFieldValue(this.formGroup.typeA.controls['PurchaseOrderNo']);
                    formdata['TaxInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['TaxInvoiceNumber']);
                    formdata['DiscountCode'] = this.getFieldValue(this.formGroup.typeA.controls['DiscountCode']);
                    formdata['CreditMissedServiceInd'] = this.getFieldValue(this.formGroup.typeA.controls['CreditMissedServiceInd']);
                    formdata['OutsortInvoice'] = this.utils.convertCheckboxValueToRequestValue(this.getFieldValue(this.formGroup.typeA.controls['OutsortInvoice']));
                    formdata['CreditNumberOfVisits'] = this.getFieldValue(this.formGroup.typeA.controls['CreditNumberOfVisits']);
                    formdata['OriginalInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['OriginalInvoiceNumber']);
                    formdata['OriginalCompanyInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedCompanyInvoiceNumber']);
                    formdata['OriginalInvoiceItemNumber'] = this.getFieldValue(this.formGroup.typeA.controls['OriginalInvoiceItemNumber']);
                    formdata['ProRataChargeValue'] = this.getFieldValue(this.formGroup.typeA.controls['ProRataChargeValue']);
                }
                if (this.formGroup.typeB) {
                    formdata['PrintCreditInd'] = this.getFieldValue(this.formGroup.typeB.controls['PrintCreditInd'], true);
                    formdata['AdditionalCreditInfo'] = this.getFieldValue(this.formGroup.typeB.controls['AdditionalCreditInfo']);
                    formdata['UseProRataNarrative'] = this.getFieldValue(this.formGroup.typeB.controls['UseProRataNarrative']);
                    formdata['ProRataNarrative'] = this.getFieldValue(this.formGroup.typeB.controls['ProRataNarrative']);
                }
                formdata['ContractTypeCode'] = this.routeParams.CurrentContractType;
            }
            catch (e) {
            }
        }
        else if (this.addMode) {
            try {
                formdata['ServiceCoverRowID'] = this.routeParams['ServiceCoverRowID'];
                if (this.routeParams['ProRataChargeRowID'])
                    formdata['ProRataChargeROWID'] = this.routeParams['ProRataChargeRowID'];
                formdata['AccountNumber'] = this.getFieldValue(this.contractFormGroup.controls['AccountNumber']);
                formdata['ContractNumber'] = this.getFieldValue(this.contractFormGroup.controls['ContractNumber']);
                formdata['PremiseNumber'] = this.getFieldValue(this.contractFormGroup.controls['PremiseNumber']);
                formdata['ProductCode'] = this.getFieldValue(this.contractFormGroup.controls['ProductCode']);
                if (this.formGroup.typeA) {
                    if (this.formGroup.allDate.startDate && this.formGroup.allDate.startDate !== '')
                        formdata['StartDate'] = this.utils.formatDate(this.formGroup.allDate.startDate);
                    else
                        formdata['StartDate'] = '';
                    if (this.formGroup.allDate.endDate && this.formGroup.allDate.endDate !== '')
                        formdata['EndDate'] = this.utils.formatDate(this.formGroup.allDate.endDate);
                    else
                        formdata['EndDate'] = '';
                    if (this.formGroup.allDate.taxPointDate && this.formGroup.allDate.taxPointDate !== '')
                        formdata['TaxPointDate'] = this.utils.formatDate(this.formGroup.allDate.taxPointDate);
                    else
                        formdata['TaxPointDate'] = '';
                    if (this.formGroup.allDate.paidDate && this.formGroup.allDate.paidDate !== '')
                        formdata['PaidDate'] = this.utils.formatDate(this.formGroup.allDate.paidDate);
                    else
                        formdata['PaidDate'] = '';
                    if (this.formGroup.allDate.extractDate && this.formGroup.allDate.extractDate !== '')
                        formdata['ToBeReleasedDate '] = this.utils.formatDate(this.formGroup.allDate.extractDate);
                    else
                        formdata['ToBeReleasedDate '] = '';
                    if (this.formGroup.negBranchNumberSelected)
                        formdata['ServiceBranchNumber'] = this.formGroup.negBranchNumberSelected['id'];
                    if (this.formGroup.negCompanyNumberSelected)
                        formdata['OriginalCompanyCode'] = this.formGroup.negCompanyNumberSelected['id'];
                    formdata['ContractTypeCode'] = this.routeParams.CurrentContractType;
                    formdata['InvoiceGroupNumber'] = this.getFieldValue(this.formGroup.typeA.controls['InvoiceGroupNumber']);
                    formdata['InvoiceCreditCode'] = this.getFieldValue(this.formGroup.typeA.controls['InvoiceCreditCode']);
                    formdata['ProRataChargeStatusCode'] = this.getFieldValue(this.formGroup.typeA.controls['ProRataChargeStatusCode']);
                    formdata['ServiceQuantity'] = this.getFieldValue(this.formGroup.typeA.controls['ServiceQuantity']);
                    formdata['CostValue'] = this.getFieldValue(this.formGroup.typeA.controls['CostValue']);
                    formdata['ProducedCompanyCode'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedCompanyCode']);
                    formdata['ProducedCompanyInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedCompanyInvoiceNumber']);
                    formdata['ProducedInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedInvoiceNumber']);
                    formdata['ServiceSalesEmployee'] = this.getFieldValue(this.formGroup.typeA.controls['ServiceSalesEmployee']);
                    formdata['ProducedInvoiceRUN'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedInvoiceRun']);
                    formdata['TaxCode'] = this.getFieldValue(this.formGroup.typeA.controls['TaxCode']);
                    formdata['InvoiceCreditReasonCode'] = this.getFieldValue(this.formGroup.typeA.controls['InvoiceCreditReasonCode']);
                    formdata['PurchaseOrderNo'] = this.getFieldValue(this.formGroup.typeA.controls['PurchaseOrderNo']);
                    formdata['TaxInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['TaxInvoiceNumber']);
                    formdata['DiscountCode'] = this.getFieldValue(this.formGroup.typeA.controls['DiscountCode']);
                    formdata['CreditMissedServiceInd'] = this.getFieldValue(this.formGroup.typeA.controls['CreditMissedServiceInd']);
                    formdata['OutsortInvoice'] = this.utils.convertCheckboxValueToRequestValue(this.getFieldValue(this.formGroup.typeA.controls['OutsortInvoice']));
                    if (this.getFieldValue(this.formGroup.typeA.controls['CreditNumberOfVisits']) && this.getFieldValue(this.formGroup.typeA.controls['CreditNumberOfVisits']) === '')
                        formdata['CreditNumberOfVisits'] = '0';
                    else
                        formdata['CreditNumberOfVisits'] = this.getFieldValue(this.formGroup.typeA.controls['CreditNumberOfVisits']);
                    formdata['OriginalInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['OriginalInvoiceNumber']);
                    formdata['OriginalCompanyInvoiceNumber'] = this.getFieldValue(this.formGroup.typeA.controls['ProducedCompanyInvoiceNumber']);
                    formdata['OriginalInvoiceItemNumber'] = this.getFieldValue(this.formGroup.typeA.controls['OriginalInvoiceItemNumber']);
                    formdata['ProRataChargeValue'] = this.getFieldValue(this.formGroup.typeA.controls['ProRataChargeValue']);
                }
                if (this.formGroup.typeB) {
                    formdata['PrintCreditInd'] = this.getFieldValue(this.formGroup.typeB.controls['PrintCreditInd'], true);
                    if (formdata['PrintCreditInd'] === 'N')
                        formdata['PrintCreditInd'] = 'no';
                    else if (formdata['PrintCreditInd'] === 'Y')
                        formdata['PrintCreditInd'] = 'yes';
                    formdata['AdditionalCreditInfo'] = this.getFieldValue(this.formGroup.typeB.controls['AdditionalCreditInfo']);
                    formdata['UseProRataNarrative'] = this.getFieldValue(this.formGroup.typeB.controls['UseProRataNarrative']);
                    formdata['ProRataNarrative'] = this.getFieldValue(this.formGroup.typeB.controls['ProRataNarrative']);
                }
            }
            catch (e) {
            }
        }
        return formdata;
    };
    ProRataChargeMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ProRataChargeMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.contractFormGroup.statusChanges.subscribe(function (value) {
            if (_this.contractFormGroup.valid === true) {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    ProRataChargeMaintenanceComponent.prototype.doLookUpOnLoad = function () {
        var _this = this;
        var lookupIPSub = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value
                },
                'fields': ['ContractName', 'InvoiceFrequencyCode', 'InvoiceAnnivDate']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
                    'PremiseNumber': this.contractFormGroup.controls['PremiseNumber'].value
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ProductCode': this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ProductCode')
                },
                'fields': ['ProductDesc']
            },
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value
                },
                'fields': ['AccountName']
            }
        ];
        this.lookUpRecord(lookupIPSub, 5).subscribe(function (data) {
            if (data.results && data.results.length > 0) {
                var resultContract = data.results[0];
                var resultPremise = data.results[1];
                var resultProduct = data.results[2];
                var resultAcount = data.results[3];
                if (resultContract[0]) {
                    _this.contractFormGroup.controls['ContractName'].setValue(resultContract[0].ContractName);
                    _this.contractFormGroup.controls['InvoiceFrequencyCode'].setValue(resultContract[0].InvoiceFrequencyCode);
                    _this.contractFormGroup.controls['InvoiceAnnivDate'].setValue(_this.utils.formatDate(resultContract[0].InvoiceAnnivDate));
                }
                if (resultPremise[0])
                    _this.contractFormGroup.controls['PremiseName'].setValue(resultPremise[0].PremiseName);
                if (resultProduct[0]) {
                    _this.contractFormGroup.controls['ProductCode'].setValue(_this.riExchange.GetParentHTMLInputElementAttribute(_this.routeParams, 'ProductCode'));
                    _this.contractFormGroup.controls['ProductDesc'].setValue(resultProduct[0].ProductDesc);
                }
                if (resultAcount[0])
                    _this.contractFormGroup.controls['AccountName'].setValue(resultAcount[0].AccountName);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataChargeMaintenanceComponent.prototype.doLookupTab = function () {
        var _this = this;
        var invoiceCreditReasonCode = '';
        if (this.formGroupData.InvoiceCreditReasonCode)
            invoiceCreditReasonCode = this.formGroupData.InvoiceCreditReasonCode;
        var lookupIPSub = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.formGroupData.ContractNumber
                },
                'fields': ['ContractName', 'InvoiceFrequencyCode', 'InvoiceAnnivDate']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.formGroupData.ContractNumber,
                    'PremiseNumber': this.formGroupData.PremiseNumber
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ProductCode': this.formGroupData.ProductCode
                },
                'fields': ['ProductDesc']
            },
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': this.formGroupData.AccountNumber
                },
                'fields': ['AccountName']
            },
            {
                'table': 'Employee',
                'query': {
                    'EmployeeCode': this.formGroupData.ServiceSalesEmployee
                },
                'fields': ['EmployeeCode', 'EmployeeSurname']
            },
            {
                'table': 'InvoiceGroup',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': this.formGroupData.AccountNumber,
                    'InvoiceGroupNumber': this.formGroupData.InvoiceGroupNumber
                },
                'fields': ['InvoiceGroupDesc']
            },
            {
                'table': 'TaxCode',
                'query': {
                    'TaxCode': this.formGroupData.TaxCode
                },
                'fields': ['TaxCodeDesc']
            },
            {
                'table': 'InvoiceCreditReasonLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'InvoiceCreditReasonCode': invoiceCreditReasonCode
                },
                'fields': ['InvoiceCreditReasonDesc']
            },
            {
                'table': 'Discount',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'DiscountCode': this.formGroupData.DiscountCode
                },
                'fields': ['DiscountDesc']
            },
            {
                'table': 'Company',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'CompanyCode': this.formGroupData.ProducedCompanyCode
                },
                'fields': ['CompanyDesc']
            }
        ];
        this.lookUpRecord(lookupIPSub, 5).subscribe(function (data) {
            if (data.results && data.results.length > 0) {
                var resultContract = data.results[0] ? data.results[0] : '';
                var resultPremise = data.results[1] ? data.results[1] : '';
                var resultProduct = data.results[2] ? data.results[2] : '';
                var resultAcount = data.results[3] ? data.results[3] : '';
                var resultEmployee = data.results[4] ? data.results[4] : '';
                var resultInvoiceGroup = data.results[5] ? data.results[5] : '';
                var resultTaxCode = data.results[6] ? data.results[6] : '';
                var resultCreditReason = data.results[7] ? data.results[7] : '';
                var resultDiscount = data.results[8] ? data.results[8] : '';
                var resultProducedCompany = data.results[9] ? data.results[9] : '';
                if (resultContract[0]) {
                    _this.contractFormGroup.controls['ContractName'].setValue(resultContract[0].ContractName);
                    _this.contractFormGroup.controls['InvoiceFrequencyCode'].setValue(resultContract[0].InvoiceFrequencyCode);
                    _this.contractFormGroup.controls['InvoiceAnnivDate'].setValue(_this.utils.formatDate(resultContract[0].InvoiceAnnivDate));
                }
                if (resultPremise[0])
                    _this.contractFormGroup.controls['PremiseName'].setValue(resultPremise[0].PremiseName);
                if (resultProduct[0])
                    _this.contractFormGroup.controls['ProductDesc'].setValue(resultProduct[0].ProductDesc);
                if (resultAcount[0])
                    _this.contractFormGroup.controls['AccountName'].setValue(resultAcount[0].AccountName);
                if (resultEmployee[0])
                    _this.formGroup.typeA.controls['EmployeeSurname'].setValue(resultEmployee[0].EmployeeSurname);
                if (resultInvoiceGroup[0])
                    _this.formGroup.typeA.controls['InvoiceGroupDesc'].setValue(resultInvoiceGroup[0].InvoiceGroupDesc);
                if (resultTaxCode[0])
                    _this.formGroup.typeA.controls['TaxCodeDesc'].setValue(resultTaxCode[0].TaxCodeDesc);
                if (resultCreditReason[0])
                    _this.formGroup.typeA.controls['InvoiceCreditReasonDesc'].setValue(resultCreditReason[0].InvoiceCreditReasonDesc);
                if (resultDiscount[0])
                    _this.formGroup.typeA.controls['DiscountDesc'].setValue(resultDiscount[0].DiscountDesc);
                if (resultProducedCompany[0])
                    _this.formGroup.typeA.controls['ProducedCompanyDesc'].setValue(resultProducedCompany[0].CompanyDesc);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataChargeMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.search.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.search, data);
    };
    ProRataChargeMaintenanceComponent.prototype.invoiceCreditReasonCodeOndeactivate = function () {
        var _this = this;
        this.queryRequest.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryRequest.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryRequest.set(this.serviceConstants.Action, '6');
        this.queryRequest.set('InvoiceCreditReasonCode', this.formGroupData.InvoiceCreditReasonCode);
        var formData = {};
        formData['Function'] = 'GetInvoiceCreditReasonDetails';
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryRequest, formData).subscribe(function (e) {
            if (e.InvoiceCreditReasonDesc)
                _this.formGroup.typeA.controls['InvoiceCreditReasonDesc'].setValue(e.InvoiceCreditReasonDesc);
            if (e.CreditMissedServiceInd)
                _this.formGroup.typeA.controls['CreditMissedServiceInd'].setValue(_this.utils.convertResponseValueToCheckboxInput(e.CreditMissedServiceInd));
        }, function (error) {
            _this.errorService.emitError(error);
            return;
        });
    };
    ProRataChargeMaintenanceComponent.prototype.getDefaults = function () {
        var _this = this;
        this.querySearchParams = new URLSearchParams();
        this.querySearchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySearchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySearchParams.set(this.serviceConstants.Action, '6');
        var formData = {};
        formData['ServiceCoverRowID'] = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ServiceCoverRowID');
        formData['InvoiceCreditCode'] = this.formGroup.typeA.controls['InvoiceCreditCode'].value;
        formData['Function'] = 'GetDefaults';
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.querySearchParams, formData).subscribe(function (defaults) {
            if (defaults) {
                if (_this.formGroup.typeA.controls['EmployeeSurname'])
                    _this.formGroup.typeA.controls['EmployeeSurname'].setValue(defaults.EmployeeSurname);
                if (_this.formGroup.typeA.controls['InvoiceAnnivDate'])
                    _this.contractFormGroup.controls['InvoiceAnnivDate'].setValue(_this.utils.formatDate(defaults.InvoiceAnnivDate));
                if (_this.formGroup.typeA.controls['InvoiceFrequencyCode'])
                    _this.contractFormGroup.controls['InvoiceFrequencyCode'].setValue(defaults.InvoiceFrequencyCode);
                if (_this.formGroup.typeA.controls['InvoiceGroupDesc'])
                    _this.formGroup.typeA.controls['InvoiceGroupDesc'].setValue(defaults.InvoiceGroupDesc);
                if (_this.formGroup.typeA.controls['InvoiceGroupNumber'])
                    _this.formGroup.typeA.controls['InvoiceGroupNumber'].setValue(defaults.InvoiceGroupNumber);
                if (_this.formGroup.typeA.controls['ProRataChargeStatusDesc'])
                    _this.formGroup.typeA.controls['ProRataChargeStatusDesc'].setValue(defaults.ProRataChargeStatusDesc);
                if (_this.formGroup.typeA.controls['ProRataChargeStatusCode'])
                    _this.formGroup.typeA.controls['ProRataChargeStatusCode'].setValue(defaults.ProRataChargeStatusCode);
                if (_this.formGroup.typeA.controls['ServiceQuantity'])
                    _this.formGroup.typeA.controls['ServiceQuantity'].setValue(defaults.ServiceQuantity);
                if (_this.formGroup.typeA.controls['ServiceSalesEmployee'])
                    _this.formGroup.typeA.controls['ServiceSalesEmployee'].setValue(defaults.ServiceSalesEmployee);
                if (_this.formGroup.typeA.controls['TaxCode'])
                    _this.formGroup.typeA.controls['TaxCode'].setValue(defaults.TaxCode);
                if (_this.formGroup.typeA.controls['TaxCodeDesc'])
                    _this.formGroup.typeA.controls['TaxCodeDesc'].setValue(defaults.TaxCodeDesc);
                _this.formGroup.branchNumber = defaults.ServiceBranchNumber;
                _this.formGroup.proRataChargeStatusCode = defaults.ProRataChargeStatusCode;
                _this.store.dispatch({ type: ContractActionTypes.FORM_GROUP_PRORATA, payload: _this.formGroup });
            }
        }, function (error) {
            _this.errorService.emitError(error);
            return;
        });
    };
    ProRataChargeMaintenanceComponent.prototype.getDefaultDiscountCode = function () {
        var _this = this;
        this.queryRequest = new URLSearchParams();
        this.queryRequest.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryRequest.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryRequest.set(this.serviceConstants.Action, '6');
        var formData = {};
        formData['Function'] = 'GetDefaultDiscountCode';
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryRequest, formData).subscribe(function (defaultDiscountCode) {
            if (_this.formGroup.typeA.controls['DiscountCode'])
                _this.formGroup.typeA.controls['DiscountCode'].setValue(defaultDiscountCode.DiscountCode);
            if (_this.formGroup.typeA.controls['DiscountDesc'])
                _this.formGroup.typeA.controls['DiscountDesc'].setValue(defaultDiscountCode.DiscountDesc);
        }, function (error) {
            _this.errorService.emitError(error);
            return;
        });
    };
    ProRataChargeMaintenanceComponent.prototype.getTaxInvoiceNumber = function () {
        var _this = this;
        if (this.blnSCEnableDiscountCode) {
            this.queryRequest.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryRequest.set(this.serviceConstants.Action, '6');
            this.queryRequest.set('OriginalInvoiceNumber', this.formGroupData.InvoiceCreditReasonCode);
            this.queryRequest.set('OriginalCompanyInvoiceNumber', this.formGroupData.InvoiceCreditReasonCode);
            this.queryRequest.set('OriginalCompanyCode', this.formGroupData.InvoiceCreditReasonCode);
            this.queryRequest.set('InvoiceCreditReasonCode', this.formGroupData.InvoiceCreditReasonCode);
            var formData = {};
            formData['Function'] = 'GetTaxInvoiceNumber';
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryRequest, formData).subscribe(function (e) {
                if (e.TaxInvoiceNumber) {
                    _this.formGroup.controls['TaxInvoiceNumber'].setValue(e.TaxInvoiceNumber);
                }
                else {
                    _this.formGroup.controls['TaxInvoiceNumber'].setValue('');
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ProRataChargeMaintenanceComponent.prototype.cancelProRataChargeMaintenance = function () {
        switch (this.inputParamsProRata.parentMode) {
            case 'ServiceCoverAdd':
                this.updateMode = false;
                this.addMode = true;
                this.formGroup.typeA.reset();
                this.formGroup.typeB.reset();
                this.riMaintenanceBeforeAddMode();
                break;
            default:
                this.setFormData();
                this.doLookupTab();
                this.invoiceCreditReasonCodeOndeactivate();
        }
    };
    ProRataChargeMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.routeSubscription)
            this.routeSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    };
    ProRataChargeMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAProRataChargeMaintenance.html',
                    providers: [ErrorService, MessageService, ComponentInteractionService]
                },] },
    ];
    ProRataChargeMaintenanceComponent.ctorParameters = [
        { type: ComponentInteractionService, },
        { type: RiExchange, },
        { type: Store, },
        { type: ActivatedRoute, },
        { type: FormBuilder, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: SysCharConstants, },
        { type: Utils, },
        { type: NgZone, },
        { type: AuthService, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: ActivatedRoute, },
        { type: Logger, },
        { type: RouteAwayGlobals, },
    ];
    ProRataChargeMaintenanceComponent.propDecorators = {
        'proRataMaintenanceTabs': [{ type: ViewChild, args: ['proRataMaintenanceTabs',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ProRataChargeMaintenanceComponent;
}());
