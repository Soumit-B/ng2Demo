import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';

@Component({
    templateUrl: 'iCABSSeServiceVisitEntitlementEntryGrid.html'
})

export class ServiceVisitEntitlementEntryGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'ShowType' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ServiceDate' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'BranchServiceAreaSeqNo' },
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'DeliveryNoteNumber' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEVISITENTITLEMENTENTRYGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
