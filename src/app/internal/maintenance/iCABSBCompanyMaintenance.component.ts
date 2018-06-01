import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
    templateUrl: 'iCABSBCompanyMaintenance.html'
})

export class CompanyMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'CompanyCode' },
        { name: 'CompanyDesc' },
        { name: 'DefaultCompanyInd' },
        { name: 'AccountSortCode' },
        { name: 'DomesticBankAccountNumber' },
        { name: 'InternationalBankAccountNumber' },
        { name: 'SeparateCompanyInvoices' },
        { name: 'AllowMixedAccountsIND' },
        { name: 'UseDefaultCompanyInvoiceRange' },
        { name: 'CompanyAddressLine1' },
        { name: 'CompanyAddressLine2' },
        { name: 'CompanyAddressLine3' },
        { name: 'CompanyAddressLine4' },
        { name: 'CompanyAddressLine5' },
        { name: 'CompanyPostCode' },
        { name: 'CompanyTelephone' },
        { name: 'CompanyFax' },
        { name: 'CompanyEmail' },
        { name: 'CompanyWebsite' },
        { name: 'CompanyRepresentativeName' },
        { name: 'CompanyContactName' },
        { name: 'CompanyContactDepartment' },
        { name: 'CompanyGroupName' },
        { name: 'CompanyRegistrationTown' },
        { name: 'CompanyRegistrationNumber' },
        { name: 'CompanyVATNumber' },
        { name: 'CompanyTypeText' },
        { name: 'CompanyActivityText' },
        { name: 'CompanyAgreementText' },
        { name: 'CreditorID' },
        { name: 'MandatePrefix' },
        { name: 'NAVCompanyCode' },
        { name: 'MinimumCompanyInvoiceNumber' },
        { name: 'InvoiceMessageLine1' },
        { name: 'InvoiceMessageLine2' },
        { name: 'InvoiceMessageLine3' },
        { name: 'InvoiceMessageLine4' },
        { name: 'InvoiceMessageLine5' },
        { name: 'InvoiceMessageLine6' },
        { name: 'InvoiceMessageLine7' },
        { name: 'InvoiceMessageLine8' },
        { name: 'InvoiceMessageLine9' },
        { name: 'InvoiceMessageLine10' },
        { name: 'CompanyLockBoxAddressLine1' },
        { name: 'CompanyLockBoxAddressLine2' },
        { name: 'CompanyLockBoxAddressLine3' },
        { name: 'CompanyLockBoxAddressLine4' },
        { name: 'CompanyLockBoxAddressLine5' },
        { name: 'CompanyLockBoxPostCode' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBCOMPANYMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Company Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
