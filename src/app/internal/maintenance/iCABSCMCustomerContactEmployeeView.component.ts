import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

@Component({
    templateUrl: 'iCABSCMCustomerContactEmployeeView.html'
})

export class CustomerContactEmployeeViewComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
        { name: 'DefaultAssigneeName', disabled: true },
        { name: 'NextActionName', disabled: true },
        { name: 'DefaultAssigneeMobilePhone', disabled: true },
        { name: 'NextActionMobilePhone', disabled: true },
        { name: 'DefaultAssigneePhone', disabled: true },
        { name: 'NextActionPhone', disabled: true },
        { name: 'DefaultAssigneePhone2', disabled: true },
        { name: 'NextActionPhone2', disabled: true },
        { name: 'DefaultAssigneeEmail', disabled: true },
        { name: 'NextActionEmail', disabled: true },
        { name: 'DefaultAssigneeBranch', disabled: true },
        { name: 'NextActionBranch', disabled: true },
        { name: 'DefaultAssigneeSupervisorName', disabled: true },
        { name: 'NextActionSupervisorName', disabled: true },
        { name: 'DefaultAssigneeSupervisorMobilePhone', disabled: true },
        { name: 'NextActionSupervisorMobilePhone', disabled: true },
        { name: 'DefaultAssigneeSupervisorPhone', disabled: true },
        { name: 'NextActionSupervisorPhone', disabled: true },
        { name: 'DefaultAssigneeSupervisorPhone2', disabled: true },
        { name: 'NextActionSupervisorPhone2', disabled: true },
        { name: 'DefaultAssigneeSupervisorEmail', disabled: true },
        { name: 'NextActionSupervisorEmail', disabled: true },
        { name: 'DefaultAssigneeSupervisorBranch', disabled: true },
        { name: 'NextActionSupervisorBranch', disabled: true },
        { name: 'NextActionEmployeeName', disabled: true },
        { name: 'FixedPriceJobPostCode' },
        { name: 'FixedPriceJobAddressLine4' },
        { name: 'FixedPriceJobAddressLine5' },
        { name: 'FixedPriceJobProduct' },
        { name: 'DefaultAssigneeBranchNo' },
        { name: 'NextActionBranchNo' },
        { name: 'DefaultAssigneeSupervisorBranchNo' },
        { name: 'NextActionSupervisorBranchNo' },
        { name: 'DefaultAssigneeEmployeeCode' },
        { name: 'NextActionEmployeeCode' },
        { name: 'PassBranchNumber' }
    ];
    private queryParams: any = {
        operation: 'ContactManagement/iCABSCMCustomerContactEmployeeView',
        module: 'tickets',
        method: 'ccm/maintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTEMPLOYEEVIEW;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Ticket Maintenance - Employee Contact Details';
        let windowTitle = 'Employee Details';
        this.getTranslatedValue(windowTitle, null).subscribe((res: string) => {
            if (res) {
                windowTitle = res;
            }
            this.utils.setTitle(windowTitle);
        });
        this.window_onload();
    }

    private window_onload(): void {
        //  When this is being run from fixedpriceJobs then the techs are determined from a postcode
        if (this.parentMode === 'FixedPriceJob') {
            this.pageTitle = 'Contact Centre - Fixed Price Jobs - Employee Details';
            this.setControlValue('FixedPriceJobPostCode', this.riExchange.getParentHTMLValue('JobPremisePostCode'));
            this.setControlValue('FixedPriceJobAddressLine4', this.riExchange.getParentHTMLValue('JobPremiseAddressLine4'));
            this.setControlValue('FixedPriceJobAddressLine5', this.riExchange.getParentHTMLValue('JobPremiseAddressLine5'));
            this.setControlValue('FixedPriceJobProduct', this.riExchange.getParentHTMLValue('SelectedProduct'));
            this.setControlValue('DefaultAssigneeEmployeeCode', this.riExchange.getParentHTMLValue('DefaultAssigneeEmployeeCode'));
        } else {
            this.setControlValue('DefaultAssigneeEmployeeCode', this.riExchange.getParentHTMLValue('DefaultAssigneeEmployeeCode'));
            this.setControlValue('NextActionEmployeeCode', this.riExchange.getParentHTMLValue('NextActionEmployeeCode'));
        }
        this.populateFormData();
    }

    private populateFormData(): void {

        let searchParams: URLSearchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set('Function', 'GetEmployeeContacts');
        searchParams.set('FixedPriceJobPostCode', this.getControlValue('FixedPriceJobPostcode'));
        searchParams.set('FixedPriceJobAddressLine4', this.getControlValue('FixedPriceJobAddressLine4'));
        searchParams.set('FixedPriceJobAddressLine5', this.getControlValue('FixedPriceJobAddressLine5'));
        searchParams.set('FixedPriceJobProduct', this.getControlValue('FixedPriceJobProduct'));
        searchParams.set('DefaultAssigneeEmployeeCode', this.getControlValue('DefaultAssigneeEmployeeCode'));
        searchParams.set('NextActionEmployeeCode', this.getControlValue('NextActionEmployeeCode'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    this.setControlValue('DefaultAssigneeEmployeeCode', e.DefaultAssigneeEmployeeCode);
                    this.setControlValue('DefaultAssigneeName', e.DefaultAssigneeName);
                    this.setControlValue('DefaultAssigneePhone', e.DefaultAssigneePhone);
                    this.setControlValue('DefaultAssigneePhone2', e.DefaultAssigneePhone2);
                    this.setControlValue('DefaultAssigneeMobilePhone', e.DefaultAssigneeMobilePhone);
                    this.setControlValue('DefaultAssigneeEmail', e.DefaultAssigneeEmail);
                    this.setControlValue('DefaultAssigneeBranch', e.DefaultAssigneeBranch);
                    this.setControlValue('DefaultAssigneeBranchNo', e.DefaultAssigneeBranchNo);

                    this.setControlValue('NextActionEmployeeCode', e.NextActionEmployeeCode);
                    this.setControlValue('NextActionName', e.NextActionName);
                    this.setControlValue('NextActionPhone', e.NextActionPhone);
                    this.setControlValue('NextActionPhone2', e.NextActionPhone2);
                    this.setControlValue('NextActionMobilePhone', e.NextActionMobilePhone);
                    this.setControlValue('NextActionEmail', e.NextActionEmail);
                    this.setControlValue('NextActionBranch', e.NextActionBranch);
                    this.setControlValue('NextActionBranchNo', e.NextActionBranchNo);

                    this.setControlValue('DefaultAssigneeSupervisorEmployeeCode', e.DefaultAssigneeSupervisorEmployeeCode);
                    this.setControlValue('DefaultAssigneeSupervisorName', e.DefaultAssigneeSupervisorName);
                    this.setControlValue('DefaultAssigneeSupervisorPhone', e.DefaultAssigneeSupervisorPhone);
                    this.setControlValue('DefaultAssigneeSupervisorPhone2', e.DefaultAssigneeSupervisorPhone2);
                    this.setControlValue('DefaultAssigneeSupervisorMobilePhone', e.DefaultAssigneeSupervisorMobilePhone);
                    this.setControlValue('DefaultAssigneeSupervisorEmail', e.DefaultAssigneeSupervisorEmail);
                    this.setControlValue('DefaultAssigneeSupervisorBranch', e.DefaultAssigneeSupervisorBranch);
                    this.setControlValue('DefaultAssigneeSupervisorBranchNo', e.DefaultAssigneeSupervisorBranchNo);

                    this.setControlValue('NextActionSupervisorEmployeeCode', e.NextActionSupervisorEmployeeCode);
                    this.setControlValue('NextActionSupervisorName', e.NextActionSupervisorName);
                    this.setControlValue('NextActionSupervisorPhone', e.NextActionSupervisorPhone);
                    this.setControlValue('NextActionSupervisorPhone2', e.NextActionSupervisorPhone2);
                    this.setControlValue('NextActionSupervisorMobilePhone', e.NextActionSupervisorMobilePhone);
                    this.setControlValue('NextActionSupervisorEmail', e.NextActionSupervisorEmail);
                    this.setControlValue('NextActionSupervisorBranch', e.NextActionSupervisorBranch);
                    this.setControlValue('NextActionSupervisorBranchNo', e.NextActionSupervisorBranchNo);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public cmdBranch1_OnClick(): void {
        this.runBranchDetails(this.getControlValue('DefaultAssigneeBranchNo'));
    }

    public cmdBranch2_OnClick(): void {
        this.runBranchDetails(this.getControlValue('NextActionBranchNo'));
    }

    public cmdSBranch1_OnClick(): void {
        if (this.getControlValue('DefaultAssigneeSupervisorBranchNo') !== '0' && this.getControlValue('DefaultAssigneeSupervisorBranchNo') !== '' && this.getControlValue('DefaultAssigneeSupervisorBranchNo')) {
            this.runBranchDetails(this.getControlValue('DefaultAssigneeSupervisorBranchNo'));
        }
    }

    public cmdSBranch2_OnClick(): void {
        if (this.getControlValue('NextActionSupervisorBranchNo') !== '0' && this.getControlValue('NextActionSupervisorBranchNo') !== '' && this.getControlValue('NextActionSupervisorBranchNo')) {
            this.runBranchDetails(this.getControlValue('NextActionSupervisorBranchNo'));
        }
    }

    private runBranchDetails(iPassBranchNumber: any): void {
        this.setControlValue('PassBranchNumber', iPassBranchNumber);
        this.navigate('CallCentre', InternalMaintenanceServiceModuleRoutes.ICABSCMEMPLOYEEVIEWBRANCHDETAILS);
    }
}

