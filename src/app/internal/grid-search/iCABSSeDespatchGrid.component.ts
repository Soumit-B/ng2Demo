import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';

@Component({
    templateUrl: 'iCABSSeDespatchGrid.html'
})

export class DespatchGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
        { name: 'ServiceAreaListCode' },
        { name: 'ServiceAreaList' },
        { name: 'VisitTypeGroupCode' },
        { name: 'VisitTypeList' },
        { name: 'WeekNumber' },
        { name: 'GridPageSize' },
        { name: 'CManualDates' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'VisitStatus' },
        { name: 'DespatchStatus' },
        { name: 'ProductCode' },
        { name: 'ProductComponentCode' },
        { name: 'ContractTypeFilter' },
        { name: 'ContractNameSearch' },
        { name: 'TownBegins' },
        { name: 'PostcodeSearch' },
        { name: 'ClientReference' },
        { name: 'ConfApptOnly' },
        { name: 'BranchServiceAreaCodeChange' },
        { name: 'EmployeeSurnameChange' },
        { name: 'AssignServiceArea' },
        { name: 'AssignServiceEmployee' },
        { name: 'UpdateComponentCode' },
        { name: 'UpdateComponentDesc' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEDESPATCHGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
