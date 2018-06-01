import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
     templateUrl: 'iCABSSSystemCharacteristicsMaintenance.html'
})

export class SystemMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSYSTEMCHARACTERISTICSMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'System Characteristics Maintenance';

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

