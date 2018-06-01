import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { BaseComponent } from './../../../base/BaseComponent';
import { QueryParametersCallback } from './../../../base/Callback';
import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter, HostListener } from '@angular/core';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { RiMaintenance, MntConst, RiTab } from './../../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { AppModuleRoutes, CCMModuleRoutes, InternalGridSearchModuleRoutes, InternalMaintenanceModuleRoutes, InternalGridSearchApplicationModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';

import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import * as moment from 'moment';

@Component({
    templateUrl: 'iCABSCMCallCentreAssignGrid.html'
})

export class CMCallCentreAssignGridComponent extends BaseComponent implements OnInit, OnDestroy, QueryParametersCallback {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('EmployeeSearchEllipsis') EmployeeSearchComponent: EllipsisComponent;

    public pageId: string = '';
    public controls = [
        { name: 'DateFrom', type: MntConst.eTypeDate },
        { name: 'DateTo', type: MntConst.eTypeDate },
        { name: 'ToEmployeeCode', type: MntConst.eTypeCode },
        { name: 'ToEmployeeSurname', type: MntConst.eTypeText, disabled: true },
        { name: 'MyFilterEmployeeCode', type: MntConst.eTypeCode },
        { name: 'TeamID', type: MntConst.eTypeTextFree },
        { name: 'EmployeeCode', type: MntConst.eTypeCode },
        { name: 'MyFilterPassed', type: MntConst.eTypeText },
        { name: 'MyContactType', type: MntConst.eTypeText },
        { name: 'MyFilterLevel', type: MntConst.eTypeText },
        { name: 'MyFilterValue', type: MntConst.eTypeText },
        { name: 'ReassignSelect', type: MntConst.eTypeText },
        { name: 'CreateRenewalInd', type: MntConst.eTypeText },
        // hidden
        { name: 'CallOutRowID', type: MntConst.eTypeText },
        { name: 'RowID', type: MntConst.eTypeText },
        { name: 'Row', type: MntConst.eTypeText },
        { name: 'Cell', type: MntConst.eTypeText },
        { name: 'SelectedCallLogID', type: MntConst.eTypeText },
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeCode },
        { name: 'BranchNumber', type: MntConst.eTypeInteger }
    ];

    public dropdown = {
        componentName: {
            params: {
                'parentMode': ''
            },
            active: {
                id: '',
                text: ''
            },
            disabled: true,
            required: true,
            isError: true
        }
    };

    // Legend
    public legend = [
        { label: 'Created Outside Service Branch', color: '#FFCCCC' }
    ];

    public currentActivity: string;
    public xhr: any;
    public xhrParams = {
        module: 'call-centre',
        method: 'ccm/maintenance',
        operation: 'ContactManagement/iCABSCMCallCentreAssignGrid'
    };

    /* ========================Message Modal Popup ===================================*/
    // message Modal popup
    public errorTitle: string;
    public errorContent: string;
    public showErrorHeader: boolean = true;
    // message Modal popup
    public messageTitle: string;
    public messageContent: string;
    public showMessageHeader: boolean = true;

    /* ========== Set Focus On =============== */
    public MyFilterEmployeeCodeIsfocus = new EventEmitter<boolean>();
    public TeamIDIsfocus = new EventEmitter<boolean>();
    public EmployeeCodeIsFocus = new EventEmitter<boolean>();
    public dateReadOnly: boolean = false;

    public ellipsisConfig = {
        MyFilterEmployeeCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'MyFilter',
                'showAddNew': false
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            disabled: false
        },
        EmployeeCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': false
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            disabled: false
        },
        ToEmployeeCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-ToEmployee',
                'showAddNew': false
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            disabled: false
        }
    };

    public modalConfig = {
        backdrop: 'static',
        keyboard: true
    };
    /* ========== Set Array Property =============== */

    public strGridData;
    public Date: Date = new Date();
    public blnUpdate: boolean;
    public intMonthsAgo: number;
    public intMonthsAhead: number;

    public callLookUpData(): void {
        let lookupIP = [
            {
                'table': 'ContactType',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ContactTypeCode', 'ContactTypeSystemDesc']
            },
            {
                'table': 'ContactTypeDetail',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'CallCentreReviewInd': 'TRUE'
                },
                'fields': ['ContactTypeCode', 'ContactTypeDetailSystemDesc']
            },
            {
                'table': 'ContactTypeLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ContactTypeCode', 'ContactTypeDesc']
            },
            {
                'table': 'riRegistry',
                'query': {
                    'RegSection': 'Contact Centre Assign',
                    'RegKey': this.businessCode() + '_FromDate (NumberOfMonthsInThePast)'
                },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': {
                    'RegSection': 'Contact Centre Assign',
                    'RegKey': this.businessCode() + '_ToDate (NumberOfMonthsInTheFuture)'
                },
                'fields': ['RegValue']
            }
        ];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            let ContactTypeData = data[0];
            let ContactTypeDetailData = data[1];
            let ContactTypeLangData = data[2];
            let riRegistryFrom = data[3];
            let riRegistryTo = data[4];
            let getMonth: number = this.Date.getMonth();
            this.pageParams.ttContactType = [];
            if (ContactTypeData) {
                ContactTypeData.forEach(item => {

                    let filterData = ContactTypeDetailData.find(detailObj => (detailObj.ContactTypeCode === item.ContactTypeCode));
                    let matchValue = ContactTypeLangData.find(langObj => (langObj.ContactTypeCode === item.ContactTypeCode));

                    if (matchValue) {
                        this.pageParams.ttContactType.push({
                            ContactTypeCode: item.ContactTypeCode,
                            ContactTypeDesc: item.ContactTypeSystemDesc || matchValue.ContactTypeDesc
                        });
                    }
                });
                this.utils.sortByKey(this.pageParams.ttContactType, 'ContactTypeDesc');
            }

            if (riRegistryFrom) {
                let RegValueFrom: number = parseInt(riRegistryFrom[0]['RegValue'], 10);
                this.pageParams.vMonthsAgo = RegValueFrom || 3;
                this.intMonthsAgo = getMonth - this.pageParams.vMonthsAgo;
                let getFromDate = this.utils.formatDate(this.Date.setMonth(this.intMonthsAgo));
                // if (moment(getFromDate, 'DD/MM/YYYY', true).isValid()) {
                //     getFromDate = this.utils.convertDate(getFromDate);
                // } else {
                //     getFromDate = this.utils.formatDate(getFromDate);
                // }
                // this.pageParams.dtNewFromDate = new Date(getFromDate);
                getFromDate = this.globalize.parseDateToFixedFormat(getFromDate);
                this.pageParams.dtNewFromDate = this.globalize.parseDateStringToDate(getFromDate);
                this.setControlValue('DateFrom', getFromDate);
            }
            if (riRegistryTo) {
                let RegValueTo: number = parseInt(riRegistryTo[0]['RegValue'], 10);
                this.pageParams.vMonthsAhead = RegValueTo || 1;
                this.intMonthsAhead = getMonth + this.pageParams.vMonthsAhead;
                let getToDate = this.utils.formatDate(this.Date.setMonth(this.intMonthsAhead));
                // if (moment(getToDate, 'DD/MM/YYYY', true).isValid()) {
                //     getToDate = this.utils.convertDate(getToDate);
                // } else {
                //     getToDate = this.utils.formatDate(getToDate);
                // }
                // this.pageParams.dtNewToDate = new Date(getToDate);
                getToDate = this.globalize.parseDateToFixedFormat(getToDate);
                this.pageParams.dtNewToDate = this.globalize.parseDateStringToDate(getToDate);
                this.setControlValue('DateTo', getToDate);
            }
        }).catch(
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

        // Set array
        this.pageParams.vFilterLevelList = [
            { value: 'currentowner', text: 'Current Owner is' },
            { value: 'currentactioner', text: 'Current Actioner is' },
            { value: 'anyaction', text: 'Any Action by' },
            { value: 'createdby', text: 'Created By' }
        ];

        this.pageParams.vFilterValueList = [
            { value: 'me', text: 'Me' },
            { value: 'myemployees', text: 'My Employees' },
            { value: 'thisbranch', text: 'This Branch' },
            { value: 'thisemployee', text: 'This Employee' }
        ];
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLCENTREASSIGNGRID;

        this.setCurrentContractType();
        this.setURLQueryParameters(this);
    }
    public setCurrentContractType(): void {
        this.pageParams.currentContractType =
            this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel =
            this.riExchange.getCurrentContractTypeLabel();
    }

    public getURLQueryParameters(param: any): void {
        this.pageParams.ParentMode = param['parentMode'] || this.riExchange.getParentMode();
        this.pageParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    }

    public formatNewFormDate(date: any): Date {
        let getDate = date;
        if (moment(getDate, 'DD/MM/YYYY', true).isValid()) {
            getDate = this.utils.convertDate(getDate);
        } else {
            getDate = this.utils.formatDate(getDate);
        }
        return new Date(getDate);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Centre - Assign';
        this.utils.setTitle(this.pageTitle);

        if (this.isReturning()) {
            this.populateUIFromFormData();
            if (this.getControlValue('DateFrom')) {
                this.pageParams.dtNewFromDate = this.formatNewFormDate(this.getControlValue('DateFrom'));
            }
            if (this.getControlValue('DateTo')) {
                this.pageParams.dtNewToDate = this.formatNewFormDate(this.getControlValue('DateTo'));
            }
            this.BuildGrid();
        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public window_onload(): void {
        this.AddFields();
        this.callLookUpData();

        // this.riGrid.BusinessObject = 'iCABSCallCentreReviewGrid.p';
        // this.riGrid.IEWindow = Window;
        // this.riGrid.HTMLdocument = Document;
        // this.riGrid.HTMLGridHeader = theadCustomerContact;
        // this.riGrid.HTMLGridBody = tbodyCustomerContact;
        // this.riGrid.HTmlGridFooter = tfootCustomerContact;

        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        //' riGrid.PageSize = 9 ' causes a scroll bar at 1024x768, dont know why
        // this.riGrid.RefreshInterval = 0;
        //  this.riGrid.ExportExcel = true;

        this.BuildGrid();
        this.riGrid.RefreshRequired();

        this.LoadSearchDefaults();

    }

    /*##############################################################
    # Initialisation Routines
    ##############################################################*/

    private AddFields(): void {
        this.riExchange.riInputElement.Add(this.uiForm, 'BranchNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'BranchServiceAreaCode');

        this.riExchange.riInputElement.Add(this.uiForm, 'MyFilterEmployeeCode');
        this.riExchange.riInputElement.Add(this.uiForm, 'EmployeeCode');
        this.riExchange.riInputElement.Add(this.uiForm, 'TeamID');

        this.riExchange.riInputElement.Add(this.uiForm, 'DateFrom');
        this.riExchange.riInputElement.Add(this.uiForm, 'DateTo');

        this.riExchange.riInputElement.Add(this.uiForm, 'ServiceCoverNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'ServiceCoverRowID');
        this.riExchange.riInputElement.Add(this.uiForm, 'CallOutID');
        this.riExchange.riInputElement.Add(this.uiForm, 'ToEmployeeCode');
        this.riExchange.riInputElement.Add(this.uiForm, 'ToEmployeeSurname');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ToEmployeeSurname');
    }

    public routeParams: any = {};
    public postData: any = {};
    private LoadSearchDefaults(): void {
        let strReturn;
        let Arr;
        let iLoop;
        let Elle;
        let CT;

        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSCallCentreReviewGrid.p';

        this.riMaintenance.PostDataAdd('Function', 'GetSearchDefaults', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BranchNumber', this.utils.getBranchCode(), MntConst.eTypeCode);

        this.riMaintenance.ReturnDataAdd('cmbContactType', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('cmbPassed', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('cmbLevel', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('cmbValue', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('cmbStatus', MntConst.eTypeInteger);

        // 'Process returned results
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                if (data.cmbContactType === 1) {
                    this.setControlValue('MyContactType', 'AR');
                } else {
                    this.setControlValue('MyContactType', data.cmbContactType);
                }
                if (data.cmbPassed === 0) {
                    this.setControlValue('MyFilterPassed', 'all');
                } else {
                    this.setControlValue('MyFilterPassed', data.cmbPassed);
                }
                if (data.cmbStatus === 0) {
                    this.setControlValue('ReassignSelect', 'All');
                } else {
                    this.setControlValue('ReassignSelect', data.cmbStatus);
                }
                this.setControlValue('MyFilterLevel', data.cmbLevel);
                this.setControlValue('MyFilterValue', data.cmbValue);

                this.myContactTypeOnchange();
                this.myFilterPassedOnchange();
                this.myFilterLevelOnchange();
                this.myFilterValueOnchange();
            }
        }, 'POST', 6);
    }

    /*##############################################################
    # Grid Routines
    ############################################################## */

    public totalRecords: number = 0;
    public pageSize: number = 10;
    public curPage: number = 1;

    private BuildGrid(): void {
        this.riGrid.Clear(); //  OUT OF SCOPE
        this.riGrid.AddColumn('grCallLogID', 'grCallLogID', 'grCallLogID', MntConst.eTypeInteger, 6, true);
        this.riGrid.AddColumnAlign('grCallLogID', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ContactActionNumber', 'ContactActionNumber', 'ContactActionNumber', MntConst.eTypeInteger, 6, true);
        this.riGrid.AddColumnAlign('ContactActionNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ContactType', 'ContactType', 'ContactType', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactName', 'ContactName', 'ContactName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('CustomerName', 'CustomerName', 'CustomerName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('CustomerTelephone', 'CustomerTelephone', 'CustomerTelephone', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactInfo', 'ContactInfo', 'ContactInfo', MntConst.eTypeImage, 2, true);
        this.riGrid.AddColumn('Comments', 'Comments', 'Comments', MntConst.eTypeText, 40);
        this.riGrid.AddColumn('LatestComments', 'LatestComments', 'LatestComments', MntConst.eTypeText, 40);
        this.riGrid.AddColumn('BranchNumber', 'BranchNumber', 'BranchNumber', MntConst.eTypeInteger, 30);
        this.riGrid.AddColumn('Actions', 'Actions', 'Actions', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('Actions', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('CurrentActionEmployeeCode', 'CurrentActionEmployeeCode', 'CurrentActionEmployeeCode', MntConst.eTypeCode, 20);
        this.riGrid.AddColumn('Assign', 'Assign', 'Assign', MntConst.eTypeImage, 1);
        this.riGrid.AddColumn('Status', 'Status', 'Status', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('ActionByDateTime', 'ActionByDateTime', 'ActionByDateTime', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('Passed', 'Passed', 'Passed', MntConst.eTypeImage, 2); //', true); 'MSA - 28 / 09 / 2004 QRS(DK); 59 - Disable passed column double click
        this.riGrid.AddColumn('CallOuts', 'CallOuts', 'CallOuts', MntConst.eTypeImage, 2); //', true); 'MSA - 01 / 10 / 2004 QRS1094(NL); - Disable drill down for callout column when not a tick

        this.riGrid.AddColumnOrderable('grCallLogID', true);
        this.riGrid.AddColumnOrderable('ContactActionNumber', true);
        this.riGrid.AddColumnOrderable('ActionByDateTime', true);
        this.riGrid.AddColumnOrderable('CurrentActionEmployeeCode', true);
        this.riGrid.AddColumnOrderable('ContactName', true);
        this.riGrid.AddColumnOrderable('ContactType', true);
        this.riGrid.AddColumnOrderable('Actions', true);

        // ' Set 'Export Only' columns
        this.riGrid.AddColumnScreen('CustomerName', false);
        this.riGrid.AddColumnScreen('CustomerTelephone', false);
        this.riGrid.AddColumnScreen('LatestComments', false);
        this.riGrid.AddColumnScreen('BranchNumber', false);
        this.riGrid.AddColumnScreen('Status', false);

        this.riGrid.Complete();
    }

    public riExchange_UpdateHTMLDocument(): void {
        if (this.riExchange.getParentAttributeValue('RowID') && this.blnUpdate) {
            this.riGrid.Update = true;
        } else {
            this.riGrid.Update = false;
        }

        // this.riGrid.Execute();
        this.BuildGrid();
        this.riGrid_BeforeExecute();
    }

    private riGrid_BeforeExecute(): void {
        let gridQueryParams = this.getURLSearchParamObject();
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set('RunningAs', 'Assign');
        gridQueryParams.set('CallLogID', this.getControlValue('CallLogID'));
        gridQueryParams.set('CustomerContactNumber', this.getControlValue('CustomerContactNumber'));
        gridQueryParams.set('AccountNumber', this.getControlValue('AccountNumber'));
        gridQueryParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        gridQueryParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        gridQueryParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
        gridQueryParams.set('ProductCode', this.getControlValue('ProductCode'));
        gridQueryParams.set('Postcode', this.getControlValue('PostCode'));
        gridQueryParams.set('ContactName', this.getControlValue('SearchContactName'));
        gridQueryParams.set('Filter', 'AllOpen');
        gridQueryParams.set('FilterPassed', this.getControlValue('MyFilterPassed'));
        gridQueryParams.set('FilterLevel', this.getControlValue('MyFilterLevel'));
        gridQueryParams.set('FilterValue', this.getControlValue('MyFilterValue'));
        gridQueryParams.set('FilterEmployeeCode', this.getControlValue('MyFilterEmployeeCode'));
        gridQueryParams.set('FilterTeamID', this.getControlValue('TeamID'));
        gridQueryParams.set('LanguageCode', this.riExchange.LanguageCode());
        gridQueryParams.set('FilterBranchNumber', this.utils.getBranchCode());
        gridQueryParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        gridQueryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        gridQueryParams.set('MyContactType', this.getControlValue('MyContactType'));
        gridQueryParams.set('OSCallOuts', 'All');
        gridQueryParams.set('DateFrom', this.getControlValue('DateFrom'));
        gridQueryParams.set('DateTo', this.getControlValue('DateTo'));
        gridQueryParams.set('ReassignEmployeeCode', this.getControlValue('EmployeeCode'));
        gridQueryParams.set('ReassignSelect', this.getControlValue('ReassignSelect'));
        // Fix for IUI-16643
        gridQueryParams.set('ROWID', this.riGrid.Update ? this.getControlValue('RowID') : null);


        gridQueryParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridQueryParams.set(this.serviceConstants.GridMode, '0');
        gridQueryParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridQueryParams.set(this.serviceConstants.GridCacheRefresh, 'true');
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridQueryParams.set('riHTMLPage', 'ContactManagement/iCABSCMCallCentreAssignGrid.htm');
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridQueryParams.set('riSortOrder', sortOrder);


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    this.riGrid.ResetGrid();
                } else {
                    this.curPage = data.pageData.pageNumber || 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.RefreshRequired();
                    if (this.riGrid.Update) {
                        this.riGrid.StartRow = this.getControlValue('Row'); // Fix for IUI-16643
                        this.riGrid.StartColumn = 0;
                        this.riGrid.RowID = this.getControlValue('RowID');
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = false;
                    }
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public riGrid_AfterExecute(): void {
        if (!this.riGrid.Update) {
            if (this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]) {
                this.SelectedRowFocus(this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]);
            }
        }
    }

    public SelectedRowFocus(rsrcElement: any): void {
        rsrcElement.select();
        rsrcElement.focus();
        this.setControlValue('Row', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.setControlValue('Cell', rsrcElement.parentElement.parentElement.cellIndex);
        this.setControlValue('RowID', this.riGrid.Details.GetAttribute('ContactActionNumber', 'RowID'));
        this.setControlValue('SelectedCallLogID', this.riGrid.Details.GetValue('grCallLogID'));
    }

    public riGrid_BodyOnKeyDown(event: any): void {
        let cellindex = event.srcElement.parentElement.parentElement.cellIndex;
        if (!event.shiftKey) {
            switch (event.keyCode) {
                case 13: //'Enter
                    this.Detail(event);
                    break;
                case 38: //'Up Arror
                    if ((this.getControlValue('Row') > 0) && (this.getControlValue('Row') < 10))
                        this.SelectedRowFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[0].children[0].children[0]);
                    break;
                case 40:
                case 9: // 'Down Arror Or Tab
                    if ((this.getControlValue('Row') >= 0) && (this.getControlValue('Row') < 9))
                        this.SelectedRowFocus(this.riGrid.CurrentHTMLRow.nextSibling.children[0].children[0].children[0]);
                    break;
                default:
                    break;
            }
        } else {
            switch (event.keyCode) {
                case 9: //'Tab
                    if ((this.getControlValue('Row') > 0) && (this.getControlValue('Row') < 10))
                        this.SelectedRowFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[0].children[0].children[0]);
                    break;
            }
        }
    }

    public riGrid_BodyOnDblClick(event: any): void {
        switch (event.srcElement.tagName) {
            case 'INPUT':
            case 'IMG':
                this.SelectedRowFocus(this.riGrid.CurrentHTMLRow.children[0].children[0].children[0]);
                break;
        }
        this.Detail(event);
    }

    public getCurrentPage(event: any): void {
        this.curPage = event.value;
        this.riExchange_UpdateHTMLDocument();
    }

    public refresh(): void {
        if (this.curPage <= 0) {
            this.curPage = 1;
        }
        this.riExchange_UpdateHTMLDocument();
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public tbodyCustomerContactOnClick(event: any): void {
        switch (event.srcElement.tagName) {
            case 'INPUT':
            case 'IMG':
                this.SelectedRowFocus(this.riGrid.CurrentHTMLRow.children[0].children[0].children[0]);
                break;
        }
    }

    public Detail(event: any): void {
        switch (event.srcElement.parentElement.getAttribute('id')) {
            case 'grCallLogID':
                if (this.getControlValue('SelectedCallLogID') > 0) {
                    this.riExchange.Mode = 'CallCentreReview';
                    this.navigate(this.riExchange.Mode, AppModuleRoutes.CCM + CCMModuleRoutes.ICABSCMCALLCENTREGRID, {
                        SelectedCallLogID: this.getControlValue('SelectedCallLogID')
                    });
                }
                break;
            case 'ContactActionNumber':
                this.blnUpdate = true;
                this.riExchange.Mode = 'CallCentreReview';
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered));
                // TODO: this.navigate(this.riExchange.Mode, '/wsscripts/riHTMLWrapper.p?riFileName=ContactManagement/iCABSCMCustomerContactMaintenance.htm<maxwidth>'
                break;
            case 'Actions':
                this.riExchange.Mode = 'CallCentreReview';
                this.attributes['CustomerContactNumberRowID'] = this.riGrid.Details.GetAttribute('Actions', 'RowID');
                this.navigate(this.riExchange.Mode, InternalGridSearchApplicationModuleRoutes.ICABSCMCUSTOMERCONTACTDETAILGRID);
                break;
            case 'ContactInfo':
                this.messageContent = this.riGrid.CurrentHTMLRow.children[2].children[0].children[0].innerText + '\n' + (this.riGrid.CurrentHTMLRow.children[2].children[0].children[0].getAttribute('title') ? this.riGrid.CurrentHTMLRow.children[2].children[0].children[0].getAttribute('title') : '');
                let mesObj: ICabsModalVO = new ICabsModalVO(this.messageContent);
                mesObj.title = 'Contact Information';
                this.modalAdvService.emitMessage(mesObj);
                break;
            case 'CallOuts':
                if (event.srcElement.getAttribute('RowID') !== '1') {
                    this.setControlValue('CallOutRowID', this.riGrid.Details.GetAttribute('CallOuts', 'RowID'));
                    this.setControlValue('RowID', this.riGrid.Details.GetAttribute('ContactActionNumber', 'RowID'));
                    this.attributes.ROWID = this.riGrid.Details.GetAttribute('ContactActionNumber', 'RowID');
                    this.riExchange.Mode = 'UpdateCallOut-ContactSearch';
                    this.navigate(this.riExchange.Mode, InternalMaintenanceServiceModuleRoutes.ICABSCMCALLOUTMAINTENANCE, {
                        CallOutROWID: this.getControlValue('CallOutRowID'),
                        ROWID: this.getControlValue('RowID')
                    });
                }
                break;
            case 'Assign':
                if (!this.getControlValue('ToEmployeeCode')) {
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ToEmployeeCode', true);
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'ToEmployeeCode');
                } else {
                    this.riMaintenance.BusinessObject = 'iCABSCallCentreReviewGrid.p';
                    this.riMaintenance.clear();
                    this.riMaintenance.PostDataAdd('BusinessCode', this.businessCode(), MntConst.eTypeCode);
                    this.riMaintenance.PostDataAdd('ToEmployeeCode', event.srcElement.ToEmployeeCode, MntConst.eTypeCode);
                    this.riMaintenance.PostDataAdd('RowID', event.srcElement.RowID, MntConst.eTypeTextFree);
                    this.riMaintenance.PostDataAdd('Function', 'Assign', MntConst.eTypeTextFree);
                    this.riMaintenance.Execute(this, function (data: any): any {
                        if (data.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        } else {
                            this.riGrid.Update = true;
                            this.riGrid_BeforeExecute();
                        }
                    }, 'POST', 6);
                    break;
                }
        }
    }

    /*##############################################################
    # Input box OnKeyDown Events
    ##############################################################*/

    public teamIDOnKeydown(event: any): void {
        if (event.keyCode === 34) {
            this.riExchange.Mode = 'LookUp-Add';
            this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered));
            // this.navigate(this.riExchange.Mode, '/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSTeamSearch.htm');
        }
    }


    /*##############################################################
    '# Input box OnDeactivate Events
    '##############################################################*/

    public branchServiceAreaCodeOnDeactivate(): void {
        if (this.getControlValue('BranchServiceAreaCode')) {
            if (this.getControlValue('MyFilterValue') === 'all') {
                this.setControlValue('MyFilterValue', 'thisbranch');
            }
        }
    }

    /*##############################################################
    '# Input box OnChange Events
    '##############################################################*/


    public myFilterEmployeeCodeOnchange(event: any): void {
        this.riGrid.RefreshRequired();
    }

    public myFilterEmployeeCodeOnblur(event: any): void {
        if (!event.target.value) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', true);
        } else {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'MyFilterEmployeeCode', false);
        }
    }

    public teamIDOnchange(): void {
        this.riGrid.RefreshRequired();
    }

    public myFilterPassedOnchange(): void {
        this.riGrid.RefreshRequired();
    }

    public myFilterLevelOnchange(): void {
        this.riGrid.RefreshRequired();
    }

    public myFilterValueOnchange(): void {
        this.riGrid.RefreshRequired();

        switch (this.getControlValue('MyFilterValue')) {
            case 'me':
            case 'myemployees':
            case 'thisbranch':
                this.pageParams.MyFilterEmployeeCodeIsHidden = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', false);
                this.pageParams.TeamIDIsHidden = false;
                this.setControlValue('TeamID', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TeamID', false);
                break;
            case 'thisemployee':
                this.pageParams.TeamIDIsHidden = false;
                this.setControlValue('TeamID', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TeamID', false);
                this.MyFilterEmployeeCodeIsfocus.emit(true);
                this.pageParams.MyFilterEmployeeCodeIsHidden = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', true);
                this.ellipsisConfig.MyFilterEmployeeCode.childConfigParams.parentMode = 'MyFilter';
                break;
            case 'thisteam':
                this.pageParams.TeamIDIsHidden = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TeamID', true);
                this.pageParams.MyFilterEmployeeCodeIsHidden = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', false);
                this.TeamIDIsfocus.emit(true);
                break;
            default:
                this.setControlValue('BranchServiceAreaCode', '');
                this.pageParams.MyFilterEmployeeCodeIsHidden = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', false);
                this.pageParams.TeamIDIsHidden = false;
                this.setControlValue('TeamID', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TeamID', false);
                break;
        }

    }

    public reassignSelectOnChange(): void {

        this.riGrid.RefreshRequired();

        switch (this.getControlValue('ReassignSelect')) {
            case 'All':
            case 'AllReassigned':
                this.pageParams.EmployeeCodeIsHidden = false;
                this.setControlValue('EmployeeCode', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', false);
                break;
            case 'ReassignedTo':
            case 'ReassignedFrom':
                this.pageParams.EmployeeCodeIsHidden = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
                this.EmployeeCodeIsFocus.emit(true);
                break;
        }

    }

    public employeeCodeOnblur(event: any): void {
        if (!event.target.value) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        } else {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', false);
        }
    }

    public myContactTypeOnchange(): void {
        this.riGrid.RefreshRequired();
    }

    public toEmployeeCodeOnChange(e: any): void {
        if (e.target.value) {
            this.riMaintenance.BusinessObject = 'iCABSWorkListCopy.p';
            this.riMaintenance.clear();
            this.riMaintenance.PostDataAdd('Function', 'EmployeeDetails', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('EmployeeCode', this.getControlValue('ToEmployeeCode'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('EmployeeSurname', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    this.setControlValue('ToEmployeeCode', '');
                    this.setControlValue('ToEmployeeSurname', '');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ToEmployeeCode', true);
                } else {
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ToEmployeeCode', false);
                    this.setControlValue('ToEmployeeSurname', data.EmployeeSurname);
                    this.checkEmployee();
                }
            }, 'POST', 6);
        } else {
            this.setControlValue('ToEmployeeSurname', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ToEmployeeCode', true);
        }
    }

    public toEmployeeCodeOnblur(e: any): void {
        if (!e.target.value) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ToEmployeeCode', true);
        } else {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ToEmployeeCode', false);
        }
    }

    public checkEmployee(): void {
        this.riMaintenance.BusinessObject = 'iCABSCallCentreReviewGrid.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('ToEmployeeCode', this.getControlValue('ToEmployeeCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Function', 'CheckEmployee', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('ErrorMessage', MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            }
        }, 'POST', 6);
    }

    public onEmployeeSearchDataReceived(data: any, route: any): void {
        let selectedData = data;
        if (data.MyFilterEmployeeCode) {
            this.setControlValue('MyFilterEmployeeCode', data.MyFilterEmployeeCode || '');
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'MyFilterEmployeeCode', false);
        }
        if (data.EmployeeCode) {
            this.setControlValue('EmployeeCode', data.EmployeeCode || '');
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', false);
        }
        if (data.ToEmployeeCode) {
            this.setControlValue('ToEmployeeCode', data.ToEmployeeCode || '');
            this.setControlValue('ToEmployeeSurname', data.ToEmployeeSurname || '');
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ToEmployeeCode', false);
        }
    }

    public modalHiddenEmployeeSearch(route: any): void {
        switch (route) {
            case 'MyFilterEmployeeCode':
                if (!this.getControlValue('MyFilterEmployeeCode')) {
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'MyFilterEmployeeCode', true);
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'MyFilterEmployeeCode');
                }
                break;
            case 'EmployeeCode':
                if (!this.getControlValue('EmployeeCode')) {
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', true);
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'EmployeeCode');
                }
                break;
            case 'ToEmployeeCode':
                if (!this.getControlValue('ToEmployeeCode')) {
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'ToEmployeeCode');
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ToEmployeeCode', false);
                }
                break;
            default:
                break;
        }
    }

    /*##############################################################
   '# Other routines
   '##############################################################*/
    @HostListener('document:keydown', ['$event']) document_onkeydown(ev: any): void {
        switch (ev.keyCode) {
            case 13:
                if (this.getControlValue('MyContactType')
                    || this.getControlValue('MyFilterPassed')
                    || this.getControlValue('MyFilterLevel')
                    || this.getControlValue('MyFilterValue')
                    || this.getControlValue('DateForm')
                    || this.getControlValue('DateTo')) {
                    this.BuildGrid();
                    this.refresh();
                }
                break;
            case 34:
                if (this.getControlValue('TeamID')) {
                    this.riExchange.Mode = 'LookUp-Add';
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered));
                    // this.navigate(this.riExchange.Mode, '/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSTeamSearch.htm');
                }
                break;
            default:
                break;
        }
    };

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', '');
        }
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', '');
        }
    }

}
