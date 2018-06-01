import { Component } from '@angular/core';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeHCARiskAssessmentGrid.html'
})

export class SeHCARiskAssessmentGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        {name: 'EmployeeCode'},
        {name: 'EmployeeSurname'},
        {name: 'ContractNumber'},
        {name: 'ContractName'}
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEHCARISKASSESSMENTGRID;
    }
}
