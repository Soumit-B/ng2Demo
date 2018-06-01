import * as moment from 'moment';
import { InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';
import { ErrorCallback, MessageCallback } from './../../../base/Callback';
import { Component, OnInit, Injector, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from './../../../base/BaseComponent';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';

@Component({
    templateUrl: 'iCABSCMSMSMessagesGrid.html'
})

export class SMSMessagesGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit, ErrorCallback, MessageCallback {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('employeeSearchEllipsis') employeeSearchEllipsis: EllipsisComponent;
    @ViewChild('supervisorSearchEllipsis') supervisorSearchEllipsis: EllipsisComponent;

    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;

    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMSMSMessagesGrid',
        module: 'notification',
        method: 'ccm/maintenance',
        ActionSearch: '0',
        ActionInsert: '1',
        ActionUpdate: '6',
        ActionEdit: '2',
        ActionDelete: '3'
    };

    // error Modal popup
    public errorTitle: string;
    public errorContent: string;
    public showErrorHeader: boolean = true;
    // message Modal popup
    public messageTitle: string;
    public messageContent: string;
    public showMessageHeader: boolean = true;
    // Prompt Modal popup
    public promptTitle: string;
    public promptContent: string;
    public showPromptHeader: boolean = true;

    // local array variables
    public routeParams: any = {};
    public search: any = {};
    public postData: any = {};

    // local date variables
    public todayDate = new Date();

    // Grid Component Variables
    public pageId: string;
    public pageSize: number = 10;
    public curPage: number = 1;
    public totalRecords: number = 1;
    public selectedRow: any = -1;
    public grdServiceCover: any = {};
    public dateReadOnly: boolean = false;

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public ellipsis = {
        supervisor: {
            autoOpen: false,
            showCloseButton: true,
            showAddNew: false,
            childConfigParams: {
                'parentMode': 'LookUp-Supervisor'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        employee: {
            autoOpen: false,
            showCloseButton: true,
            showAddNew: false,
            childConfigParams: {
                'parentMode': 'LookUp'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    // set Grid OderableColumn
    public controls = [
        { name: 'SearchType', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'SupervisorEmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'SupervisorSurname', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'selectStatus', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'DateFrom', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate }
    ];

    // Legend
    public legend = [
        { label: 'Received by Intranet and Sent', color: 'rgb(236, 176, 104)' },
        { label: 'Received by Intranet, Sent, Received on Phone', color: 'rgb(204, 255, 204)' },
        { label: 'Sent, Read Receipt not yet Received From Phone', color: 'rgb(221, 221, 221)' }
    ];

    // imglabel
    public imglabel = [
        { label: 'Awaiting Release', img: 'http://10.117.192.160:9090/Images/Smile.gif' },
        { label: 'Sent', img: 'http://10.117.192.160:9090/Images/SmileUp.gif' },
        { label: 'Unsent - Error', img: 'http://10.117.192.160:9090/Images/SmileDown.gif' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMSMSMESSAGESGRID;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }

    public setCurrentContractType(): void {
        this.pageParams.currentContractType =
            this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel =
            this.riExchange.getCurrentContractTypeLabel();
    }

    public getURLQueryParameters(param: any): void {
        this.pageParams.ParentMode = param['parentMode'] ? param['parentMode'] : this.riExchange.getParentMode();
        this.pageParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'SMS Message Search';
        this.utils.setTitle(this.pageTitle);

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.pageParams.DateFrom = this.convertNewDate(this.getControlValue('DateFrom'));
            this.pageParams.DateTo = this.convertNewDate(this.getControlValue('DateTo'));
        } else {
            //To Date
            let toDate = new Date().toString();
            this.pageParams.DateTo = new Date();
            this.setControlValue('DateTo', this.convertNewDate(toDate));

            //From Date
            let fromDate: any = this.utils.removeDays(this.convertNewDate(new Date()), 28);
            this.pageParams.DateFrom = fromDate;
            this.setControlValue('DateFrom', this.convertNewDate(fromDate));

            this.window_onload();
        }
    }

    ngAfterViewInit(): void {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    public window_onload(): void {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;

        this.renderPage();
        //this.BuildGrid();
    }

    public renderPage(): void {
        this.setControlValue('SearchType', 'Employee');
        this.setControlValue('selectStatus', 'unsent');

        this.disableControl('EmployeeSurname', true);
        this.disableControl('SupervisorSurname', true);

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DateFrom', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DateTo', true);

        if (this.pageParams.parentMode === 'SMSMessagesEmployee') {
            this.setControlValue('EmployeeCode', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'EmployeeCode'));
            this.setControlValue('EmployeeSurname', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'EmployeeSurname'));
        }

        this.searchTypeonchange('Employee', true);
    }

    public convertNewDate(getDate: any): any {
        getDate = this.globalize.parseDateToFixedFormat(getDate);
        return this.globalize.parseDateStringToDate(getDate);
    }

    public BuildGrid(): void {
        this.riGrid.Clear();
        if (!this.getControlValue('EmployeeCode')) {
            this.riGrid.AddColumn('EmployeeCode', 'SMSMessage', 'EmployeeCode', MntConst.eTypeCode, 6, false);
            this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
            this.riGrid.AddColumn('EmployeeSurname', 'SMSMessage', 'EmployeeSurname', MntConst.eTypeText, 10, false);
            this.riGrid.AddColumnOrderable('EmployeeCode', true);
            this.riGrid.AddColumnOrderable('EmployeeSurname', true);
        }
        this.riGrid.AddColumn('InternalExternal', 'SMSMessage', 'InternalExternal', MntConst.eTypeText, 6, false);
        this.riGrid.AddColumn('DateCreated', 'SMSMessage', 'DateCreated', MntConst.eTypeText, 16, false);
        this.riGrid.AddColumnAlign('DateCreated', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('DateCreated', true);

        if (this.getControlValue('selectStatus') !== 'unsent') {
            this.riGrid.AddColumn('DateSent', 'SMSMessage', 'DateSent', MntConst.eTypeText, 16, false);
            this.riGrid.AddColumnAlign('DateSent', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnOrderable('DateSent', true);
        }
        this.riGrid.AddColumn('MobileNumber', 'SMSMessage', 'MobileNumber', MntConst.eTypeText, 10, false);
        this.riGrid.AddColumn('MessageText', 'SMSMessage', 'MessageText', MntConst.eTypeText, 150, false);
        this.riGrid.AddColumn('StatusImg', 'SMSMessage', 'StatusImg', MntConst.eTypeImage, 2, false);
        this.riGrid.AddColumn('SMSResentInd', 'SMSResentInd', 'SMSResentInd', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumn('SMSSendOn', 'SMSSendOn', 'SMSSendOn', MntConst.eTypeTextFree, 14, true);
        this.riGrid.AddColumn('SMSRedirect', 'SMSRedirect', 'SMSRedirect', MntConst.eTypeImage, 8, true);
        this.riGrid.Complete();

        this.riGrid_BeforeExecute();
    } // end of BuildGrid

    public riGrid_BeforeExecute(): void {
        let haserror_DateFrom = this.riExchange.riInputElement.isError(this.uiForm, 'DateFrom');
        let haserror_DateTo = this.riExchange.riInputElement.isError(this.uiForm, 'DateTo');
        let haserror_EmployeeCode = this.riExchange.riInputElement.isError(this.uiForm, 'EmployeeCode');

        if (!haserror_DateFrom
            && !haserror_DateTo
            && !haserror_EmployeeCode) {
            this.search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
            // set parameters
            this.search.set('DateFrom', this.getControlValue('DateFrom') ? this.getControlValue('DateFrom') : '');
            this.search.set('DateTo', this.getControlValue('DateTo') ? this.getControlValue('DateTo') : '');
            this.search.set('BranchNumber', this.utils.getBranchCode());
            this.search.set('SupervisorEmployeeCode', this.getControlValue('SupervisorEmployeeCode') ? this.getControlValue('SupervisorEmployeeCode') : '');
            this.search.set('EmployeeCode', this.getControlValue('EmployeeCode') ? this.getControlValue('EmployeeCode') : '');
            this.search.set('Status', this.getControlValue('selectStatus') ? this.getControlValue('selectStatus') : 'All');

            // set grid building parameters
            this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.curPage.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '6489328');
            this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
            let sortOrder = 'Descending';
            if (!this.riGrid.DescendingSort) {
                sortOrder = 'Ascending';
            }
            this.search.set(this.serviceConstants.GridSortOrder, sortOrder);
            this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);

            this.queryParams.search = this.search;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.errorMessage) {
                        return;
                    }
                    // this.totalRecords = data.pageData.pageNumber;
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    // this.totalRecords = this.riGrid.PageSize * data.pageData.pageNumber;
                    this.riGrid.Execute(data);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public riExchange_UpdateHTMLDocument(): void {
        this.riGrid_BeforeExecute();
    }

    public riGrid_Sort(event: any): void {
        // this.curPage = 1;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_BodyOnDblClick(event: any): void {
        let strElementID = event.srcElement.parentElement.parentElement.getAttribute('id');

        switch (strElementID) {
            case 'SMSResentInd':
                this.resendDetails();
                break;
            case 'SMSRedirect':
                this.redirectSMS();
                break;
            default:
                break;
        }
    } // End of getGridOnDblClick

    public getCurrentPage(event: any): void {
        this.selectedRow = -1;
        this.curPage = event.value;
        this.onRefresh();
    }

    public onRefresh(): void {
        if (this.curPage <= 0) {
            this.curPage = 1;
        }
        this.riGrid.RefreshRequired();
        this.BuildGrid();
    }

    public promptSave(event: any): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        //set parameters
        this.postData.Function = 'ResendMessage';
        this.postData.RowID = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, this.postData)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e.info['error']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.showErrorModal(e.errorMessage);
                    } else {
                        this.onRefresh();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    public resendDetails(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.postData.Function = 'CheckMessage';
        this.postData.RowID = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, this.postData)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.errorService.emitError(data.info['error']);
                } else {
                    if ((typeof data !== 'undefined' && data['errorMessage'])) {
                        this.showErrorModal(data.errorMessage);
                    } else {
                        this.promptTitle = this.getTranslatedValue('Are you sure you want to resend this Message').value;
                        this.promptModal.show();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public redirectSMS(): void {
        this.pageParams.SMSMessageRowID = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');
        let riExchangeMode = 'Redirect';
        this.navigate(riExchangeMode, InternalMaintenanceServiceModuleRoutes.ICABSCMSMSREDIRECT, {
            'SMSMessageRowID': this.pageParams.SMSMessageRowID
        });
    }

    public selectStatusOnchange(data: any): void {
        if (data) {
            // this.riGrid.RefreshRequired();
            // this.BuildGrid();
        }
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('DateFrom', value.value);
        } else {
            this.setControlValue('DateFrom', '');
        }
        this.riGrid.RefreshRequired();
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('DateTo', value.value);
        } else {
            this.setControlValue('DateTo', '');
        }
        this.riGrid.RefreshRequired();
    }

    public searchTypeonchange(data: any, call: boolean): void {
        switch (data) {
            case 'Supervisor':
                this.pageParams.trSupervisor = true;
                this.pageParams.trEmployee = false;
                this.setControlValue('EmployeeCode', '');
                this.setControlValue('EmployeeSurname', '');
                break;
            default:
                this.pageParams.trSupervisor = false;
                this.pageParams.trEmployee = true;
                this.setControlValue('SupervisorEmployeeCode', '');
                this.setControlValue('SupervisorSurname', '');
                break;
        }
        // this.riGrid.RefreshRequired();
        // this.BuildGrid();
    }

    public supervisoronchange(obj: any, call: boolean): void {
        if (call) {
            if (obj.SupervisorEmployeeCode) {
                this.setControlValue('SupervisorEmployeeCode', obj.SupervisorEmployeeCode);
            }
            if (obj.SupervisorSurname) {
                this.setControlValue('SupervisorSurname', obj.SupervisorSurname);
            }
        }
        // this.riGrid.RefreshRequired();
        // this.BuildGrid();
    }

    public employeeonchange(obj: any, call: boolean): void {
        if (call) {
            if (obj.EmployeeCode) {
                this.setControlValue('EmployeeCode', obj.EmployeeCode);
            }
            if (obj.EmployeeSurname) {
                this.setControlValue('EmployeeSurname', obj.EmployeeSurname);
            }
        }
    }

    public employeeCodeonkeydown(event: any, byval: number): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionUpdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.postData.Function = 'GetEmployeeName';
        this.postData.EmployeeCode = this.getControlValue('EmployeeCode') ? this.getControlValue('EmployeeCode') : '';

        if (this.postData.EmployeeCode) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, this.postData)
                .subscribe(
                (data) => {
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.info['error']);
                        this.setControlValue('EmployeeSurname', '');
                    } else {
                        if ((typeof data !== 'undefined' && data['errorMessage'])) {
                            this.showErrorModal(data.errorMessage);
                            this.setControlValue('EmployeeSurname', '');
                        } else {
                            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', false);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', true);
                    this.setControlValue('EmployeeSurname', '');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.setControlValue('EmployeeSurname', '');
        }
    }

    public supervisorEmployeeCodeonkeydown(event: any, byval: number): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionUpdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.postData.Function = 'GetEmployeeName';
        this.postData.EmployeeCode = this.getControlValue('SupervisorEmployeeCode') ? this.getControlValue('SupervisorEmployeeCode') : '';

        if (this.postData.EmployeeCode) {
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, this.postData)
                .subscribe(
                (data) => {
                    if (data.status === 'failure') {
                        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'SupervisorEmployeeCode', true);
                        this.showErrorModal(data.info['error']);
                        this.setControlValue('SupervisorSurname', '');
                    } else {
                        if ((typeof data !== 'undefined' && data['errorMessage'])) {
                            this.showErrorModal(data.errorMessage);
                            this.setControlValue('SupervisorSurname', '');
                        } else {
                            this.setControlValue('SupervisorSurname', data.EmployeeSurname);
                            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'SupervisorEmployeeCode', false);
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'SupervisorEmployeeCode', true);
                    this.setControlValue('SupervisorSurname', '');
                }
                );
        } else {
            this.setControlValue('SupervisorSurname', '');
        }
    }


}


