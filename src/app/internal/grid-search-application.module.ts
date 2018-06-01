import { Component, ViewChild, ViewContainerRef, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';

import { InternalSearchModule } from './search.module';
import { SharedModule } from './../../shared/shared.module';
import { InvoiceByAccountGridComponent } from './grid-search/iCABSAInvoiceByAccountGrid.component';
import { AccountReviewGridComponent } from './../customer-contact-management/ReportsContact/iCABSCMAccountReviewGrid.component';
import { CallCentreSearchEmployeeGridComponent } from './grid-search/iCABSCMCallCentreSearchEmployeeGrid.component';
import { ServiceCoverClosedDateGridComponent } from './grid-search/iCABSAServiceCoverClosedDateGrid.component';
import { ServiceCoverCalendarDateComponent } from './grid-search/iCABSAServiceCoverCalendarDateGrid.component';
import { LeadGridComponent } from './grid-search/iCABSCMHCALeadGrid';
import { PremisePostcodeRezoneGridComponent } from './grid-search/iCABSBPremisePostcodeRezoneGrid.component';
import { CallCentreGridCallLogDetailViewComponent } from './grid-search/iCABSCMCallCentreGridCallLogDetailView.component';
import { CMCustomerContactDetailGridComponent } from './grid-search/iCABSCMCustomerContactDetailGrid.component';
import { CalendarTemplateBranchAccessGridComponent } from './grid-search/iCABSACalendarTemplateBranchAccessGrid.component';
import { CallCentreGridEmployeeViewComponent } from './grid-search/iCABSCMCallCentreGridEmployeeView.component';
import { ClosedTemplateDateGridComponent } from './grid-search/iCABSAClosedTemplateDateGrid.component';
import { InvoiceGroupAddressAmendmentGridComponent } from './grid-search/iCABSAInvoiceGroupAddressAmendmentGrid.component';
import { LinkedPremiseSummaryGridComponent } from './grid-search/iCABSALinkedPremiseSummaryGrid.component';
import { CallAnalysisTicketGridComponent } from './grid-search/iCABSCMCallAnalysisTicketGrid.component';
import { CreditApprovalGridComponent } from './grid-search/iCABSACreditApprovalGrid.component';
import { TeleSalesOrderLineGridComponent } from './grid-search/iCABSATeleSalesOrderLineGrid.component';
import { CallCentreGridNotepadComponent } from './grid-search/iCABSCMCallCentreGridNotepad';
import { ServiceCoverWasteGridComponent } from './grid-search/iCABSAServiceCoverWasteGrid.component';
import { PNOLLevelHistoryComponent } from './grid-search/iCABSAPNOLLevelHistory.component';
import { ServiceCoverSeasonGridComponent } from './grid-search/iCABSAServiceCoverSeasonGrid';
import { RouteAwayGuardService } from '../../shared/services/route-away-guard.service';
import { ApplyAPIContractGridComponent } from './grid-search/iCABSAApplyAPIContractGrid.component';
import { InvoiceHeaderGridComponent } from './grid-search/iCABSAInvoiceHeaderGrid';
import { PlanVisitGridComponent } from './grid-search/iCABSSePlanVisitGrid.component';
import { ServiceCoverDisplayGridComponent } from './grid-search/iCABSAServiceCoverDisplayGrid.component';
import { ContactTypeDetailAssigneeGridComponent } from './grid-search/iCABSSContactTypeDetailAssigneeGrid.component';
import { InternalGridSearchApplicationModuleRoutesConstant } from '../base/PageRoutes';
import { ServiceCoverUpdateableGridComponent } from './grid-search/iCABSAServiceCoverUpdateableGrid';
import { CustomerContactNotificationsGridComponent } from './grid-search/iCABSCMCustomerContactNotificationsGrid.component';
@Component({
    template: `<router-outlet></router-outlet>
    <icabs-modal #errorModal="child" [(showHeader)]="showErrorHeader" [config]="{backdrop: 'static'}"></icabs-modal>`
})

export class InternalGridSearchApplicationComponent {
    @ViewChild('errorModal') public errorModal;
    public showErrorHeader: boolean = true;
    constructor(viewContainerRef: ViewContainerRef, componentsHelper: ComponentsHelper) {
        componentsHelper.setRootViewContainerRef(viewContainerRef);
    }
}


@NgModule({
    imports: [
        HttpModule,
        SharedModule,
        InternalSearchModule,
        RouterModule.forChild([
            {
                path: '', component: InternalGridSearchApplicationComponent, children: [
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSAAPPLYAPICONTRACTGRID, component: ApplyAPIContractGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERSEASONGRID, component: ServiceCoverSeasonGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSAPNOLLEVELHISTORY, component: PNOLLevelHistoryComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERWASTEGRID, component: ServiceCoverWasteGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSAINVOICEHEADERGRID, component: InvoiceHeaderGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSSASERVICECOVERDISPLAYGRID, component: ServiceCoverDisplayGridComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLCENTREGRIDNOTEPAD, component: CallCentreGridNotepadComponent, canDeactivate: [RouteAwayGuardService] },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSATELESALESORDERLINEGRID, component: TeleSalesOrderLineGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSACREDITAPPROVALGRID, component: CreditApprovalGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLANALYSISTICKETGRID, component: CallAnalysisTicketGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSALINKEDPREMISESUMMARYGRID, component: LinkedPremiseSummaryGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSAINVOICEGROUPADDRESSAMENDMENTGRID, component: InvoiceGroupAddressAmendmentGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCLOSEDTEMPLATEDATEGRID, component: ClosedTemplateDateGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLCENTERGRIDEMPLOYEEVIEW, component: CallCentreGridEmployeeViewComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSACALENDARTEMPLATEBRANCHACCESSGRID, component: CalendarTemplateBranchAccessGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCUSTOMERCONTACTDETAILGRID, component: CMCustomerContactDetailGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLCENTREGRIDCALLLOGDETAILVIEW, component: CallCentreGridCallLogDetailViewComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSBPREMISEPOSTCODEREZONEGRID, component: PremisePostcodeRezoneGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMHCALEADGRID, component: LeadGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERCALENDARDATEGRID, component: ServiceCoverCalendarDateComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERCLOSEDDATEGRID, component: ServiceCoverClosedDateGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLCENTRESEARCHEMPLOYEEGRID, component: CallCentreSearchEmployeeGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSSEPLANVISITGRID, component: PlanVisitGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMACCOUNTREVIEWGRID, component: AccountReviewGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSAINVOICEBYACCOUNTGRID, component: InvoiceByAccountGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSSCONTACTTYPEDETAILASSIGNEEGRID, component: ContactTypeDetailAssigneeGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERUPDATEABLEGRID, component: ServiceCoverUpdateableGridComponent },
                    { path: InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCUSTOMERCONTACTNOTIFICATIONSGRID, component: CustomerContactNotificationsGridComponent, canDeactivate: [RouteAwayGuardService] }]
            }
        ])
    ],

    declarations: [
        InternalGridSearchApplicationComponent,
        ApplyAPIContractGridComponent,
        ServiceCoverSeasonGridComponent,
        PNOLLevelHistoryComponent,
        ServiceCoverWasteGridComponent,
        InvoiceHeaderGridComponent,
        ServiceCoverDisplayGridComponent,
        CallCentreGridNotepadComponent,
        TeleSalesOrderLineGridComponent,
        CreditApprovalGridComponent,
        CallAnalysisTicketGridComponent,
        LinkedPremiseSummaryGridComponent,
        InvoiceGroupAddressAmendmentGridComponent,
        ClosedTemplateDateGridComponent,
        CallCentreGridEmployeeViewComponent,
        CalendarTemplateBranchAccessGridComponent,
        CMCustomerContactDetailGridComponent,
        CallCentreGridCallLogDetailViewComponent,
        PremisePostcodeRezoneGridComponent,
        LeadGridComponent,
        ServiceCoverCalendarDateComponent,
        ServiceCoverClosedDateGridComponent,
        CallCentreSearchEmployeeGridComponent,
        AccountReviewGridComponent,
        PlanVisitGridComponent,
        InvoiceByAccountGridComponent,
        ContactTypeDetailAssigneeGridComponent,
        ServiceCoverUpdateableGridComponent,
        CustomerContactNotificationsGridComponent
    ],

    entryComponents: [
        ApplyAPIContractGridComponent,
        PNOLLevelHistoryComponent,
        ServiceCoverWasteGridComponent,
        ServiceCoverDisplayGridComponent,
        CallCentreGridNotepadComponent,
        CreditApprovalGridComponent,
        LinkedPremiseSummaryGridComponent,
        ClosedTemplateDateGridComponent,
        CalendarTemplateBranchAccessGridComponent,
        CMCustomerContactDetailGridComponent,
        CallCentreGridCallLogDetailViewComponent,
        PremisePostcodeRezoneGridComponent,
        LeadGridComponent,
        ServiceCoverCalendarDateComponent,
        ServiceCoverClosedDateGridComponent,
        CallCentreSearchEmployeeGridComponent,
        InvoiceByAccountGridComponent,
        AccountReviewGridComponent
    ]
})

/*export class InternalGridSearchModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: InternalGridSearchModule,
            providers: [
                RouteAwayGuardService, RouteAwayGlobals
            ]
        };
    }
}*/

export class InternalGridSearchApplicationModule { }
