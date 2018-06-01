import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { ContractActionTypes } from '../../../../app/actions/contract';
export var ProRataMaintenanceTypeBComponent = (function () {
    function ProRataMaintenanceTypeBComponent(zone, fb, route, router, store, _formBuilder, localeTranslateService) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.store = store;
        this._formBuilder = _formBuilder;
        this.localeTranslateService = localeTranslateService;
        this.isAdditionalCreditInfo = true;
        this.vSCEnableUseProRataNarrative = false;
        this.isPrintCredit = false;
        this.sysCharParams = {};
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            switch (data['action']) {
                case ContractActionTypes.FORM_GROUP_PRORATA:
                    var formGroup = data['formGroup'];
                    _this.isAdditionalCreditInfo = formGroup['isAdditionalCreditInfo'];
                    _this.isPrintCredit = formGroup['isPrintCredit'];
                    break;
                case ContractActionTypes.SAVE_SYSCHAR:
                    if (data['syschars']) {
                        _this.sysCharParams = data['syschars'];
                        _this.vSCEnableUseProRataNarrative = _this.sysCharParams['vSCEnableUseProRataNarrative'];
                    }
                    break;
                default:
                    break;
            }
        });
    }
    ;
    ProRataMaintenanceTypeBComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
        this.contractNarrativeFormGroup = this._formBuilder.group({
            PrintCreditInd: [{ value: '', disabled: false }],
            ProRataNarrative: [{ value: '', disabled: false }],
            AdditionalCreditInfo: [{ value: '', disabled: false }],
            UseProRataNarrative: [{ value: '', disabled: false }]
        });
        this.contractNarrativeFormGroup.controls['ProRataNarrative'].setValidators(Validators.required);
    };
    ;
    ProRataMaintenanceTypeBComponent.prototype.ngAfterViewInit = function () {
        this.setFormGroupToStore();
    };
    ProRataMaintenanceTypeBComponent.prototype.setFormGroupToStore = function () {
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP_PRORATA,
            payload: {
                typeB: this.contractNarrativeFormGroup,
                isAdditionalCreditInfo: this.isAdditionalCreditInfo,
                isPrintCredit: this.isPrintCredit
            }
        });
    };
    ProRataMaintenanceTypeBComponent.prototype.ngOnDestroy = function () {
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    };
    ProRataMaintenanceTypeBComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-proratamaintenance-type-b',
                    templateUrl: 'proRatamaintenance-type-b.html'
                },] },
    ];
    ProRataMaintenanceTypeBComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: Store, },
        { type: FormBuilder, },
        { type: LocaleTranslationService, },
    ];
    return ProRataMaintenanceTypeBComponent;
}());
