import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSSeCustomerSignatureSummary.html'
})

export class CustomerSignatureSummaryComponent extends BaseComponent implements OnInit, OnDestroy {


    public pageId: string = '';
    public controls = [
        { name: 'BusinessCode' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'RegionCode' },
        { name: 'RegionDesc' },
        { name: 'SupervisorEmployeeCode' },
        { name: 'SupervisorSurname' }
    ];

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSECUSTOMERSIGNATURESUMMARY;

    }
}
