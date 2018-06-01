import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSeManualWasteConsignmentNote.html'
})

export class SeManualWasteConsignmentNoteComponent extends BaseComponent implements OnInit, OnDestroy {


    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'WasteConsignmentNoteNumber' },
        { name: 'WasteConsignmentVoid' },
        { name: 'ServiceBranchNumber' },
        { name: 'BranchName' },
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeForename' },
        { name: 'EmployeeSurname' },
        { name: 'RegulatoryAuthorityNumber' },
        { name: 'RegulatoryAuthorityName' },
        { name: 'WasteTransferTypeCode' },
        { name: 'WasteTransferTypeDesc' },
        { name: 'WasteRegulatoryPremiseRef' },
        { name: 'PrenotificationNumber' },
        { name: 'SICCode' },
        { name: 'SICDescription' },
        { name: 'VehicleRegistration' },
        { name: 'ConsigneeName' },
        { name: 'ConsigneeAddressLine1' },
        { name: 'ConsigneeAddressLine2' },
        { name: 'ConsigneeAddressLine3' },
        { name: 'ConsigneeAddressLine4' },
        { name: 'ConsigneeAddressLine5' },
        { name: 'ConsigneePostCode' },
        { name: 'DepotName' },
        { name: 'DepotAddressLine1' },
        { name: 'DepotAddressLine2' },
        { name: 'DepotAddressLine3' },
        { name: 'DepotAddressLine4' },
        { name: 'DepotAddressLine5' },
        { name: 'DepotPostCode' },
        { name: 'WasteOperationCode' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEMANUALWASTECONSIGNMENTNOTE;

    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
