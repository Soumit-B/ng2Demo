import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';


@Component({
    templateUrl: 'iCABSSeServicePlanSummaryDetailGrid.html'
})

export class ServicePlanSummaryDetailGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';

    public controls = [
       {name: 'ServicePlanNumber'},
       {name: 'PlannedVisitDate'},
       {name: 'VisitTypeDescTranslated'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANSUMMARYDETAILGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

