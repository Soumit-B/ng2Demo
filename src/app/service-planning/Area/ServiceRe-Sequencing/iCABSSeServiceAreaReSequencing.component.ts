import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from '../../../../shared/components/grid/grid';
import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSeServiceAreaReSequencing.html'
})

export class ServiceAreaReSequencingComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
         { name: 'EmployeeSurname' },
         { name: 'DateSelection' },
         { name: 'GridPageSize' },
         { name: 'LocationStartPostcode' },
         { name: 'LocationEndPostcode' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEAREARESEQUENCING;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Re-Sequencing';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
