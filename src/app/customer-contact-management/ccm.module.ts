import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
/*import { InternalGridSearchModule } from '../internal/grid-search.module';
import { InternalMaintenanceModule } from '../internal/maintenance.module';*/

import { CCMRootComponent } from './ccm.component';
import { CentreReviewGridComponent } from './CustomerContact/iCABSCMCallCentreReviewGrid';
import { ContactSearchGridComponent } from './CustomerContact/iCABSCMCustomerContactSearchGrid';
import { CallCentreGridComponent } from './CustomerContact/iCABSCMCallCentreGrid.component';

import { CallCenterGridAccountsComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridAccounts.component';
import { CallCenterGridCallLogsComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridCallLogs.component';
import { CallCenterGridContractsComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridContracts.component';
import { CallCenterGridDashboardComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridDashboard.component';
import { CallCenterGriddlContractComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGriddlContract.component';
import { CallCenterGridEventHistoryComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridEventHistory.component';
import { CallCenterGridHistoryComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridHistory.component';
import { CallCenterGridInvoicesComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridInvoices.component';
import { CallCenterGridPremisesComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridPremises.component';
import { CallCenterGridWorkOrdersComponent } from './CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridWorkOrders.component';
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
import { CCMRouteDefinitions } from './ccm.route';
import { CallCentreGridNewContactComponent } from './CallCentreGridNewContact/iCABSCMCallCentreGridNewContact';
import { CustomerContactCalloutGridComponent } from './CustomerContact/CalloutSearch/iCABSCMCustomerContactCalloutGrid';
import { ContactTypeMaintenanceComponent } from './TableMaintenanceSystem/ContactType/iCABSSContactTypeMaintenance.component';

@NgModule({
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        CCMRouteDefinitions
    ],
    declarations: [
        CCMRootComponent,
        CentreReviewGridComponent,
        ContactSearchGridComponent,
        CallCentreGridComponent,
        CallCenterGridAccountsComponent,
        CallCenterGridCallLogsComponent,
        CallCenterGridContractsComponent,
        CallCenterGridDashboardComponent,
        CallCenterGriddlContractComponent,
        CallCenterGridEventHistoryComponent,
        CallCenterGridHistoryComponent,
        CallCenterGridInvoicesComponent,
        CallCenterGridPremisesComponent,
        CallCenterGridWorkOrdersComponent,
        EmailGridComponent,
        BulkSMSMessageMaintenanceComponent,
        SMSMessagesGridComponent,
        ContactMediumGridComponent,
        ContactActionMaintenanceComponent,
        CMCallAnalysisGridComponent,
        ContactRedirectionComponent,
        CMCallCentreAssignGridComponent,
        WorkorderReviewGridComponent,
        TeleSalesOrderGridComponent,
        CallCentreGridNewContactComponent,
        CustomerContactCalloutGridComponent,
        ContactTypeMaintenanceComponent
    ],
    entryComponents: [
        CallCenterGridAccountsComponent,
        CallCenterGridCallLogsComponent,
        CallCenterGridContractsComponent,
        CallCenterGridDashboardComponent,
        CallCenterGriddlContractComponent,
        CallCenterGridEventHistoryComponent,
        CallCenterGridHistoryComponent,
        CallCenterGridInvoicesComponent,
        CallCenterGridPremisesComponent,
        CallCenterGridWorkOrdersComponent,
        EmailGridComponent,
        SMSMessagesGridComponent,
        ContactMediumGridComponent,
        CMCallCentreAssignGridComponent,
        CMCallAnalysisGridComponent,
        ContactRedirectionComponent,
        TeleSalesOrderGridComponent,
        CallCentreGridNewContactComponent,
        CustomerContactCalloutGridComponent
    ]
})

export class CCMModule { }
