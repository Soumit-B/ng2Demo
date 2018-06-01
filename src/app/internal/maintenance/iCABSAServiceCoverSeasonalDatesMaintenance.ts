import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSAServiceCoverSeasonalDatesMaintenance.html'
})

export class ServiceCoverSeasonalDatesMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'Status' },
        { name: 'ServiceCommenceDate' },
        { name: 'ServiceVisitFrequency' },
        { name: 'ServiceQuantity' },
        { name: 'ServiceVisitAnnivDate' },
        { name: 'SeasonalServiceInd' },
        { name: 'NumberOfSeasons' },
        { name: 'SeasonalTemplateNumber' },
        { name: 'TemplateName' },
        { name: 'SeasonalBranchUpdate' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERSEASONALDATESMAINTENANCE;
    }
}
