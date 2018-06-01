import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeDebriefMaintenance.html'
})

export class SeDebriefMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false },
        { name: 'BranchServiceAreaDesc', readonly: true, disabled: false, required: false },
        { name: 'DaysWorkNumber', readonly: true, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: true, disabled: false, required: false },
        { name: 'EmployeeCode', readonly: true, disabled: false, required: false },
        { name: 'DebriefUserCode', readonly: true, disabled: false, required: false },
        { name: 'DebriefNumber', readonly: true, disabled: false, required: false },
        { name: 'DebriefFromDate', readonly: true, disabled: false, required: false },
        { name: 'DebriefToDate', readonly: true, disabled: false, required: false },
        { name: 'PlannedVisitsNumber', readonly: true, disabled: false, required: false },
        { name: 'CompletedVisitsNumber', readonly: true, disabled: false, required: false },
        { name: 'ManualVisitsNumber', readonly: true, disabled: false, required: false },
        { name: 'MissedVisitsNumber', readonly: true, disabled: false, required: false },
        { name: 'UnactionedVisitsNumber', readonly: true, disabled: false, required: false },
        { name: 'AddedVisitsNumber', readonly: true, disabled: false, required: false },
        { name: 'CancelledVisitsNumber', readonly: true, disabled: false, required: false },
        { name: 'RejectedVisitsNumber', readonly: true, disabled: false, required: false },
        { name: 'ExpectedScansNumber', readonly: true, disabled: false, required: false },
        { name: 'CapturedScansNumber', readonly: true, disabled: false, required: false },
        { name: 'RegisteredScansNumber', readonly: true, disabled: false, required: false },
        { name: 'RejectedScansNumber', readonly: true, disabled: false, required: false },
        { name: 'ExpectedSignaturesNumber', readonly: true, disabled: false, required: false },
        { name: 'CapturedSignaturesNumber', readonly: true, disabled: false, required: false },
        { name: 'RejectedSignaturesNumber', readonly: true, disabled: false, required: false },
        { name: 'LeadsNumber', readonly: true, disabled: false, required: false },
        { name: 'AlertsNumber', readonly: true, disabled: false, required: false },
        { name: 'ActionsNumber', readonly: true, disabled: false, required: false }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEDEBRIEFMAINTENANCE;
    }
}
