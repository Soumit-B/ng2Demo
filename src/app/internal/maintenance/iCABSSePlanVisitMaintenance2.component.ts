import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MntConst } from './../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSSePlanVisitMaintenance2.html'
})

export class PlanVisitMaintenance2Component extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls: any[] = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName' },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName' },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc' },
        { name: 'PlanVisitNumber', type: MntConst.eTypeInteger },
        { name: 'VisitTypeCode', type: MntConst.eTypeCode },
        { name: 'VisitTypeDesc' },
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        { name: 'BranchName' },
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeCode },
        { name: 'BranchServiceAreaDesc' },
        { name: 'OriginalVisitDueDate' },
        { name: 'PlanQuantity', type: MntConst.eTypeInteger },
        { name: 'VisitDurationDefault', type: MntConst.eTypeText }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPLANVISITMAINTENANCE2;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Plan Visit Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
