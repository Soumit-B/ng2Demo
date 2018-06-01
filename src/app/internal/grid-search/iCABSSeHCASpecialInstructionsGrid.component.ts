import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSSeHCASpecialInstructionsGrid.html'
})

export class SpecialInstructionsGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'ContractNumber' },
        { name: 'ContractName' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEHCASPECIALINSTRUCTIONSGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Special Instructions Update';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
