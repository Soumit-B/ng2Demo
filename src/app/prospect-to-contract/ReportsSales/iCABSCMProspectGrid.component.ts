import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSCMProspectGrid.html'
})

export class CMProspectGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTGRID;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Management - Prospect';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
