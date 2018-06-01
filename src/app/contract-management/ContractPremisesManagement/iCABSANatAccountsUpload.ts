import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSANatAccountsUpload.html'
})

export class NatAccountsUploadComponent extends BaseComponent {

     public pageId: string = '';
      public controls = [
      ];

       constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSANATACCOUNTSUPLOAD;
    }


}
