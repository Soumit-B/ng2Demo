import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSePremisePDAICABSActivityGrid.html'
})

export class SePremisePDAICABSActivityGridComponent extends BaseComponent implements OnInit, OnDestroy {


    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'ActualStartTime' },
        { name: 'ActualEndTime' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'PlannedVisitDate' },
        { name: 'NoBarcodeReasonCode' },
        { name: 'ActivityStatusDesc' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'NoSignatureReasonNumber' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'StatusDesc' },
        { name: 'NoPremiseVisitReasonCode' },
        { name: 'ProofSignatureRequiredInd' },
        { name: 'ProofScanRequiredInd' },
        { name: 'NoPremiseVisitReasonNote' },
        { name: 'PremiseAddressLine1' },
        { name: 'PremiseContactName' },
        { name: 'PremiseAddressLine2' },
        { name: 'PremiseContactPosition' },
        { name: 'PremiseAddressLine3' },
        { name: 'PremiseContactTelephone' },
        { name: 'PremiseAddressLine4' },
        { name: 'PremiseContactFax' },
        { name: 'PremiseAddressLine5' },
        { name: 'PremiseContactEmail' },
        { name: 'PremisePostcode' },
        { name: 'GeneralNotes' },
        { name: 'PremiseContactSignature' },
        { name: 'PDAPremiseContactName' },
        { name: 'WasteConsignmentNoteNumber' }
    ];

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPREMISEPDAICABSACTIVITYGRID;

    }
}
