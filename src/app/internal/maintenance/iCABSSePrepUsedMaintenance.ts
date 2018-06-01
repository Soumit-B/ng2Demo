import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSePrepUsedMaintenance.html'
})

export class SePrepUsedMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: true, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'PrepCode', readonly: true, disabled: false, required: false },
        { name: 'PrepDesc', readonly: true, disabled: false, required: false },
        { name: 'MeasureBy', readonly: true, disabled: false, required: false },
        { name: 'PrepVolume', readonly: true, disabled: false, required: false },
        { name: 'PrepValue', readonly: true, disabled: false, required: false },
        { name: 'MixRatio', readonly: true, disabled: false, required: false },
        { name: 'EPANumber', readonly: true, disabled: false, required: false },
        { name: 'PrepUsedText', readonly: true, disabled: false, required: false },
        { name: 'PrepBatchNumber', readonly: true, disabled: false, required: false },
        { name: 'AreaCovered', readonly: true, disabled: false, required: false },
        { name: 'Temperature', readonly: true, disabled: false, required: false },
        { name: 'Humidity', readonly: true, disabled: false, required: false },
        { name: 'WindSpeed', readonly: true, disabled: false, required: false },
        { name: 'ApplicationNote', readonly: true, disabled: false, required: false }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPREPUSEDMAINTENANCE;
    }
}
