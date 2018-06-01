import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeServicePlanningMaintenance.html'
})

export class ServicePlanningMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchNumber' },
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'StartDate' },
        { name: 'EndDate' },
        { name: 'ServicePlanNumber' },
        { name: 'VisitTypeFilter' },
        { name: 'ContractTypeFilter' },
        { name: 'selCustomerIndicationNumber' },
        { name: 'ContractNameSearch' },
        { name: 'ConfirmedStatus' },
        { name: 'TownSearch' },
        { name: 'selBehindStatus' },
        { name: 'PostCode' },
        { name: 'selVisitStatus' },
        { name: 'TotalNoOfCalls' },
        { name: 'TotalNoOfExchanges' },
        { name: 'TotalTime' },
        { name: 'TotalNettValue' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGMAINTENANCE;
    }
}
