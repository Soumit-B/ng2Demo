import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSBServiceAreaRezoneGrid.html'
})

export class ServiceAreaRezoneGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'ContractTypeCode' },
        { name: 'BranchServiceAreaCodeTo' },
        { name: 'BranchServiceAreaDescTo' },
        { name: 'PortfolioStatusType' },
        { name: 'ProductServiceGroupCode' },
        { name: 'ProductServiceGroupDesc' },
        { name: 'Postcode' },
        { name: 'State' },
        { name: 'Town' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBSERVICEAREAREZONEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Area Postcode Rezoning';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
