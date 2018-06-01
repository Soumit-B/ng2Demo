import { BaseComponent } from '../../../app/base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSeServicePlanningInfo.html'
})

export class ServicePlanningInfoComponent extends BaseComponent implements OnInit {

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseName' },
        { name: 'PremiseNumber' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'ContractExpiryDate' },
        { name: 'ServiceSpecialInstructions' },
        {name: 'WindowStart01'},
        {name: 'WindowEnd01'},
        {name: 'WindowStart08'},
        {name: 'WindowEnd08'},
        {name: 'WindowStart02'},
        {name: 'WindowEnd02'},
        {name: 'WindowStart09'},
        {name: 'WindowEnd09'},
        {name: 'WindowStart03'},
        {name: 'WindowEnd03'},
        {name: 'WindowStart10'},
        {name: 'WindowEnd10'},
        {name: 'WindowStart04'},
        {name: 'WindowEnd04'},
        {name: 'WindowStart11'},
        {name: 'WindowEnd11'},
        {name: 'WindowStart05'},
        {name: 'WindowEnd05'},
        {name: 'WindowStart12'},
        {name: 'WindowEnd12'},
        {name: 'WindowStart06'},
        {name: 'WindowEnd06'},
        {name: 'WindowStart13'},
        {name: 'WindowEnd13'},
        {name: 'WindowStart07'},
        {name: 'WindowEnd07'},
        {name: 'WindowStart14'},
        {name: 'WindowEnd14'}
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGINFO;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = '';
    }

}
