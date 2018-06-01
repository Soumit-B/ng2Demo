import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector, Component } from '@angular/core';
import { BaseComponent } from 'src/app/base/BaseComponent';

@Component({
    templateUrl: 'iCABSALostBusinessRequestSearch.html'
})
export class ALostBusinessRequestSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = ' ';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'CustomerContactName' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSALOSTBUSINESSREQUESTSEARCH;
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}
