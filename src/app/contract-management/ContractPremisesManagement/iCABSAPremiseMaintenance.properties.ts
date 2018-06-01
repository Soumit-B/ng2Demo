import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'icabs-premise-properties',
    templateUrl: 'iCABSAPremiseMaintenance.properties.html'
})

export class PremisePropertiesComponent implements OnInit, OnDestroy {
    @Input() public uiForm: FormGroup;

    ngOnInit(): void {
        // statement
    }

    ngOnDestroy(): void {
        // statement
    }

}
