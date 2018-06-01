import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';


@Component({
    templateUrl: 'iCABSBVisitTypeMaintenance.html'
})

export class VisitTypeMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'VisitTypeCode' },
        { name: 'VisitTypeDesc' },
        { name: 'WeightFactor' },
        { name: 'PassToPDAInd' },
        { name: 'OtherInd' },
        { name: 'VisitTypeNarrative' },
        { name: 'InspectionInd' },
        { name: 'PestNetInd' },
        { name: 'PestControlInd' },
        { name: 'ProductSaleInd' },
        { name: 'ActiveInd' }
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBVISITTYPEMAINTENANCE;
    }
    ngOnInit(): void {
        super.ngOnInit();
    }
}
