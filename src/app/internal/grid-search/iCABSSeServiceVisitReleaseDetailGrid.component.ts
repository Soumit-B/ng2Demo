import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSeServiceVisitReleaseDetailGrid.html'
})

export class ServiceVisitReleaseDetailGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
         { name: 'ContractNumber' },
         { name: 'ContractName' },
         { name: 'DateFrom' },
         { name: 'DateTo' },
         { name: 'PremiseNumber' },
         { name: 'PremiseName' },
         { name: 'ServiceAnnualValue' },
         { name: 'ProductCode' },
         { name: 'ProductDesc' },
         { name: 'ServiceVisitFrequency' },
         { name: 'VisitValue' },
         { name: 'ServiceQuantity' }

    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEVISITRELEASEDETAILGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Visit Detail Release';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
