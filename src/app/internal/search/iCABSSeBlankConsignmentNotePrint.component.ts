import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSeBlankConsignmentNotePrint.html'
})

export class BlankConsignmentNotePrintComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'FilterRegAuthority' },
        { name: 'FilterWasteTransferType' },
        { name: 'PrintCopies' },
        { name: 'SchedulePrintCopies' },
        { name: 'AuthorityPrintCopies' },
        { name: 'UsePrintTool' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEBLANKCONSIGNMENTNOTEPRINT;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Blank Consignment Note Print';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
