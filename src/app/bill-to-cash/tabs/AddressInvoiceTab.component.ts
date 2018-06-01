/**
 * Component - AddressInvoiceTabComponent
 * Refered In - Tabs of 'Bill To Cash' pages
 * Functionality - Contains form to view/update invoice address data
 * Notes -
 *  InvoiceAddressLine4 control is populated from AddressLine4
 *  InvoiceAddressLine5 control is populated from AddressLine5
 */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { InvoiceActionTypes } from './../../actions/invoice';
import { Utils } from './../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { TableComponent } from './../../../shared/components/table/table';
import { Router } from '@angular/router';
import { BillToCashConstants } from './../bill-to-cash-constants';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { PostCodeSearchComponent } from './../../internal/search/iCABSBPostcodeSearch.component';
import { Logger } from '@nsalaun/ng2-logger';

@Component({
    selector: 'icabs-address-invoice-tab',
    templateUrl: 'AddressInvoiceTab.html'
})

export class AddressInvoiceTabComponent implements OnInit, OnDestroy {
    public storeSubscription: Subscription;
    public ajaxSubscription: Subscription;
    public addressInvoiceFormGroup: FormGroup;

    // Query Parameters
    public postcodeQuery: URLSearchParams;
    public addressQuery: URLSearchParams;

    // Object To Enable/Disable Buttons
    public buttonStates = {
        GetAddress: true,
        PremisesAddress: true,
        AccountAddress: true,
        InvoiceAddress: true,
        CopyInvoice: true
    };
    // Object To Show Hide Controls
    public elementShowHide = {
        GetAddress: true,
        AddressLine3: true,
        AddressLine3Required: false,
        InvoiceAddressLine4Required: false,
        InvoiceAddressLine5Required: false,
        PostCode: true,
        GPSCoordinates: false,
        ContactDetails: false
    };

    // Store Objects
    public storeData: Object;
    public storeCode: Object;
    public storeInvoice: Object;
    public storeMode: Object;
    public storeParams: Object;
    public storeOtherDetails: Object;
    public storeSysChars: Object;
    public storeSentFromParent: Object;
    public storeFormGroup: Object;
    public storeFormKey: string = 'AddressInvoice';
    public maxLen: number = 40;

    // Premise Search Ellipsis Properties
    public showPremiseSearchEllipsis: boolean = true;
    public premiseSearchComponent: any = PremiseSearchComponent;
    public postcodeSearchComponent = PostCodeSearchComponent;
    public modalConfig = {
        backdrop: 'static',
        keyboard: false
    };
    public inputParamsPremise: any = {};
    public inputParamsPostcode: any = {};
    @ViewChild('premiseSearchEllipsis') public premiseSearchEllipsis: EllipsisComponent;
    @ViewChild('postcodeSearchEllipsis') public postcodeSearchEllipsis: EllipsisComponent;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public isRequesting = false;
    public disableForm: boolean = true;

