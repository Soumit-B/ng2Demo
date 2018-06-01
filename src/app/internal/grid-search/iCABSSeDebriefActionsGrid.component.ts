import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSeDebriefActionsGrid.html'
})

export class SeDebriefActionsGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
        { name: 'SupervisorEmployeeCode' },
        { name: 'SupervisorEmployeeName' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'ServicePlanNumber' },
        { name: 'DisplayNumberOfRows' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEDEBRIEFACTIONSGRID;

    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
