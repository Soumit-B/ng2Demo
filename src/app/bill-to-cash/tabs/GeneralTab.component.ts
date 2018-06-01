import { enableProdMode } from '@angular/core';
/**
 * Component - GeneralTab
 * Refered In - Tabs of 'Bill To Cash' pages
 * Functionality - Contains form to view/update general tab data
 */
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceActionTypes } from './../../actions/invoice';
import { Utils } from './../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { BillToCashConstants } from './../bill-to-cash-constants';
import { InvoiceFeeSearchComponent } from './../../internal/search/iCABSBInvoiceFeeSearch';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './../../../shared/services/http-service';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { PaymentSearchComponent } from './../../internal/search/iCABSBPaymentTypeSearch';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { PaymentTermSearchComponent } from './../../internal/search/iCABSBPaymentTermSearch.component';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { RiExchange } from './../../../shared/services/riExchange';
import { Subscription } from 'rxjs/Subscription';
import { CommonDropdownComponent } from './../../../shared/components/common-dropdown/common-dropdown.component';
import { SystemInvoiceFormatLanguageSearchComponent } from './../../internal/search/iCABSSSystemInvoiceFormatLanguageSearch.component';
import { StaticUtils } from './../../../shared/services/static.utility';

@Component({
    selector: 'icabs-general-tab',
    templateUrl: 'GeneralTab.html'
})

export class GeneralTabComponent implements OnInit, OnDestroy {
    @ViewChild('InvoiceIssueTypeDropdown') invoiceIssueTypeDropdown: CommonDropdownComponent;
    @ViewChild('paymentTermEllipsis') public paymentTermEllipsis: EllipsisComponent;
    public storeSubscription: Subscription;
    public generalFormGroup: FormGroup;
    public invoiceFeeSearchComponent = InvoiceFeeSearchComponent;
    public paymentMethodSearchComponent = PaymentSearchComponent;
    public showHeader = true;
    public showCloseButton = true;
    // Properties To Show Hide Controls
    public elementShowHide = {
        PaymentType: false,
        InvoiceFee: true,
        HideProductDetailOnInvoice: true,
        InvoiceFeeEllipsisCloseButton: true,
        InvoiceFeeEllipsisHeader: true,
        GroupByVisits: true,
        OverridePrintOption: false
    };
    // Object TO Enable/Disable Inputs
    public elementStates = {
        InvoiceFeeEllipsis: false,
        InvoiceFee: false
    };

    // Store Objects
    public storeData: Object;
    public storeCode: Object;
    public storeMode: Object;
    public storeSysChars: Object;
    public storeOtherDetails: Object;
    public storeFormGroup: Object;
    public storeFormValidKey: string = 'General';

    // Ellipsis Configurations
    public PaymentTermSearchComponent = PaymentTermSearchComponent;
    public accountSearchComponent = AccountSearchComponent;
    // Query Parameter Objects
    public ellipsisQueryParams: Object = {
        invoiceFee: {
            parentMode: 'Lookup'
        },
        paymentTerm: {
            parentMode: 'Lookup'
        },
        inputParamsPaymentTermSearch: {
            parentMode: 'LookUp-Active'
        },
        inputParamsCollectForm: {
            parentMode: 'LookUp-CollectFrom'
        },
        invoiceFormatLanguageSearch: {
            parentMode: 'LookUp'
        }
    };
    public modalConfig: Object;

    // Query Parameters
    public issueTypeQuery: URLSearchParams;
    public outsortInvoiceQuery: URLSearchParams;

    // Save Mode Parameters
    public isExOAMandateReferenceEnabled = false;

    // Invoice Type
    public paramsInvoiceTypes: any = {
        inputParams: {
            method: 'bill-to-cash/search',
            module: 'invoicing',
            operation: 'System/iCABSSSystemInvoiceIssueTypeLanguageSearch'
        },
        displayFields: ['SystemInvoiceIssueTypeLang.InvoiceIssueTypeCode', 'SystemInvoiceIssueTypeLang.SystemInvoiceIssueTypeDesc']
    };

