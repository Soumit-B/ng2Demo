import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

@Component({
    templateUrl: 'iCABSCMContactRedirectionMaintenance.html'
})

export class ContactRedirectionMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';

    public controls = [
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'EmployeeCodeTo' },
        { name: 'EmployeeSurnameTo' },
        { name: 'RedirectMessagingInd' },
        { name: 'RedirectEmployeeInd' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCONTACTREDIRECTIONMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Redirection Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
