import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSeServiceAreaSequenceGrid.html'
})

export class ServiceAreaSequenceGridComponent extends BaseComponent implements OnInit, OnDestroy {


    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'SeqNumberFrom' },
        { name: 'SequenceGap' }

    ];

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEAREASEQUENCEGRID;

    }
}
