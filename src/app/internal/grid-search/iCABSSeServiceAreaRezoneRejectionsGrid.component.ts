import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSeServiceAreaRezoneRejectionsGrid.html'
})

export class ServiceAreaRezoneRejectionsGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BranchName' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEAREAREZONEREJECTIONSGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Area Rezone Rejections';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
