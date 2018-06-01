import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSBBusinessRegistryGrid.html'
})

export class BusinessRegistryGridComponent extends BaseComponent implements OnInit {


    public pageId: string = '';
    public controls = [
        { name: 'LatestInd' }
    ];

    ngOnInit(): void {
        super.ngOnInit();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBUSINESSREGISTRYGRID;

    }
}
