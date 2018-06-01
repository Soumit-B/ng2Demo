import { Component } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

@Component({
    templateUrl: 'iCABSCMProspectMaintenance.html'
})

export class CMProspectMaintenanceComponent extends BaseComponent implements OnInit {

    private subSysChar: Subscription;
    public xhrParams = {
        module: 'prospect',
        method: 'prospect-to-contract/maintenance',
        operation: 'ContactManagement/iCABSCMProspectMaintenance'
    };

    public pageId: string = '';
    public controls = [
        { name: 'ProspectNumber' },
        { name: 'AccountNumber' },
        { name: 'ContractNumber' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'PremiseAddressLine1' },
        { name: 'PremiseAddressLine2' },
        { name: 'PremiseAddressLine3' },
        { name: 'PremiseAddressLine4' },
        { name: 'PremiseAddressLine5' },
        { name: 'PremisePostCode' },
        { name: 'PremiseContactName' },
        { name: 'PremiseContactPosition' },
        { name: 'PremiseContactTelephone' },
        { name: 'PremiseContactMobile' },
        { name: 'PremiseContactFax' },
        { name: 'PremiseContactEmail' },
        { name: 'ProspectStatusCode' },
        { name: 'ProspectStatusDesc' },
        { name: 'PDALeadEmployeeCode' },
        { name: 'PDALeadEmployeeSurname' },
        { name: 'TotalConvertedValue' },
        { name: 'ConvertedSalesEmployeeCode' },
        { name: 'ConvertedSalesEmployeeSurname' },
        { name: 'Name' },
        { name: 'AddressLine1' },
        { name: 'AddressLine2' },
        { name: 'AddressLine3' },
        { name: 'AddressLine4' },
        { name: 'AddressLine5' },
        { name: 'PostCode' },
        { name: 'ContactName' },
        { name: 'ContactPosition' },
        { name: 'ContactTelephone' },
        { name: 'ContactMobile' },
        { name: 'ContactFax' },
        { name: 'ContactEmail' }
    ];

    public tabs: any = {
        tab0: { active: true },
        tab1: { active: false },
        tab2: { active: false }
    };

    public ngOnInit(): void {
        super.ngOnInit();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTMAINTENANCE;
    }

    public onTabClick(index: number): void {
        if (this.tabs['tab' + index].active) {
            return;
        }
        for (let key in this.tabs) {
            if (!key) {
                continue;
            }

            if (key === 'tab' + index) {
                this.tabs[key].active = true;
                continue;
            }
            this.tabs[key].active = false;
        }
    }

    private getSysCharDtetails(): any {
        this.ajaxSource.next(this.ajaxconstant.START);
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInstallationEmployeeCodeValidation,
            this.sysCharConstants.SystemCharEnableSurveyDetail
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vEnableInsEmpCodeValidation = record[0].Required;
            this.pageParams.vEnableSurveyDetail = record[1].Required;
            this.pageParams.vShowWasteHistory = record[2].Required;
            //this.getregistryValues();
        });
    }


}
