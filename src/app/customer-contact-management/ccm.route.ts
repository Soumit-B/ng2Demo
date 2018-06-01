import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CCMRootComponent } from './ccm.component';
import { CCMModuleRoutes } from '../base/PageRoutes';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { CentreReviewGridComponent } from './CustomerContact/iCABSCMCallCentreReviewGrid';
import { ContactSearchGridComponent } from './CustomerContact/iCABSCMCustomerContactSearchGrid';
import { CallCentreGridComponent } from './CustomerContact/iCABSCMCallCentreGrid.component';
import { EmailGridComponent } from './Communications/EmailMessages/iCABSBEmailGrid.component';
import { BulkSMSMessageMaintenanceComponent } from './Communications/iCABSBulkSMSMessageMaintenance';
import { SMSMessagesGridComponent } from './Communications/SMSMessages/iCABSCMSMSMessagesGrid.component';
import { ContactMediumGridComponent } from './CustomerContact/iCABSContactMediumGrid.Component';
import { ContactActionMaintenanceComponent } from './CustomerContact/iCABSCMContactActionMaintenance.component';
import { CMCallAnalysisGridComponent } from './ReportsContact/CallAnalysis/iCABSCMCallAnalysisGrid.component';
import { ContactRedirectionComponent } from './Communications/iCABSCMContactRedirection.component';
import { CMCallCentreAssignGridComponent } from './CustomerContact/ContactCentreAssign/iCABSCMCallCentreAssignGrid.component';
import { WorkorderReviewGridComponent } from './CustomerContact/WorkOrderReview/iCABSCMWorkorderReviewGrid.component';
import { TeleSalesOrderGridComponent } from './Telesales/iCABSATeleSalesOrderGrid';
import { CallCentreGridNewContactComponent } from './CallCentreGridNewContact/iCABSCMCallCentreGridNewContact';
import { CustomerContactCalloutGridComponent } from './CustomerContact/CalloutSearch/iCABSCMCustomerContactCalloutGrid';
import { ContactTypeMaintenanceComponent } from './TableMaintenanceSystem/ContactType/iCABSSContactTypeMaintenance.component';

const routes: Routes = [
    {
        path: '', component: CCMRootComponent, children: [
            { path: 'centreReview', component: CentreReviewGridComponent },
            { path: 'contact/search', component: ContactSearchGridComponent },
            { path: CCMModuleRoutes.ICABSCMCALLCENTREGRID, component: CallCentreGridComponent },
            { path: 'business/email', component: EmailGridComponent },
            { path: CCMModuleRoutes.ICABSCMSMSMESSAGESGRID, component: SMSMessagesGridComponent },
            { path: CCMModuleRoutes.ICABSCONTACTMEDIUMGRID, component: ContactMediumGridComponent },
            { path: CCMModuleRoutes.ICABSCMCONTACTACTIONMAINTENANCE, component: ContactActionMaintenanceComponent },
            { path: CCMModuleRoutes.ICABSCMCALLANALYSISGRID, component: CMCallAnalysisGridComponent },
            { path: CCMModuleRoutes.SENDBULKSMSBUSINESS, component: BulkSMSMessageMaintenanceComponent },
            { path: CCMModuleRoutes.SENDBULKSMSBRANCH, component: BulkSMSMessageMaintenanceComponent },
            { path: CCMModuleRoutes.SENDBULKSMSACCOUNT, component: BulkSMSMessageMaintenanceComponent },
            { path: CCMModuleRoutes.ICABSCMCONTACTREDIRECTION, component: ContactRedirectionComponent },
            { path: CCMModuleRoutes.ICABSCMCALLCENTREASSIGNGRID, component: CMCallCentreAssignGridComponent },
            { path: CCMModuleRoutes.ICABSCMWORKORDERREVIEWGRID, component: WorkorderReviewGridComponent },
            { path: CCMModuleRoutes.ICABSATELESALESORDERGRID, component: TeleSalesOrderGridComponent },
            { path: CCMModuleRoutes.ICABSCMCALLCENTREGRIDNEWCONTACT, component: CallCentreGridNewContactComponent },
            { path: CCMModuleRoutes.ICABSCMCUSTOMERCONTACTCALLOUTGRID, component: CustomerContactCalloutGridComponent },
            { path: CCMModuleRoutes.ICABSSCONTACTTYPEMAINTENANCE, component: ContactTypeMaintenanceComponent, canDeactivate: [RouteAwayGuardService] }
        ], data: { domain: 'CUSTOMER CONTACT MANAGEMENT' }
    }
];

export const CCMRouteDefinitions: ModuleWithProviders = RouterModule.forChild(routes);
