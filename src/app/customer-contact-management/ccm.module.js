import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { InternalSearchModule } from '../internal/search.module';
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
import { CCMRouteDefinitions } from './ccm.route';
export var CCMModule = (function () {
    function CCMModule() {
    }
    CCMModule.decorators = [
        { type: NgModule, args: [{
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
                        SMSMessagesGridComponent
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
                        SMSMessagesGridComponent
                    ]
                },] },
    ];
    CCMModule.ctorParameters = [];
    return CCMModule;
}());
