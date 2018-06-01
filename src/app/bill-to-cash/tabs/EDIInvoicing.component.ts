/**
 * Component - EDIInvoicingTabComponent
 * Refered In - Tabs of 'Bill To Cash' pages
 * Functionality - Contains form to view/update EDI invoicing data
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InvoiceActionTypes } from './../../actions/invoice';
import { LocaleTranslationService } from './../../../shared/services/translation.service';

@Component({
    selector: 'icabs-ediinvoicing-tab',
    templateUrl: 'EDIInvoicingTab.html'
})

export class EDIInvoicingTabComponent implements OnInit, OnDestroy {
    public storeSubscription: Subscription;
    public ediInvoicingFormGroup: FormGroup;

    // Store Objects
    public storeData: Object;
    public storeFormValidKey: string = 'EDIInvoicing';

    constructor(
        public store: Store<any>,
        public formBuilder: FormBuilder,
        public localeTranslateService: LocaleTranslationService
    ) {
        /*
         * Subscribe To Store Data
         * Called an object method from the callback instead of directly using the method
         * Since "this" object context will be lost if used as callback
         */
        this.storeSubscription = this.store.select('invoice').subscribe((data) => {
            this.storeUpdateHandler(data);
        });

    }

    // Object Methods
    /**
     * Method - storeUpdateHandler
     * Callback for any publish to store objects
     * Updates object properties for use
     */
    public storeUpdateHandler(data: Object): void {
        switch (data && data['action']) {
            case InvoiceActionTypes.SAVE_DATA:
                this.storeData = data['data'];
                // Call Method To Update Form
                this.setFormData();
                break;
            case InvoiceActionTypes.RESET_FORMS:
                this.setFormData();
                break;
        }
    }

    // Lifecycle Methods
    public ngOnInit(): void {
        // Initialize Form
        this.buidForm();

        // Initialize Translate Service
        this.localeTranslateService.setUpTranslation();
    }

    public ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    /**
     * Method - buildForm
     * Builds The Form
     */
    public buidForm(): void {
        this.ediInvoicingFormGroup = this.formBuilder.group({
            EDIPartnerAccountCode: [{ value: '', disabled: false }],
            EDIPartnerANANumber: [{ value: '', disabled: false }],
            EDILocationAccountCode: [{ value: '', disabled: false }],
            EDILocationANANumber: [{ value: '', disabled: false }],
            EDIPartnerLocationCode: [{ value: '', disabled: false }],
            AttachmentType: [{ value: '', disabled: false }],
            DespatchInstructions: [{ value: '', disabled: false }]
        });

        // Set In Store For Validation
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormValidKey,
                form: this.ediInvoicingFormGroup
            }
        });

        this.ediInvoicingFormGroup.disable();
    }

    /**
     * Method - setFormData
     * Sets form data
     */
    public setFormData(): void {
        this.ediInvoicingFormGroup.reset();
        this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].setValue(this.storeData['EDIPartnerAccountCode']);
        this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].setValue(this.storeData['EDIPartnerANANumber']);
        this.ediInvoicingFormGroup.controls['EDILocationAccountCode'].setValue(this.storeData['EDILocationAccountCode']);
        this.ediInvoicingFormGroup.controls['EDILocationANANumber'].setValue(this.storeData['EDILocationANANumber']);
        this.ediInvoicingFormGroup.controls['EDIPartnerLocationCode'].setValue(this.storeData['EDIPartnerLocationCode']);
        this.ediInvoicingFormGroup.controls['AttachmentType'].setValue(this.storeData['AttachmentType']);
        this.ediInvoicingFormGroup.controls['DespatchInstructions'].setValue(this.storeData['DespatchInstructions']);
        this.ediInvoicingFormGroup.enable();
    }
}
