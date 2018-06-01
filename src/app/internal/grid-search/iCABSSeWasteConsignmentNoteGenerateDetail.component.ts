import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSeWasteConsignmentNoteGenerateDetail.html'
})

export class WasteConsignmentNoteGenerateDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BranchNumber' },
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'UsePrintTool' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEWASTECONSIGNMENTNOTEGENERATEDETAIL;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Generate Service Listing';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
