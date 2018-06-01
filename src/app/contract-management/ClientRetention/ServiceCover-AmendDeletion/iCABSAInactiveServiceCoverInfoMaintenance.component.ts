import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { Component, OnInit,Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSAInactiveServiceCoverInfoMaintenance.html'
})

export class InactiveServiceCoverInfoMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'menu'},
        { name: 'ContractNumber'},
        { name: 'ContractName'},
        { name: 'NegBranchNumber'},
        { name: 'BranchName'},
        { name: 'PremiseNumber'},
        { name: 'PremiseName'},
        { name: 'ProductCode'},
        { name: 'ProductDesc'},
        { name: 'Status'},
        { name: 'ServiceVisitFrequency'},
        { name: 'ServiceAnnualValue'},
        { name: 'ServiceQuantity'},
        { name: 'InvoiceAnnivDate'},
        { name: 'ServiceCommenceDate'},
        { name: 'InvoiceFrequencyCode'},
        { name: 'InvoiceFrequencyDesc'},
        { name: 'LostBusinessCode'},
        { name: 'LostBusinessDetailCode'},
        { name: 'InactiveEffectDate'},
        { name: 'CommissionEmployeeCode'},
        { name: 'SalesEmployeeText'},
        { name: 'EmployeeSurname'},
        { name: 'InactiveServiceCoverText'},
        { name: 'VisitNarrativeCode'},
        { name: 'RemovalVisitText'},
        { name: 'CreateContact'},
        { name: 'CancelProRataChargeInd'}
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINACTIVESERVICECOVERINFOMAINTENANCE;
    }
}
