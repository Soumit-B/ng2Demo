import { RouterModule } from '@angular/router';
import { CCMRootComponent } from './ccm.component';
import { CCMModuleRoutes } from '../base/PageRoutes';
import { CentreReviewGridComponent } from './CustomerContact/iCABSCMCallCentreReviewGrid';
import { ContactSearchGridComponent } from './CustomerContact/iCABSCMCustomerContactSearchGrid';
import { CallCentreGridComponent } from './CustomerContact/iCABSCMCallCentreGrid.component';
import { EmailGridComponent } from './Communications/EmailMessages/iCABSBEmailGrid.component';
import { BulkSMSMessageMaintenanceComponent } from './Communications/iCABSBulkSMSMessageMaintenance';
import { SMSMessagesGridComponent } from './Communications/SMSMessages/iCABSCMSMSMessagesGrid.component';
var routes = [
    {
        path: '', component: CCMRootComponent, children: [
            { path: 'centreReview', component: CentreReviewGridComponent },
            { path: 'contact/search', component: ContactSearchGridComponent },
            { path: 'callcentersearch', component: CallCentreGridComponent },
            { path: 'business/email', component: EmailGridComponent },
            { path: CCMModuleRoutes.SENDBULKSMSBUSINESS, component: BulkSMSMessageMaintenanceComponent },
            { path: CCMModuleRoutes.SENDBULKSMSBRANCH, component: BulkSMSMessageMaintenanceComponent },
            { path: CCMModuleRoutes.SENDBULKSMSACCOUNT, component: BulkSMSMessageMaintenanceComponent },
            { path: CCMModuleRoutes.ICABSCMSMSMESSAGESGRID, component: SMSMessagesGridComponent }
        ], data: { domain: 'CUSTOMER CONTACT MANAGEMENT' }
    }
];
export var CCMRouteDefinitions = RouterModule.forChild(routes);
