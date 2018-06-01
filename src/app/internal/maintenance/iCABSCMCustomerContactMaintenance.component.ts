import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

@Component({
    templateUrl: 'iCABSCMCustomerContactMaintenance.html'
})

export class CustomerContactMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';

    public controls = [
        { name: 'CustomerContactNumber' },
        { name: 'CurrentTeamID' },
        { name: 'ActionCount' },
        { name: 'ClosedDateTime' },
        { name: 'AccountNumber' },
        { name: 'AccountName' },
        { name: 'GroupAccountNumber' },
        { name: 'GroupName' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'CurrentOwnerEmployeeCode' },
        { name: 'CurrentOwnerEmployeeName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ServiceTypeCode' },
        { name: 'ServiceTypeDesc' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'ContactPostcode' },
        { name: 'DispProspectNumber' },
        { name: 'AddressName' },
        { name: 'AddressContactName' },
        { name: 'AddressLine1' },
        { name: 'AddressContactPosn' },
        { name: 'AddressLine2' },
        { name: 'AddressLine3' },
        { name: 'AddressLine4' },
        { name: 'AddressContactPhone' },
        { name: 'AddressLine5' },
        { name: 'AddressContactMobile' },
        { name: 'AddressPostcode' },
        { name: 'AddressContactEmail' },

        { name: 'CustomerContactPosition' },
        { name: 'CustomerContactTelephone' },
        { name: 'CustomerContactMobileNumber' },
        { name: 'CustomerContactEmailAddress' },
        { name: 'CustomerContactFax' },
        { name: 'CustomerContactTicketReference' },
        { name: 'CreatedDate' },
        { name: 'CreatedTime' },
        { name: 'CreatedByEmployeeCode' },
        { name: 'CreatedByEmployeeName' },
        { name: 'ShortNarrative' },
        { name: 'ContactPosition' },
        { name: 'ContactTelephone' },
        { name: 'ContactMobileNumber' },
        { name: 'ContactEmailAddress' },
        { name: 'ContactFax' },
        { name: 'TicketReference' },
        { name: 'LatestCreatedDate' },
        { name: 'LatestCreatedTime' },
        { name: 'LatestCreatedByEmployeeCode' },
        { name: 'LatestCreatedByEmployeeName' },
        { name: 'ShortDescription' },
        { name: 'EarliestEffectDate' },
        { name: 'chkCreateProspect' },
        { name: 'CRCommenceDate' },
        { name: 'CRNoticePeriod' },
        { name: 'NextActionByTime' },
        { name: 'DefaultAssigneeEmployeeDetails' },
        { name: 'OriginatingEmployeeCode' },
        { name: 'OriginatingEmployeeName' },
        { name: 'NextActionEmployeeCode' },
        { name: 'NextActionEmployeeName' },
        { name: 'chkKeepOwnership' },
        { name: 'chkContactPassedToActioner' },
        { name: 'SMSSendOnTime' },
        { name: 'chkCreateCallOut' },
        { name: 'ScheduledCloseDate' }

    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Ticket Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
