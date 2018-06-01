/**
 * Component - AddressStatementTabComponent
 * Refered In - Tabs of 'Bill To Cash' pages
 * Functionality - Contains form to view/update invoice statement data
 */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { InvoiceActionTypes } from './../../actions/invoice';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { BillToCashConstants } from './../bill-to-cash-constants';
import { Utils } from './../../../shared/services/utility';
import { Router } from '@angular/router';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { PostCodeSearchComponent } from './../../internal/search/iCABSBPostcodeSearch.component';
import { Logger } from '@nsalaun/ng2-logger';

@Component({
    selector: 'icabs-address-statement-tab',
    templateUrl: 'AddressStatementTab.html'
})

export class AddressStatementTabComponent implements OnInit, OnDestroy {
    public storeSubscription: Subscription;
    public ajaxSubscription: Subscription;
    public addressStatementFormGroup: FormGroup;

    // Query Parameters
    public postcodeQuery: URLSearchParams;
    public addressQuery: URLSearchParams;

    // Object To Enable/Disable Buttons
    public buttonStates = {
        GetAddress: true,
        PremisesAddress: true,
        AccountAddress: true,
        InvoiceAddress: true
    };
    // Properties To Show Hide Controls
    public elementShowHide = {
        GetAddress: true,
        AddressLine3: true,
        AddressLine3Required: false,
        StatementAddressLine4Required: false,
        StatementAddressLine5Required: false,
        PostCode: true,
        GPSCoordinates: false,
        ContactDetails: false
    };
    public inputParamsPremise = {};
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
    public storeFormKey: string = 'AddressStatement';
    public maxLen: number = 40;

