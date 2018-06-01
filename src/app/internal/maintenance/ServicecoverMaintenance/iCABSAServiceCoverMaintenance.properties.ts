import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'icabs-service-cover-properties',
    templateUrl: 'iCABSAServiceCoverMaintenance.properties.html'
})

export class ServiceCoverPropertiesComponent implements OnInit, OnDestroy {
    @Input() public uiForm: FormGroup;

    ngOnInit(): void {
        // statement
    }

    ngOnDestroy(): void {
        // statement
    }

}
