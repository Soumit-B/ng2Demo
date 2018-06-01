import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Component, OnInit, ViewChild, Injector } from '@angular/core';
// import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
@Component({
    templateUrl: 'iCABSAPostcodeMoveBranchMessage.html'
})

export class PostcodeMoveBranchMessageComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPOSTCODEMOVEBRANCHMESSAGE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
