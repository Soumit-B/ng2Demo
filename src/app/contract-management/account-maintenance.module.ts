import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { ContractManagementModuleRoutes } from './../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
import { AccountMaintenanceComponent } from './AccountAndGroupAccountManagement/iCABSAAccountMaintenance';
import { TelesalesComponent } from './AccountAndGroupAccountManagement/tabs/Telesales.component';
import { AccountManagementComponent } from './AccountAndGroupAccountManagement/tabs/AccountManagement.component';
import { AddressComponent } from './AccountAndGroupAccountManagement/tabs/Address.component';
import { EDIInvoicingComponent } from './AccountAndGroupAccountManagement/tabs/EDIInvoicing.component';
import { GeneralComponent } from './AccountAndGroupAccountManagement/tabs/General.component';
import { BankDetailsComponent } from './AccountAndGroupAccountManagement/tabs/BankDetails.component';
import { InvoiceTextComponent } from './AccountAndGroupAccountManagement/tabs/InvoiceText.component';
import { DiscountsComponent } from './AccountAndGroupAccountManagement/tabs/Discounts.component';

@Component({
    template: `<router-outlet></router-outlet>
    `
})

export class AccountMaintenanceRootComponent {
    constructor(viewContainerRef: ViewContainerRef, componentsHelper: ComponentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
}

@NgModule({
    imports: [
        HttpModule,
        InternalSearchModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '', component: AccountMaintenanceRootComponent, children: [
                    { path: ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE_SUB, component: AccountMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
            ], data: { domain: 'CONTRACT MANAGEMENT' }
            }

        ])
    ],
    declarations: [
        AccountMaintenanceRootComponent,
        AccountMaintenanceComponent,
        DiscountsComponent,
        TelesalesComponent,
        InvoiceTextComponent,
        EDIInvoicingComponent,
        BankDetailsComponent,
        GeneralComponent,
        AccountManagementComponent,
        AddressComponent
    ],
    exports: [
        DiscountsComponent,
        TelesalesComponent,
        InvoiceTextComponent,
        EDIInvoicingComponent,
        BankDetailsComponent,
        GeneralComponent,
        AccountManagementComponent,
        AddressComponent
    ],
    entryComponents: [
        DiscountsComponent,
        TelesalesComponent,
        InvoiceTextComponent,
        EDIInvoicingComponent,
        BankDetailsComponent,
        GeneralComponent,
        AccountManagementComponent,
        AddressComponent
    ]
})

export class AccountMaintenanceModule { }
