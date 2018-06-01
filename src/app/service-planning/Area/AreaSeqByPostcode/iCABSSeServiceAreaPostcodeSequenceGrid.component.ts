import { Component } from '@angular/core';
import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeServiceAreaPostcodeSequenceGrid.html'
})

export class ServiceAreaPostcodeSequenceGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'ContractTypeCode' },
        { name: 'PortfolioStatusType' },
        { name: 'IncludeUnsequenced' },
        { name: 'SequenceGap' },
        { name: 'cmdResequenceNumbers' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEAREAPOSTCODESEQUENCEGRID;
    }
}
