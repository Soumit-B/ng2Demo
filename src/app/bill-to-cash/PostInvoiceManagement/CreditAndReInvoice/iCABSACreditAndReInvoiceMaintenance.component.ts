import * as moment from 'moment';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { ContractActionTypes } from './../../../actions/contract';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { ScreenNotReadyComponent } from '../../../../shared/components/screenNotReady';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { Observable } from 'rxjs';
import { BCompanySearchComponent } from './../../../internal/search/iCABSBCompanySearch';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { InvoiceSearchComponent } from './../../../internal/search/iCABSInvoiceSearch.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { CommonDropdownComponent } from './../../../../shared/components/common-dropdown/common-dropdown.component';

@Component({
    templateUrl: 'iCABSACreditAndReInvoiceMaintenance.html',
    styles: [
        `.red-bdr span {border-color: transparent !important;}
        .btn-secondary {
            background: #fff;
            border-radius: 0px;
            border: 1px solid #ffffff !important;
            color: #007dc5;
        }
    `]
})

export class CreditAndReInvoiceMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('bCompanySearchComponent') bCompanySearchComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('promptConfirmModal2') public promptConfirmModal2;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('InvoiceSearchEllipsis') InvoiceSearchEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('invoiceReasonSearch') invoiceReasonSearch: CommonDropdownComponent;

    public pageId: string = '';
    public controls = [{ name: 'CompanyCode', readonly: false, disabled: false, required: false },
    { name: 'CompanyInvoiceNumber', readonly: false, disabled: false, required: true },
    { name: 'AccountNumber', readonly: false, disabled: false, required: false },
    { name: 'InvoiceName', readonly: false, disabled: false, required: false },
    { name: 'InvoiceAddressLine1', readonly: false, disabled: false, required: false },
    { name: 'InvoiceAddressLine2', readonly: false, disabled: false, required: false },
    { name: 'InvoiceAddressLine3', readonly: false, disabled: false, required: false },
    { name: 'InvoiceAddressLine4', readonly: false, disabled: false, required: false },
    { name: 'InvoiceAddressLine5', readonly: false, disabled: false, required: false },
    { name: 'InvoicePostcode', readonly: false, disabled: false, required: false },
    { name: 'ValueExclTax', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency },
    { name: 'TaxValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency },
    { name: 'rsCredit', readonly: false, disabled: false, required: false },
    { name: 'CreditReasonCode', readonly: false, disabled: false, required: true },
    { name: 'CreditReasonDesc', readonly: false, disabled: false, required: false },
    { name: 'rsUseAddress', readonly: false, disabled: false, required: false },
    { name: 'InvoiceReasonCode', readonly: false, disabled: false, required: true },
    { name: 'InvoiceReasonDesc', readonly: false, disabled: false, required: false },
    { name: 'CreditIndividualItems', readonly: false, disabled: false, required: false },
    { name: 'TaxPointDate', readonly: false, disabled: false, required: false },
    { name: 'CreditNarrative', readonly: false, disabled: false, required: true },
    { name: 'AdditionalCreditInfo', readonly: false, disabled: false, required: false },
    { name: 'TaxPointDateHidden', readonly: false, disabled: false, required: false },
    { name: 'CompanyCode', readonly: false, disabled: false, required: true },
    { name: 'CompanyDesc', readonly: false, disabled: false, required: false },
    { name: 'InvoiceNumber', readonly: false, disabled: false, required: false },
    { name: 'ReInvoice', readonly: false, disabled: false, required: false }
    ];
    public invoiceSearchComponent = InvoiceSearchComponent; //TO Do: when the page is available
    public ellipseConfig = {
        bCompanySearchComponent: {
            inputParamsCompanySearch: {
                parentMode: 'LookUp',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode()
            },
            isDisabled: false,
            isRequired: false,
            active: { id: '', text: '' }
        },
        invoiceSearchComponent: {
            inputParams: {
                parentMode: 'CreditReInvoice',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode(),
                companyCode: '',
                CompanyInvoiceNumber: ''
            },
            showCloseButton: true,
            config: {
                ignoreBackdropClick: true
            },
            showHeader: true,
            disabled: false
        }
    };
    public dropdown: any = {
        creditReasonCode: {
            isRequired: true,
            isDisabled: false,
            isTriggerValidate: false,
            params: {
                parentMode: 'LookUp-Credit'
            },
            isActive: {
                id: '',
                text: ''
            },
            displayFields: ['InvoiceCreditReasonLang.InvoiceCreditReasonCode', 'InvoiceCreditReasonLang.InvoiceCreditReasonDesc']
        },
        invoiceReasonCode: {
            isRequired: true,
            isDisabled: false,
            isTriggerValidate: false,
            params: {
                parentMode: 'LookUp-Invoice'
            },
            isActive: {
                id: '',
                text: ''
            },
            displayFields: ['InvoiceCreditReasonLang.InvoiceCreditReasonCode', 'InvoiceCreditReasonLang.InvoiceCreditReasonDesc']
        }
    };
    public invoiceSearchComponentDataReceived(eventObj: any): any {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', eventObj);
        this.lookupSearch('InvoiceNumberReceived');
    }
    public promptConfig = {
        forSave: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: MessageConstant.Message.ConfirmRecord
        },
        promptFlag: 'save',
        config: {
            ignoreBackdropClick: true
        },
        afterSave: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: ''
        },
        forSave2: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: MessageConstant.Message.ConfirmRecord
        }
    };
    public messageModalConfig = {
        showMessageHeader: true,
        config: {
            ignoreBackdropClick: true
        },
        title: '',
        content: '',
        showCloseButton: true
    };
    public pageVariables = {
        CompanyCode: '',
        CompanyDesc: '',
        savecancelFlag: true,
        isRequesting: false,
        saveMode: true,
        addMode: false,
        requiredStatus: false,
        requiredFormControlsObj: { 'CompanyCode': false, 'CompanyInvoiceNumber': false },
        requiredFormControlsAfterSave: { 'CreditReasonCode': false, 'CreditNarrative': false },
        saved: false,
        saveClicked: false,
        saveClickedAfter: false,
        TaxPointDate: new Date(),
        CompanyCodeDefault: {
            'id': '',
            'text': ''
        }
    };
    public pageDisableFlag = {
        mandatoryFieldsEnableFlag: false, //Enable update mode from begening as per IUI-7513
        CreditIndividualItems: false
    };
    public pageDisplayFlag = {
        InvoiceReasonCode: false,
        TaxPointDate: false,
        CompanyCode: true
    };
    public uiFormValueChanges: any;
    public companySearchdataReceived(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', eventObj.CompanyCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', eventObj.CompanyDesc);
        this.ellipseConfig.invoiceSearchComponent.inputParams.companyCode = eventObj.CompanyCode;
        this.cbbService.disableComponent(true);
        if (this.pageVariables.requiredFormControlsObj.hasOwnProperty('CompanyCode'))
            this.pageVariables.requiredFormControlsObj['CompanyCode'] = false;
    }
    public xhrParams = {
        method: 'bill-to-cash/maintenance',
        module: 'invoicing',
        operation: 'Application/iCABSACreditAndReInvoiceMaintenance'
    };

    public screenNotReadyComponent = ScreenNotReadyComponent;
    public sysCharParams = {
        vSCEnableCompanyCode: '',
        vSCEnableInvoiceTaxPointRules2: ''
    };
    public sysCharArr = [];
    public querySysChar: URLSearchParams = new URLSearchParams();

    public tempFormdata = {};

    public invoiceReasonSearchColumns: Array<string> = ['SuspendReasonCode', 'SuspendReasonDesc'];
    public inputParamsInvoiceReasonSearchhDropdown: any = {
        operation: 'Business/iCABSBSuspendReasonSearch',
        module: 'suspension',
        method: 'contract-management/search'
    };


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACREDITANDREINVOICEMAINTENANCE;
        this.browserTitle = 'Credit and Re-Invoice Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Invoice';
        this.initForm();
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe((value: any) => {
            this.formChanges(value);
        });
        this.triggerFetchSysChar(false, true);
        this.lookupSearch('defaultCompanyCode');
        this.resetRadios();
        this.pageVariables.TaxPointDate = null;
    }

    ngAfterViewInit(): void {
        if (localStorage.getItem('navFromCreditReinvoiceToGrid')) {
            if (localStorage.getItem('navFromCreditReinvoiceToGrid') === 'false') {
                this.populateUIFromFormData();
                this.uiForm.controls['CreditIndividualItems'].setValue(true);
                this.ellipseConfig.bCompanySearchComponent.active.id = this.uiForm.controls['CompanyCode'].value;
                this.ellipseConfig.bCompanySearchComponent.active.text = this.uiForm.controls['CompanyDesc'].value;
                let active = { id: this.uiForm.controls['CompanyCode'].value, text: this.uiForm.controls['CompanyDesc'].value };
                this.bCompanySearchComponent.active = active;
                localStorage.removeItem('navFromCreditReinvoiceToGrid');
            }
        }
    }

    public setSysChars(): any {
        if (this.sysCharParams['vSCEnableCompanyCode'].toString() === 'true') {
            this.pageDisplayFlag.CompanyCode = true;
        } else {
            this.pageDisplayFlag.CompanyCode = false;
        }
        if (this.sysCharParams['vSCEnableInvoiceTaxPointRules2'].toString() === 'true') {
            this.pageDisplayFlag.TaxPointDate = true;
        } else {
            this.pageDisplayFlag.TaxPointDate = false;
        }
    }
    public onSysCharDataReceive(e: any): void {
        if (e.records && e.records.length > 0) {
            this.sysCharParams['vSCEnableCompanyCode'] = e.records[0].Required;
            this.sysCharParams['vSCEnableInvoiceTaxPointRules2'] = e.records[1].Required;
        }
        this.setSysChars();
    }
    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }
    public sysCharParameters(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableCompanyCode,
            this.sysCharConstants.SystemCharEnableInvoiceTaxPointRules2
        ];
        return sysCharList.join(',');
    }
    public triggerFetchSysChar(saveModeData: any, returnSubscription: boolean): any {
        let sysCharNumbers = this.sysCharParameters();
        this.fetchSysChar(sysCharNumbers).subscribe((data) => {
            this.onSysCharDataReceive(data);
        });
    }

    public initForm(): void {
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.uiFormValueChanges.unsubscribe();
    }

    public formChanges(obj: any): void {
        if (obj === 'VALID') {
            this.pageVariables.savecancelFlag = false;
        } else {
            this.pageVariables.savecancelFlag = true;
        }
        if (!this.uiForm.pristine)
            this.formValidation();
        if (this.pageVariables.saveClickedAfter)
            this.formValidationAfterSave();
    }

    public lookupSearch(key: string): void {
        switch (key) {
            case 'CompanyInvoiceNumber':
                let flag = this.formValidation('CompanyInvoiceNumber');
                let queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                let lookupQuery: any;
                queryParams.set(this.serviceConstants.Action, '5');
                if (flag === 0) {
                    lookupQuery = [{
                        'table': 'InvoiceHeader',
                        'query': { 'BusinessCode': this.utils.getBusinessCode(), 'Companycode': this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyCode'), 'CompanyInvoiceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyInvoiceNumber') },
                        'fields': ['InvoiceNumber']
                    }];
                    this.pageVariables.isRequesting = true;
                    this.ajaxSource.next(this.ajaxconstant.START);
                    this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                        value => {
                            this.pageVariables.isRequesting = false;
                            let returnDataLength = value.results[0].length;
                            switch (returnDataLength) {
                                case 0:
                                    this.messageModalConfig.content = MessageConstant.Message.RecordNotFound;
                                    this.messageModal.show();
                                    break;
                                case 1:
                                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                                    this.pageVariables.isRequesting = false;
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', value.results[0][0].InvoiceNumber);
                                    this.lookupSearch('InvoiceNumberReceived');
                                    break;
                                case 2:
                                    this.ellipseConfig.invoiceSearchComponent.inputParams.CompanyInvoiceNumber = this.uiForm.controls['CompanyInvoiceNumber'].value;
                                    this.InvoiceSearchEllipsis.openModal();
                                    break;
                                default:
                                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                                    this.pageVariables.isRequesting = false;
                                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', value.results[0][0].InvoiceNumber);
                                    this.lookupSearch('InvoiceNumberReceived');
                                    //TO DO: when invoice search is available
                                    // this.ellipseConfig.invoiceSearchComponent.inputParams['CompanyInvoiceNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyInvoiceNumber');
                                    // this.ellipseConfig.invoiceSearchComponent.inputParams['CompanyCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyCode');
                                    break;
                            }
                        },
                        error => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            this.pageVariables.isRequesting = false;
                        },
                        () => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            this.pageVariables.isRequesting = false;
                        }
                    );
                }
                break;
            case 'InvoiceNumberReceived':
                let searchPost = new URLSearchParams();
                let postParams: any = {};
                postParams['InvoiceNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
                postParams['Function'] = 'GetInvoiceDetailsFromCompanyInvoice';
                postParams['methodtype'] = 'maintenance';
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
                    this.xhrParams.operation, searchPost, postParams)
                    .subscribe(
                    (e) => {
                        this.pageVariables.isRequesting = false;
                        if (e['status'] === 'failure') {
                            this.errorService.emitError(e['oResponse']);
                        } else {
                            if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                                this.errorService.emitError(e['oResponse']);
                            } else if (e['errorMessage']) {
                                this.errorService.emitError(e);
                            } else {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', e['AccountNumber']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', e['CompanyCode']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyInvoiceNumber', e['CompanyInvoiceNumber']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceAddressLine1', e['InvoiceAddressLine1']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceAddressLine2', e['InvoiceAddressLine2']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceAddressLine3', e['InvoiceAddressLine3']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceAddressLine4', e['InvoiceAddressLine4']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceAddressLine5', e['InvoiceAddressLine5']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceName', e['InvoiceName']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', e['InvoiceNumber']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoicePostCode', e['InvoicePostCode']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxPointDateHidden', e['TaxPointDate']);
                                let serviceCommenceDateDisplay = '';
                                if (moment(e['TaxPointDate'], 'DD/MM/YYYY', true).isValid()) {
                                    serviceCommenceDateDisplay = this.utils.convertDateString(e['TaxPointDate']);
                                }
                                if (!serviceCommenceDateDisplay) {
                                    this.pageVariables.TaxPointDate = null;
                                } else {
                                    this.pageVariables.TaxPointDate = new Date(serviceCommenceDateDisplay);
                                }
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxValue', e['TaxValue']);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'ValueExclTax', e['ValueExclTax']);
                            }
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    );
                break;
            case 'CheckSaveFormData':
                searchPost = new URLSearchParams();
                postParams = {};
                postParams['InvoiceNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
                postParams['Function'] = 'CheckInvoiceCredit';
                postParams['methodtype'] = 'maintenance';
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.pageVariables.isRequesting = true;
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
                    this.xhrParams.operation, searchPost, postParams)
                    .subscribe(
                    (e) => {
                        this.pageVariables.isRequesting = false;
                        if (e.hasOwnProperty('ErrorMessageDesc')) {
                            let msg = e['ErrorMessageDesc'];
                            if (msg !== '') {
                                this.promptConfig.promptFlag = 'afterSave';
                                this.promptConfig.forSave.promptConfirmContent = msg;
                                this.promptConfirmModal.show();
                            } else {
                                this.afterSaveCheckFormMessagesAndSave();
                            }
                        } else {
                            this.afterSaveCheckFormMessagesAndSave();
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    );
                break;
            case 'SaveFormData':
                searchPost = new URLSearchParams();
                let allFormData = this.uiForm.value;
                postParams = {};
                postParams['CompanyInvoiceNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
                postParams['InvoiceNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
                postParams['CreditIndividualItems'] = this.utils.convertCheckboxValueToRequestValue('CreditIndividualItems');
                postParams['CreditReasonCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CreditReasonCode');
                postParams['ReInvoice'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ReInvoice');
                postParams['InvoiceReasonCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceReasonCode');
                postParams['CreditNarrative'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'CreditNarrative');
                postParams['TaxPointDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxPointDateHidden');
                postParams['AdditionalCreditInfo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AdditionalCreditInfo');
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'rsUseAddress') === '0') {
                    postParams['UseAddress'] = 'new';
                } else {
                    postParams['UseAddress'] = 'old';
                }
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '1');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.pageVariables.isRequesting = true;
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
                    this.xhrParams.operation, searchPost, postParams)
                    .subscribe(
                    (e) => {
                        this.pageVariables.isRequesting = false;
                        if (e.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                        } else {
                            if (this.uiForm.controls['CreditIndividualItems'].value) {
                                if (this.uiForm.controls['CreditIndividualItems'].value === true) {
                                    let userAddress = false;
                                    if (this.uiForm.controls['rsUseAddress'].value === 1) {
                                        userAddress = true;
                                    }
                                    let urlParams = {
                                        CompanyCode: this.uiForm.controls['CompanyCode'].value,
                                        CompanyDesc: this.uiForm.controls['CompanyDesc'].value,
                                        CompanyInvoiceNumber: this.uiForm.controls['CompanyInvoiceNumber'].value,
                                        InvoiceNumber: this.uiForm.controls['InvoiceNumber'].value,
                                        CreditReasonCode: this.uiForm.controls['CreditReasonCode'].value,
                                        CreditReasonDesc: this.uiForm.controls['CreditReasonDesc'].value,
                                        UseAddress: userAddress
                                    };
                                    localStorage.setItem('navFromCreditReinvoiceToGrid', 'true');
                                    this.navigate('navFromCreditReinvoiceToGrid', '/billtocash/InvoicedAndCreditReporting/CreditAndReInvoiceGrid', urlParams);
                                } else {
                                    this.pageVariables.isRequesting = false;
                                    this.pageVariables.saved = true;
                                    this.messageModalConfig.content = MessageConstant.Message.SavedSuccessfully;
                                    this.messageModal.show();
                                }
                            } else {
                                this.pageVariables.isRequesting = false;
                                this.pageVariables.saved = true;
                                this.messageModalConfig.content = MessageConstant.Message.SavedSuccessfully;
                                this.messageModal.show();
                            }
                            this.tempFormdata = allFormData;
                            this.formPristine();
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    );
                break;
            case 'SearchCreditReasonCode':
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                    'table': 'InvoiceCreditReasonLang',
                    'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': 'ENG', 'InvoiceCreditReasonCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'CreditReasonCode') },
                    'fields': ['InvoiceCreditReasonDesc']
                }];
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                    value => {
                        if (value.results[0])
                            if (value.results[0][0])
                                this.uiForm.controls['CreditReasonDesc'].setValue(value.results[0][0].InvoiceCreditReasonDesc);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    error => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    },
                    () => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    }
                );
                break;
            case 'SearchInvoiceReasonCode':
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                    'table': 'InvoiceCreditReasonLang',
                    'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': 'ENG', 'InvoiceCreditReasonCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceReasonCode') },
                    'fields': ['InvoiceCreditReasonDesc']
                }];
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                    value => {
                        if (value.results[0])
                            if (value.results[0][0])
                                this.uiForm.controls['InvoiceReasonDesc'].setValue(value.results[0][0].InvoiceCreditReasonDesc);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    error => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    },
                    () => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    }
                );
                break;
            case 'defaultCompanyCode':
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                    'table': 'Company',
                    'query': { 'BusinessCode': this.utils.getBusinessCode(), 'DefaultCompanyInd': true },
                    'fields': ['CompanyCode', 'CompanyDesc']
                }];
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                    value => {
                        let returnDataLength = value.results[0].length;
                        if (value.results[0].length > 0) {
                            if (value.results[0][0]) {
                                this.uiForm.controls['CompanyCode'].setValue(value.results[0][0].CompanyCode);
                                this.uiForm.controls['CompanyDesc'].setValue(value.results[0][0].CompanyDesc);
                                this.ellipseConfig.invoiceSearchComponent.inputParams.companyCode = value.results[0][0].CompanyCode;
                            }
                        }
                    },
                    error => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    },
                    () => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    }
                );
                break;
            default:
                break;
        }
    }
    /**
     * Making the lookup API call
     */
    public invokeLookupSearch(queryParams: any, data: any): Observable<any> {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    }

    public actionButtonClicked(key: string): void {
        switch (key) {
            case 'save':
                this.pageVariables.saveClicked = true;
                this.dropdown['invoiceReasonCode']['isTriggerValidate'] = true;
                this.dropdown['creditReasonCode']['isTriggerValidate'] = true;
                if (this.formValidation() === 0) {
                    if (this.uiForm.controls['CreditReasonCode'].value !== null) {
                        if (this.uiForm.controls['CreditReasonCode'].value.trim() !== '') {
                            this.lookupSearch('SearchCreditReasonCode');
                        }
                    }
                    if (this.uiForm.controls['InvoiceReasonCode'].value !== null) {
                        if (this.pageDisplayFlag.InvoiceReasonCode) {
                            if (this.uiForm.controls['InvoiceReasonCode'].value.trim() !== '') {
                                this.lookupSearch('SearchInvoiceReasonCode');
                            }
                        }
                    }
                    //this.promptConfirmModal.show();
                    this.lookupSearch('CheckSaveFormData');
                }
                break;
            case 'cancel':
                let temp = {
                    companyCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyCode'),
                    companyDesc: this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyDesc'),
                    rsCredit: this.uiForm.controls['rsCredit'].value,
                    rsUseAddress: this.uiForm.controls['rsUseAddress'].value
                };
                if (this.pageVariables.saved) {
                    for (let i in this.tempFormdata) {
                        if (this.tempFormdata[i]) {
                            if (this.uiForm.controls[i])
                                this.uiForm.controls[i].setValue(this.tempFormdata[i]);
                            if (this.tempFormdata['rsCredit'] === '1')
                                this.radioOnlick('rsCredit1');
                            else
                                this.radioOnlick('rsCredit2');
                        }
                    }
                }
                else {
                    this.setControlValue('CreditReasonCode', '');
                    this.uiForm.controls['CreditReasonCode'].markAsUntouched();
                    this.setControlValue('CreditReasonDesc', '');
                    this.setControlValue('InvoiceReasonCode', '');
                    this.uiForm.controls['InvoiceReasonCode'].markAsUntouched();
                    this.setControlValue('InvoiceReasonDesc', '');
                    this.setControlValue('CreditNarrative', '');
                    this.uiForm.controls['CreditNarrative'].markAsUntouched();
                    this.setControlValue('AdditionalCreditInfo', '');
                    this.setControlValue('rsCredit', '1');
                    this.radioOnlick('rsCredit1');
                    this.setControlValue('rsUseAddress', '1');
                    this.setControlValue('CreditIndividualItems', false);
                }
                this.pageVariables.saveClicked = false;
                this.pageVariables.saveClickedAfter = false;
                break;
            case 'add':
                //Enable update mode from begening as per IUI-7513
                // this.pageVariables.saveMode = true;
                // this.pageVariables.addMode = false;
                // this.riExchange.riInputElement.Enable(this.uiForm, 'CompanyInvoiceNumber');
                // this.riExchange.riInputElement.Enable(this.uiForm, 'CreditReasonDesc');
                // this.riExchange.riInputElement.Enable(this.uiForm, 'CreditReasonCode');
                // this.riExchange.riInputElement.Enable(this.uiForm, 'CreditNarrative');
                // this.pageDisableFlag.mandatoryFieldsEnableFlag = false;
                break;
            default:
                break;
        }
    }

    public formValidation(keyName?: any): any {
        let status = 0;
        if (keyName) {
            if (this.uiForm.controls[keyName].value === null) {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            } else if (this.uiForm.controls[keyName].value.trim() === '') {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            } else {
                if (keyName === 'CompanyInvoiceNumber') {
                    if (isNaN(this.uiForm.controls[keyName].value)) {
                        this.pageVariables.requiredFormControlsObj[keyName] = true;
                        status = 1;
                    } else {
                        this.pageVariables.requiredFormControlsObj[keyName] = false;
                    }
                } else {
                    this.pageVariables.requiredFormControlsObj[keyName] = false;
                }
            }
        } else {
            if (this.pageVariables.saveClicked) {
                for (let key in this.pageVariables.requiredFormControlsObj) {
                    if (key) {
                        if (this.uiForm.controls[key].value === null) {
                            this.pageVariables.requiredFormControlsObj[key] = true;
                            status = 1;
                        } else if (this.uiForm.controls[key].value.trim() === '') {
                            this.pageVariables.requiredFormControlsObj[key] = true;
                            status = 1;
                        } else {
                            if (key === 'CompanyInvoiceNumber') {
                                if (isNaN(this.uiForm.controls[key].value)) {
                                    this.pageVariables.requiredFormControlsObj[key] = true;
                                    status = 1;
                                } else {
                                    this.pageVariables.requiredFormControlsObj[key] = false;
                                }
                            } else {
                                this.pageVariables.requiredFormControlsObj[key] = false;
                            }
                        }
                        if (this.pageVariables.requiredFormControlsObj[key] === true) {
                            if (key === 'CompanyCode') {
                                document.querySelector('.ui-select-match .ui-select-toggle')['style'].border = '0px';
                            }
                            status = 1;
                        }
                    }
                }
            }
        }
        return status;
    }

    public formValidationAfterSave(): any {
        let status = 0;
        /*if (this.pageVariables.saveClickedAfter) {*/
        if (this.pageDisplayFlag.InvoiceReasonCode) {
            this.pageVariables.requiredFormControlsAfterSave['InvoiceReasonCode'] = false;
        }
        for (let key in this.pageVariables.requiredFormControlsAfterSave) {
            if (key) {
                if (this.uiForm.controls[key].value === null) {
                    this.pageVariables.requiredFormControlsAfterSave[key] = true;
                    status = 1;
                } else if (this.uiForm.controls[key].value.trim() === '') {
                    this.pageVariables.requiredFormControlsAfterSave[key] = true;
                    status = 1;
                } else {
                    if ((key === 'InvoiceReasonCode') || (key === 'CreditReasonCode')) {
                        if (isNaN(this.uiForm.controls[key].value)) {
                            this.pageVariables.requiredFormControlsAfterSave[key] = true;
                            status = 1;
                        } else {
                            this.pageVariables.requiredFormControlsAfterSave[key] = false;
                        }
                    } else {
                        this.pageVariables.requiredFormControlsAfterSave[key] = false;
                    }
                }
            }
        }
        /*}*/
        return status;
    }

    public formValidationMakeDescBlank(): void {
        for (let key in this.pageVariables.requiredFormControlsAfterSave) {
            if (this.pageVariables.requiredFormControlsAfterSave[key]) {
                if (key === 'CreditReasonCode') {
                    this.uiForm.controls['CreditReasonDesc'].setValue('');
                }
                if (key === 'InvoiceReasonCode') {
                    this.uiForm.controls['InvoiceReasonDesc'].setValue('');
                }
            }
        }
    }

    public invoiceReasonCodeMsg(): void {
        if (this.pageDisplayFlag.InvoiceReasonCode) {
            if (!this.uiForm.controls['InvoiceReasonCode'].value) {
                if (this.uiForm.controls['InvoiceReasonCode'].value.trim() === '') {
                    this.messageModalConfig.content = MessageConstant.PageSpecificMessage.invoiceReasonCodeAbsentError;
                    this.messageModal.show();
                }
            }
        }
    }
    public afterSaveCheckFormMessagesAndSave(): void {
        let formVal = this.formValidationAfterSave(); //IUI-9712
        let formVal2 = this.formValidation();
        this.invoiceReasonCodeMsg();//IUI-9712
        if ((formVal === 0) && (formVal2 === 0)) {
            this.zone.run(() => {
                this.promptConfig.promptFlag = 'afterSaveProcess';
                this.promptConfig.forSave2.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                this.promptConfirmModal2.show();
            });
        }
    }
    public promptConfirm(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                this.lookupSearch('CheckSaveFormData');
                break;
            case 'afterSave':
                this.afterSaveCheckFormMessagesAndSave();
                this.formValidationMakeDescBlank();
                break;
            default:
                break;
        }
    }
    public promptConfirm2(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'afterSaveProcess':
                this.lookupSearch('SaveFormData');//IUI-9712
                this.resetPrompt();
                break;
            default:
                break;
        }
    }

    public promptCancel(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            case 'afterSave':
                let formVal = this.formValidationAfterSave(); //IUI-9712
                this.resetPrompt();
                break;
            default:
                break;
        }
    }
    public promptCancel2(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'afterSaveProcess':
                this.resetPrompt();
                break;
            default:
                break;
        }
    }

    public radioOnlick(eventObj: any): void {
        switch (eventObj) {
            case 'rsCredit1':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ReInvoice', 'no');
                this.riExchange.riInputElement.Enable(this.uiForm, 'CreditReasonCode');
                //this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceReasonCode'); //IUI-7512
                //this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceReasonDesc'); //IUI-7512
                this.pageDisplayFlag.InvoiceReasonCode = false; //IUI-7512
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceReasonCode', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CreditReasonCode', true);
                this.uiForm.controls['CreditIndividualItems'].enable();
                break;
            case 'rsCredit2':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ReInvoice', 'yes');
                this.riExchange.riInputElement.Enable(this.uiForm, 'CreditReasonCode');
                //this.riExchange.riInputElement.Enable(this.uiForm, 'InvoiceReasonCode'); //IUI-7512
                //this.riExchange.riInputElement.Enable(this.uiForm, 'InvoiceReasonDesc'); //IUI-7512
                this.pageDisplayFlag.InvoiceReasonCode = true; //IUI-7512
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceReasonCode', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CreditReasonCode', true);
                this.uiForm.controls['CreditIndividualItems'].disable();
                break;
            default:
                break;
        }
    }

    public resetRadios(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'rsCredit', '1');
        //this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceReasonCode');
        //this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceReasonDesc');
        this.pageDisplayFlag.InvoiceReasonCode = false;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceReasonCode', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceReasonDesc', false);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'rsUseAddress', '1');
    }

    public resetPrompt(): void {
        this.promptConfig.promptFlag = 'save';
        this.promptConfig.forSave.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
    }

    public messageModalClose(): void {
        //console.log('close');
    }

    public oniCABSBSuspendReasonSearchDataRecieved(data: any): void {
        if (data) {
            this.setControlValue('InvoiceReasonCode', data['InvoiceCreditReasonLang.InvoiceCreditReasonCode']);
            this.setControlValue('InvoiceReasonDesc', data['InvoiceCreditReasonLang.InvoiceCreditReasonDesc']);
            this.dropdown['invoiceReasonCode']['isTriggerValidate'] = false;
        }
    }

    public onCreditReasonDataRecieved(data: any): void {
        if (data) {
            this.setControlValue('CreditReasonCode', data['InvoiceCreditReasonLang.InvoiceCreditReasonCode']);
            this.setControlValue('CreditReasonDesc', data['InvoiceCreditReasonLang.InvoiceCreditReasonDesc']);
            this.dropdown['creditReasonCode']['isTriggerValidate'] = false;
        }
    }
}