    // @TODO - Remove Dropdown Data Once The Dropdown Is Created
    public invoiceIssueTypeCodeList = [
        { text: 'Options', value: '' },
        { text: 'Hard Copy', value: '01' },
        { text: 'Direct Debit', value: '02' },
        { text: 'Elctronic Data Interchange', value: '03' },
        { text: 'Fascimile', value: '04' },
        { text: 'Email', value: '05' },
        { text: 'Do Not Print', value: '06' }
    ];
    public invoiceFormatCodeList = [
        { text: 'Options', value: '' },
        { text: 'Contract', value: 'CO' },
        { text: 'Invoice Group', value: 'IG' },
        { text: 'Premise', value: 'PM' },
        { text: 'Product', value: 'PR' }
    ];
    public disableForm: boolean = true;

    public invoiceFormatLanguageSearch = SystemInvoiceFormatLanguageSearchComponent;

    constructor(
        public store: Store<any>,
        public formBuilder: FormBuilder,
        public util: Utils,
        public serviceConstants: ServiceConstants,
        public globalConstant: GlobalConstant,
        public httpService: HttpService,
        public localeTranslateService: LocaleTranslationService,
        private utils: Utils,
        private riExchange: RiExchange
    ) {
        /*
         * Subscribe To Store Data
         * Called an object method from the callback instead of directly using the method
         * Since "this" object context will be lost if used as callback
         */
        this.storeSubscription = this.store.select('invoice').subscribe((data) => {
            this.storeUpdateHandler(data);
        });

        // Set Modal Config For Ellipsis
        this.modalConfig = BillToCashConstants.c_o_ELLIPSIS_MODAL_CONFIG;

        this.ellipsisQueryParams['paymentTerm'][this.serviceConstants.CountryCode] = this.util.getCountryCode();
        this.ellipsisQueryParams['paymentTerm'][this.serviceConstants.BusinessCode] = this.util.getBusinessCode();
    }

