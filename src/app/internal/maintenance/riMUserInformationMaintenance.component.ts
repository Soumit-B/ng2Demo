import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'riMUserInformationMaintenance.html'
})

export class UserInformationMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'UserCode' },
        { name: 'UserName' },
        { name: 'LanguageCode' },
        { name: 'LanguageDescription' },
        { name: 'Email' },
        { name: 'PhoneNumber' },
        { name: 'FaxNumber' },
        { name: 'Password' },
        { name: 'PasswordLastChangedDate' },
        { name: 'PasswordRetries' },
        { name: 'DateLastLoggedOn' },
        { name: 'LocalDocumentServer' },
        { name: 'ReportServer' },
        { name: 'UserTypeCode' },
        { name: 'UserTypeDescription' },
        { name: 'ApprovalLevelCode' },
        { name: 'SOUserQuoteTypeGroupCode' },
        { name: 'OwnSubmissionsInd' },
        { name: 'Inactive' },
        { name: 'riDeveloper' },
        { name: 'riMessagingEnabled' },
        { name: 'riProgramRequestStats' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMUSERINFORMATIONMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'User Information Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
