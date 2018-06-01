import { Component, OnInit, Injector, OnDestroy } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAContractProductSummary.html'
})
export class ContractProductSummaryComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'InvoiceAnnivDate', type: MntConst.eTypeDate },
        { name: 'AccountNumber', type: MntConst.eTypeCode },
        { name: 'AccountName', type: MntConst.eTypeText },
        { name: 'NegBranchNumber', type: MntConst.eTypeInteger },
        { name: 'NegBranchName', type: MntConst.eTypeText },
        { name: 'InvoiceFrequencyCode', type: MntConst.eTypeInteger },
        { name: 'ContractAnnualValue', type: MntConst.eTypeCurrency }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACONTRACTPRODUCTSUMMARY;
        this.pageTitle = this.browserTitle = 'Contract Product Summary';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
