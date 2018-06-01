import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';

@Component({
    templateUrl: 'iCABSARWasteTransferNotesPrint.html'
})

export class WasteTransferNotesPrintComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchNumber' },
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurName' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PlanVisitsDue' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSARWASTETRANSFERNOTESPRINT;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
