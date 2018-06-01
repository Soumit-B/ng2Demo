import * as moment from 'moment';
import { LocalStorageService } from 'ng2-webstorage';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from './../search/iCABSBEmployeeSearch';
import { PaymentSearchComponent } from './../search/iCABSBPaymentTypeSearch';
import { InvoiceFrequencySearchComponent } from './../search/iCABSBBusinessInvoiceFrequencySearch';
import { PageIdentifier } from '../../base/PageIdentifier';
import { Component, OnInit, ViewChild, Injector, OnDestroy, ChangeDetectorRef, Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Observable } from 'rxjs/Rx';
import { ContractDurationComponent } from './../search/iCABSBContractDurationSearch';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
import { AppModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from '../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSSdlContractMaintenance.html',
    styles: [`
    :host /deep/ .red-bdr .btn.btn-default.btn-secondary.form-control.ui-select-toggle {
        border: transparent;
    }
  `]
})

export class DlContractMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('contractDurationDropDown') contractDurationDropDown;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('messageModal') public messageModal;
    public showMessageHeaderSave: boolean = true;
    public showMessageHeader: boolean = true;
    // Prompt Modal Model Properties
    public showPromptMessageHeader: boolean = true;
    public promptConfirmTitle: string;
    public promptConfirmContent: string;
    public backLinkText: string;
    public pageParentMode = '';

    public inputParamsContractDuration = {
        parentMode: 'LookUp-Contract',
        businessCode: this.utils.getBusinessCode(),
        countryCode: this.utils.getCountryCode(),
        validForNewContract: true
    };
    public contractDurationActive = {
        'id': '1',
        'text': '1 - Month'
    };
    public receivedcontractDuration(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationCode', eventObj.ContractDurationCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationDesc', eventObj.ContractDurationDesc);
        this.CalculateExpiryDate();
    }
    public pageId: string = '';
    public controls = [
        { name: 'dlContractRef', readonly: false, disabled: false, required: false },
        { name: 'ContractTypeCode', readonly: false, disabled: false, required: false },
        { name: 'dlStatusCode', readonly: false, disabled: false, required: false },
        { name: 'dlStatusDesc', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeValue1', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeValue2', readonly: false, disabled: false, required: false },
        { name: 'ContractName', readonly: false, disabled: false, required: true },
        { name: 'ContractAddressLine1', readonly: false, disabled: false, required: true },
        { name: 'ContractAddressLine2', readonly: false, disabled: false, required: false },
        { name: 'ContractAddressLine3', readonly: false, disabled: false, required: false },
        { name: 'ContractAddressLine4', readonly: false, disabled: false, required: false },
        { name: 'ContractAddressLine5', readonly: false, disabled: false, required: true },
        { name: 'ContractPostcode', readonly: false, disabled: false, required: true },
        { name: 'ContractContactName', readonly: false, disabled: false, required: true },
        { name: 'ContractContactPosition', readonly: false, disabled: false, required: true },
        { name: 'DecisionMakerInd', readonly: false, disabled: false, required: false },
        { name: 'ContractContactMobile', readonly: false, disabled: false, required: false },
        { name: 'ContractContactTelephone', readonly: false, disabled: false, required: true },
        { name: 'ContractContactFax', readonly: false, disabled: false, required: false },
        { name: 'ContractContactEmail', readonly: false, disabled: false, required: false },
        { name: 'ContractCommenceDate', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'ContinuousInd', readonly: false, disabled: false, required: false },
        { name: 'RenewalInd', readonly: false, disabled: false, required: false },
        { name: 'ContractExpiryDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'InvoiceFrequencyCode', readonly: false, disabled: false, required: false },
        { name: 'InvoiceFrequencyDesc', readonly: false, disabled: false, required: false },
        { name: 'CreditReference', readonly: false, disabled: false, required: false },
        { name: 'AccountNumber', readonly: false, disabled: false, required: false },
        { name: 'AccountName', readonly: false, disabled: false, required: false },
        { name: 'GroupAccountNumber', readonly: false, disabled: false, required: false },
        { name: 'GroupName', readonly: false, disabled: false, required: false },
        { name: 'GroupAccountPriceGroupID', readonly: false, disabled: false, required: false },
        { name: 'GroupAccountPriceGroupDesc', readonly: false, disabled: false, required: false },
        { name: 'CompanyRegistrationNumber', readonly: false, disabled: false, required: false },
        { name: 'CompanyVATNumber', readonly: false, disabled: false, required: false },
        { name: 'NegBranchNumber', readonly: false, disabled: false, required: false },
        { name: 'BranchName', readonly: false, disabled: false, required: false },
        { name: 'ContractSalesEmployee', readonly: false, disabled: false, required: false },
        { name: 'SalesEmployeeSurname', readonly: false, disabled: false, required: false },
        { name: 'EmailInd', readonly: false, disabled: false, required: false },
        { name: 'LetterInd', readonly: false, disabled: false, required: false },
        { name: 'VarianceText', readonly: false, disabled: false, required: false },
        { name: 'AuthorityCode', readonly: false, disabled: false, required: false },
        { name: 'BusinessCode', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeCode', readonly: false, disabled: false, required: false },
        { name: 'ContractDurationCode', readonly: false, disabled: false, required: false },
        { name: 'ContractDurationDesc', readonly: false, disabled: false, required: false },
        { name: 'ContractReference', readonly: false, disabled: false, required: false },
        { name: 'LimitedCompanyInd', readonly: false, disabled: false, required: false },
        { name: 'OriginalContractRenewalDate', readonly: false, disabled: false, required: false },
        { name: 'PaymentDesc', readonly: false, disabled: false, required: false },
        { name: 'PaymentTypeCode', readonly: false, disabled: false, required: false },
        { name: 'QuoteTypeCode', readonly: false, disabled: false, required: false },
        { name: 'ReferenceRequired', readonly: false, disabled: false, required: false },
        { name: 'SalutationName', readonly: false, disabled: false, required: false },
        { name: 'UpdateableInd', readonly: false, disabled: false, required: false },
        { name: 'ValidForClientTypeVal', readonly: false, disabled: false, required: false },
        { name: 'dlApprovalLevel', readonly: false, disabled: false, required: false },
        { name: 'dlBatchRef', readonly: false, disabled: false, required: false },
        { name: 'dlContract', readonly: false, disabled: false, required: false },
        { name: 'dlMasterExtRef', readonly: false, disabled: false, required: false },
        { name: 'dlRejectionCode', readonly: false, disabled: false, required: false },
        { name: 'dlRejectionDesc', readonly: false, disabled: false, required: false },
        { name: 'findResult', readonly: false, disabled: false, required: false },
        { name: 'ContactMobile', readonly: false, disabled: false, required: false },
        { name: 'DisQuoteTypeCode', readonly: false, disabled: false, required: false },
        { name: 'SubSystem', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeCodeSel', readonly: false, disabled: false, required: false },
        { name: 'SalutationNameSel', readonly: false, disabled: false, required: false },
        { name: 'MandateRequired', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeDescription', readonly: false, disabled: false, required: false },
        { name: 'PaymentTypeCodeDefault', readonly: false, disabled: false, required: false },
        { name: 'PaymentTypeDescDefault', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeSalutationInd', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeLabel1', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeLabel2', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeCompanyNoInd', readonly: false, disabled: false, required: false },
        { name: 'ClientTypePrefixText', readonly: false, disabled: false, required: false },
        { name: 'ClientTypeSuffixText', readonly: false, disabled: false, required: false },
        { name: 'DefaultSalutationName', readonly: false, disabled: false, required: false },
        { name: 'PipelineAmendMode', readonly: false, disabled: false, required: false },
        { name: 'CurrentContractType', readonly: false, disabled: false, required: false },
        { name: 'SalutationName', readonly: false, disabled: false, required: false },
        { name: 'menu', readonly: false, disabled: false, required: false }
    ];

    public controlsCopy = {};
    public specialBackupElements = {
        ClientTypeCodeSelBackup: '',
        ClientTypeLabel1: '',
        ClientTypeLabel2: ''
    };

    public tabNameMap: any = {
        General: true,
        SpecialInstructions: false
    };

    public tabValidationObj = {
        General: false,
        SpecialInstructions: false,
        SaveClickFlag: false,
        GeneralTab: {
            ContractName: { required: true, isValid: true },
            ContractAddressLine1: { required: true, isValid: true },
            ContractAddressLine4: { required: true, isValid: true },
            ContractAddressLine5: { required: true, isValid: true },
            ContractPostcode: { required: true, isValid: true },
            ContractContactTelephone: { required: true, isValid: true },
            ContractContactPosition: { required: true, isValid: true },
            ContractAddressLine3: { required: false, isValid: true }
        },
        SpecialInstructionsTab: {
            ContractCommenceDate: { required: true, isValid: true },
            ContractDurationCode: { required: false, isValid: true },
            CompanyVATNumber: { required: false, isValid: true }
        },
        NonRequiredFields: {
            InvoiceFrequencyCode: { required: true, isValid: true, tabName: 'SpecialInstructions' }
        },
        SectionMiddleFields: {
            ClientTypeValue1: { required: false, isValid: true },
            ClientTypeCodeSel: { required: false, isValid: true }
        }
    };
    public tabValidationObjCopy: any;

    public validateFormValues(key: any, type: any, special?: true): boolean {
        let statusGeneral = 1;
        let statusSpecial = 1;
        let returnFlag = true;
        if (special) {
            if (type === 'number') {
                if (isNaN(this.uiForm.controls[key].value)) {
                    this.tabValidationObj.NonRequiredFields[key].isValid = false;
                    this.tabValidationObj[this.tabValidationObj.NonRequiredFields[key].tabName] = true;
                } else {
                    this.tabValidationObj.NonRequiredFields[key].isValid = true;
                    this.tabValidationObj[this.tabValidationObj.NonRequiredFields[key].tabName] = false;
                }
            }
            return returnFlag;
        }
        if (this.tabValidationObj.SaveClickFlag) {
            if (key === 'all' && type === 'normal') {
                for (let keyGeneral in this.tabValidationObj.GeneralTab) {
                    if (this.tabValidationObj.GeneralTab[keyGeneral].required) {
                        if (this.uiForm.controls[keyGeneral].value === '') {
                            this.tabValidationObj.GeneralTab[keyGeneral].isValid = false;
                            statusGeneral = 0;
                        } else {
                            this.tabValidationObj.GeneralTab[keyGeneral].isValid = true;
                        }
                    }
                }
                for (let keySpecial in this.tabValidationObj.SpecialInstructionsTab) {
                    if (this.tabValidationObj.SpecialInstructionsTab[keySpecial].required) {
                        if (this.uiForm.controls[keySpecial].value === '') {
                            this.tabValidationObj.SpecialInstructionsTab[keySpecial].isValid = false;
                            statusSpecial = 0;
                        } else {
                            this.tabValidationObj.SpecialInstructionsTab[keySpecial].isValid = true;
                        }
                    }
                }
                if (statusGeneral === 0) {
                    this.tabValidationObj.General = true;
                } else {
                    this.tabValidationObj.General = false;
                }
                if (statusSpecial === 0) {
                    this.tabValidationObj.SpecialInstructions = true;
                } else {
                    this.tabValidationObj.SpecialInstructions = false;
                }

                for (let keyMiddleSec in this.tabValidationObj.SectionMiddleFields) {
                    if (this.uiDisplayFlag.ClientTypeValue1) {
                        if (this.uiForm.controls['ClientTypeLabel1'].value !== '') {
                            if (this.uiForm.controls['ClientTypeValue1'].value === '') {
                                this.tabValidationObj.SectionMiddleFields.ClientTypeValue1.isValid = false;
                                statusGeneral = 0;
                            }
                        }
                    } else {
                        if (this.tabValidationObj.SectionMiddleFields[keyMiddleSec].required) {
                            if (this.uiForm.controls[keyMiddleSec].value === '') {
                                this.tabValidationObj.SectionMiddleFields[keyMiddleSec].isValid = false;
                                statusSpecial = 0;
                            } else {
                                this.tabValidationObj.SectionMiddleFields[keyMiddleSec].isValid = true;
                            }
                        }
                    }
                }

                //SectionMiddleFields: {
                //     ClientTypeValue1: { required: false, isValid: true },
                //     ClientTypeCodeSel: { required: false, isValid: true }
                // }

                if ((statusGeneral === 0) || (statusSpecial === 0)) {
                    returnFlag = false;
                } else {
                    returnFlag = true;
                }
            }
        }
        return returnFlag;
    }

    public pageLoadData: any;

    public search: URLSearchParams;

    public sysCharParams = {
        vBusinessCode: '',
        vSCEnableAddressLine3: '',
        vSCAddressLine3Logical: '',
        vSCEnableMaxAddress: '',
        vSCEnableMaxAddressValue: '',
        vDisableFieldList: '',
        vSCEnableHopewiserPAF: '',
        vSCEnableDatabasePAF: '',
        vSCAddressLine4Required: '',
        vSCAddressLine5Required: '',
        vSCAddressLine5Logical: '',
        vSCPostCodeRequired: '',
        vSCPostCodeMustExistInPAF: '',
        vSCRunPAFSearchOn1stAddressLine: '',
        vSCClientTypeValidation: '',
        vSCVatRegMandatory: '',
        vDefaultCountryCode: ''
    };

    public uiDisplayFlag = {
        dlContractRef: true,
        ContractTypeCode: true,
        dlStatusCode: true,
        dlStatusDesc: true,
        ClientTypeValue1: true,
        ClientTypeValue2: true,
        ContractName: true,
        ContractAddressLine1: true,
        ContractAddressLine2: true,
        ContractAddressLine3: true,
        ContractAddressLine4: true,
        ContractAddressLine5: true,
        ContractPostcode: true,
        ContractContactName: true,
        ContractContactPosition: true,
        DecisionMakerInd: true,
        ContractContactMobile: true,
        ContractContactTelephone: true,
        ContractContactFax: true,
        ContractContactEmail: true,
        ContractCommenceDate: true,
        ContinuousInd: true,
        RenewalInd: true,
        ContractExpiryDate: true,
        InvoiceFrequencyCode: true,
        InvoiceFrequencyDesc: true,
        CreditReference: true,
        AccountNumber: true,
        AccountName: true,
        GroupAccountNumber: true,
        GroupName: true,
        GroupAccountPriceGroupID: true,
        GroupAccountPriceGroupDesc: true,
        CompanyRegistrationNumber: true,
        CompanyVATNumber: true,
        NegBranchNumber: true,
        BranchName: true,
        ContractSalesEmployee: true,
        SalesEmployeeSurname: true,
        EmailInd: true,
        LetterInd: true,
        VarianceText: true,
        AuthorityCode: true,
        BusinessCode: true,
        ClientTypeCode: true,
        ContractDurationCode: true,
        ContractDurationDesc: true,
        ContractReference: true,
        LimitedCompanyInd: true,
        OriginalContractRenewalDate: true,
        PaymentDesc: true,
        PaymentTypeCode: true,
        QuoteTypeCode: true,
        ReferenceRequired: true,
        SalutationName: true,
        UpdateableInd: true,
        ValidForClientTypeVal: true,
        dlApprovalLevel: true,
        dlBatchRef: true,
        dlContract: true,
        dlMasterExtRef: true,
        dlRejectionCode: true,
        dlRejectionDesc: true,
        findResult: true,
        ContactMobile: true,
        cmdCopyName: true,
        cmdGetAddress: true,
        trRenewalInd: true,
        trInvoiceFrequency: true,
        trAccountNumber: true,
        trNegotiatingBranch: true,
        trContinuousInd: true,
        trContractDurationCode: true,
        ClientTypeCodeSel: true,
        SalutationNameSel: true,
        tdSalutationLabel: true,
        trContractExpiryDate: true,
        grdClientType: true,
        tdClientTypeLabel: true,
        trContractAddressLine3: false
    };
    public uiDisplayFlagBack = {};

    public uiDisableFlag = {
        dlContractRef: false,
        ContractTypeCode: false,
        dlStatusCode: false,
        dlStatusDesc: false,
        ClientTypeValue1: false,
        ClientTypeValue2: false,
        ContractName: false,
        ContractAddressLine1: false,
        ContractAddressLine2: false,
        ContractAddressLine3: false,
        ContractAddressLine4: false,
        ContractAddressLine5: false,
        ContractPostcode: false,
        ContractContactName: false,
        ContractContactPosition: false,
        DecisionMakerInd: false,
        ContractContactMobile: false,
        ContractContactTelephone: false,
        ContractContactFax: false,
        ContractContactEmail: false,
        ContractCommenceDate: false,
        ContinuousInd: false,
        RenewalInd: false,
        ContractExpiryDate: false,
        InvoiceFrequencyCode: false,
        InvoiceFrequencyDesc: false,
        CreditReference: false,
        AccountNumber: false,
        AccountName: false,
        GroupAccountNumber: false,
        GroupName: false,
        GroupAccountPriceGroupID: false,
        GroupAccountPriceGroupDesc: false,
        CompanyRegistrationNumber: false,
        CompanyVATNumber: false,
        NegBranchNumber: false,
        BranchName: false,
        ContractSalesEmployee: false,
        SalesEmployeeSurname: false,
        EmailInd: false,
        LetterInd: false,
        VarianceText: false,
        AuthorityCode: false,
        BusinessCode: false,
        ClientTypeCode: false,
        ContractDurationCode: false,
        ContractDurationDesc: false,
        ContractReference: false,
        LimitedCompanyInd: false,
        OriginalContractRenewalDate: false,
        PaymentDesc: false,
        PaymentTypeCode: false,
        QuoteTypeCode: false,
        ReferenceRequired: false,
        SalutationName: false,
        UpdateableInd: false,
        ValidForClientTypeVal: false,
        dlApprovalLevel: false,
        dlBatchRef: false,
        dlContract: false,
        dlMasterExtRef: false,
        dlRejectionCode: false,
        dlRejectionDesc: false,
        findResult: false,
        ContactMobile: false,
        cmdCopyName: false,
        cmdGetAddress: null,
        ClientTypeCodeSel: false,
        SalutationNameSel: false,
        isInvoiceFrequencyEllipsisDisabled: false
    };
    public uiDisableFlagBack = {};

    public sysCharArr = [];
    public querySysChar: URLSearchParams = new URLSearchParams();
    public xhrParams = {
        method: 'prospect-to-contract/maintenance',
        module: 'advantage',
        operation: 'Sales/iCABSSdlContractMaintenance'
    };
    public parentValues: any = {
        CurrentContractType: '',
        PipelineAmendMode: '',
        DefaultSalutationName: '',
        ContractCommenceDateValue: new Date()
    };
    public uiSelectDropdownValues = {
        ClientTypeCodeSel: [{ value: '', text: '' }],
        SalutationNameSel: [{ value: '', text: '' }]
    };

    //Invoice frequency ellipse
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public inputParamsInvoiceFrequency: any = { 'parentMode': 'LookUp', 'countryCode': this.utils.getCountryCode(), 'businessCode': this.utils.getBusinessCode() };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public invoiceFrequencySearchComponent = InvoiceFrequencySearchComponent;
    public onInvoiceFrequencyDataReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyCode', data.InvoiceFrequencyCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyDesc', data.InvoiceFrequencyDesc);
        }
    }

    //Payment type ellipse
    public inputParamsPaymentType: any = { 'parentMode': 'LookUp', 'countryCode': this.utils.getCountryCode(), 'businessCode': this.utils.getBusinessCode() };
    public paymentTypeCodeComponent = PaymentSearchComponent;
    public onPaymentTypeDataReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentTypeCode', data.PaymentTypeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentDesc', data.PaymentDesc);
        }
    }

    public accountSearchComponent = AccountSearchComponent;
    public inputParamsAccountNumber: any = {
        'parentMode': 'ContractSearch',
        'contractName': '',
        'shouldRetainFilter': true
    };
    public setAccountNumber(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', data.AccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', data.AccountName);
    }

    public ellipsisConfig = {
        employee: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp-ContractSalesEmployee',
            showAddNew: false,
            component: EmployeeSearchComponent
        }
    };
    public employeeEllipseDataReceive(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractSalesEmployee', data.ContractSalesEmployee);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesEmployeeSurname', data.SalesEmployeeSurname);
    }

    public pageMode = {
        updateMode: false
    };

    public uiFormValueChanges: any;
    public menu = '';
    public savecancelFlag = true;
    public tabInvalid: Array<boolean> = [false, false];
    public pageisLoading = false;

    public focusOrdering = {
        General: { ContractName: false },
        SpecialInstructions: { ContractCommenceDate: false }
    };
    constructor(injector: Injector, private _ls: LocalStorageService, private ref: ChangeDetectorRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSDLCONTRACTMAINTENANCE;
        this.pageTitle = 'Advantage Contract Maintenance';
        this.search = this.getURLSearchParamObject();
    }
    public ngOnInit(): void {
        super.ngOnInit();
        this.initForm();
        this.parentValues.ContractCommenceDateValue = null;
        //this.contractDurationDropDown.inputParams = this.inputParamsContractDuration;
        this.uiForm.controls['ClientTypeLabel1'].setValue('Client Type Value1');
        this.uiForm.controls['ClientTypeLabel2'].setValue('Client Type Value2');
        this.loadParentInputValues(); //1st
        //this.lookupSearch();
        //this.triggerFetchSysChar(false, true);
        this.formData = this.riExchange.getParentHTMLValues();
        this.sysCharParams.vBusinessCode = this.utils.getBusinessCode();
        //this.getOnloadValues();
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe((value: any) => {
            this.formChanges(value);
        });
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.onloadriMaintenance();
        this.utils.getTranslatedval('Advantage Contract Maintenance').then(value => {
            this.utils.setTitle(value);
        });
        this.uiForm.valueChanges.subscribe(
            value => {
                this.validateFormValues('all', 'normal');
            }
        );
    }

    public onloadriMaintenance(): void {
        this.uiDisableFlag.dlStatusCode = true;
        this.uiDisableFlag.dlMasterExtRef = true;
        this.uiDisableFlag.dlStatusDesc = true;
        this.uiDisableFlag.dlRejectionCode = true;
        this.uiDisableFlag.dlRejectionDesc = true;
        this.uiDisableFlag.UpdateableInd = true;
        this.uiDisableFlag.GroupAccountNumber = true;
        this.uiDisableFlag.GroupAccountPriceGroupID = true;
        this.uiDisableFlag.ContractExpiryDate = true;
        this.uiDisableFlag.NegBranchNumber = true;
        this.uiDisableFlag.BusinessCode = true;
        this.uiDisableFlag.QuoteTypeCode = true;
        this.uiDisableFlag.ValidForClientTypeVal = true;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.uiFormValueChanges.unsubscribe();
    }

    public initForm(): void {
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    private loadParentInputValues(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DisQuoteTypeCode', this.riExchange.getParentHTMLValue('DisQuoteTypeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'QuoteTypeCode', this.riExchange.getParentHTMLValue('PassQuoteTypeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SubSystem', this.riExchange.getParentHTMLValue('SubSystem'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlContract', this.riExchange.GetParentHTMLInputElementAttribute({}, 'dlContractRowID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PipelineAmendMode', this.riExchange.getParentHTMLValue('PipelineAmend'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentContractType', this.riExchange.getParentHTMLValue('CurrentContractType'));
        this.getUrlData(); //2nd
    }

    public getUrlData(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['dlContractRowID']) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'dlContract', params['dlContractRowID']);
            }
            if (params['DisQuoteTypeCode']) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DisQuoteTypeCode', params['DisQuoteTypeCode']);
            }
            if (params['SubSystem']) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SubSystem', params['SubSystem']);
            }
            if (params['PipelineAmendMode']) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PipelineAmendMode', params['PipelineAmendMode']);
                this.sysCharParams['vSCClientTypeValidation'] = 'false';
            }
            if (params['CurrentContractType']) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentContractType', params['CurrentContractType']);
            }
            if (params['ContractTypeCode']) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', params['ContractTypeCode']);
            }
            if (params['parentMode']) {
                this.pageParentMode = params['parentMode'];
                //From pipeline prospect quote grid
                if (this.pageParentMode === 'SOQuote') {
                    this.setSQuoteInformations();
                }
                if (this.pageParentMode === 'SOQuoteEffectiveDate') {
                    this.changeTab('SpecialInstructions');
                }
            }
            this.getOnloadValues(); //3rd
        });
    }

    public setSQuoteInformations(): void {
        if (this.formData['ContractTypeCode']) {
            this.uiForm.controls['ContractTypeCode'].setValue(this.formData['ContractTypeCode']);
        }
        if (this.formData['DisContractTypeCode']) {
            //this.uiForm.controls['DisContractTypeCode'].setValue(this.formData['DisContractTypeCode']);
        }
        if (this.formData['DisQuoteTypeCode']) {
            this.uiForm.controls['DisQuoteTypeCode'].setValue(this.formData['DisQuoteTypeCode']);
        }
        if (this.formData['dlContractRef']) {
            this.uiForm.controls['dlContractRef'].setValue(this.formData['dlContractRef']);
        }
    }

    /**
     * getOnloadValues Making the onload API call (URL 1)
     */
    public getOnloadValues(): void {
        this.pageisLoading = true;
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '0');
        //search.set('dlContractROWID', '0x0000000009aa93c6');
        search.set('dlContractROWID', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContract'));
        search.set('dlBatchRef', '');
        search.set('dlRecordType', 'CO');
        search.set('dlContractRef', '');

        let dlContract = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.pageisLoading = false;
                    return;
                }
                this.loadFormData(data); //4th
            });
    }
    /**
     * loadFormData Using API (URL 1) return data values
     * @param data loads all the page form datas
     */
    public loadFormData(data: any): void {
        this.pageLoadData = data;
        if (!data.GroupName)
            data.GroupName = '';
        if (!data.GroupAccountPriceGroupDesc)
            data.GroupAccountPriceGroupDesc = '';
        if (!data.BranchName)
            data.BranchName = '';
        if (!data.SalesEmployeeSurname)
            data.SalesEmployeeSurname = '';
        if (!data.ContactMobile)
            data.ContactMobile = '';
        if (!data.DisQuoteTypeCode)
            data.DisQuoteTypeCode = '';
        if (!data.SubSystem)
            data.SubSystem = '';
        if (!data.ClientTypeCodeSel)
            data.ClientTypeCodeSel = '';
        if (!data.SalutationNameSel)
            data.SalutationNameSel = '';
        if (!data.MandateRequired)
            data.MandateRequired = true;
        if (!data.PaymentDesc)
            data.PaymentDesc = '';
        if (!data.ClientTypeDescription)
            data.ClientTypeDescription = '';
        if (!data.PaymentTypeCodeDefault)
            data.PaymentTypeCodeDefault = '';
        if (!data.PaymentTypeDescDefault)
            data.PaymentTypeDescDefault = '';
        if (!data.ClientTypeSalutationInd)
            data.ClientTypeSalutationInd = '';
        if (!data.ClientTypeLabel1)
            data.ClientTypeLabel1 = '';
        if (!data.ClientTypeLabel2)
            data.ClientTypeLabel2 = '';
        if (!data.ClientTypeCompanyNoInd)
            data.ClientTypeCompanyNoInd = '';
        if (!data.ClientTypePrefixText)
            data.ClientTypePrefixText = '';
        if (!data.ClientTypeSuffixText)
            data.ClientTypeSuffixText = '';
        if (!data.DefaultSalutationName)
            data.DefaultSalutationName = '';
        if (!data.PipelineAmendMode)
            data.PipelineAmendMode = '';
        if (!data.CurrentContractType)
            data.CurrentContractType = '';
        if (!data.SalutationName)
            data.SalutationName = '';
        if (!data.hasOwnProperty('dlContractRef'))
            data.dlContractRef = '';
        if (data.ContractDurationCode) {
            this.contractDurationActive.id = data.ContractDurationCode;
            if (data.ContractDurationDesc !== '') {
                this.contractDurationActive.text = data.ContractDurationDesc.split(' ').join(' - ');
                this.contractDurationDropDown.active = this.contractDurationActive;
                this.contractDurationDropDown.active = {
                    id: data.ContractDurationCode,
                    text: data.ContractDurationDesc.split(' ').join(' - ')
                };
            }
        }
        data.menu = 'Options';
        this.uiForm.setValue(data);
        let dateString = data['ContractCommenceDate'];
        this.parentValues.ContractCommenceDateValue = this.setDatePicker(dateString);

        this.triggerFetchSysChar(false, true);

        //this.loadParentInputValues();
        this.riMaintenance_AfterFetch(data);
        this.lookupSearchAPI('generalLookup');
        this.handleCheckBoxValues();
    }

    /**
     * Handles the checkbox values from service
     */
    public handleCheckBoxValues(): void {
        let data = this.pageLoadData;
        if (data['DecisionMakerInd']) {
            if (data['DecisionMakerInd'] === 'yes') {
                this.uiForm.controls['DecisionMakerInd'].setValue(true);
            } else {
                this.uiForm.controls['DecisionMakerInd'].setValue(false);
            }
            this.uiForm.controls['DecisionMakerInd'].markAsDirty();
        }
        if (data['ContinuousInd']) {
            if (data['ContinuousInd'] === 'yes') {
                this.uiForm.controls['ContinuousInd'].setValue(true);
            } else {
                this.uiForm.controls['ContinuousInd'].setValue(false);
            }
            this.uiForm.controls['ContinuousInd'].markAsDirty();
        }
        if (data['RenewalInd']) {
            if (data['RenewalInd'] === 'yes') {
                this.uiForm.controls['RenewalInd'].setValue(true);
            } else {
                this.uiForm.controls['RenewalInd'].setValue(false);
            }
            this.uiForm.controls['RenewalInd'].markAsDirty();
        }
        if (data['EmailInd']) {
            if (data['EmailInd'] === 'yes') {
                this.uiForm.controls['EmailInd'].setValue(true);
            } else {
                this.uiForm.controls['EmailInd'].setValue(false);
            }
            this.uiForm.controls['EmailInd'].markAsDirty();
        }
        if (data['LetterInd']) {
            if (data['LetterInd'] === 'yes') {
                this.uiForm.controls['LetterInd'].setValue(true);
            } else {
                this.uiForm.controls['LetterInd'].setValue(false);
            }
            this.uiForm.controls['LetterInd'].markAsDirty();
        }
        //this is a hidden text box holding the checkbox value
        if (data['ReferenceRequired']) {
            this.uiForm.controls['ReferenceRequired'].setValue(data['ReferenceRequired']);
            this.uiForm.controls['ReferenceRequired'].markAsDirty();
        }

        //taking backup of validation object after all data loads-- for cancel functionality
        this.tabValidationObjCopy = JSON.parse(JSON.stringify(this.tabValidationObj));
    }
    public riMaintenance_AfterFetch(data: any): void {
        if (data.ContractName)
            this.inputParamsAccountNumber.contractName = data['ContractName'];
        if (data.ContinuousInd) {
            if (data.ContinuousInd === 'yes') {
                this.uiDisplayFlag.trRenewalInd = false;
                this.uiDisplayFlag.trContractDurationCode = false;
                this.uiDisplayFlag.trContractExpiryDate = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationCode', '');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationDesc', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractDurationCode', false);
            }
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', this.utils.getBranchText().split('-')[1]);
        if (data.ClientTypeLabel1) {
            if (data.ClientTypeLabel1 === '') {
                this.uiDisplayFlag.ClientTypeValue1 = false;
            } else {
                this.uiDisplayFlag.ClientTypeValue1 = true;
            }
        }
        this.uiForm.controls['ContractDurationCode'].setValue('1');//setting default value for ContractDurationCode
    }

    public setDatePicker(dateString: any): any {
        return this.globalize.parseDateToFixedFormat(dateString);
    }

    public cancelForm(): void {
        this.uiForm.reset();
        this.parentValues.ContractCommenceDateValue = this.setDatePicker('');
        /*this.tabNameMap = {
            General: true,
            SpecialInstructions: false
        };*/
        this.tabValidationObj.SaveClickFlag = false;
        for (let key in this.uiForm.controls) {
            if (true) {
                this.uiForm.controls[key].setValue(this.controlsCopy[key]);
                if (key === 'LetterInd') {
                    if (this.controlsCopy[key] === 'no' || this.controlsCopy[key] === false) {
                        this.uiForm.controls['LetterInd'].setValue(false);
                    } else {
                        this.uiForm.controls['LetterInd'].setValue(true);
                    }
                }
                if (key === 'EmailInd') {
                    if (this.controlsCopy[key] === 'no' || this.controlsCopy[key] === false) {
                        this.uiForm.controls['EmailInd'].setValue(false);
                    } else {
                        this.uiForm.controls['EmailInd'].setValue(true);
                    }
                }
            }
        }
        let dateString = this.controlsCopy['ContractCommenceDate'];
        this.uiForm.controls['ClientTypeCodeSel'].setValue(this.specialBackupElements['ClientTypeCodeSelBackup']);
        this.uiForm.controls['ClientTypeLabel1'].setValue(this.specialBackupElements['ClientTypeLabel1']);
        this.uiForm.controls['ClientTypeLabel2'].setValue(this.specialBackupElements['ClientTypeLabel2']);
        this.parentValues.ContractCommenceDateValue = this.setDatePicker(dateString);
        this.tabValidationObj = this.tabValidationObjCopy;
        //this.tabValidationObj.GeneralTab.ContractAddressLine3.isValid = true;

        //reseting all disable and hidden fields
        for (let key in this.uiDisableFlagBack) {
            if (true) {
                this.uiDisableFlag[key] = this.uiDisableFlagBack[key];
            }
        }
        for (let key in this.uiDisplayFlagBack) {
            if (true) {
                this.uiDisplayFlag[key] = this.uiDisplayFlagBack[key];
            }
        }
        this.contractDurationActive = {
            'id': '1',
            'text': '1 - Month'
        };
        this.ref.detectChanges();
    }
    /**
     * Response to change tab events.
     */
    public changeTab(tabname: string): void {
        for (let key in this.tabNameMap) {
            if (this.tabNameMap.hasOwnProperty(key)) {
                this.tabNameMap[key] = false;
            }
        }
        this.tabNameMap[tabname] = true;
    }
    public changeTabKeypress(eventObj: any, tabname: string): void {
        // if (eventObj['keyCode'] === 9) {
        //     for (let key in this.tabNameMap) {
        //         if (this.tabNameMap.hasOwnProperty(key)) {
        //             this.tabNameMap[key] = false;
        //         }
        //     }
        //     this.tabNameMap[tabname] = true;
        // }
    }
    public generalTabFocus(): void {
        document.getElementById('cmdCopyName').focus();
    }
    //focusing next tab
    public focusSave(): void {
        this.changeTab('SpecialInstructions');
        document.querySelector('.datePicker1 .form-control').setAttribute('id', 'specialDatepicker');
    }
    //focusing next tab
    public focusSave2(): void {
        document.getElementById('cmdCopyName').focus();
    }
    //focusing next tab
    public focusSave3(): void {
        //this.changeTab('SpecialInstructions');
    }
    /**
     * This method is invoked on manual entry for AccountNumber and InvoiceGroupNumber fields.
     * Makes the lookup call to populate the Account Name / InvoiceGroupDesc fields.
     */
    public lookupSearch(): void {
        let queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.MethodType, 'maintenance');
        let lookupQuery: any;
        queryParams.set(this.serviceConstants.Action, '5');
        lookupQuery = [{
            'table': 'dlContract',
            'query': { 'dlContractRowID': this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContract') },
            'fields': ['dlMasterExtRef', 'dlStatusCode', 'dlStatusDesc', 'dlRejectionCode', 'dlRejectionDesc', 'UpdateableInd']
        }];
        this.isRequesting = true;
        this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
            value => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            () => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            }
        );
    }

    /**
     * Making the lookup API call
     */
    public invokeLookupSearch(queryParams: any, data: any): Observable<any> {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    }

    public setSysChars(): any {
        //Get Address button syschar enable disable logic
        if ((this.sysCharParams['vSCEnableHopewiserPAF'] === 'true') || (this.sysCharParams['vSCEnableDatabasePAF'] === 'true')) {
            this.uiDisplayFlag.cmdGetAddress = true;
        } else {
            this.uiDisplayFlag.cmdGetAddress = false;
        }
        if (this.sysCharParams['vSCClientTypeValidation'] === 'true') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeCode', true);
            this.tabValidationObj.SectionMiddleFields.ClientTypeCodeSel.required = true;
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeCode', false);
            this.tabValidationObj.SectionMiddleFields.ClientTypeCodeSel.required = false;
        }
        if (this.sysCharParams['vSCAddressLine3Logical'] === 'true') {
            //this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractAddressLine3', true);
            this.uiDisplayFlag.trContractAddressLine3 = true;
            //this.tabValidationObj.GeneralTab.ContractAddressLine3.required = true;
        } else {
            //this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractAddressLine3', false);
            this.uiDisplayFlag.trContractAddressLine3 = false;
            //this.tabValidationObj.GeneralTab.ContractAddressLine3.required = false;
        }
        if (this.sysCharParams['vSCAddressLine5Logical'] === 'true') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractAddressLine5', true);
            this.tabValidationObj.GeneralTab.ContractAddressLine5.required = true;
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractAddressLine5', false);
            this.tabValidationObj.GeneralTab.ContractAddressLine5.required = false;
        }
        if (this.sysCharParams['vSCClientTypeValidation'] === 'true') {
            this.GetClientTypeSalutationLists();
        }
        this.GetClientTypeSalutationLists();
        this.setOnloadBusinessLogic();
    }

    public setOnloadBusinessLogic(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PipelineAmendMode')) {
            this.sysCharParams['vSCClientTypeValidation'] = 'false';
            this.uiDisplayFlag.trRenewalInd = false;
            this.uiDisplayFlag.trInvoiceFrequency = false;
            this.uiDisplayFlag.trAccountNumber = false;
            this.uiDisplayFlag.trNegotiatingBranch = false;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CurrentContractType') === 'J') {
            this.uiDisplayFlag.trContinuousInd = false;
            this.uiDisplayFlag.trContractDurationCode = false;
            this.uiDisplayFlag.trInvoiceFrequency = false;
        }
        //this.uiDisableFlag.cmdGetAddress = true;
        this.uiDisableFlag.cmdCopyName = true;

        //SCClientTypeValidation implementation
        if (this.sysCharParams.vSCClientTypeValidation === 'true') {
            this.uiDisplayFlag.tdClientTypeLabel = true;
            this.uiDisableFlag.ContractName = true;
            this.uiDisableFlag.ClientTypeCodeSel = true;
            this.uiDisableFlag.SalutationNameSel = true;
            this.tabValidationObj.GeneralTab.ContractName.required = false;
        } else {
            this.uiDisplayFlag.grdClientType = false;
            this.uiDisableFlag.ContractName = null;
            this.uiDisableFlag.ClientTypeCodeSel = null;
            this.uiDisableFlag.SalutationNameSel = null;
            this.tabValidationObj.GeneralTab.ContractName.required = true;
        }
        this.uiDisableFlag.ClientTypeCodeSel = null;
    }

    public GetClientTypeSalutationLists(): void {
        let search: URLSearchParams = new URLSearchParams();
        //search.set(this.serviceConstants.BusinessCode, 'Z');
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        //search.set(this.serviceConstants.CountryCode, 'ZA');
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetClientTypeSalutationLists');
        //search.set('ContractTypeCode', 'J');
        search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'));

        let dlContract = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                this.uiSelectDropdownValues = {
                    ClientTypeCodeSel: [],
                    SalutationNameSel: []
                };
                let ClientTypeCodeList: any;
                let ClientTypeDescList: any;
                let SalutationNameList: any;
                let SalutationDescList: any;
                let DefaultSalutationName: any;
                ClientTypeCodeList = data.ClientTypeCodeList.split('\n');
                ClientTypeDescList = data.ClientTypeDescList.split('\n');
                SalutationNameList = data.SalutationNameList.split('\n');
                SalutationDescList = data.SalutationDescList.split('\n');
                DefaultSalutationName = data.DefaultSalutationName;
                //this.parentValues.DefaultSalutationName = DefaultSalutationName;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DefaultSalutationName', DefaultSalutationName);
                for (let i = 0; i < ClientTypeCodeList.length; i++) {
                    this.uiSelectDropdownValues.ClientTypeCodeSel.push({ value: ClientTypeCodeList[i], text: ClientTypeDescList[i] });
                }
                this.uiForm.controls['ClientTypeCodeSel'].setValue(this.uiForm.controls['ClientTypeCode'].value);
                this.specialBackupElements['ClientTypeCodeSelBackup'] = this.uiForm.controls['ClientTypeCode'].value;
                for (let i = 0; i < SalutationNameList.length; i++) {
                    this.uiSelectDropdownValues.SalutationNameSel.push({ value: SalutationNameList[i], text: SalutationDescList[i] });
                }
                this.uiForm.controls['SalutationNameSel'].setValue('DR');
            });
        //this.PopulateNameFromClientDetails();
    }

    public populatePaymentCodeFields(): void {
        let search: URLSearchParams = new URLSearchParams();
        //search.set(this.serviceConstants.BusinessCode, 'Z');
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        //search.set(this.serviceConstants.CountryCode, 'ZA');
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetPaymentTypeCodeDetails');
        //search.set('PaymentTypeCode', 'C');
        search.set('PaymentTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'PaymentTypeCode'));
        search.set('ReferenceRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'ReferenceRequired'));
        search.set('MandateRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'MandateRequired'));

        let dlContract = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                if (data.ReferenceRequired === 'no') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ReferenceRequired', false);
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ReferenceRequired', true);
                }
                if (data.MandateRequired === 'no') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'MandateRequired', false);
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'MandateRequired', true);
                }
            });
    }

    public PopulateNameFromClientDetailsBefore(key: any): void {
        if (this.uiForm.controls[key].value !== '') {
            this.PopulateNameFromClientDetails();
        }
    }

    public PopulateNameFromClientDetails(): void {
        this.isRequesting = true;
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'BuildContractNameFromClientType');
        //search.set('PaymentTypeCode', 'C');
        search.set('ClientTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeCode'));
        search.set('SalutationName', this.riExchange.riInputElement.GetValue(this.uiForm, 'SalutationName'));
        search.set('ClientTypeValue1', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeValue1'));
        search.set('ClientTypeValue2', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeValue2'));

        let dlContract = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                this.isRequesting = false;
                if (data.errorMessage) {
                    this.messageModal.show({ msg: data.errorMessage, title: '' }, false);
                    return;
                }
                if (data.ContractName) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
                }
            });
    }

    public sysCharParameters(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharMaximumAddressLength,
            this.sysCharConstants.SystemCharEnableClientTypeValidationInSOP,
            this.sysCharConstants.SystemCharMakeCompanyVATMandatoryLikeCompanyReg
        ];
        return sysCharList.join(',');
    }

    public onSysCharDataReceive(e: any): void {
        if (e.records && e.records.length > 0) {
            this.sysCharParams['vSCEnableAddressLine3'] = e.records[0].Required.toString();
            this.sysCharParams['vSCAddressLine3Logical'] = e.records[0].Required.toString();
            this.sysCharParams['vSCEnableHopewiserPAF'] = e.records[1].Required.toString();
            this.sysCharParams['vSCEnableDatabasePAF'] = e.records[2].Required.toString();
            this.sysCharParams['vSCAddressLine4Required'] = e.records[3].Required.toString();
            this.sysCharParams['vSCAddressLine5Required'] = e.records[4].Required.toString();
            this.sysCharParams['vSCAddressLine5Logical'] = e.records[4].Required.toString();
            this.sysCharParams['vSCPostCodeRequired'] = e.records[5].Required.toString();
            this.sysCharParams['vSCPostCodeMustExistInPAF'] = e.records[6].Required.toString();
            this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] = e.records[7].Required.toString();
            this.sysCharParams['vSCEnableMaxAddress'] = e.records[8].Required.toString();
            this.sysCharParams['vSCEnableMaxAddressValue'] = e.records[8].Integer.toString();
            this.sysCharParams['vSCClientTypeValidation'] = e.records[9].Required.toString();
            this.sysCharParams['vSCVatRegMandatory'] = e.records[10].Required.toString();
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
    public triggerFetchSysChar(saveModeData: any, returnSubscription: boolean): any {
        let sysCharNumbers = this.sysCharParameters();
        this.fetchSysChar(sysCharNumbers).subscribe((data) => {
            this.onSysCharDataReceive(data);
        });
    }
    public onChange(eventobject: any, value: any): void {
        let selectedValue = '';
        switch (value) {
            case 'ClientTypeCodeSel':
                selectedValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeCodeSel');
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SalutationNameSel') === '') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SalutationNameSel', this.riExchange.riInputElement.GetValue(this.uiForm, 'DefaultSalutationName'));
                }
                this.uiForm.controls['ClientTypeCode'].setValue(selectedValue);
                this.GetClientTypeDetails(true);
                let thisRef = this;
                setTimeout(function (): void {
                    thisRef.PopulateNameFromClientDetails(); //loading the middle section service call values
                }, 2000);
                //this.PopulateNameFromClientDetails();
                break;
            case 'SalutationNameSel':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SalutationName', this.riExchange.riInputElement.GetValue(this.uiForm, 'SalutationNameSel'));
                this.PopulateNameFromClientDetails();
                break;
            case 'menu':
                let menu = this.menu;
                if (menu === 'Premises') {
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === '') {
                        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSSSOPREMISEGRID], { queryParams: { parentMode: 'Contract' } });
                        //this.navigate('Contract', '/application/SOPremiseGrid');
                    } else {
                        //TO DO: iCABSSPipelinePremiseGrid is not created
                        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSSPIPELINEPREMISEGRID], { queryParams: { parentMode: 'Contract' } });
                    }
                }
                break;
            default:
                break;
        }
    }
    public GetClientTypeDetails(flag: boolean): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetClientTypeDetails');
        search.set('ClientTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeCodeSel'));
        search.set('PaymentTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'PaymentTypeCode'));
        search.set('PaymentDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'PaymentDesc'));
        search.set('MandateRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'MandateRequired'));
        search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'));
        search.set('ClientTypeValue1', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeValue1'));
        search.set('ClientTypeValue2', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeValue2'));

        let dlContract = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypeDescription', data.ClientTypeDescription);
                if (data.ClientTypeSalutationInd === 'no') {
                    this.uiDisplayFlag.tdSalutationLabel = false;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypeSalutationInd', 'no');
                    this.uiDisableFlag.SalutationNameSel = true;
                } else {
                    this.uiDisplayFlag.tdSalutationLabel = true;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypeSalutationInd', 'yes');
                    this.uiDisableFlag.SalutationNameSel = false;
                }
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentTypeCodeDefault', data.PaymentTypeCodeDefault);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentTypeDescDefault', data.PaymentTypeDescDefault);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypeLabel1', data.ClientTypeLabel1);
                if (this.specialBackupElements.ClientTypeLabel1 === '')
                    this.specialBackupElements.ClientTypeLabel1 = data.ClientTypeLabel1;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypeLabel2', data.ClientTypeLabel2);
                if (this.specialBackupElements.ClientTypeLabel2 === '')
                    this.specialBackupElements.ClientTypeLabel2 = data.ClientTypeLabel2;
                if (data.ClientTypeCompanyNoInd === 'no') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypeCompanyNoInd', false);
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypeCompanyNoInd', true);
                }
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypePrefixText', data.ClientTypePrefixText);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ClientTypeSuffixText', data.ClientTypeSuffixText);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DefaultSalutationName', data.DefaultSalutationName);
                if (data.ClientTypeCompanyNoInd)
                    this.uiForm.controls['ClientTypeCompanyNoInd'].setValue(data.ClientTypeCompanyNoInd);
                if (data.ClientTypeDescription)
                    this.uiForm.controls['ClientTypeDescription'].setValue(data.ClientTypeDescription);
                if (data.ClientTypeLabel1)
                    this.uiForm.controls['ClientTypeLabel1'].setValue(data.ClientTypeLabel1);
                if (data.ClientTypeLabel2)
                    this.uiForm.controls['ClientTypeLabel2'].setValue(data.ClientTypeLabel2);
                if (data.ClientTypePrefixText)
                    this.uiForm.controls['ClientTypePrefixText'].setValue(data.ClientTypePrefixText);
                if (data.ClientTypeSalutationInd)
                    this.uiForm.controls['ClientTypeSalutationInd'].setValue(data.ClientTypeSalutationInd);
                if (data.ClientTypeSuffixText)
                    this.uiForm.controls['ClientTypeSuffixText'].setValue(data.ClientTypeSuffixText);
                if (data.ClientTypeValue1)
                    this.uiForm.controls['ClientTypeValue1'].setValue(data.ClientTypeValue1);
                if (data.ClientTypeValue2)
                    this.uiForm.controls['ClientTypeValue2'].setValue(data.ClientTypeValue2);
                if (data.DefaultSalutationName)
                    this.uiForm.controls['DefaultSalutationName'].setValue(data.DefaultSalutationName);
                if (data.PaymentTypeCodeDefault)
                    this.uiForm.controls['PaymentTypeCodeDefault'].setValue(data.PaymentTypeCodeDefault);
                if (data.PaymentTypeDescDefault)
                    this.uiForm.controls['PaymentTypeDescDefault'].setValue(data.PaymentTypeDescDefault);
                this.SetupClientTypeFields(flag);
            });
    }

    public SetupClientTypeFields(flag: any): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeCodeSel', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SalutationNameSel', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeValue1', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeValue2', false);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeSalutationInd') === 'no') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SalutationNameSel', false);
            this.uiDisplayFlag.tdSalutationLabel = false;
        } else {
            this.uiDisplayFlag.tdSalutationLabel = true;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeLabel1') === '') {
            this.uiDisplayFlag.ClientTypeValue1 = false;
        } else {
            this.uiDisplayFlag.ClientTypeValue1 = true;
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'clientTypeSalutationInd') === 'false') {
                document.getElementById('ClientTypeValue1').focus();
            }
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeLabel2') === '') {
            this.uiDisplayFlag.ClientTypeValue2 = false;
        } else {
            this.uiDisplayFlag.ClientTypeValue2 = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeValue2', false);
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeCompanyNoInd') === 'true') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyRegistrationNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyVATNumber', true);
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyRegistrationNumber', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyVATNumber', false);
        }
        if (this.sysCharParams['vSCVatRegMandatory'] === 'true') {
            this.tabValidationObj.SpecialInstructionsTab.CompanyVATNumber.required = true;
        } else {
            this.tabValidationObj.SpecialInstructionsTab.CompanyVATNumber.required = false;
        }
        //this.CalculateExpiryDate(); //loading expiry date on page load

        this.pageisLoading = false; //Making the page visible here

        if (!flag) {
            //taking backup of all disable and display none fields
            this.uiDisableFlagBack = JSON.parse(JSON.stringify(this.uiDisableFlag));
            this.uiDisplayFlagBack = JSON.parse(JSON.stringify(this.uiDisplayFlag));
            //controlsCopy keeping form controls onload values
            for (let key in this.uiForm.controls) {
                if (true) {
                    this.controlsCopy[key] = this.uiForm.controls[key].value;
                }
            }
            return;
        }
    }

    public ContinuousInd_onclick(): void {
        /*if (!this.uiForm.get('ContinuousInd').disabled) {*/
        let continuousInd = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContinuousInd').toString();
        if (continuousInd === 'yes' || continuousInd === 'true' || continuousInd === null) {
            let PipelineAmendMode = this.riExchange.riInputElement.GetValue(this.uiForm, 'PipelineAmendMode');
            if (PipelineAmendMode.toString() === 'true' || PipelineAmendMode.toString() === 'yes') {
                this.uiDisplayFlag.trRenewalInd = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'RenewalInd', true);
            }
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractDurationCode', true);
            this.tabValidationObj.SpecialInstructionsTab.ContractDurationCode.required = true;
            //this.uiDisableFlag.ContractDurationCode = true;
            this.uiDisplayFlag.trContractExpiryDate = true;
            this.uiDisplayFlag.trContractDurationCode = true;
        } else {
            this.uiDisplayFlag.trRenewalInd = false;
            this.uiDisplayFlag.trContractDurationCode = false;
            this.uiDisplayFlag.trContractExpiryDate = false;
            //this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationCode', '');
            //this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationDesc', '');
            //this.uiDisableFlag.ContractDurationCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractDurationCode', false);
            this.tabValidationObj.SpecialInstructionsTab.ContractDurationCode.required = false;
        }
        /*}*/
        this.uiDisplayFlag.trRenewalInd = false; //always hiding Contract Renewal as per IUI-15476
    }

    public RenewalInd_onclick(): void {
        let renewalInd = this.riExchange.riInputElement.GetValue(this.uiForm, 'RenewalInd');
        if (renewalInd) {
            this.parentValues.ContractCommenceDateValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'OriginalContractRenewalDate');
            this.uiDisableFlag.ContractCommenceDate = true;
            //this.tabValidationObj.GeneralTab.ContractAddressLine3.required = false;
            if (this.uiDisplayFlag.trContractExpiryDate === false) {
                this.CalculateExpiryDate();
            }
        } else {
            this.uiDisableFlag.ContractCommenceDate = false;
            //this.tabValidationObj.GeneralTab.ContractAddressLine3.required = true;
        }
    }

    public selDate(value: any, id: string): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, id, value);
    }

    public CalculateExpiryDate(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PipelineAmendMode')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RenewalInd', true);
        }
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetExpiryDate');
        search.set('ContractCommenceDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractCommenceDate'));
        search.set('ContractDurationCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractDurationCode'));
        search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'));
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('ContractExpiryDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractExpiryDate'));
        search.set('ContractDurationDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractDurationDesc'));

        let dlContract = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractExpiryDate', data.ContractExpiryDate);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationDesc', data.ContractDurationDesc);
            });
    }

    public changeMode(key: any, flag: boolean): void {
        this.pageMode[key] = flag;
        //this.EmailRequired();
    }

    public EmailRequired(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmailInd', true);
    }

    public cmdCopyName_onclick(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractContactName', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'));
    }

    public cmdGetAddress_onclick(): void {
        //TO DO: riMPAFSearch is not created
        this.messageModal.show({ msg: 'riMPAFSearch.htm ' + MessageConstant.Message.PageNotDeveloped, title: '' }, false);
        //this.router.navigate(['/riMPAFSearch'], { queryParams: { parentMode: 'Contract' } });
        // if (this.sysCharParams['vSCEnableHopewiserPAF'] === 'true') {
        //     let queryParams = {
        //         parentMode: 'Contract'
        //     };
        //     this.messageModal.show({ msg: 'riMPAFSearch.htm ' + MessageConstant.Message.PageNotDeveloped, title: '' }, false);
        // }
    }

    public saveFormData(): void {
        // if (!this.riExchange.validateForm(this.uiForm)) {
        //     let self = this;
        //     setTimeout(function (): void {
        //         self.markTab();
        //     }, 0);
        //     return;
        // }
        this.tabValidationObj.SaveClickFlag = true;
        if (!this.validateFormValues('all', 'normal')) {
            return;
        }
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        let allFormData = this.uiForm.value;
        let requiredFieldsArr = ['ContractCommenceDate', 'ContractName', 'ContractAddressLine1', 'ContractAddressLine5', 'ContractPostcode', 'ContractPostcode', 'ContractContactName', 'ContractContactPosition', 'ContractContactTelephone'];
        this.promptConfirmModal.show();
    }

    private markTab(): void {
        let tabs: any = document.querySelectorAll('div.tab-pane');
        tabs.forEach((tab: any, index: number) => {
            this.tabInvalid[index] = document.querySelectorAll('div.tab-pane:nth-child(' + (index + 1) + ') input.ng-invalid.ng-touched').length > 0;
        });
    }

    public promptConfirm(event: any): void {
        let searchPost = new URLSearchParams();
        let allFormData = this.uiForm.value;
        let postParams: any = {};
        for (let key in allFormData) {
            if (key) {
                postParams[key] = allFormData[key];
            }
        }
        postParams['dlContractROWID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContract');
        searchPost.set(this.serviceConstants.Action, '2');
        searchPost.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (Object.keys(e).length === 0) {
                    this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                }
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.riExchange.setParentAttributeValue('dlPremiseRowID', postParams['dlContractROWID']);
                        //TO DO: iCABSSdlPremiseMaintenance is not created
                        //this.router.navigate(['/iCABSSdlPremiseMaintenance'], { queryParams: { parentMode: 'AddQuote' } });
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public promptCancel(eventObj: any): void {
        //TO Do:
    }

    public formChanges(obj: any): void {
        if (obj === 'VALID') {
            this.savecancelFlag = false;
        } else {
            this.savecancelFlag = true;
        }
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    public menuOnchange(): void {
        let menu = this.menu;
        if (menu === 'Premises') {
            this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSSPIPELINEPREMISEGRID], {
                queryParams: {
                    parentMode: 'Contract',
                    dlBatchRef: this.getControlValue('dlBatchRef'),
                    dlContractRef: this.getControlValue('dlContractRef'),
                    ContractTypeCode: this.getControlValue('ContractTypeCode'),
                    QuoteTypeCode: this.getControlValue('QuoteTypeCode'),
                    SubSystem: this.getControlValue('SubSystem')
                }
            });
        }
    }

    /**
     * On close of the modal, this method save the form datas by caklling the respected api.
     */
    public messageModalClose(): any {
        //TO DO:
    }

    public ContractPostcode_onfocusout(): void {
        if (this.sysCharParams['vSCPostCodeRequired'] === 'true' && this.uiForm.controls['ContractPostcode'].value.trim() === '') {
            this.cmdGetAddress_onclick();
        }
    }

    public lookupSearchAPI(key: string): void {
        switch (key) {
            case 'generalLookup':
                let queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                let lookupQuery: any;
                queryParams.set(this.serviceConstants.Action, '3');
                lookupQuery = [{
                    'table': 'Employee',
                    'query': { 'EmployeeCode': this.uiForm.controls['ContractSalesEmployee'].value, 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['EmployeeSurname']
                },
                {
                    'table': 'Branch',
                    'query': { 'BranchNumber': this.utils.getBranchCode(), 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['BranchName']
                },
                {
                    'table': 'PaymentType',
                    'query': { 'PaymentTypeCode': this.uiForm.controls['PaymentTypeCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['PaymentDesc', 'MandateRequired', 'ReferenceRequired']
                },
                {
                    'table': 'SystemInvoiceFrequencyLang',
                    'query': { 'InvoiceFrequencyCode': this.uiForm.controls['InvoiceFrequencyCode'].value, 'LanguageCode': this.riExchange.LanguageCode() },
                    'fields': ['SystemInvoiceFrequencYDesc']
                }
                ];
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                    value => {
                        if (value['results']) {
                            for (let i = 0; i < value['results'].length; i++) {
                                if (!value['results'][i][0])
                                    continue;
                                let obj = value['results'][i][0];
                                if (obj['EmployeeSurname']) {
                                    this.uiForm.controls['SalesEmployeeSurname'].setValue(obj['EmployeeSurname']);
                                }
                                if (obj['PaymentDesc']) {
                                    this.uiForm.controls['PaymentDesc'].setValue(obj['PaymentDesc']);
                                }
                            }
                            let thisRef = this;
                            setTimeout(function (): void {
                                thisRef.GetClientTypeDetails(false); //loading the middle section service call values
                            }, 1000);
                        }
                    },
                    error => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    () => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                );
                break;
            case 'PaymentTypeKeyDown':
                if (this.uiForm.controls['PaymentTypeCode'].value !== '') {
                    queryParams = new URLSearchParams();
                    queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                    queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                    queryParams.set(this.serviceConstants.Action, '3');
                    lookupQuery = [
                        {
                            'table': 'PaymentType',
                            'query': { 'PaymentTypeCode': this.uiForm.controls['PaymentTypeCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
                            'fields': ['PaymentDesc', 'MandateRequired', 'ReferenceRequired']
                        }
                    ];
                    this.ajaxSource.next(this.ajaxconstant.START);
                    this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                        value => {
                            if (value['results']) {
                                for (let i = 0; i < value['results'].length; i++) {
                                    if (value['results'][i].length <= 0) {
                                        this.messageModal.show({ msg: MessageConstant.Message.noRecordFound, title: '' }, false);
                                    } else {
                                        let obj = value['results'][i][0];
                                        if (obj['PaymentDesc']) {
                                            this.uiForm.controls['PaymentDesc'].setValue(obj['PaymentDesc']);
                                        }
                                    }
                                }
                            }
                        },
                        error => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        },
                        () => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        }
                    );
                }
                break;
            default:
                break;

        }
    }

    public toCamelCase(key: any): any {
        let out = '';
        let sentenceCase = this.uiForm.controls[key].value;
        if (sentenceCase !== '') {
            let tempArr = sentenceCase.split(' ');
            for (let i in tempArr) {
                if (true) {
                    out += tempArr[i][0].toUpperCase();
                    if (tempArr[i].length > 1) {
                        out += tempArr[i].substring(1);
                    }
                }
            }
            this.uiForm.controls[key].setValue(out);
        }
        return out;
    }
}
