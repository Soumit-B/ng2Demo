import { Component } from '@angular/core';
import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSSePlanningDiary.html'
})

export class SePlanningDiaryComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'SupervisorEmployeeCode' },
        { name: 'BranchServiceAreaCode' },
        { neme: 'EmployeeSurname' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPLANNINGDIARY;
    }
}
