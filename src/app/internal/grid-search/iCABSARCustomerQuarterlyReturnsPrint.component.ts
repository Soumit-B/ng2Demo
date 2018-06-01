import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSARCustomerQuarterlyReturnsPrint.html'
})

export class CustomerQuarterlyReturnsPrintComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BranchName' },
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurName' },
        { name: 'EmployeeSurname' },
        { name: 'PlanVisitsDue' },
        { name: 'RegulatoryAuthorityNumber' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSARCUSTOMERQUARTERLYRETURNSPRINT;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Customer Quarterly Returns';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
