import * as moment from 'moment';
import { InternalGridSearchServiceModuleRoutes } from './../../../base/PageRoutes';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSeTechnicianWorkSummaryGrid.html'
})

export class TechnicianWorkSummaryComponent extends BaseComponent implements OnInit, OnDestroy {
    public queryParams: any = {
        operation: 'Service/iCABSSeTechnicianWorkSummaryGrid',
        module: 'pda',
        method: 'service-delivery/maintenance'
    };
    @ViewChild('technicianworksummaryPagination') technicianworksummaryPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public pageId: string = '';
    public itemsPerPage: number = 10;
    public DateTo: any = new Date();
    public DateFrom: any = new Date(new Date().setDate(1));
    public TodtDisplayed: any;
    public FromdtDisplayed: any;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public search = this.getURLSearchParamObject();
    public sCEnableDurations: any = false;
    public sCEnableReceiptRequired: any = false;
    public vSCEnableReceiptRequired: any = false;
    public trBusiness: boolean = false;
    public trBranch: boolean = false;
    public ShowDetailIndCheck: any = false;
    public ValidateScreenParameters: string;
    public isDateDateFrom: boolean = true;
    public isDateDateTo: boolean = true;
    public BusinessObjectPostData: any;
    public errorMessage: string;
    public searchGet: any;
    public searchGetSuper: any;
    public showErrorHeader: any = true;
    public showHeader: any = true;
    public CurrentContractTypeURLParameter: any;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public totalRecords: number = 1;
    public pageCurrent: number = 1;
    public showCloseButton: boolean = true;
    public controls = [
        { name: 'Level', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'BusinessCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'BusinessDesc', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'BranchNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'SupervisorEmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'SupervisorSurname', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'DateFrom', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'ShowDetailInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSETECHNICIANWORKSUMMARYGRID;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();
    }

    private window_onload(): void {
        this.logger.warn('window onload', this.pageParams.vSCEnableReceiptRequired);
        this.sCEnableDurations = true;
        if (this.pageParams.vSCEnableReceiptRequired) {
            this.sCEnableReceiptRequired = true;
        }
        else {
            this.sCEnableReceiptRequired = false;
        }
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        if (this.formData.DateFrom || this.formData.DateTo || this.formData.ShowDetailInd) {

            let getFromDate: any = this.globalize.parseDateToFixedFormat(this.formData.DateFrom);
            this.DateFrom = this.globalize.parseDateStringToDate(getFromDate);

            let getToDate: any = this.globalize.parseDateToFixedFormat(this.formData.DateTo);
            this.DateTo = this.globalize.parseDateStringToDate(getToDate);

            this.populateUIFromFormData();
            if (this.formData.ShowDetailInd) {
                this.ShowDetailIndCheck = true;
            }
            this.riGrid.ResetGrid();
            this.BuildGrid();
        }
        this.FromdtDisplayed = this.globalize.parseDateToFixedFormat(this.utils.formatDate(this.DateFrom));
        this.setControlValue('DateFrom', this.FromdtDisplayed);
        this.TodtDisplayed = this.globalize.parseDateToFixedFormat(this.utils.formatDate(new Date(this.DateTo)));
        this.setControlValue('DateTo', this.TodtDisplayed);
        if (this.FromdtDisplayed === '' || this.FromdtDisplayed === null || this.FromdtDisplayed === undefined) {
            this.isDateDateFrom = false;
        }
        else {
            this.isDateDateFrom = true;
        }
        if (this.TodtDisplayed === '' || this.TodtDisplayed === null || this.TodtDisplayed === undefined) {
            this.isDateDateTo = false;
        }
        else {
            this.isDateDateTo = true;
        }
        this.validateScreenParameters();
        this.pageTitle = 'Servicing Work Summary';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.utils.getBusinessCode());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessDesc', this.utils.getBusinessDesc(this.utils.getBusinessCode(), this.utils.getCountryCode()));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.utils.getBranchCode());

        if (this.riExchange.URLParameterContains('Business')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Level', 'Business');
            this.trBusiness = true;
            this.trBranch = false;
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Level', 'Branch');
            this.trBusiness = false;
            this.trBranch = true;
        }
        switch (this.parentMode) {
            case 'Productivity':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.riExchange.getParentHTMLValue('DateFrom'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.riExchange.getParentHTMLValue('DateTo'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.riExchange.getParentHTMLValue('BranchNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', this.riExchange.getParentHTMLValue('BranchName'));

                this.riExchange.riInputElement.ReadOnly(this.uiForm, 'EmployeeCode', true);
                this.riExchange.riInputElement.ReadOnly(this.uiForm, 'SupervisorEmployeeCode', true);
                this.riExchange.riInputElement.ReadOnly(this.uiForm, 'DateFrom', true);
                this.riExchange.riInputElement.ReadOnly(this.uiForm, 'DateTo', true);
                break;
            case 'OvertimeEmployee':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentAttributeValue('EmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', this.riExchange.getParentAttributeValue('EmployeeSurname'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorEmployeeCode', this.riExchange.getParentAttributeValue('SupervisorEmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorSurname', this.riExchange.getParentAttributeValue('SupervisorSurname'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.riExchange.getParentAttributeValue('DateFrom'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.riExchange.getParentAttributeValue('DateTo'));
                break;
        }
        this.doLookupformDataEmployee();
        this.doLookupformDataEmployeeSuper();
        this.doLookupformDataBranch();
        document.querySelector('.datepicker-input-cont input[type=text]')['focus']();

    }
    public fromDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.FromdtDisplayed = value.value;
            this.setControlValue('DateFrom', this.FromdtDisplayed);
            this.isDateDateFrom = true;
        } else {
            this.FromdtDisplayed = '';
            this.setControlValue('DateFrom', this.FromdtDisplayed);
            this.isDateDateFrom = false;
        }
    }

    public toDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.TodtDisplayed = value.value;
            this.setControlValue('DateTo', this.TodtDisplayed);
            this.isDateDateTo = true;
        } else {
            this.TodtDisplayed = '';
            this.setControlValue('DateTo', this.TodtDisplayed);
            this.isDateDateTo = false;
        }
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableReceiptRequired];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableReceiptRequired = record[0]['Required'];
            this.window_onload();
        });
    }
    public onCheckboxChange(event: any): void {
        if (event.target.checked) {
            this.ShowDetailIndCheck = true;
        } else {
            this.ShowDetailIndCheck = false;
        }
    }
    public validateScreenParameters(): string {
        let blnReturn: string = 'True';

        if (this.isDateDateFrom === false) {
            blnReturn = 'False';
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, this.FromdtDisplayed, true);
        }

        if (this.isDateDateTo === false) {
            blnReturn = 'False';
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, this.TodtDisplayed, true);
        }

        this.ValidateScreenParameters = blnReturn;
        return this.ValidateScreenParameters;
    }

    public getCurrentPage(currentPage: any): void {
        this.pageCurrent = currentPage.value;
        this.loadData();
    }

    public refresh(): void {
        this.riGrid.ResetGrid();
        this.BuildGrid();
        this.validateScreenParameters();
        this.currentPage = 1;
    }
    public riGrid_Sort(event: any): void {
        this.loadData();
    }
    private loadData(): void {
        if (this.ValidateScreenParameters === 'True') {
            this.BusinessObjectPostData = {
                Level: this.riExchange.riInputElement.GetValue(this.uiForm, 'Level'),
                BranchNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'),
                DateFrom: this.FromdtDisplayed,
                DateTo: this.TodtDisplayed,
                EmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'),
                SupervisorEmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode'),
                ShowDetailInd: this.ShowDetailIndCheck
            };
        }
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        //set parameters
        this.search.set('Level', this.riExchange.riInputElement.GetValue(this.uiForm, 'Level'));
        this.search.set('BranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'));
        this.search.set('DateFrom', this.FromdtDisplayed);
        this.search.set('DateTo', this.TodtDisplayed);
        this.search.set('EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
        this.search.set('SupervisorEmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode'));
        this.search.set('ShowDetailInd', this.ShowDetailIndCheck);
        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '4195362');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('HeaderClickedColumn', '');
        this.search.set('riCacheRefresh', 'True');
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.UpdateFooter = true;
                        if (data && data.errorMessage) {
                            this.messageModal.show(data['errorMessage'], true);
                        } else {
                            this.riGrid.Execute(data);
                        }

                    } catch (e) {
                        this.logger.log('Problem in grid load', e);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            error => {
                this.messageModal.show(error, true);
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }

    public doLookupformDataEmployee(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') !== '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') !== null || this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') !== undefined) {
            this.searchGet = this.getURLSearchParamObject();
            this.searchGet.set(this.serviceConstants.Action, '0');
            this.searchGet.set('PostDesc', 'Employee');
            this.searchGet.set('EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, this.searchGet)
                .subscribe(
                (e) => {
                    if (e.errorMessage) {
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode')) {
                            this.showAlert('Employee Data: ' + e.errorMessage);
                        }
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
                    } else {
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') && e.EmployeeSurname === '') {
                            this.showAlert('Employee Data: Record Not Found');
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', '');
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
                        }
                        else {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', e.EmployeeSurname);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isRequesting = false;
                },
                (error) => {
                    this.showAlert('Employee Data:' + error.errorMessage);
                });
        }
    }

    public doLookupformDataBranch(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber') !== '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber') !== null || this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber') !== undefined) {
            this.searchGet = this.getURLSearchParamObject();
            this.searchGet.set(this.serviceConstants.Action, '0');
            this.searchGet.set('PostDesc', 'Branch');
            this.searchGet.set('BranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, this.searchGet)
                .subscribe(
                (e) => {
                    if (e.errorMessage) {
                        this.showAlert('BranchName: ' + e.errorMessage);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', '');
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', e.BranchName);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isRequesting = false;
                },
                (error) => {
                    this.showAlert('BranchName:' + error.errorMessage);
                });
        }
    }
    public showAlert(msgTxt: string, type?: number): void {
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = 'Error Message'; break;
            case 1: titleModal = 'Success Message'; break;
            case 2: titleModal = 'Warning Message'; break;
        }

        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    }
    public doLookupformDataEmployeeSuper(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode') !== '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode') !== null || this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode') !== undefined) {
            this.searchGetSuper = this.getURLSearchParamObject();
            this.searchGetSuper.set(this.serviceConstants.Action, '0');
            this.searchGetSuper.set('PostDesc', 'SupervisorEmployee');
            this.searchGetSuper.set('SupervisorEmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, this.searchGetSuper)
                .subscribe(
                (e) => {
                    if (e.errorMessage) {
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode')) {
                            this.showAlert('Supervisor Employee Data: ' + e.errorMessage);
                        }
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorEmployeeCode', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorSurname', '');
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorSurname', e.SupervisorSurname);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isRequesting = false;
                },
                (error) => {
                    this.showAlert('Supervisor Employee Data: ' + error.errorMessage);
                });
        }
    }

    public ellipsis = {
        employeeSearchComponentSuper: {
            disabled: true,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp-Supervisor'
            },
            component: EmployeeSearchComponent
        },
        employeeSearchComponent: {
            disabled: true,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp-Service-All'
            },
            component: EmployeeSearchComponent
        }
    };

    public onEmployeeDataReceived(data: any, employeeCode: string, employeeSurname: string, occupationDesc: string): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', data.EmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
        }
    }

    public onEmployeeDataReceivedSuper(data: any, employeeCode: string, employeeSurname: string, occupationDesc: string): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorEmployeeCode', data.SupervisorEmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorSurname', data.SupervisorSurname);
        }
    }

    public setContractType(event: any): void {
        if (this.riGrid.CurrentColumnName !== 'PremiseContactSignature') {
            this.attributes.BranchNumberPDAICABSActivityRowID = this.riGrid.Details.GetAttribute('ActivityDesc', 'additionalproperty');
            //this.attributes.BranchNumberRow = this.riGrid.RowID;
            this.attributes.grdWorkSummaryPDAICABSActivityRowID = this.riGrid.Details.GetAttribute('ActivityDesc', 'additionalproperty');
            //this.attributes.grdWorkSummaryRow = this.riGrid.RowID;
        }
        switch (this.riGrid.Details.GetAttribute('PremiseName', 'additionalproperty')) {
            case 'C':
                this.pageParams.CurrentContractTypeURLParameter = '';
                this.attributes.CurrentContractTypeURLParameter = '';
                break;
            case 'J':
                this.pageParams.CurrentContractTypeURLParameter = '<job>';
                this.attributes.CurrentContractTypeURLParameter = '<job>';
                break;
            case 'P':
                this.pageParams.CurrentContractTypeURLParameter = '<product>';
                this.attributes.CurrentContractTypeURLParameter = '<product>';
                break;
        }
    }

    public BuildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('gridEmployeeCode', 'WorkSummary', 'gridEmployeeCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('gridEmployeeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceDateStart', 'WorkSummary', 'ServiceDateStart', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceDateStart', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ActivityDesc', 'WorkSummary', 'ActivityDesc', MntConst.eTypeText, 15);

        this.riGrid.AddColumn('BranchServiceArea', 'WorkSummary', 'BranchServiceArea', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('BranchServiceArea', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ContractNumber', 'WorkSummary', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseNumber', 'WorkSummary', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseName', 'WorkSummary', 'PremiseName', MntConst.eTypeText, 15);

        this.riGrid.AddColumn('PremiseAddressLine1', 'WorkSummary', 'PremiseAddressLine1', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('PremiseAddressLine1', false);

        this.riGrid.AddColumn('PremiseAddressLine2', 'WorkSummary', 'PremiseAddressLine2', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('PremiseAddressLine2', false);

        this.riGrid.AddColumn('PremiseAddressLine3', 'WorkSummary', 'PremiseAddressLine3', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('PremiseAddressLine3', false);

        this.riGrid.AddColumn('PremiseAddressLine4', 'WorkSummary', 'PremiseAddressLine4', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('PremiseAddressLine4', false);

        this.riGrid.AddColumn('PremisePostcode', 'WorkSummary', 'PremisePostcode', MntConst.eTypeText, 15);
        this.riGrid.AddColumnScreen('PremisePostcode', false);

        this.riGrid.AddColumn('ProductCode', 'WorkSummary', 'ProductCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        if (this.sCEnableDurations) {
            this.riGrid.AddColumn('StandardTreatmentTime', 'WorkSummary', 'StandardTreatmentTime', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('StandardTreatmentTime', MntConst.eAlignmentCenter);
        }
        if (this.ShowDetailIndCheck) {
            this.riGrid.AddColumn('StandardDuration', 'WorkSummary', 'StandardDuration', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('StandardDuration', MntConst.eAlignmentCenter);

            this.riGrid.AddColumn('OvertimeDuration', 'WorkSummary', 'OvertimeDuration', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('OvertimeDuration', MntConst.eAlignmentCenter);
        }


        this.riGrid.AddColumn('Duration', 'WorkSummary', 'Duration', MntConst.eTypeTime, 6);
        this.riGrid.AddColumnAlign('Duration', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('Paused', 'WorkSummary', 'Paused', MntConst.eTypeCode, 4);
        this.riGrid.AddColumnScreen('Paused', false);

        if (this.sCEnableDurations) {
            this.riGrid.AddColumn('DurationPercentage', 'WorkSummary', 'DurationPercentage', MntConst.eTypeInteger, 3);
            this.riGrid.AddColumnAlign('DurationPercentage', MntConst.eAlignmentCenter);
        }


        this.riGrid.AddColumn('ServicedQuantity', 'WorkSummary', 'ServicedQuantity', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('ServicedQuantity', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseContactSignature', 'WorkSummary', 'PremiseContactSignature', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('PremiseContactSignature', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('AttemptedPrintCode', 'WorkSummary', 'AttemptedPrintCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumnAlign('AttemptedPrintCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('VisitTypeCode', 'WorkSummary', 'VisitTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ActualStartTime', 'WorkSummary', 'ActualStartTime', MntConst.eTypeTime, 6);
        this.riGrid.AddColumnAlign('ActualStartTime', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ActualEndTime', 'WorkSummary', 'ActualEndTime', MntConst.eTypeTime, 6);
        this.riGrid.AddColumnAlign('ActualEndTime', MntConst.eAlignmentCenter);

        if (this.sCEnableDurations) {
            this.riGrid.AddColumn('KeyedStartTime', 'WorkSummary', 'KeyedStartTime', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('KeyedStartTime', MntConst.eAlignmentCenter);

            this.riGrid.AddColumn('KeyedEndTime', 'WorkSummary', 'KeyedEndTime', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('KeyedEndTime', MntConst.eAlignmentCenter);

        }

        this.riGrid.AddColumn('Mileage', 'WorkSummary', 'Mileage', MntConst.eTypeInteger, 5);

        this.riGrid.AddColumn('PrivateWorkMileage', 'WorkSummary', 'PrivateWorkMileage', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('PrivateWorkMileage', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('Recommendation', 'ServiceVisitRecommendation', 'Recommendation', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('Recommendation', MntConst.eAlignmentCenter);

        if (this.sCEnableReceiptRequired) {
            this.riGrid.AddColumn('ReceiptRequired', 'WorkSummary', 'ReceiptRequired', MntConst.eTypeImage, 1);
            this.riGrid.AddColumnAlign('ReceiptRequired', MntConst.eAlignmentCenter);
        }
        this.riGrid.Complete();

        this.loadData();
    }

    public onGridRowClick(event: any): void {
        this.formData.DateFrom = this.FromdtDisplayed;
        this.formData.DateTo = this.TodtDisplayed;
        if ((this.riGrid.CurrentColumnName === 'gridEmployeeCode') ||
            (this.riGrid.CurrentColumnName === 'ActivityDesc') ||
            (this.riGrid.CurrentColumnName === 'ContractNumber') ||
            (this.riGrid.CurrentColumnName === 'PremiseNumber') ||
            (this.riGrid.CurrentColumnName === 'ProductCode') ||
            (this.riGrid.CurrentColumnName === 'Recommendation')) {
            this.attributes.BranchNumberPDAICABSActivityRowID = this.riGrid.Details.GetAttribute('ActivityDesc', 'additionalproperty');
            switch (this.riGrid.CurrentColumnName) {
                case 'gridEmployeeCode':
                    if (this.riExchange.URLParameterContains('Business')) {
                        alert('Service/iCABSSePDAiCABSActivityEmployeeMaintenance is not in scope');
                        //this.navigate('TechWorkSummary', 'Service/iCABSSePDAiCABSActivityEmployeeMaintenance.htm');
                    }
                    break;
                case 'ActivityDesc':
                    alert('Service/iCABSSePDAiCABSActivityMaintenance is not in scope');
                    //this.navigate('TechWorkSummary', 'Service/iCABSSePDAiCABSActivityMaintenance.htm');
                    break;
                case 'ContractNumber':
                    if (this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty') !== 'x') {
                        this.setContractType(event);
                        this.attributes.BusinessCodeContractRowID = this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty');
                        if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'J') {
                            this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                                'parentMode': 'TechWorkSummary',
                                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                                'ContractRowID': this.attributes.BusinessCodeContractRowID,
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                                'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                            });
                        }
                        if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'C') {
                            this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                                'parentMode': 'TechWorkSummary',
                                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                                'ContractRowID': this.attributes.BusinessCodeContractRowID,
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                                'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                            });
                        }
                        if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'P') {
                            this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                                'parentMode': 'TechWorkSummary',
                                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                                'ContractRowID': this.attributes.BusinessCodeContractRowID,
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                                'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                            });
                        }
                    }
                    break;
                case 'PremiseNumber':
                    if (this.riGrid.Details.GetAttribute('PremiseNumber', 'additionalproperty') !== 'x') {
                        this.setContractType(event);
                        this.attributes.BusinessCodePremiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'additionalproperty');
                        this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                            'parentMode': 'TechWorkSummary',
                            'PremiseRowID': this.attributes.BusinessCodePremiseRowID,
                            'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                            'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber'),
                            'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                        });

                    }
                    break;
                case 'ProductCode':
                    if (this.riGrid.Details.GetAttribute('PremiseNumber', 'additionalproperty') !== 'x') {
                        this.setContractType(event);
                        this.attributes.BusinessCodeServiceCoverRowID = this.riGrid.Details.GetAttribute('ProductCode', 'additionalproperty');
                        this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                            'parentMode': 'TechWorkSummary',
                            'ServiceCoverRowID': this.attributes.BusinessCodeServiceCoverRowID,
                            'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                            'currentContractType': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                        });
                    }
                    break;
                case 'Recommendation':
                    if (this.riGrid.Details.GetValue('Recommendation') !== '') {
                        this.navigate('TechWorkSummary', InternalGridSearchServiceModuleRoutes.ICABSARECOMMENDATIONGRID.URL_1, {
                            'parentMode': 'TechWorkSummary',
                            'PremiseRowID': this.attributes.BusinessCodePremiseRowID,
                            'ServiceCoverRowID': this.attributes.BusinessCodeServiceCoverRowID,
                            'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                            'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber'),
                            'PremiseName': this.riGrid.Details.GetValue('PremiseName'),
                            'currentContractType': this.riGrid.Details.GetValue('ContractNumber').charAt(0),
                            'ContractRowID': this.attributes.BusinessCodeContractRowID,
                            'ContractNumber': this.riGrid.Details.GetValue('ContractNumber'),
                            'ProductCode': this.riGrid.Details.GetValue('ProductCode'),
                            'ServiceDateFrom': this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom'),
                            'ServiceDateTo': this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo')
                        });
                    }
                    break;
            }
        }
    }
}
