import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSCMProspectEntryMaintenance.html'
})

export class ProspectEntryMaintenanceComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'ProspectNumber' },
        { name: 'AccountNumber' },
        { name: 'ContractNumber' },
        { name: 'PremiseNumber' },
        { name: 'Name' },
        { name: 'AddressLine1' },
        { name: 'cmdGetAddress' },
        { name: 'AddressLine2' },
        { name: 'AddressLine3' },
        { name: 'AddressLine4' },
        { name: 'AddressLine5' },
        { name: 'Postcode' },
        { name: 'ContactName' },
        { name: 'ContactPosition' },
        { name: 'ContactTelephone' },
        { name: 'PremiseContactMobile' },
        { name: 'PremiseContactFax' },
        { name: 'PremiseContactEmail' },
        { name: 'BusinessOriginCode' },
        { name: 'BusinessOriginDesc' },
        { name: 'ContactMediumCode' },
        { name: 'ContactMediumDesc' },
        { name: 'AssignToEmployeeCode' },
        { name: 'AssignToEmployeeName' },
        { name: 'PDALeadInd' },
        { name: 'PDALeadEmployeeCode' },
        { name: 'PDALeadEmployeeSurname' },
        { name: 'SMSMessage' },
        { name: 'PremiseName' },
        { name: 'PremiseAddressLine1' },
        { name: 'cmdGetPremiseAddress' },
        { name: 'PremiseAddressLine2' },
        { name: 'PremiseAddressLine3' },
        { name: 'PremiseAddressLine4' },
        { name: 'PremiseAddressLine5' },
        { name: 'PremisePostcode' },
        { name: 'PremiseContactName' },
        { name: 'PremiseContactPosition' },
        { name: 'PremiseContactTelephone' },
        { name: 'AnnualValue' },
        { name: 'PaymentTypeCode' },
        { name: 'PaymentDesc' },
        { name: 'InvoiceGroupNumber' },
        { name: 'InvoiceGroupDesc' },
        { name: 'CustomerTypeCode' },
        { name: 'CustomerTypeDesc' },
        { name: 'NegotiatingSalesEmployeeCode' },
        { name: 'NegotiatingSalesEmployeeSurname' },
        { name: 'BranchNumber' },
        { name: 'BranchName' },
        { name: 'ServicingSalesEmployeeCode' },
        { name: 'ServicingSalesEmployeeSurname' },
        { name: 'PurchaseOrderNumber' },
        { name: 'ClientReference' },
        { name: 'Narrative' },
        { name: 'ProspectStatusCode' },
        { name: 'ProspectStatusDesc' },
        { name: 'ConvertedToNumber' },
        { name: 'chkAuthorise' },
        { name: 'chkReject' },
        { name: 'chkBranch' }
    ];
    ngOnInit(): void {
        super.ngOnInit();
    }
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTENTRYMAINTENANCE;
    }
}
