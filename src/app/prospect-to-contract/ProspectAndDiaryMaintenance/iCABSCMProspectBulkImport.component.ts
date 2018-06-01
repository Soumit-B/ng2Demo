import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSCMProspectBulkImport.html'
})

export class CMProspectBulkImportComponent extends BaseComponent implements OnInit {

    public pageId: string = '';
    public controls = [];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTBULKIMPORT;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Prospect Bulk Import';
    }
}
