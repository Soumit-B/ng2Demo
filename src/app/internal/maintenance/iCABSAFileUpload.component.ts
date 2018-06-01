import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSAFileUpload.html'
})

export class FileUploadComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'FileUploaded' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAFILEUPLOAD;
    }
}
