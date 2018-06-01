import { ReleaseForInvoiceGridComponent } from './JobReleaseInvoice/Employee/iCABSReleaseForInvoiceGrid.component';
import { CreditAndReInvoiceMaintenanceComponent } from './PostInvoiceManagement/CreditAndReInvoice/iCABSACreditAndReInvoiceMaintenance.component';
import { ServiceCoverAcceptGridComponent } from './PostInvoiceManagement/iCABSAServiceCoverAcceptGrid.component';
import { ActualVsContractualServiceCoverComponent } from './Portfolio/iCABSSeActualVsContractualServiceCover.component';
import { ActualVsContractualBusinessComponent } from './Portfolio/iCABSSeActualVsContractualBusiness';
import { ActualVsContractualBranchComponent } from './Portfolio/iCABSSeActualVsContractualBranch';
import { ApplyApiGridComponent } from './InvoiceProductionAndAPI/iCABSAApplyApiGrid';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillToCashRootComponent } from './bill-to-cash.component';
import { CreditApprovalComponent } from './Authorisation/credit-approval';
import { ApiDateMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSAAPIDateMaintenance';
import { ApiGenerationMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSAApplyAPIGeneration';
import { ApiReverseMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSAAPIReverse';
import { ContractInvoiceGridComponent } from './PostInvoiceManagement/iCABSAContractInvoiceGrid';
import { PortfolioGeneralMaintenanceComponent } from './Portfolio/iCABSAPortfolioGeneralMaintenance.component';
import { ContractAPIMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSAContractAPIMaintenance.component';
import { InvoiceGroupMaintenanceComponent } from './PreInvoiceManagement/iCABSAInvoiceGroupMaintenance.component';
import { APICodeMaintenanceComponent } from './InvoiceProductionAndAPI/iCABSBAPICodeMaintenance.component';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { ServiceCoverAPIGridComponent } from './InvoiceProductionAndAPI/iCABSAServiceCoverAPIGrid';
import { InvoiceRunDatesGridComponent } from './InvoiceProductionAndAPI/iCABSBInvoiceRunDatesGrid';
import { CreditAndReInvoiceGridComponent } from './InvoicedAndCreditReporting/iCABSACreditAndReInvoiceGrid';
import { ARGenerateNextInvoiceRunForecastComponent } from './InvoiceAndAPIReporting/NextInvoiceRun-ForecastGeneration/iCABSARGenerateNextInvoiceRunForecast.component';
import { TaxRegistrationChangeComponent } from './PreInvoiceManagement/iCABSATaxRegistrationChange.component';
import { InvoiceDetailsMaintainanceComponent } from '../internal/maintenance/iCABSAInvoiceDetailsMaintenance';
import { BillToCashModuleRoutes } from '../base/PageRoutes';


const routes: Routes = [
    {
        path: '', component: BillToCashRootComponent, children: [
            { path: 'creditapproval', component: CreditApprovalComponent },
            { path: 'creditapproval/payment/search', component: CreditApprovalComponent },
            { path: 'apidate', component: ApiDateMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'apigrid', component: ApplyApiGridComponent },
            { path: 'apigeneration', component: ApiGenerationMaintenanceComponent },
            { path: 'contract/apireverse', component: ApiReverseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'contract/invoice', component: ContractInvoiceGridComponent },
            { path: 'contract/apiexempt', component: ContractAPIMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'premise/apireverse', component: ApiReverseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'servicecover/apireverse', component: ApiReverseMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'portfolio/generalMaintenance', component: PortfolioGeneralMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: BillToCashModuleRoutes.ICABSAINVOICEGROUPMAINTENANCE, component: InvoiceGroupMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'actualvscontractualbranch', component: ActualVsContractualBranchComponent },
            { path: 'actualvscontractualbusiness', component: ActualVsContractualBusinessComponent },
            { path: 'apicodemaintenance', component: APICodeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'actualvscontractualservicecover', component: ActualVsContractualServiceCoverComponent },
            { path: 'serviceCoverApiGrid', component: ServiceCoverAPIGridComponent },
            { path: BillToCashModuleRoutes.ICABSARGENERATENEXTINVOICERUNFORECAST, component: ARGenerateNextInvoiceRunForecastComponent },
            { path: 'rundatesgrid', component: InvoiceRunDatesGridComponent },
            { path: BillToCashModuleRoutes.ICABSASERVICECOVERACCEPTGRID, component: ServiceCoverAcceptGridComponent },
            { path: 'postInvoiceManagement/creditAndReInvoiceMaintenance', component: CreditAndReInvoiceMaintenanceComponent, canDeactivate: [RouteAwayGuardService] },
            { path: 'InvoicedAndCreditReporting/CreditAndReInvoiceGrid', component: CreditAndReInvoiceGridComponent },
            { path: 'application/releaseforinvoiceGrid', component: ReleaseForInvoiceGridComponent },
            { path: 'application/taxregistrationchange', component: TaxRegistrationChangeComponent, canDeactivate: [RouteAwayGuardService] },
            { path: BillToCashModuleRoutes.ICABSAINVOICEDETAILSMAINTENANCE, component: InvoiceDetailsMaintainanceComponent }
        ], data: { domain: 'BILL TO CASH' }
    }
];

export const BillToCashRouteDefinitions: ModuleWithProviders = RouterModule.forChild(routes);
