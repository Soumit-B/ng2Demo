import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeServiceAreaDetailGrid.html'
})

export class SeServiceAreaDetailGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: false, disabled: false, required: false },
        { name: 'ContractTypeCode', readonly: false, disabled: false, required: false },
        { name: 'PremisePostcode', readonly: false, disabled: false, required: false },
        { name: 'PortfolioStatusType', readonly: false, disabled: false, required: false },
        { name: 'PremiseTown', readonly: false, disabled: false, required: false },
        { name: 'EntitlementProd', readonly: false, disabled: false, required: false },
        { name: 'SeqNumberFrom', readonly: false, disabled: false, required: false },
        { name: 'DisplayErrors', readonly: false, disabled: false, required: false },
        { name: 'TotalPremises', readonly: false, disabled: false, required: false },
        { name: 'TotalExchanges', readonly: false, disabled: false, required: false },
        { name: 'TotalHours', readonly: false, disabled: false, required: false },
        { name: 'TotalWEDs', readonly: false, disabled: false, required: false }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEAREADETAILGRID;
    }
}
