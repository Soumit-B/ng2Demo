import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSeServicePlanningListEntry.html'
})

export class ServicePlanningListEntryComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BusinessDesc' },
        { name: 'BranchNumber' },
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGLISTENTRY;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Planning List';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