    // Premise Search Ellipsis Properties
    public inputParamsPostcode: any = {};
    public showPremiseSearchEllipsis: boolean = true;
    public premiseSearchComponent: any = PremiseSearchComponent;
    public postcodeSearchComponent = PostCodeSearchComponent;
    public modalConfig = {
        backdrop: 'static',
        keyboard: false
    };
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
            if (data['invoice']) {
                this.storeInvoice = data['invoice'];
            }
            if (data['params']) {
                this.storeParams = data['params'];
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
            case InvoiceActionTypes.SET_FORM_GROUPS:
                this.storeFormGroup = data['formGroup'];
                break;
            case InvoiceActionTypes.ADDRESS_DATA_RECEIVED:
                // Call Method To Update Address In Forms
                this.onAddressDataReceived();
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
        this.addressStatementFormGroup = this.formBuilder.group({
            StatementName: [{ value: '', disabled: false }, Validators.required],
            StatementAddressLine1: [{ value: '', disabled: false }, Validators.required],
            StatementAddressLine2: [{ value: '', disabled: false }],
            StatementAddressLine3: [{ value: '', disabled: false }],
            StatementAddressLine4: [{ value: '', disabled: false }],
            StatementAddressLine5: [{ value: '', disabled: false }],
            StatementPostcode: [{ value: '', disabled: false }, Validators.required],
            StatementContactName: [{ value: '', disabled: true }],
            StatementContactDepartment: [{ value: '', disabled: true }],
            StatementContactPosition: [{ value: '', disabled: true }],
            StatementContactMobile: [{ value: '', disabled: true }],
            StatementContactTelephone: [{ value: '', disabled: true }],
            StatementContactFax: [{ value: '', disabled: true }],
            StatementContactEmail: [{ value: '', disabled: true }],
            StatementGPSCoordinateX: [{ value: '', disabled: true }],
            StatementGPSCoordinateY: [{ value: '', disabled: true }]
        });


        // Set In Store For Validation
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormKey,
                form: this.addressStatementFormGroup
            }
        });

        this.addressStatementFormGroup.disable();
    }

    /**
     * Method - setFormData
     * Sets form data
     */
    public setFormData(): void {
        this.addressStatementFormGroup.reset();
        try {
            this.addressStatementFormGroup.controls['StatementName'].setValue(this.storeData['StatementName'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine1'].setValue(this.storeData['StatementAddressLine1'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine2'].setValue(this.storeData['StatementAddressLine2'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine3'].setValue(this.storeData['StatementAddressLine3'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine4'].setValue(this.storeData['StatementAddressLine4'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(this.storeData['StatementAddressLine5'].trim());
            this.addressStatementFormGroup.controls['StatementPostcode'].setValue(this.storeData['StatementPostcode'].trim());
            this.addressStatementFormGroup.controls['StatementContactName'].setValue(this.storeData['StatementContactName'].trim());
            this.addressStatementFormGroup.controls['StatementContactDepartment'].setValue(this.storeData['StatementContactDepartment'].trim());
            this.addressStatementFormGroup.controls['StatementContactPosition'].setValue(this.storeData['StatementContactPosition'].trim());
            this.addressStatementFormGroup.controls['StatementContactMobile'].setValue(this.storeData['StatementContactMobile'].trim());
            this.addressStatementFormGroup.controls['StatementContactTelephone'].setValue(this.storeData['StatementContactTelephone'].trim());
            this.addressStatementFormGroup.controls['StatementContactFax'].setValue(this.storeData['StatementContactFax'].trim());
            this.addressStatementFormGroup.controls['StatementContactEmail'].setValue(this.storeData['StatementContactEmail'].trim());
            this.addressStatementFormGroup.controls['StatementGPSCoordinateX'].setValue(this.storeData['StatementGPSCoordinateX'].trim());
            this.addressStatementFormGroup.controls['StatementGPSCoordinateY'].setValue(this.storeData['StatementGPSCoordinateY'].trim());
        } catch (ignore) {
            // Do ntohing. Checked for case of Add
        }
        this.addressStatementFormGroup.enable();
        this.disableForm = false;
        this.sensitiseContactDetails(!this.storeSysChars['vSCMultiContactInd']);
    }

    /**
     * Method - updateViewFromSysChars
     * Update view from syschars
     */
    public updateViewFromSysChar(): void {
        let sysCharsValue = this.storeSysChars;
        // Get Address Button Show/Hide
        this.elementShowHide.GetAddress = true;
        if (!(sysCharsValue['vSCEnableHopewiserPAF'] || sysCharsValue['vSCEnableDatabasePAF'])) {
            this.elementShowHide.GetAddress = false;
        }

        /**
         * If Address Line 3 Field Is Disabled In SysChars Hide The Field
         * Else If It Is Required In SysChars Add Validator And Show Required Mark
         */
        if (sysCharsValue['vDisableFieldList'].indexOf('AddressLine3') >= 0) {
            // Show/Hide Address Line 3
            this.elementShowHide.AddressLine3 = false;
        } else if (sysCharsValue['vSCEnableAddressLine3'] && sysCharsValue['vSCAddressLine3Logical']) {
            // Set Validator
            this.addressStatementFormGroup.controls['StatementAddressLine3'].setValidators(Validators.required);
            // Show/Hide Mandatory Mark Span
            this.elementShowHide.AddressLine3Required = true;
        }

        // StatementAddressLine4 Mandatory
        if (sysCharsValue['vSCAddressLine4Logical'] ||
            !(!sysCharsValue['vSCEnablePostcodeSuburbLog'] && sysCharsValue['vSCEnableValidatePostcodeSuburb'])) {
            // Set Validator
            this.addressStatementFormGroup.controls['StatementAddressLine4'].setValidators(Validators.required);
            // Show/Hide Mandatory Mark Span
            this.elementShowHide.StatementAddressLine4Required = true;
        }

        // StatementAddressLine5 Mandatory
        if (sysCharsValue['vSCAddressLine5Logical']) {
            // Set Validator
            this.addressStatementFormGroup.controls['StatementAddressLine5'].setValidators(Validators.required);
            // Show/Hide Mandatory Mark Span
            this.elementShowHide.StatementAddressLine4Required = true;
        }

        // Postcode Show/Hide
        if (sysCharsValue['vSCHidePostcode']) {
            // Clear Validator
            this.addressStatementFormGroup.controls['StatementPostcode'].clearValidators();
            // Show/Hide Control
            this.elementShowHide.PostCode = false;
        }

        // GPS Coordinates Show/Hide
        if (sysCharsValue['vSCEnableGPSCoordinates']) {
            this.elementShowHide.GPSCoordinates = true;
        }

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
     * Method - getStatementTabPremisesAddress
     * Navigate to premises address page
     */
    public getStatementTabPremisesAddress(): void {
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
            this.getAddressFromAccountNumber();
            return;
        }

        // Initialize Form Data
        formData[this.serviceConstants.PremiseNumber] = premiseNumber;
        formData[this.serviceConstants.ContractNumber] = contractNumber;
        formData[this.serviceConstants.Function] = 'GetStatAddressFromPremise';

        this.updateAddressInForm(formData);
    }

    /**
     * Method - getStatementTabAccountAddress
     * Navigate to account address page
     */
    public getStatementTabAccountAddress(): void {
        let accountNumber: string = this.storeFormGroup['main'].controls[this.serviceConstants.AccountNumber].value;
        let formData = {};

        // Initialize Form Data
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[this.serviceConstants.Function] = 'GetStatAddressFromAccount';

        this.updateAddressInForm(formData);
    }

    /**
     * Method - getStatementTabInvoiceAddress
     * Navigate to invoice address page
     * @TODO - Add route in Constants
     */
    public getStatementTabInvoiceAddress(): void {
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
        let accountNumber = this.storeInvoice[this.serviceConstants.AccountNumber];
        let invoiceGroupNumber = this.storeSentFromParent[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']];
        let formData = {};

        // Initialize Form Data
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = invoiceGroupNumber;
        formData[this.serviceConstants.Function] = 'GetStatAddressFromInv';

        this.updateAddressInForm(formData);
    }

    /**
     * Method - getAddressFromAccountNumber
     * Gets address using account number
     */
    public getAddressFromAccountNumber(): void {
        let premiseNumber = this.storeParams[this.serviceConstants.PremiseNumber];
        let accountNumber = this.storeInvoice[this.serviceConstants.AccountNumber];
        let formData = {};

        // Initialize Form Data
        formData[this.serviceConstants.PremiseNumber] = premiseNumber;
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Detail']] = BillToCashConstants.c_o_REQUEST_PARAM_VALUES['Statement'];
        formData[this.serviceConstants.Function] = 'GetStatAddressFromAccount';

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
                // Execute Logic Only If data Is Not Blank
                if (!data['StatementName']) {
                    return;
                }

                this.addressStatementFormGroup.controls['StatementName'].setValue(data['StatementName']);
                this.addressStatementFormGroup.controls['StatementAddressLine1'].setValue(data['StatementAddressLine1']);
                this.addressStatementFormGroup.controls['StatementAddressLine2'].setValue(data['StatementAddressLine2']);
                this.addressStatementFormGroup.controls['StatementAddressLine3'].setValue(data['StatementAddressLine3']);
                this.addressStatementFormGroup.controls['StatementAddressLine4'].setValue(data['StatementAddressLine4']);
                this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(data['StatementAddressLine5']);
                this.addressStatementFormGroup.controls['StatementPostcode'].setValue(data['StatementPostcode']);
                this.addressStatementFormGroup.controls['StatementContactName'].setValue(data['StatementContactName']);
                this.addressStatementFormGroup.controls['StatementContactDepartment'].setValue(data['StatementContactDepartment']);
                this.addressStatementFormGroup.controls['StatementContactPosition'].setValue(data['StatementContactPosition']);
                this.addressStatementFormGroup.controls['StatementContactMobile'].setValue(data['StatementContactMobile']);
                this.addressStatementFormGroup.controls['StatementContactTelephone'].setValue(data['StatementContactTelephone']);
                this.addressStatementFormGroup.controls['StatementContactFax'].setValue(data['StatementContactFax']);
                this.addressStatementFormGroup.controls['StatementContactEmail'].setValue(data['StatementContactEmail']);
                this.addressStatementFormGroup.controls['StatementGPSCoordinateX'].setValue(data['StatementGPSCoordinateX']);
                this.addressStatementFormGroup.controls['StatementGPSCoordinateY'].setValue(data['StatementGPSCoordinateY']);
            },
            (error) => {
                this.dispatchGeneralError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    /**
     * Method - onGeneralAddressDataReceived
     * Populate data in forms
     * Expect value to be available in params key in store
     */
    public onGeneralAddressDataReceived(): void {
        this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(this.storeOtherDetails['StatementAddressLine5']);
        this.addressStatementFormGroup.controls['StatementPostcode'].setValue(this.storeOtherDetails['StatementPostcode']);
    }

    /**
     * Method - onContactDetailsReceived
     * On contact details received
     */
    public onContactDetailsReceived(): void {
        let data = this.storeSentFromParent;

        this.addressStatementFormGroup.controls['InvoiceContactName'].setValue(data['ContactName']);
        this.addressStatementFormGroup.controls['InvoiceContactDepartment'].setValue(data['ContactDepartment']);
        this.addressStatementFormGroup.controls['InvoiceContactPosition'].setValue(data['ContactPosition']);
        this.addressStatementFormGroup.controls['InvoiceContactMobile'].setValue(data['ContactMobileNumber']);
        this.addressStatementFormGroup.controls['InvoiceContactTelephone'].setValue(data['ContactTelephone']);
        this.addressStatementFormGroup.controls['InvoiceContactFax'].setValue(data['ContactFax']);
        this.addressStatementFormGroup.controls['InvoiceContactEmail'].setValue(data['ContactEmailAddress']);
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
        if (!this.addressStatementFormGroup) {
            return;
        }
        if (enable) {
            this.addressStatementFormGroup.controls['StatementContactName'].enable();
            this.addressStatementFormGroup.controls['StatementContactPosition'].enable();
            this.addressStatementFormGroup.controls['StatementContactDepartment'].enable();
            this.addressStatementFormGroup.controls['StatementContactMobile'].enable();
            this.addressStatementFormGroup.controls['StatementContactPosition'].enable();
            this.addressStatementFormGroup.controls['StatementContactTelephone'].enable();
            this.addressStatementFormGroup.controls['StatementContactFax'].enable();
            this.addressStatementFormGroup.controls['StatementContactEmail'].enable();
        } else {
            this.addressStatementFormGroup.controls['StatementContactName'].disable();
            this.addressStatementFormGroup.controls['StatementContactPosition'].disable();
            this.addressStatementFormGroup.controls['StatementContactDepartment'].disable();
            this.addressStatementFormGroup.controls['StatementContactMobile'].disable();
            this.addressStatementFormGroup.controls['StatementContactPosition'].disable();
            this.addressStatementFormGroup.controls['StatementContactTelephone'].disable();
            this.addressStatementFormGroup.controls['StatementContactFax'].disable();
            this.addressStatementFormGroup.controls['StatementContactEmail'].disable();
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
                parentMode: 'Statement',
                StatementPostcode: this.addressStatementFormGroup.controls['StatementPostcode'].value,
                StatementAddressLine5: this.addressStatementFormGroup.controls['StatementAddressLine5'].value,
                StatementAddressLine4: this.addressStatementFormGroup.controls['StatementAddressLine4'].value
            };
            this.postcodeSearchEllipsis.childConfigParams = this.inputParamsPostcode;
            this.postcodeSearchEllipsis.openModal();
        }
    }

    public onPostcodeDataReturn(data: any): void {
        this.addressStatementFormGroup.controls['StatementAddressLine4'].setValue(data['StatementAddressLine4']);
        this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(data['StatementAddressLine5']);
        this.addressStatementFormGroup.controls['StatementPostcode'].setValue(data['StatementPostcode']);
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
            payload: 'ContactDetailsStat'
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
     * Method - onStatementAddressLine4Blur
     * Executed On Blur Of StatementAddressLine4 Control
     */
    public onStatementAddressLine4Blur(): void {
        let sysChars = this.storeSysChars;
        let inputValue = this.addressStatementFormGroup.controls['StatementAddressLine4'].value;

        if (sysChars['vSCAddressLine4Required'] && inputValue === '' && sysChars['vSCEnableValidatePostcodeSuburb']) {
            this.getAddressClick();
        }
    }

    /**
     * Method - onStatementAddressLine5Blur
     * Executed On Blur Of StatementAddressLine5 Control
     */
    public onStatementAddressLine5Blur(): void {
        let sysChars = this.storeSysChars;
        let inputValue = this.addressStatementFormGroup.controls['StatementAddressLine5'].value;

        if (sysChars['vSCAddressLine5Required'] && inputValue === '' && sysChars['vSCEnableValidatePostcodeSuburb']) {
            this.getAddressClick();
        }
    }

    // Check This Functionality
    /**
     * Method - onPostCodeBlur
     * Executed On Blur Of PostCode Control
     */
    public onPostCodeBlur(): void {
        let inputValue = this.addressStatementFormGroup.controls['StatementPostcode'].value;

        if (this.storeSysChars['vSCPostCodeRequired'] && inputValue === '') {
            this.getAddressClick();
        }
    }

    /**
     * Method - onPostCodeChange
     * Executed on change of postcode value
     */
    public onPostCodeChange(): void {
        let inputPostCode = this.addressStatementFormGroup.controls['StatementPostcode'].value;
        let inputStatementAddressLine4 = this.addressStatementFormGroup.controls['StatementAddressLine4'].value;
        let inputState = this.addressStatementFormGroup.controls['StatementAddressLine5'].value;
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
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['StatementAddressLine4'], inputStatementAddressLine4);
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
                        parentMode: 'Statement',
                        InvoicePostCode: this.addressStatementFormGroup.controls['StatementPostcode'].value,
                        InvoiceAddressLine5: this.addressStatementFormGroup.controls['StatementAddressLine5'].value,
                        InvoiceAddressLine4: this.addressStatementFormGroup.controls['StatementAddressLine4'].value
                    };
                    this.postcodeSearchEllipsis.openModal();
                    return;
                }

                // Else set values in controls
                this.addressStatementFormGroup.controls['StatementPostcode'].setValue(data.Postcode);
                this.addressStatementFormGroup.controls['StatementAddressLine4'].setValue(data.Town);
                this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(data.State);
            }, (error) => {
                this.dispatchGeneralError(error);
            });
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
        formData[this.serviceConstants.Function] = 'GetStatAddressFromPremise';

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
                    this.addressStatementFormGroup.controls[key].setValue(data[key]);
                }
            }
        }, error => {
            this.dispatchGeneralError(error);
        });
    }
}
