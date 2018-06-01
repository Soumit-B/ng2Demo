import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

@Component({
    templateUrl: 'iCABSCMRootCauseAnalysisDetailGrid.html'
})

export class RootCauseAnalysisDetailGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';

    public controls = [
        { name: 'ReportTypeCode' },
        { name: 'ReportTypeDesc' },
        { name: 'ReportNumber' },
        { name: 'DateFrom' },
        { name: 'DateTo' },
        { name: 'ContactType' },
        { name: 'ContactTypeDetail' },
        { name: 'CustomerType' },
        { name: 'RootCause' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMROOTCAUSEANALYSISDETAILGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Customer Complaint Details - Business';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
