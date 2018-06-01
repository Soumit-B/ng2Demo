import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeDebriefEmployeeGrid.html'
})

export class SeDebriefEmployeeGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false },
        { name: 'BranchServiceAreaDesc', readonly: true, disabled: false, required: false },
        { name: 'VehicleCheckedInd', readonly: true, disabled: false, required: false },
        { name: 'EmployeeCode', readonly: true, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: true, disabled: false, required: false },
        { name: 'cmdShow', readonly: true, disabled: false, required: false },
        { name: 'ServicePlanNumber', readonly: true, disabled: false, required: false },
        { name: 'cmdVisitMap', readonly: true, disabled: false, required: false },
        { name: 'DebriefNumber', readonly: true, disabled: false, required: false },
        { name: 'VehicleStartMileage', readonly: true, disabled: false, required: false },
        { name: 'VehicleEndMileage', readonly: true, disabled: false, required: false },
        { name: 'DayLocationStart', readonly: true, disabled: false, required: false },
        { name: 'DayLocationEnd', readonly: true, disabled: false, required: false },
        { name: 'DayTimeStart', readonly: true, disabled: false, required: false },
        { name: 'DayTimeEnd', readonly: true, disabled: false, required: false },
        { name: 'LastSyncDate', readonly: true, disabled: false, required: false },
        { name: 'LastSyncTime', readonly: true, disabled: false, required: false },
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'FilterStatus', readonly: true, disabled: false, required: false },
        { name: 'FilterAction', readonly: true, disabled: false, required: false },
        { name: 'NumberOfDaysWorked', readonly: true, disabled: false, required: false },
        { name: 'NumberOfPremises', readonly: true, disabled: false, required: false },
        { name: 'PercentageComplete', readonly: true, disabled: false, required: false },
        { name: 'cmdLeadAlert', readonly: true, disabled: false, required: false },
        { name: 'cmdDebrief', readonly: true, disabled: false, required: false },
        { name: 'DisplayNumberOfRows', readonly: true, disabled: false, required: false }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEDEBRIEFEMPLOYEEGRID;
    }
}
