import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSBInfestationLevelMaintenance.html'
})

export class InfestationLevelMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'InfestationGroupCode' },
        { name: 'InfestationGroupDesc' },
        { name: 'InfestationLevelCode' },
        { name: 'InfestationLevelDesc' },
        { name: 'LevelScore' },
        { name: 'SortOrder' },
        { name: 'PassToPDAInd' },
        { name: 'ExtraInputInd' },
        { name: 'PassToTabletInd' },
        { name: 'menu' }
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINFESTATIONLEVELMAINTENANCE;
    }
    ngOnInit(): void {
        super.ngOnInit();
    }
}
