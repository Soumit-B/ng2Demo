import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSePDAWorkListEntryGrid.html'
})

export class PDAWorkListEntryGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'TotalMileage' },
        { name: 'DateFrom' },
        { name: 'DateTo' },
        { name: 'TotalDuration' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPDAWORKLISTENTRYGRID;
    }
}
