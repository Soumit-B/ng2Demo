import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSCMHCALeadMaintenance.html'
})

export class LeadMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'LeadNumber' },
        { name: 'ContractNumber' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'PremiseAddressLine1' },
        { name: 'PremiseAddressLine2' },
        { name: 'PremiseAddressLine3' },
        { name: 'PremisePostcode' },
        { name: 'PremiseContactName' },
        { name: 'PremiseContactApproached' },
        { name: 'PremiseContactPosition' },
        { name: 'PremiseContactTelephone' },
        { name: 'LeadDetailText' },
        { name: 'LeadTypeCode' },
        { name: 'LeadStatusCode' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMHCALEADMAINTENANCE;
    }
}
