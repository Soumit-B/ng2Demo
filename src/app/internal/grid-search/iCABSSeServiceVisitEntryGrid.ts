import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeServiceVisitEntryGrid.html'
})

export class SeServiceVisitEntryGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: true, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false },
        { name: 'BranchServiceAreaDesc', readonly: true, disabled: false, required: false },
        { name: 'BranchServiceAreaSeqNo', readonly: true, disabled: false, required: false },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: false, required: false }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEVISITENTRYGRID;
    }
}
