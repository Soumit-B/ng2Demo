import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { InvoiceActionTypes } from './../../actions/invoice';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
export var EDIInvoicingTabComponent = (function () {
    function EDIInvoicingTabComponent(store, formBuilder, localeTranslateService) {
        var _this = this;
        this.store = store;
        this.formBuilder = formBuilder;
        this.localeTranslateService = localeTranslateService;
        this.storeFormValidKey = 'EDIInvoicing';
        this.storeSubscription = this.store.select('invoice').subscribe(function (data) {
            _this.storeUpdateHandler(data);
        });
    }
    EDIInvoicingTabComponent.prototype.storeUpdateHandler = function (data) {
        switch (data && data['action']) {
            case InvoiceActionTypes.SAVE_DATA:
                this.storeData = data['data'];
                this.setFormData();
                break;
            case InvoiceActionTypes.RESET_FORMS:
                this.setFormData();
                break;
        }
    };
    EDIInvoicingTabComponent.prototype.ngOnInit = function () {
        this.buidForm();
        this.localeTranslateService.setUpTranslation();
    };
    EDIInvoicingTabComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    };
    EDIInvoicingTabComponent.prototype.buidForm = function () {
        this.ediInvoicingFormGroup = this.formBuilder.group({
            EDIPartnerAccountCode: [{ value: '', disabled: false }],
            EDIPartnerANANumber: [{ value: '', disabled: false }],
            EDILocationAccountCode: [{ value: '', disabled: false }],
            EDILocationANANumber: [{ value: '', disabled: false }],
            EDIPartnerLocationCode: [{ value: '', disabled: false }],
            AttachmentType: [{ value: '', disabled: false }],
            DespatchInstructions: [{ value: '', disabled: false }]
        });
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormValidKey,
                form: this.ediInvoicingFormGroup
            }
        });
        this.ediInvoicingFormGroup.disable();
    };
    EDIInvoicingTabComponent.prototype.setFormData = function () {
        this.ediInvoicingFormGroup.reset();
        this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].setValue(this.storeData['EDIPartnerAccountCode']);
        this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].setValue(this.storeData['EDIPartnerANANumber']);
        this.ediInvoicingFormGroup.controls['EDILocationAccountCode'].setValue(this.storeData['EDILocationAccountCode']);
        this.ediInvoicingFormGroup.controls['EDILocationANANumber'].setValue(this.storeData['EDILocationANANumber']);
        this.ediInvoicingFormGroup.controls['EDIPartnerLocationCode'].setValue(this.storeData['EDIPartnerLocationCode']);
        this.ediInvoicingFormGroup.controls['AttachmentType'].setValue(this.storeData['AttachmentType']);
        this.ediInvoicingFormGroup.controls['DespatchInstructions'].setValue(this.storeData['DespatchInstructions']);
        this.ediInvoicingFormGroup.enable();
    };
    EDIInvoicingTabComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-ediinvoicing-tab',
                    templateUrl: 'EDIInvoicingTab.html'
                },] },
    ];
    EDIInvoicingTabComponent.ctorParameters = [
        { type: Store, },
        { type: FormBuilder, },
        { type: LocaleTranslationService, },
    ];
    return EDIInvoicingTabComponent;
}());
