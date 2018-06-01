import { Component, OnInit, Injector } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
@Component({
    templateUrl: 'iCABSBNoSignatureReasonSearch.html'
})

export class NoSignatureReasonSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBLOSTBUSINESSMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
