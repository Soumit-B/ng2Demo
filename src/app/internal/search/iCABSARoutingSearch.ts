import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSARoutingSearch.html'
})

export class RoutingSearchComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'Apply' },
        { name: 'cbAddressLine1' },
        { name: 'strAddressLine1' },
        { name: 'cbAddressLine2' },
        { name: 'strAddressLine2' },
        { name: 'cbAddressLine3' },
        { name: 'strAddressLine3' },
        { name: 'cbAddressLine4' },
        { name: 'strAddressLine4' },
        { name: 'cbPostcode' },
        { name: 'strPostcode' },
        { name: 'cbCountry' },
        { name: 'strCountry' },
        { name: 'cmdAddress' },
        { name: 'cbGPSX' },
        { name: 'strGPSX' },
        { name: 'cmdFind' },
        { name: 'strScore' },
        { name: 'strSelRoutingSource' },
        { name: 'cbGeonode' },
         { name: 'strGeonode' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAROUTINGSEARCH;
    }
}
