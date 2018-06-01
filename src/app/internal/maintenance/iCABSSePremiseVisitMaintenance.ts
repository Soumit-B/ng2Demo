import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSePremiseVisitMaintenance.html'
})

export class PremiseVisitMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false },
        { name: 'ContractName', readonly: false, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: false, disabled: false, required: false },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: false, disabled: false, required: false },
        { name: 'ActualStartTime', readonly: false, disabled: false, required: false },
        { name: 'ActualEndTime', readonly: false, disabled: false, required: false },
        { name: 'PremiseContactName', readonly: false, disabled: false, required: false },
        { name: 'ReasonNumber', readonly: false, disabled: false, required: false },
        { name: 'ReasonDesc', readonly: false, disabled: false, required: false },
        { name: 'VisitReference', readonly: false, disabled: false, required: false },
        { name: 'AttemptedPrintInd', readonly: false, disabled: false, required: false },
        { name: 'SuccessfulPrintInd', readonly: false, disabled: false, required: false },
        { name: 'NoPremiseVisitReasonCode', readonly: false, disabled: false, required: false },
        { name: 'NoPremiseVisitReasonDesc', readonly: false, disabled: false, required: false },
        { name: 'NoBarcodeReasonCode', readonly: false, disabled: false, required: false },
        { name: 'NoBarcodeReasonDesc', readonly: false, disabled: false, required: false },
        { name: 'PremiseContactSignature', readonly: false, disabled: false, required: false },
        { name: 'PremiseContactPrintedName', readonly: false, disabled: false, required: false },
        { name: 'PremiseContactReason', readonly: false, disabled: false, required: false },
        { name: 'chkConsumablesOnly', readonly: false, disabled: false, required: false }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPREMISEVISITMAINTENANCE;
    }
}
