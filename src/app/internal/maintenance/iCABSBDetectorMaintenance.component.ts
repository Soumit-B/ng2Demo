import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSBDetectorMaintenance.html'
})

export class DetectorMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'DetectorID'},
        { name: 'Description'},
        { name: 'ValidForSingleBarcode'},
        { name: 'SortOrder'},
        { name: 'HasBattery'},
        { name: 'HasGas'},
        { name: 'ConnectUnit'},
        { name: 'PassToPDAInd'},
        { name: 'BarcodeRef'}
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBDETECTORMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
