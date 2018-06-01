import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSeWasteConsignmentNoteGrid.html'
})

export class WasteConsignmentNoteGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
         { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'WasteConsignmentNoteNumber' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEWASTECONSIGNMENTNOTEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Waste Consignment Note Detail';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
