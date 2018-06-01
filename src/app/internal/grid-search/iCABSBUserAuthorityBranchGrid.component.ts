import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MntConst } from './../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSBUserAuthorityBranchGrid.html'
})

export class UserAuthorityBranchGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls: any[] = [
        { name: 'UserCode', type: MntConst.eTypeCode },
        { name: 'UserName', type: MntConst.eTypeText },
        { name: 'ExistingBranchAuthorityInd', type: MntConst.eTypeCheckBox },
        { name: 'LiveBranchInd', type: MntConst.eTypeCheckBox }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBUSERAUTHORITYBRANCHGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'User Authority - Branch';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
