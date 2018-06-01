import { ReleaseForInvoiceGridComponent } from './JobReleaseInvoice/Employee/iCABSReleaseForInvoiceGrid.component';
import { ActualVsContractualServiceCoverComponent } from './Portfolio/iCABSSeActualVsContractualServiceCover.component';
import { ActualVsContractualBusinessComponent } from './Portfolio/iCABSSeActualVsContractualBusiness';
import { ActualVsContractualBranchComponent } from './Portfolio/iCABSSeActualVsContractualBranch';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
/*import { InternalGridSearchModule } from '../internal/grid-search.module';
import { InternalMaintenanceModule } from '../internal/maintenance.module';*/
import { InternalSearchModule } from '../internal/search.module';

import { BillToCashRootComponent } from './bill-to-cash.component';
import { CreditApprovalComponent } from './Authorisation/credit-approval';
import { ApiDateMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSAAPIDateMaintenance';
import { ContractAPIMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSAContractAPIMaintenance.component';
import { ApiGenerationMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSAApplyAPIGeneration';
import { ApiReverseMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSAAPIReverse';
import { ApplyApiGridComponent } from './InvoiceProductionAndAPI/iCABSAApplyApiGrid';
import { ContractInvoiceGridComponent } from './PostInvoiceManagement/iCABSAContractInvoiceGrid';
import { PortfolioGeneralMaintenanceComponent } from './Portfolio/iCABSAPortfolioGeneralMaintenance.component';
import { BillToCashRouteDefinitions } from './bill-to-cash.route';
import { InvoiceGroupMaintenanceComponent } from './PreInvoiceManagement/iCABSAInvoiceGroupMaintenance.component';
import { BillToCashConstants } from './bill-to-cash-constants';
import { AddressInvoiceTabComponent } from './tabs/AddressInvoiceTab.component';
import { AddressStatementTabComponent } from './tabs/AddressStatementTab.component';
import { GeneralTabComponent } from './tabs/GeneralTab.component';
import { EDIInvoicingTabComponent } from './tabs/EDIInvoicing.component';
import { APICodeMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSBAPICodeMaintenance.component';
import { ServiceCoverAPIGridComponent } from './InvoiceProductionAndAPI/iCABSAServiceCoverAPIGrid';
import { InvoiceRunDatesGridComponent } from './InvoiceProductionAndAPI/iCABSBInvoiceRunDatesGrid';
import { ServiceCoverAcceptGridComponent } from './PostInvoiceManagement/iCABSAServiceCoverAcceptGrid.component';
import { ARGenerateNextInvoiceRunForecastComponent } from './InvoiceAndAPIReporting/NextInvoiceRun-ForecastGeneration/iCABSARGenerateNextInvoiceRunForecast.component';
import { CreditAndReInvoiceMaintenanceComponent } from './PostInvoiceManagement/CreditAndReInvoice/iCABSACreditAndReInvoiceMaintenance.component';
import { CreditAndReInvoiceGridComponent } from './InvoicedAndCreditReporting/iCABSACreditAndReInvoiceGrid';
import { TaxRegistrationChangeComponent } from './PreInvoiceManagement/iCABSATaxRegistrationChange.component';
import { InvoiceDetailsMaintainanceComponent } from '../internal/maintenance/iCABSAInvoiceDetailsMaintenance';

@NgModule({
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        BillToCashRouteDefinitions
    ],
    declarations: [
        BillToCashRootComponent,
        CreditApprovalComponent,
        ApiDateMaintenanceComponent,
        ApiGenerationMaintenanceComponent,
        ApiReverseMaintenanceComponent,
        ApplyApiGridComponent,
        ContractInvoiceGridComponent,
        PortfolioGeneralMaintenanceComponent,
        ContractAPIMaintenanceComponent,
        InvoiceGroupMaintenanceComponent,
        AddressInvoiceTabComponent,
        AddressStatementTabComponent,
        GeneralTabComponent,
        EDIInvoicingTabComponent,
        ARGenerateNextInvoiceRunForecastComponent,
        ActualVsContractualBranchComponent,
        ActualVsContractualBusinessComponent,
        APICodeMaintenanceComponent,
        ActualVsContractualServiceCoverComponent,
        ServiceCoverAPIGridComponent,
        InvoiceRunDatesGridComponent,
        ServiceCoverAcceptGridComponent,
        CreditAndReInvoiceMaintenanceComponent,
        CreditAndReInvoiceGridComponent,
        ReleaseForInvoiceGridComponent,
        TaxRegistrationChangeComponent,
        InvoiceDetailsMaintainanceComponent
    ],
    providers: [
        BillToCashConstants
    ],
    entryComponents: [
        ApplyApiGridComponent,
        AddressInvoiceTabComponent,
        AddressStatementTabComponent,
        GeneralTabComponent,
        EDIInvoicingTabComponent,
        APICodeMaintenanceComponent,
        ARGenerateNextInvoiceRunForecastComponent,
        InvoiceRunDatesGridComponent,
        CreditAndReInvoiceGridComponent,
        TaxRegistrationChangeComponent
    ]
})

export class BillToCashModule { }