    constructor(
        public store: Store<any>,
        public formBuilder: FormBuilder,
        public httpService: HttpService,
        public serviceConstants: ServiceConstants,
        public utils: Utils,
        public router: Router,
        public localeTranslateService: LocaleTranslationService,
        public ajaxconstant: AjaxObservableConstant,
        public logger: Logger
    ) {
        /*
         * Subscribe To Store Data
         * Called an object method from the callback instead of directly using the method
         * Since "this" object context will be lost if used as callback
         */
        this.storeSubscription = this.store.select('invoice').subscribe((data) => {
            this.storeUpdateHandler(data);
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        // Ajax Subscription For Spinner
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                switch (event) {
                    case this.ajaxconstant.START:
                        this.isRequesting = true;
                        break;
                    case this.ajaxconstant.COMPLETE:
                        this.isRequesting = false;
                        break;
                }
            }
        });
    }

    // Lifecycle Methods
    // ngOnInit - Executed When The Component Is Loaded
    public ngOnInit(): void {
        // Initialize Form
        this.buidForm();

        // If not search mode, enable buttons
        if (!this.storeMode['searchMode']) {
            this.buttonStates.PremisesAddress = false;
            this.buttonStates.AccountAddress = false;
            this.buttonStates.InvoiceAddress = false;
            this.buttonStates.CopyInvoice = false;
        }

        // Initialize Translate Service
        this.localeTranslateService.setUpTranslation();
    }

    // ngOnDestroy - Executed On Object Desry
    public ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
    }

    // Object Methods
    /**
     * Method - storeUpdateHandler
     * Callback for any publish to store objects
     * Updates object properties for use
     */
    public storeUpdateHandler(data: Object): void {
        this.storeMode = {};
        this.storeCode = {};
        this.storeParams = {};
        this.storeInvoice = {};
        this.storeOtherDetails = {};
        this.storeSentFromParent = {};
        // Set code and mode objects in class property
        if (data) {
            if (data['mode']) {
                this.storeMode = data['mode'];
            }
            if (data['code']) {
                this.storeCode = data['code'];
            }
            if (data['params']) {
                this.storeParams = data['params'];
            }
            if (data['invoice']) {
                this.storeInvoice = data['invoice'];
            }
            if (data['otherDetails']) {
                this.storeOtherDetails = data['otherDetails'];
            }
            if (data['sentFromParent']) {
                this.storeSentFromParent = data['sentFromParent'];
            }
            if (data['syschars']) {
                this.storeSysChars = data['syschars'];
            }
        }

        switch (data && data['action']) {
            case InvoiceActionTypes.SAVE_DATA:
                this.storeData = data['data'];
                // Call Method To Update Form
                this.setFormData();
                break;
            case InvoiceActionTypes.SAVE_MODE:
                if (this.storeSysChars['vSCMultiContactInd']) {
                    this.elementShowHide.ContactDetails = true;
                }
                if (this.storeMode['addMode']) {
                    this.elementShowHide.ContactDetails = false;
                }
                break;
            case InvoiceActionTypes.SAVE_SYSCHAR:
                // Set SysChar Values In Property
                this.storeSysChars = data['syschars'];
                if (this.storeSysChars['vSCMultiContactInd']) {
                    this.elementShowHide.ContactDetails = true;
                }
                // Call Method To Update View
                this.updateViewFromSysChar();
                break;
            case InvoiceActionTypes.SAVE_PARAMS:
                // Set SysChar Values In Property
                this.storeParams = data['params'];
                break;
            case InvoiceActionTypes.ADDRESS_DATA_RECEIVED:
                // Call Method To Update Address In Forms
                this.onAddressDataReceived();
                break;
            case InvoiceActionTypes.SET_FORM_GROUPS:
                this.storeFormGroup = data['formGroup'];
                break;
            case InvoiceActionTypes.SET_FORM_GROUPS:
                this.storeFormGroup = data['formGroup'];
                break;
            case InvoiceActionTypes.RESET_FORMS:
                this.setFormData();
                break;
            case InvoiceActionTypes.DISABLE_FORMS:
                this.disableForm = true;
                break;
        }
    }

    /**
     * Method - buildForm
     * Builds The Form
     */
    public buidForm(): void {
        this.addressInvoiceFormGroup = this.formBuilder.group({
            InvoiceName: [{ value: '', disabled: false }, Validators.required],
            InvoiceAddressLine1: [{ value: '', disabled: false }, Validators.required],
            InvoiceAddressLine2: [{ value: '', disabled: false }],
            InvoiceAddressLine3: [{ value: '', disabled: false }],
            InvoiceAddressLine4: [{ value: '', disabled: false }],
            InvoiceAddressLine5: [{ value: '', disabled: false }],
            InvoicePostcode: [{ value: '', disabled: false }, Validators.required],
            InvoiceContactName: [{ value: '', disabled: true }],
            InvoiceContactDepartment: [{ value: '', disabled: true }],
            InvoiceContactPosition: [{ value: '', disabled: true }],
            InvoiceContactMobile: [{ value: '', disabled: true }],
            InvoiceContactTelephone: [{ value: '', disabled: true }],
            InvoiceContactFax: [{ value: '', disabled: true }],
            InvoiceContactEmail: [{ value: '', disabled: true }],
            InvoiceGPSCoordinateX: [{ value: '', disabled: true }],
            InvoiceGPSCoordinateY: [{ value: '', disabled: true }]
        });

        // Set In Store For Validation
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormKey,
                form: this.addressInvoiceFormGroup
            }
        });

        this.addressInvoiceFormGroup.disable();
    }

    /**
     * Method - setFormData
     * Sets form data
     */
    public setFormData(): void {
        this.addressInvoiceFormGroup.reset();
        try {
            this.addressInvoiceFormGroup.controls['InvoiceName'].setValue(this.storeData['InvoiceName'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine1'].setValue(this.storeData['InvoiceAddressLine1'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine2'].setValue(this.storeData['InvoiceAddressLine2'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine3'].setValue(this.storeData['InvoiceAddressLine3'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValue(this.storeData['InvoiceAddressLine4'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(this.storeData['InvoiceAddressLine5'].trim());
            this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(this.storeData['InvoicePostcode'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactName'].setValue(this.storeData['InvoiceContactName'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].setValue(this.storeData['InvoiceContactDepartment'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].setValue(this.storeData['InvoiceContactPosition'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].setValue(this.storeData['InvoiceContactMobile'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].setValue(this.storeData['InvoiceContactTelephone'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactFax'].setValue(this.storeData['InvoiceContactFax'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].setValue(this.storeData['InvoiceContactEmail'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceGPSCoordinateX'].setValue(this.storeData['InvoiceGPSCoordinateX'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceGPSCoordinateY'].setValue(this.storeData['InvoiceGPSCoordinateY'].trim());
        } catch (ignore) {
            // Do ntohing. Checked for case of Add
        }
        this.disableForm = false;
        this.addressInvoiceFormGroup.enable();
        this.sensitiseContactDetails(!this.storeSysChars['vSCMultiContactInd']);
    }

    /**
     * Method - updateViewFromSysChars
     * Update view from syschars
     */
    public updateViewFromSysChar(): any {
        let sysCharsValue = this.storeSysChars;
        // Get Address Button Show/Hide
        this.elementShowHide.GetAddress = true;
        if (!sysCharsValue['vSCEnableHopewiserPAF'] && !sysCharsValue['vSCEnableDatabasePAF']) {
            this.elementShowHide.GetAddress = false;
        }

        /**
         * If Address Line 3 Field Is Disabled In SysChars Hide The Field
         * Else If It Is Required In SysChars Add Validator And Show Required Mark
         */
        if (sysCharsValue['vDisableFieldList'].indexOf('AddressLine3') >= 0) {
            // Show/Hide Address Line 3
            this.elementShowHide.AddressLine3 = false;
        } else if (sysCharsValue['vSCAddressLine3Logical']) {
            // Set Validator
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine3'].setValidators(Validators.required);
            // Show/Hide Mandatory Mark Span
            this.elementShowHide.AddressLine3Required = true;
        }

        // InvoiceAddressLine4 Mandatory
        if (sysCharsValue['vSCAddressLine4Logical'] ||
            !(!sysCharsValue['vSCEnablePostcodeSuburbLog'] && sysCharsValue['vSCEnableValidatePostcodeSuburb'])) {
            // Set Validator
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValidators(Validators.required);
            // Show/Hide Mandatory Mark Span
            this.elementShowHide.InvoiceAddressLine4Required = true;
        }

        // InvoiceAddressLine5 Mandatory
        if (sysCharsValue['vSCAddressLine5Logical']) {
            // Set Validator
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValidators(Validators.required);
            // Show/Hide Mandatory Mark Span
            this.elementShowHide.InvoiceAddressLine5Required = true;
        }

        // Postcode Mandatory
        if (sysCharsValue['vSCHidePostcode']) {
            // Clear Validator
            this.addressInvoiceFormGroup.controls['InvoicePostcode'].clearValidators();
            // Show/Hide Control
            this.elementShowHide.PostCode = false;
        }

        // GPS Coordinates Show/Hide
        if (sysCharsValue['vSCEnableGPSCoordinates']) {
            this.elementShowHide.GPSCoordinates = true;
        }

        // Display Contact Details Button In Update And Search Mode
        this.elementShowHide.ContactDetails = true;
        if (!sysCharsValue['vSCMultiContactInd'] || this.storeMode['addMode']) {
            this.elementShowHide.ContactDetails = false;
        }

        if (sysCharsValue['vSCEnableMaxAddress']) {
            this.maxLen = sysCharsValue['vSCEnableMaxAddressValue'];
        }

        this.sensitiseContactDetails(!sysCharsValue['vSCMultiContactInd']);
    }

    /**
     * Method - onAddressDataReceived
     * Executes if store action is ADDRESS_DATA_RECEIVED
     * Makes call to the appropiate methods and updates the fields
     */
    public onAddressDataReceived(): void {
        let addressForTab = this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']];
        let addressType = this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']];

        // If Address Is Not Requested From This Tab Do Not Execute Logic
        if (addressForTab !== this.storeFormKey) {
            return;
        }

        // Call Method Based On Address Type
        switch (addressType) {
            case BillToCashConstants.c_o_ADDRESS_TYPES['Invoice']:
                this.onInvoiceAddressDataReceived();
                break;
            case BillToCashConstants.c_o_ADDRESS_TYPES['General']:
                this.onInvoiceAddressDataReceived();
                break;
        }
    }

    /**
     * Method - navigateToGetAddress
     * Dispatches data to store
     * Store update will trigger navigation
     * Store update for this action is handled in main page - Invoice Group Maintenance
     * Takes page name as parameter; Route will be picked from constants using page
     * Navigates to another page
     */
    public navigateToGetAddress(page: string): void {
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']] = this.storeFormKey;
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_PARAMS,
            payload: this.storeParams
        });
        if (page === 'GetPremisesAddress') {
            // Dispatch Data To Store; For Navigation
            this.store.dispatch({
                type: InvoiceActionTypes.NAVIGATE,
                payload: page
            });
        }
    }

    /**
     * Method - getPremisesAddress
     * Navigate to premises address page
     */
    public getInvoiceTabPremisesAddress(): void {
        let mode: string = 'AddInvoiceGroup';
        // Set In storeParams Propert So That It Can Be Retireived When Back In This Page
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = BillToCashConstants.c_o_ADDRESS_TYPES['Premises'];
        // Call method to navigate
        this.showPremiseSearchEllipsis = false;
        mode = 'AddInvoiceGroup';
        if (this.storeFormGroup['main'].controls['InvoiceGroupNumber'].value) {
            mode = 'InvoiceGroupGetAddress';
        }
        this.inputParamsPremise = {
            parentMode: mode,
            AccountNumber: this.storeInvoice[this.serviceConstants.AccountNumber],
            AccountName: this.storeInvoice['AccountName'],
            InvoiceGroupNumber: this.storeInvoice['InvoiceGroupNumber']
        };
        this.premiseSearchEllipsis.childConfigParams = this.inputParamsPremise;
        this.premiseSearchEllipsis.openModal();
    }

    /**
     * Method - onPremisesAddressDataReceived
     * Gets executes on data recieved from premises form
     */
    public onPremisesAddressDataReceived(data: any): void {
        let premiseNumber = data[this.serviceConstants.PremiseNumber];
        let contractNumber = data[this.serviceConstants.ContractNumber];
        let formData = {};

        // Do Not Execute If premiseNumber Is Not Set
        if (!premiseNumber) {
            return;
        }

        // If contractNumber Is Not Set Call Method To Get Address Using AccountNumber And Break From Method
        if (!contractNumber) {
            this.getInvoiceAddressFromAccountNumber();
            return;
        }

        // Initialize Form Data
        formData[this.serviceConstants.PremiseNumber] = premiseNumber;
        formData[this.serviceConstants.ContractNumber] = contractNumber;
        formData[this.serviceConstants.Function] = 'GetInvAddressFromPremise';

        this.updateAddressInForm(formData);
    }

    /**
     * Method - getAccountAddress
     * Navigate to account address page
     */
    public getInvoiceTabAccountAddress(): void {
        let accountNumber: string = this.storeFormGroup['main'].controls[this.serviceConstants.AccountNumber].value;
        let formData = {};

        // Initialize Form Data
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[this.serviceConstants.Function] = 'GetInvAddressFromAccount';

        this.updateAddressInForm(formData);
    }

    /**
     * Method - getInvoiceAddress
     * Navigate to invoice address page
     * @TODO - Add route In Constants
     */
    public getInvoiceTabInvoiceAddress(): void {
        // Set In storeParams Propert So That It Can Be Retireived When Back In This Page
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = BillToCashConstants.c_o_ADDRESS_TYPES['Invoice'];
        // Call method to navigate
        this.navigateToGetAddress('GetInvoiceAddress');
    }

    /**
     * Method - onInvoiceAddressDataReceived
     * Gets executes on data recieved from premises form
     */
    public onInvoiceAddressDataReceived(): void {
        let accountNumber = this.storeFormGroup['main'].controls[this.serviceConstants.AccountNumber].value;
        let invoiceGroupNumber = this.storeSentFromParent[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']];
        let formData = {};

        // Initialize Form Data
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = invoiceGroupNumber;
        formData[this.serviceConstants.Function] = 'GetInvAddressFromInv';

        this.updateAddressInForm(formData);
    }

    /**
     * Method - getAddressFromAccountNumber
     * Gets address using account number
     */
    public getInvoiceAddressFromAccountNumber(): void {
        let premiseNumber = this.storeParams[this.serviceConstants.PremiseNumber];
        let accountNumber = this.storeInvoice[this.serviceConstants.AccountNumber];
        let formData = {};

        // Initialize Form Data
        formData[this.serviceConstants.PremiseNumber] = premiseNumber;
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Detail']] = BillToCashConstants.c_o_REQUEST_PARAM_VALUES['Invoice'];
        formData[this.serviceConstants.Function] = 'GetAddressFromAccountNumber';

        this.updateAddressInForm(formData);
    }

    /**
     * Method - prepareAddressQuery
     * Prepares Address Query With QueryStrings
     */
    public prepareAddressQuery(): URLSearchParams {
        let query = new URLSearchParams();

        // Prepare Query
        query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        query.set(this.serviceConstants.Action, '6');

        return query;
    }

    /**
     * Method - updateAddressInForm
     * Populates form with address data recieved
     */
    public updateAddressInForm(formData: any): void {
        // Prepare Query
        this.addressQuery = new URLSearchParams();
        this.addressQuery = this.prepareAddressQuery();

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.addressQuery,
            formData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                // Display Error If Any Returned
                if (data.errorMessage) {
                    let errorObject: Object = {};
                    errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.message] = data.errorMessage;
                    this.dispatchError(errorObject);
                    return;
                }

                // Execute Logic Only If data Is Not Blank
                if (!data['InvoiceName']) {
                    return;
                }

                this.addressInvoiceFormGroup.controls['InvoiceName'].setValue(data['InvoiceName']);
                this.addressInvoiceFormGroup.controls['InvoiceAddressLine1'].setValue(data['InvoiceAddressLine1']);
                this.addressInvoiceFormGroup.controls['InvoiceAddressLine2'].setValue(data['InvoiceAddressLine2']);
                this.addressInvoiceFormGroup.controls['InvoiceAddressLine3'].setValue(data['InvoiceAddressLine3']);
                this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValue(data['InvoiceAddressLine4']);
                this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(data['InvoiceAddressLine5']);
                this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(data['InvoicePostcode']);
                this.addressInvoiceFormGroup.controls['InvoiceContactName'].setValue(data['InvoiceContactName']);
                this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].setValue(data['InvoiceContactDepartment']);
                this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].setValue(data['InvoiceContactPosition']);
                this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].setValue(data['InvoiceContactMobile']);
                this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].setValue(data['InvoiceContactTelephone']);
                this.addressInvoiceFormGroup.controls['InvoiceContactFax'].setValue(data['InvoiceContactFax']);
                this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].setValue(data['InvoiceContactEmail']);
                this.addressInvoiceFormGroup.controls['InvoiceGPSCoordinateX'].setValue(data['InvoiceGPSCoordinateX']);
                this.addressInvoiceFormGroup.controls['InvoiceGPSCoordinateY'].setValue(data['InvoiceGPSCoordinateY']);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.dispatchGeneralError(error);
            });
    }

    /**
     * Method - onGeneralAddressDataReceived
     * Populate data in forms
     * Expect value to be available in params key in store
     */
    public onGeneralAddressDataReceived(): void {
        this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(this.storeOtherDetails['InvoiceAddressLine5']);
        this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(this.storeOtherDetails['InvoicePostcode']);
    }

    /**
     * Method - onContactDetailsReceived
     * On contact details received
     */
    public onContactDetailsReceived(): void {
        let data = this.storeSentFromParent;

        this.addressInvoiceFormGroup.controls['InvoiceContactName'].setValue(data['ContactName']);
        this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].setValue(data['ContactDepartment']);
        this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].setValue(data['ContactPosition']);
        this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].setValue(data['ContactMobileNumber']);
        this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].setValue(data['ContactTelephone']);
        this.addressInvoiceFormGroup.controls['InvoiceContactFax'].setValue(data['ContactFax']);
        this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].setValue(data['ContactEmailAddress']);
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

    /**
     * Method - sensitiseContactDetails
     * Enables and disables controls
     */
    public sensitiseContactDetails(enable: boolean): void {
        if (!this.addressInvoiceFormGroup) {
            return;
        }
        if (enable) {
            this.addressInvoiceFormGroup.controls['InvoiceContactName'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactFax'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].enable();
        } else {
            this.addressInvoiceFormGroup.controls['InvoiceContactName'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactFax'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].disable();
        }
    }

    // Events
    /**
     * Method - getAddress
     * Executes on click of GetAddress button
     */
    public getAddress(): void {
        // Set Tab Name
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']] = this.storeFormKey;
        // Set In storeParams Propert So That It Can Be Retireived When Back In This Page
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = BillToCashConstants.c_o_ADDRESS_TYPES['General'];
        // Dispatch Data To Store; For Navigation
        this.store.dispatch({
            type: InvoiceActionTypes.NAVIGATE,
            payload: 'GetAddress'
        });
    }

    public getAddressClick(): void {
        let sysCharsValue = this.storeSysChars;

        if (sysCharsValue['vSCEnableHopewiserPAF']) {
            // @TODO - Implement when page is implemented
            this.logger.log('To open riMPAFSearch.htm');
        } else if (sysCharsValue['vEnablePostcodeDefaulting']) {
            this.inputParamsPostcode = {
                parentMode: 'Invoice',
                InvoicePostCode: this.addressInvoiceFormGroup.controls['InvoicePostcode'].value,
                InvoiceAddressLine5: this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].value,
                InvoiceAddressLine4: this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].value
            };
            this.postcodeSearchEllipsis.childConfigParams = this.inputParamsPostcode;
            this.postcodeSearchEllipsis.openModal();
        }
    }

    public onPostcodeDataReturn(data: any): void {
        this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValue(data['InvoiceAddressLine4']);
        this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(data['InvoiceAddressLine5']);
        this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(data['InvoicePostcode']);
    }

    /**
     * Method - getContactDetails
     * Executes on click of GetAddress button
     */
    public getContactDetails(): void {
        // Set Tab Name
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']] = this.storeFormKey;
        // Set In storeParams Propert So That It Can Be Retireived When Back In This Page
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = 'contactdetails';
        // Dispatch Data To Store; For Navigation
        this.store.dispatch({
            type: InvoiceActionTypes.NAVIGATE,
            payload: 'ContactDetailsInv'
        });
    }

    /**
     * Method - onInvoiceNameChange
     * Executes on change of invoice name
     */
    public onInvoiceNameChange(): void {
        let sysChars = this.storeSysChars;

        // Execute Logic Only If In Add Mode
        if (this.storeMode && !this.storeMode['addMode']) {
            return;
        }

        // Check SysChar Values And Execute Logic
        // If Search Is Not Enabled On First Line Change Stop Execution
        if (sysChars['vSCRunPAFSearchOn1stAddressLine']) {
            return;
        }
        if ((sysChars['vSCEnableHopewiserPAF'] || sysChars['vSCEnableDatabasePAF'])) {
            this.getAddress();
        }
    }

    /**
     * Method - onInvoiceAddressLine4Blur
     * Executed On Blur Of InvoiceAddressLine4 Control
     */
    public onInvoiceAddressLine4Blur(): void {
        let sysChars = this.storeSysChars;
        let inputValue = this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].value;

        if (sysChars['vSCAddressLine4Required'] && inputValue === '' && sysChars['vSCEnableValidatePostcodeSuburb']) {
            this.getAddressClick();
        }
    }

    /**
     * Method - onInvoiceAddressLine5Blur
     * Executed On Blur Of InvoiceAddressLine5 Control
     */
    public onInvoiceAddressLine5Blur(): void {
        let sysChars = this.storeSysChars;
        let inputValue = this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].value;

        if (sysChars['vSCAddressLine5Required'] && inputValue === '' && sysChars['vSCEnableValidatePostcodeSuburb']) {
            this.getAddressClick();
        }
    }

    /**
     * Method - onPostCodeBlur
     * Executed On Blur Of PostCode Control
     */
    public onPostCodeBlur(): void {
        let inputValue = this.addressInvoiceFormGroup.controls['InvoicePostcode'].value;

        // Get Address
        if (this.storeSysChars['vSCPostCodeRequired'] && inputValue === '') {
            this.getAddressClick();
        }
    }

    /**
     * Method - onPostCodeChange
     * Executed on change of postcode value
     */
    public onPostCodeChange(): void {
        let inputPostCode = this.addressInvoiceFormGroup.controls['InvoicePostcode'].value;
        let inputInvoiceAddressLine4 = this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].value;
        let inputState = this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].value;
        this.postcodeQuery = new URLSearchParams();

        /*
         * Do not execute logic, if
         *  - vEnablePostcodeDefaulting is false
         *  - vSCEnableDatabasePAF is false
         *  - inputValue is blank
         */
        if (!this.storeSysChars['vEnablePostcodeDefaulting'] || !this.storeSysChars['vSCEnableDatabasePAF'] || !inputPostCode) {
            return;
        }

        // Prepare Query To Make Request
        this.postcodeQuery.set(this.serviceConstants.BusinessCode,
            this.utils.getBusinessCode());
        this.postcodeQuery.set(this.serviceConstants.CountryCode,
            this.utils.getCountryCode());
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Function'],
            'GetPostCodeTownAndState');
        this.postcodeQuery.set(this.serviceConstants.Action, '0');
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['State'], inputState);
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Town'], inputInvoiceAddressLine4);
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['PostCode'], inputPostCode);

        // Make HTTP Call To Fetch Data
        this.httpService.makeGetRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.postcodeQuery).subscribe((data) => {
                if (data.errorMessage) {
                    this.dispatchError({
                        msg: data.errorMessage
                    });
                    return;
                }
                // If no unique record found navigate to other page
                if (!this.utils.convertResponseValueToCheckboxInput(data.UniqueRecordFound)) {
                    // Dispatch Data To Store
                    this.postcodeSearchEllipsis.childConfigParams = {
                        parentMode: 'Invoice',
                        InvoicePostCode: this.addressInvoiceFormGroup.controls['InvoicePostcode'].value,
                        InvoiceAddressLine5: this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].value,
                        InvoiceAddressLine4: this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].value
                    };
                    this.postcodeSearchEllipsis.openModal();
                    return;
                }

                // Else set values in controls
                this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(data.Postcode);
                this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValue(data.Town);
                this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(data.State);
            }, (error) => {
                this.dispatchGeneralError(error);
            });
    }

    /**
     * Method - copyInvoice
     * Copies invoice information to statement
     */
    public copyInvoice(): void {
        let invFormGroup = this.addressInvoiceFormGroup;
        let statFormGroup = this.storeFormGroup['AddressStatement'];

        for (let control in invFormGroup['controls']) {
            if (!control) {
                continue;
            }
            let statementControlName = control.replace('Invoice', 'Statement');
            if (statFormGroup['controls'][statementControlName] && invFormGroup['controls'][control]) {
                statFormGroup['controls'][statementControlName].setValue(invFormGroup['controls'][control].value);
            }
        }
    }

    /**
     * Method - onPremiseDataReturn
     * Execute on selection from premise ellipsis
     */
    public onPremiseDataReturn(data?: any): void {
        // Hide Ellipsis Button
        this.showPremiseSearchEllipsis = true;
        if (!data || !data.PremiseNumber || !data.ContractNumber) {
            return;
        }
        let getAddressQuery: URLSearchParams = new URLSearchParams();
        let formData: any = {};

        getAddressQuery.set(this.serviceConstants.BusinessCode,
            this.utils.getBusinessCode());
        getAddressQuery.set(this.serviceConstants.CountryCode,
            this.utils.getCountryCode());
        getAddressQuery.set(this.serviceConstants.Action, '6');

        formData[this.serviceConstants.ContractNumber] = data.ContractNumber;
        formData[this.serviceConstants.PremiseNumber] = data.PremiseNumber;
        formData[this.serviceConstants.Function] = 'GetInvAddressFromPremise';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            getAddressQuery,
            formData
        ).subscribe(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                let errorObject: Object = {};
                errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.message] = data.errorMessage;
                this.dispatchError(errorObject);
                return;
            }
            for (let key in data) {
                if (key) {
                    this.addressInvoiceFormGroup.controls[key].setValue(data[key]);
                }
            }
        }, error => {
            this.dispatchGeneralError(error);
        });
    }
}
