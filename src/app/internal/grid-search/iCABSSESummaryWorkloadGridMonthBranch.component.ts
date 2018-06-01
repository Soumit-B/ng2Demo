import { OnInit, Injector, Component, OnDestroy } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSSESummaryWorkloadGridMonthBranch.html'
})

export class SummaryWorkloadGridMonthBranchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BusinessCode', type: MntConst.eTypeCode },
        { name: 'BranchNumber', type: MntConst.eTypeCode },
        { name: 'BranchName', type: MntConst.eTypeText },
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', type: MntConst.eTypeText },
        { name: 'ProductServiceGroupString', type: MntConst.eTypeCode },
        { name: 'VisitFrequencyFilter', type: MntConst.eTypeInteger },
        { name: 'SelectedYear', type: MntConst.eTypeInteger },
        { name: 'TotalVisits', type: MntConst.eTypeInteger },
        { name: 'TotalUnits', type: MntConst.eTypeInteger },
        { name: 'TotalWED', type: MntConst.eTypeDecimal1 },
        { name: 'TotalTime', type: MntConst.eTypeText },
        { name: 'ProdServGroupString', type: MntConst.eTypeCode },
        { name: 'PostalBrickString', type: MntConst.eTypeCode },
        { name: 'VisitIntervalString', type: MntConst.eTypeCode },
        { name: 'AverageWeight', type: MntConst.eTypeDecimal2 },
        { name: 'SelectedArea', type: MntConst.eTypeCode },
        { name: 'SelectedDate', type: MntConst.eTypeDate },
        { name: 'SupervisorEmployeeCode', type: MntConst.eTypeCode },
        { name: 'SupervisorSurname', type: MntConst.eTypeText },
        { name: 'ViewTypeFilter' },
        { name: 'SelectedMonth' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESUMMARYWORKLOADGRIDMONTHBRANCH;
        this.pageTitle = this.browserTitle = 'Branch Summary Workload';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
