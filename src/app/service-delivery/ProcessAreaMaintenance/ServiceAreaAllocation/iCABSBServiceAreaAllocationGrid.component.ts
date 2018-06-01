import { Component } from '@angular/core';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSBServiceAreaAllocationGrid.html'
})

export class ServiceAreaAllocationGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode'},
        { name: 'BranchServiceAreaDesc'},
        { name: 'ServiceVisitFrequency'},
        { name: 'VisitCycleInWeeks'},
        { name: 'PostcodeFilter'},
        { name: 'TownFilter'},
        { name: 'PortfolioStatusType'},
        { name: 'SelectedPremiseNumber'},
        { name: 'SelectedPremiseName'},
        { name: 'SelectedProductService'},
        { name: 'SelectedProductCode'},
        { name: 'SelectedWED'},
        { name: 'SelectedServiceType'},
        { name: 'SelectedFrequency'},
        { name: 'SelectedVisitCycle'},
        { name: 'SelectedQuantity'},
        { name: 'SelectedNextVisit'},
        { name: 'SelectedPostcode'},
        { name: 'SelectedServiceAreaCode'},
        { name: 'ExcludeSelectedArea'},
        { name: 'SelectedServiceAreaSeq'},
        { name: 'SelectedAnniversary'},
        { name: 'ExcludeSelectedArea'}
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBSERVICEAREAALLOCATIONGRID;
    }
}