    // Lifecycle Methods
    public ngOnInit(): void {
        // Initialize Form
        this.buidForm();

        // Set In Store For Validation
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: BillToCashConstants.c_o_STORE_KEY_NAMES['Dropdown'],
                form: {
                    InvoiceIssueTypeCode: this.invoiceIssueTypeDropdown
                }
            }
        });

        // Initialize Translate Service
        this.localeTranslateService.setUpTranslation();
    }

    public ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    // Object Methods
    /**
     * Method - storeUpdateHandler
     * Callback for any publish to store objects
     * Updates object properties for use
     */
    public storeUpdateHandler(data: Object): void {
        if (data && data['code']) {
            this.storeCode = data['code'];
        }
        if (data && data['formGroup']) {
            this.storeFormGroup = data['formGroup'];
        }
        if (data && data['mode']) {
            this.storeMode = data['mode'];
        }
        switch (data['action']) {
            case InvoiceActionTypes.SAVE_DATA:
                this.storeData = data['data'];
                // Call Method To Update Form
                this.setFormData();
                break;
            case InvoiceActionTypes.SAVE_CODE:
                this.storeCode = data['code'];
                // Set Ellipsis Params
                this.setEllipsisParams();
                break;
            case InvoiceActionTypes.SAVE_SYSCHAR:
                // Set SysChar Values In Property
                this.storeSysChars = data['syschars'];
                // Call Method To Update View
                this.updateViewFromSysChar();
                break;
            case InvoiceActionTypes.SAVE_OTHER_DETAILS:
                // Set Other Details In Property
                this.storeOtherDetails = data['otherDetails'];
                // Set Details In Forms
                this.setDetailsInForms();
                break;
            case InvoiceActionTypes.UPDATE_LIVE_INVOICE:
                this.generalFormGroup.controls['LiveInvoiceGroup'].setValue(data['isLiveInvoice']);
                break;
            case InvoiceActionTypes.RESET_FORMS:
                this.setFormData();
                this.setDetailsInForms();
                break;
            case InvoiceActionTypes.SAVE_MODE:
                if (this.generalFormGroup) {
                    this.riExchange.riInputElement.Enable(this.generalFormGroup, 'PaymentTermCode');
                    if (this.storeMode['updateMode']) {
                        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'PaymentTermCode');
                    }
                }
                break;
        }
    }

    /**
     * Method - buildForm
     * Builds The Form
     */
    public buidForm(): void {
        this.generalFormGroup = this.formBuilder.group({
            InvoiceGroupDesc: [{ value: '', disabled: false }, Validators.required],
            InvoiceFeeCode: [{ value: '', disabled: false }, Validators.required],
            InvoiceFeeDesc: [{ value: '', disabled: true }],
            PaymentTypeCode: [{ value: '', disabled: false }],
            OverridePrintOption: [{ value: '' }],
            PaymentDesc: [{ value: '', disabled: false }],
            InvoiceLanguageCode: [{ value: '', disabled: false }, Validators.required],
            LanguageDescription: [{ value: '', disabled: true }],
            CurrencyCode: [{ value: '', disabled: false }, Validators.required],
            CurrencyDesc: [{ value: '', disabled: true }],
            InvoiceCopies: [{ value: '', disabled: false }, Validators.required],
            PaymentTermCode: [{ value: '', disabled: false }, Validators.required],
            PaymentTermDesc: [{ value: '', disabled: true }],
            CollectFrom: [{ value: '', disabled: false }],
            CollectFromName: [{ value: '', disabled: true }],
            ExOAMandateReference: [{ value: '', disabled: false }],
            TaxRegistrationNumber: [{ value: '', disabled: false }],
            PrintClientReference: [{ value: '', disabled: false }],
            PrintPurchaseOrderNo: [{ value: '', disabled: false }],
            PrintPremiseAddress: [{ value: '', disabled: false }],
            PrintProductDesc: [{ value: '', disabled: false }],
            OutsortInvoice: [{ value: '', disabled: false }],
            OutsortInvoiceSequence: [{ value: '', disabled: false }],
            ScheduleRequired: [{ value: '', disabled: false }],
            HideProductDetailOnInvoice: [{ value: '', disabled: false }],
            LiveInvoiceGroup: [{ value: '', disabled: false }],
            GroupByVisits: [{ value: '', disabled: false }],
            CombineInvoiceValueInd: [{ value: '', disabled: false }],
            CombineInvoiceValueDesc: [{ value: '', disabled: true }],
            InvoiceIssueTypeCode: [{ value: '', disabled: true }, Validators.required],
            SystemInvoiceFormatCode: [{ value: '', disabled: false }, Validators.required],
            SystemInvoiceFormatDesc: [{ value: '', disabled: true }]
        });

        // Set In Store For Validation
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormValidKey,
                form: this.generalFormGroup
            }
        });

        this.generalFormGroup.disable();
        this.invoiceIssueTypeDropdown.isDisabled = true;
        // @todo - Disable
        //this.invoiceFormatCodeDropdown.disabled = true;
    }

    /**
     * Method - setFormData
     * Sets form data
     */
    public setFormData(): void {
        this.generalFormGroup.reset();
        this.generalFormGroup.controls['InvoiceGroupDesc'].setValue(this.storeData['InvoiceGroupDesc']);
        this.generalFormGroup.controls['PaymentTypeCode'].setValue(this.storeData['PaymentTypeCode']);
        this.generalFormGroup.controls['InvoiceIssueTypeCode'].setValue(this.storeData['InvoiceIssueTypeCode']);
        this.invoiceIssueTypeDropdown.isActive = this.getIssueTypeValue(this.storeData['InvoiceIssueTypeCode']);
        this.generalFormGroup.controls['SystemInvoiceFormatCode'].setValue(this.storeData['SystemInvoiceFormatCode']);
        this.generalFormGroup.controls['OverridePrintOption'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['OverridePrintOption']));
        this.generalFormGroup.controls['CurrencyCode'].setValue(this.storeData['CurrencyCode']);
        this.generalFormGroup.controls['CurrencyDesc'].setValue(this.storeData['CurrencyDesc']);
        this.generalFormGroup.controls['InvoiceLanguageCode'].setValue(this.storeData['LanguageCode']);
        this.generalFormGroup.controls['InvoiceFeeCode'].setValue(this.storeData['InvoiceFeeCode']);
        this.generalFormGroup.controls['LanguageDescription'].setValue(this.storeData['LanguageDescription']);
        this.generalFormGroup.controls['InvoiceCopies'].setValue(this.storeData['InvoiceCopies']);
        this.generalFormGroup.controls['PaymentTermCode'].setValue(this.storeData['PaymentTermCode']);
        this.generalFormGroup.controls['PaymentTermDesc'].setValue(this.storeData['PaymentTermDesc']);
        this.generalFormGroup.controls['ExOAMandateReference'].setValue(this.storeData['ExOAMandateReference']);
        this.generalFormGroup.controls['TaxRegistrationNumber'].setValue(this.storeData['TaxRegistrationNumber']);
        this.generalFormGroup.controls['PrintClientReference'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['PrintClientReference']));
        this.generalFormGroup.controls['PrintPurchaseOrderNo'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['PrintPurchaseOrderNo']));
        this.generalFormGroup.controls['PrintPremiseAddress'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['PrintPremiseAddress']));
        this.generalFormGroup.controls['PrintProductDesc'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['PrintProductDesc']));
        this.generalFormGroup.controls['OutsortInvoice'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['OutsortInvoice']));
        this.generalFormGroup.controls['OutsortInvoiceSequence'].setValue(this.storeData['OutsortInvoiceSequence']);
        this.generalFormGroup.controls['ScheduleRequired'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['ScheduleRequired']));
        this.generalFormGroup.controls['HideProductDetailOnInvoice'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['HideProductDetailOnInvoice']));
        if (!this.storeMode['addMode']) {
            this.generalFormGroup.controls['LiveInvoiceGroup'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['LiveInvoiceGroup']));
        }
        this.generalFormGroup.controls['GroupByVisits'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['GroupByVisits']));
        this.generalFormGroup.controls['CombineInvoiceValueInd'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['CombineInvoiceValueInd']));
        this.generalFormGroup.controls['CombineInvoiceValueDesc'].setValue(this.storeData['CombineInvoiceValueDesc']);
        this.showGroupByVisits();
        this.disableForm = false;
        this.enableForm();
    }

    private getIssueTypeValue(issueType: string): any {
        let list: Array<any> = this.invoiceIssueTypeDropdown.requestdata;
        let dropdownValue: any = {};

        list.forEach(value => {
            if (value['SystemInvoiceIssueTypeLang.InvoiceIssueTypeCode'] === issueType) {
                dropdownValue['id'] = issueType;
                dropdownValue['text'] = issueType + ' - ' + value['SystemInvoiceIssueTypeLang.SystemInvoiceIssueTypeDesc'];
                // This return is equivalent to loop break; Not actually returning value to the calling method
                return false;
            }
        });

        return dropdownValue;
    }

    private enableForm(): void {
        this.generalFormGroup.enable();
        if (this.storeMode['updateMode']) {
            this.riExchange.riInputElement.Disable(this.generalFormGroup, 'PaymentTermCode');
        }
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'InvoiceFeeDesc');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'PaymentDesc');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'CurrencyDesc');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'LanguageDescription');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'PaymentTermDesc');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'CollectFromName');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'CollectFromName');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'SystemInvoiceFormatDesc');
        this.invoiceIssueTypeDropdown.isDisabled = false;
    }

    /**
     * Method - updateViewFromSysChars
     * Update view from syschars
     */
    public updateViewFromSysChar(): void {
        let sysCharsValue = this.storeSysChars;

        // Payment Type Show/Hide
        if (sysCharsValue['vSCEnablePayTypeAtInvGroupLev']) {
            // Set Validator
            this.generalFormGroup.controls['PaymentTypeCode'].setValidators(Validators.required);
        }
        this.elementShowHide.PaymentType = sysCharsValue['vSCEnablePayTypeAtInvGroupLev'];

        this.elementShowHide.InvoiceFee = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.generalFormGroup, 'InvoiceFeeCode', true);

        // Invoice Fee Mandatory
        if (!sysCharsValue['vSCEnableInvoiceFee']) {
            // Set Validator
            this.riExchange.riInputElement.SetRequiredStatus(this.generalFormGroup, 'InvoiceFeeCode', false);
            // Show/Hide Mandatory Mark Span
            this.elementShowHide.InvoiceFee = false;
        }

        // Hide Product Detail On Invoice
        this.elementShowHide.HideProductDetailOnInvoice = sysCharsValue['vSCInvoiceShowProductDetail'];
    }

    /**
     * Method - setDetailsInForms
     * Called from the store otherDetails key update
     * Updates the form controls
     */
    public setDetailsInForms(): void {
        if (this.storeMode['addMode']) {
            this.generalFormGroup.controls['LiveInvoiceGroup'].setValue(true);
        }
        // Set Form Control Values
        this.generalFormGroup.controls['CurrencyDesc'].setValue(this.storeOtherDetails['CurrencyDesc'] || '');
        this.generalFormGroup.controls['PaymentTermDesc'].setValue(this.storeOtherDetails['PaymentTermDesc'] || '');
        this.generalFormGroup.controls['LanguageDescription'].setValue(this.storeOtherDetails['LanguageDescription'] || '');
        this.generalFormGroup.controls['SystemInvoiceFormatDesc'].setValue(this.storeOtherDetails['SystemInvoiceFormatDesc'] || '');
        if (this.generalFormGroup.controls['InvoiceFeeCode'].value) {
            this.generalFormGroup.controls['InvoiceFeeDesc'].setValue(this.storeOtherDetails['InvoiceFeeDesc'] || '');
        }
    }

    /**
     * Method - setEllipsisParams
     * Sets all the ellipsis input paramters in the page
     */
    public setEllipsisParams(): void {
        for (let key in this.ellipsisQueryParams) {
            if (!key) {
                continue;
            }
            this.ellipsisQueryParams[key]['parentMode'] = this.ellipsisQueryParams[key].parentMode;
            this.ellipsisQueryParams[key][this.serviceConstants.BusinessCode] = this.storeCode[this.serviceConstants.BusinessCode];
            this.ellipsisQueryParams[key][this.serviceConstants.CountryCode] = this.storeCode[this.serviceConstants.CountryCode];
        }
    }

    /**
     * Method - showGroupByVisits
     */
    public showGroupByVisits(): void {
        let invoiceFormatCode = this.generalFormGroup.controls['SystemInvoiceFormatDesc'].value;
        /**
         * Show group by visits control if invoice format code = PM OR PR
         */
        this.elementShowHide.GroupByVisits = (BillToCashConstants.c_arr_GROUPBYVISITS_FORMAT_CODES.indexOf(invoiceFormatCode) > -1);
    }

    /**
     * Method - dispatchError
     * Dispatches to store so that the main page can get the event and show the error
     */
    public dispatchError(error: any): void {
        this.store.dispatch({
            type: InvoiceActionTypes.DISPATCH_ERROR,
            payload: error
        });
    }
    /**
     * Method - dispatchError
     * Dispatches to store so that the main page can get the event and show the error
     */
    public dispatchGeneralError(error: any): void {
        let errorObject: Object = {};
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.isLogRequired] = true;
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.error] = error;
        this.dispatchError(errorObject);
    }

    // Ellipsis Data Select Events
    /**
     * Method - onInvoiceFeeDataReceived
     * Gets executed when invoice fee data is recieved from ellipsis
     */
    public onInvoiceFeeDataReceived(data: any): void {
        this.generalFormGroup.controls['InvoiceFeeCode'].setValue(data.InvoiceFeeCode);
        if (data.InvoiceFeeDesc) {
            this.generalFormGroup.controls['InvoiceFeeDesc'].setValue(data.InvoiceFeeDesc);
        }
    }

    /**
     * Method - onPaymentMethodDataReceived
     * Gets executed when invoice fee data is recieved from ellipsis
     */
    public onPaymentMethodDataReceived(data: any): void {
        this.generalFormGroup.controls['PaymentTypeCode'].setValue(data.PaymentTypeCode);
        if (data.Object.PaymentDesc) {
            this.generalFormGroup.controls['PaymentDesc'].setValue(data.Object.PaymentDesc);
        }
    }

    // Dropdown Data Select Events
    /**
     * Method - onInvoiceIssueTypeChange
     * Execute invoice issue type change event
     */
    public onInvoiceIssueTypeChange(data: any): void {
        // SysChar Store Is Not Set Do Not Execute The Logic
        if (!this.storeSysChars) {
            return;
        }
        let sysChars = this.storeSysChars;
        let issueType = data['SystemInvoiceIssueTypeLang.InvoiceIssueTypeCode'];

        this.generalFormGroup.controls['InvoiceIssueTypeCode'].setValue(issueType);
        this.elementShowHide.OverridePrintOption = (sysChars['vSCPrintEDIInvoices'] && sysChars['vSCEnablePayTypeAtInvGroupLev'] && issueType === '03');
    }

    /**
     * Method - onInvoiceFormatChange
     * Execute invoice format change event
     */
    public onInvoiceFormatChange(data: any): void {
        let controlValue: string = this.generalFormGroup.controls['SystemInvoiceFormatCode'].value;
        let lookupQuery: any = [{
            'table': 'SystemInvoiceFormatLang',
            'query': { 'SystemInvoiceFormatCode': controlValue, 'LanguageCode': this.riExchange.LanguageCode() },
            'fields': ['SystemInvoiceFormatDesc']
        }];

        if (!controlValue) {
            this.generalFormGroup.controls['SystemInvoiceFormatDesc'].setValue('');
        } else {

            this.getDescriptions(lookupQuery, 'SystemInvoiceFormatDesc', 'SystemInvoiceFormatDesc');
        }

        this.generalFormGroup.controls['SystemInvoiceFormatCode'].setValue(StaticUtils.toUpperCase(controlValue));

        this.showGroupByVisits();
    }

    // Text On Change Events
    /**
     * Method - onExOAMandateReferenceChange
     * Execute ExOAMandateReference change event
     */
    public onExOAMandateReferenceChange(event: any): void {
        let inputValue = this.generalFormGroup.controls['ExOAMandateReference'].value;

        this.isExOAMandateReferenceEnabled = false;

        if (inputValue) {
            this.isExOAMandateReferenceEnabled = true;
        }
    }

    /**
     * Method - onCollectFormChange
     * Executes on collect from change event
     */
    public onCollectFormChange(event: any): void {
        let collectFrom = this.generalFormGroup.controls['CollectFrom'].value;

        // Do Not Format If Length Is Same As Default
        if (collectFrom.length === this.globalConstant.AppConstants['defaultFormatSize']) {
            return;
        }

        collectFrom = this.util.fillLeadingZeros(collectFrom);

        this.generalFormGroup.controls['CollectFrom'].setValue(collectFrom);

        let code: string = this.generalFormGroup.controls['CollectFrom'].value;
        let lookupQuery: any = [{
            'table': 'Account',
            'query': { 'AccountNumber': code },
            'fields': ['AccountName']
        }];

        this.getDescriptions(lookupQuery, 'CollectFromName', 'AccountName');
    }

    /**
     * Method - onLiveInvoiceGroupChange
     * Executes on live invoice group control change
     * Will update store to make HTTP call from parent
     * Response will be recieved in store update callback - storeUpdateHandler
     */
    public onLiveInvoiceGroupChange(): void {
        let liveInvoiceGroup = this.generalFormGroup.controls['LiveInvoiceGroup'].value;

        // Execute HTTP Only If Check Box Is Unchecked
        if (liveInvoiceGroup) {
            return;
        }

        // Update Sotre
        this.store.dispatch({
            type: InvoiceActionTypes.CHECK_LIVE_INVOICE
        });
    }

    /**
     * Method - onCombineInvoiceValueIndChange
     * Executes on combine invoice value change
     * If checked, disables the controls and clears the value
     * Else, enables the checkbox
     */
    public onCombineInvoiceValueIndChange(): void {
        //this.generalFormGroup.controls['CombineInvoiceValueDesc'].disabled = this.generalFormGroup.controls['CombineInvoiceValueInd'].value;

        // Clear Value
        if (!this.generalFormGroup.controls['CombineInvoiceValueInd'].value) {
            this.generalFormGroup.controls['CombineInvoiceValueDesc'].disable();
            this.generalFormGroup.controls['CombineInvoiceValueDesc'].setValue('');
        } else {
            this.generalFormGroup.controls['CombineInvoiceValueDesc'].enable();
        }
    }

    /**
     * Method - onPaymentTypeCodeChange
     * Makes HTTP call to get InvoiceIssueTypeCode and InvoiceIssueTypeDesc
     */
    public onPaymentTypeCodeChange(): void {
        let paymentType = this.generalFormGroup.controls['PaymentTypeCode'].value;

        // Do Not Make HTTP Call If Input Value Is Blank
        if (!paymentType) {
            return;
        }

        this.issueTypeQuery = new URLSearchParams();
        let formData: Object = {};

        // Initialize Query
        this.issueTypeQuery.set(this.serviceConstants.BusinessCode,
            this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeBusiness']]);
        this.issueTypeQuery.set(this.serviceConstants.CountryCode,
            this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeCountry']]);
        this.issueTypeQuery.set(this.serviceConstants.Action, '6');

        // Initialize Form Data
        formData[this.serviceConstants.AccountNumber] = this.storeFormGroup['main'].controls['AccountNumber'].value;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['PaymentTypeCode']] = paymentType;
        formData[this.serviceConstants.Function] = 'GetDefaultIssueType';

        // Make Calls
        this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.issueTypeQuery,
            formData).subscribe(
            (data) => {
                if (data['errorMessage'] !== undefined) {
                    this.dispatchError({
                        msg: data.errorMessage
                    });
                    return;
                }
                if (data.InvoiceIssueTypeCode) {
                    this.invoiceIssueTypeDropdown.isActive = this.getIssueTypeValue(data.InvoiceIssueTypeCode);
                }
            },
            (error) => {
                this.dispatchGeneralError(error);
            });
    }

    /**
     * Method - onOutsortInvoiceChange
     * Executes On OutsortInvoiceChange
     */
    public onOutsortInvoiceChange(): void {
        let formData: Object = {};

        if (!this.storeMode['updateMode']) {
            return;
        }

        this.outsortInvoiceQuery = new URLSearchParams();

        // Initialize Query
        this.outsortInvoiceQuery.set(this.serviceConstants.BusinessCode,
            this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeBusiness']]);
        this.outsortInvoiceQuery.set(this.serviceConstants.CountryCode,
            this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeCountry']]);
        this.outsortInvoiceQuery.set(this.serviceConstants.Action, '6');

        formData[this.serviceConstants.AccountNumber] = this.storeFormGroup['main'].controls['AccountNumber'].value;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['OutsortInvoice']] = this.storeFormGroup['General'].controls['OutsortInvoice'].value;
        formData[this.serviceConstants.Function] = 'UpdateOutsortInvoice';

        // Make Calls
        this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.outsortInvoiceQuery,
            formData).subscribe(
            (data) => {
                if (!data) {
                    return;
                }
                if (data['errorMessage'] !== undefined) {
                    this.dispatchError({
                        msg: data.errorMessage
                    });
                    return;
                }
            },
            (error) => {
                this.dispatchGeneralError(error);
            });

    }

    public onPaymentTermReceived(data: any): void {
        let PaymentTermNumber = data['PaymentTermNumber'];
        let PaymentTermDesc = data['PaymentTermDesc'];

        // Set Invoice Group Number
        this.generalFormGroup.controls['PaymentTermCode'].setValue(PaymentTermNumber);
        this.generalFormGroup.controls['PaymentTermDesc'].setValue(PaymentTermDesc);
        // this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentTermNumber', PaymentTermNumber);
        // this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentTermDesc', PaymentTermDesc);
    }

    public onAccountNumberReceived(data: any): void {
        this.generalFormGroup.controls['CollectFrom'].setValue(data['AccountNumber']);
        this.generalFormGroup.controls['CollectFromName'].setValue(data['AccountName']);
    }

    public onInvoiceFeeChange(event: any): void {
        let invoiceFeeCode: string = this.generalFormGroup.controls['InvoiceFeeCode'].value;
        let lookupQuery: any = [{
            'table': 'InvoiceFee',
            'query': { 'InvoiceFeeCode': invoiceFeeCode },
            'fields': ['InvoiceFeeDesc']
        }];

        this.getDescriptions(lookupQuery, 'InvoiceFeeDesc', 'InvoiceFeeDesc');
    }

    public onLanguageChange(event: any): void {
        let code: string = this.generalFormGroup.controls['InvoiceLanguageCode'].value;
        let lookupQuery: any = [{
            'table': 'Language',
            'query': { 'LanguageCode': code },
            'fields': ['LanguageDescription']
        }];

        this.getDescriptions(lookupQuery, 'LanguageDescription', 'LanguageDescription');
    }

    public onCurrencyChange(event: any): void {
        let code: string = this.generalFormGroup.controls['CurrencyCode'].value;
        let lookupQuery: any = [{
            'table': 'Currency',
            'query': { 'CurrencyCode': code },
            'fields': ['CurrencyDesc']
        }];

        this.getDescriptions(lookupQuery, 'CurrencyDesc', 'CurrencyDesc');
    }

    public onPaymentTermChange(event: any): void {
        let code: string = this.generalFormGroup.controls['PaymentTermCode'].value;
        let lookupQuery: any = [{
            'table': 'PaymentTerm',
            'query': { 'PaymentTermCode': code },
            'fields': ['PaymentTermDesc']
        }];

        this.getDescriptions(lookupQuery, 'PaymentTermDesc', 'PaymentTermDesc');
    }

    private getDescriptions(lookupQuery: any, controlName: string, fieldName: string): void {
        let query = new URLSearchParams();

        // Set Paramters
        query.set(this.serviceConstants.BusinessCode,
            this.utils.getBusinessCode());
        query.set(this.serviceConstants.CountryCode,
            this.utils.getCountryCode());
        query.set(this.serviceConstants.Action, '0');
        query.set(this.serviceConstants.MaxResults, '1');

        this.httpService.lookUpRequest(query, lookupQuery).subscribe(data => {
            let desc: string = '';
            if (data.results[0].length) {
                desc = data.results[0][0][fieldName];
            }
            this.generalFormGroup.controls[controlName].setValue(desc);
        }, error => {
            this.dispatchGeneralError(error);
        });
    }

    public onInvoiceFormatLanguageDataReceived(data: any): void {
        this.generalFormGroup.controls['SystemInvoiceFormatCode'].setValue(data.SystemInvoiceFormatCode);
        this.generalFormGroup.controls['SystemInvoiceFormatDesc'].setValue(data.SystemInvoiceFormatDesc);
    }
}
