import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSBBranchServiceAreaEmployeeGrid.html'
})

export class BranchServiceAreaEmployeeGridComponent extends BaseComponent implements OnInit {


    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'BranchNumber' },
        { name: 'menu' }
    ];

    ngOnInit(): void {
        super.ngOnInit();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBRANCHSERVICEAREAEMPLOYEEGRID;

    }
}
