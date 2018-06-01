import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeUploadBulkServiceCoverUplifts.html'
})

export class UploadBulkServiceCoverUpliftsComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEUPLOADBULKSERVICECOVERUPLIFTS;
    }
}
