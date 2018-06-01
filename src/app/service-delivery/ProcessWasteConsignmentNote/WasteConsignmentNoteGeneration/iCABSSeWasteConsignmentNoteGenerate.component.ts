import { Component } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeWasteConsignmentNoteGenerate.html'
})

export class WasteConsignmentNoteGenerateComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchName' },
        { name: 'BranchServiceAreaList' },
        { name: 'UsePrintTool' },
        { name: 'GenerateAll' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEWASTECONSIGNMENTNOTEGENERATE;
    }
}
