import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from './../../../base/BaseComponent';
import { MessageCallback, ErrorCallback } from './../../../base/Callback';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { CCMModuleRoutes, AppModuleRoutes, InternalGridSearchApplicationModuleRoutes } from './../../../base/PageRoutes';
import { GridComponent } from '../../../../shared/components/grid/grid';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ErrorConstant } from './../../../../shared/constants/error.constant';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import { AccountSearchComponent } from './../../../internal/search/iCABSASAccountSearch';
import { BranchSearchComponent } from './../../../internal/search/iCABSBBranchSearch';
import { DatepickerComponent } from '../../../../shared/components/datepicker/datepicker';
import { DropdownStaticComponent } from './../../../../shared/components/dropdown-static/dropdownstatic';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMCallAnalysisGrid.html',
    styles: [`
    :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(2) {
        width: 25%;
    }
    :host /deep/ .gridtable tbody tr:last-child td:nth-child(3) div span,
    :host /deep/ .gridtable tbody tr:last-child td:nth-child(4) div span,
    :host /deep/ .gridtable tbody tr:last-child td:nth-child(5) div span,
    :host /deep/ .gridtable tbody tr:last-child td:nth-child(6) div span,
    :host /deep/ .gridtable tbody tr:last-child td:nth-child(7) div span,
    :host /deep/ .gridtable tbody tr:last-child td:nth-child(8) div span {
        background: #FFF;
        border-radius: 2px;
        border: 1px solid #999;
        box-shadow: inset 0 1px 1px rgba(0,0,0,0.05);
        font-family: "Open Sans",sans-serif;
        font-weight: normal;
        font-size: 1em;
        padding: 0 0.5em;
        color: #000;
        line-height: 26px;
        text-align: center;
        padding: 0 7px;
        display: block;
    }
    :host /deep/ .gridtable input {
        pointer-events: none;
    }
  `]
})

export class CMCallAnalysisGridComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy, MessageCallback, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('callAnalysisGrid') callAnalysisGrid: GridComponent;
    @ViewChild('callAnalysisPagination') callAnalysisPagination: PaginationComponent;
    @ViewChild('branchDropdown') branchDropdown: DropdownStaticComponent;
    @ViewChild('viewByDropdown') viewByDropdown: DropdownStaticComponent;
    @ViewChild('contactTypeDropdown') contactTypeDropdown: DropdownStaticComponent;
    @ViewChild('contactDetailDropdown') contactDetailDropdown: DropdownStaticComponent;
    @ViewChild('fromDate') fromDatePicker: DatepickerComponent;
    @ViewChild('toDate') toDatePicker: DatepickerComponent;

    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public queryPost: URLSearchParams = this.getURLSearchParamObject();
    public errorMessage: string;
    public messageContentError: string = ErrorConstant.Message.RecordNotFound;
    public autoOpen: boolean = false;
    public gridSortHeaders: Array<any>;
    public contactTypeCodesList: Array<Object> = [];
    public contactTypeDetailCodesList: Array<Object> = [];
    public viewBySelected: string = '';
    public viewBySelectedLabel: string = '';
    public inputParamsBranch: any = {};
    public todayDate: Date = new Date();
    public fromDateValue: Date = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
    public toDateValue: Date = new Date();
    public isGridRefreshClicked: boolean = false;
    public branchSelected: Object = {
        id: '',
        text: ''
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public controls = [
        { name: 'ViewBy', disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'ViewByValue', disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ViewByValueDesc', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContactType', disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ContactTypeDetail', disabled: false, required: false },
        { name: 'ContactStatusCode', disabled: false, required: false },
        { name: 'ContactStatus', disabled: false, required: false },
        { name: 'chkIncludeInactive', disabled: false, required: false },
        { name: 'FromDate', disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'ToDate', disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'fromDateValue', disabled: false, required: false },
        { name: 'toDateValue', disabled: false, required: false },
        { name: 'IncludeInactive', disabled: false, required: true },
        // Hidden Fields
        { name: 'BusinessCode', disabled: false, required: false },
        { name: 'AccountNumber', disabled: false, required: false },
        { name: 'ThisLevel', disabled: false, required: false },
        { name: 'PassLevel', disabled: false, required: false },
        { name: 'PassContactStatusCode', disabled: false, required: false },
        { name: 'PassViewBy', disabled: false, required: false },
        { name: 'PassViewByValue', disabled: false, required: false },
        { name: 'PassViewByValueDesc', disabled: false, required: false },
        { name: 'PassContactType', disabled: false, required: false },
        { name: 'PassContactTypeDetail', disabled: false, required: false },
        { name: 'PassGroupCode', disabled: false, required: false },
        { name: 'PassGroupName', disabled: false, required: false },
        { name: 'PassFromDate', disabled: false, required: false },
        { name: 'PassToDate', disabled: false, required: false },
        { name: 'GroupCode', disabled: false, required: false },
        { name: 'GroupName', disabled: false, required: false },
        { name: 'BranchNumber', disabled: false, required: false },
        { name: 'BranchName', disabled: false, required: false }
    ];

    public muleConfig = {
        method: 'ccm/maintenance',
        module: 'tickets',
        operation: 'ContactManagement/iCABSCMCallAnalysisGrid'
    };
    public gridParams: any = {
        totalRecords: 0,
        maxColumn: 8,
        itemsPerPage: 10,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 1771322,
        riSortOrder: 'Descending'
    };

    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeText,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 5,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 7,
            'align': 'center'
        }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLANALYSISGRID;
        this.pageTitle = this.browserTitle = 'Contact Management - Call Analysis';
    };

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    };

    ngOnDestroy(): void {
        super.ngOnDestroy();
    };

    public ngAfterViewInit(): void {
        this.setErrorCallback(this);
        this.setMessageCallback(this);

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.fromDateValue = this.getControlValue('FromDate');
            this.toDateValue = this.getControlValue('ToDate');
            if (this.getControlValue('IncludeInactive') === 'True') {
                this.setControlValue('chkIncludeInactive', true);
            } else {
                this.setControlValue('chkIncludeInactive', false);
            }
            if (this.getControlValue('ViewBy') === 'branch')
                this.branchSelected = {
                    id: this.getControlValue('ViewByValue'),
                    text: this.getControlValue('ViewByValue') + ' - ' + this.getControlValue('ViewByValueDesc')
                };
            this.refreshGrid();
            return;
        }
    };

    public datePickerSelectedValue(data: any, handle: string): void {
        switch (handle) {
            case 'FromDate':
                this.setControlValue('FromDate', data.value);
                this.fromDatePicker.validateDateField();
                break;
            case 'ToDate':
                this.setControlValue('ToDate', data.value);
                this.toDatePicker.validateDateField();
                break;
        }
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    private window_onload(): void {
        this.viewBySelected = 'employee';
        this.viewBySelectedLabel = this.viewBySelected.charAt(0).toUpperCase() + this.viewBySelected.slice(1) + ' Search';
        this.setControlValue('ThisLevel', 'CallAnalysis');
        this.setControlValue('IncludeInactive', 'True');
        this.setControlValue('chkIncludeInactive', true);
        this.setControlValue('ContactStatus', 'all');
        this.setControlValue('ContactType', 'all');
        this.setControlValue('ContactTypeDetail', 'all');

        // TODO - AnnualValue not working because of Newline Char in Field Name
        this.gridSortHeaders = [{
            'fieldName': 'ContractNumber',
            'colName': 'Contract Number',
            'sortType': 'ASC'
        }, {
            'fieldName': 'PremiseNumber',
            'colName': 'Premises Number',
            'sortType': 'ASC'
        }, {
            'fieldName': 'PremisePostcode',
            'colName': 'Postcode',
            'sortType': 'ASC'
        }, {
            'fieldName': 'ServiceBranch',
            'colName': 'Serving Branch',
            'sortType': 'ASC'
        }, {
            'fieldName': 'AnnualValue',
            'colName': 'Annual Value at Effective Date',
            'sortType': 'ASC'
        }];
        this.getContactTypeCodes();
    };

    public ellipsisConfig = {
        employee: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'CallCentreAnalysis'
            },
            modalConfig: this.modalConfig,
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        account: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'CallCentreAnalysis',
                'showAddNewDisplay': false,
                'showBusinessCode': false,
                'showCountryCode': false
            },
            modalConfig: this.modalConfig,
            contentComponent: AccountSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        branch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'CallCentreAnalysis'
            },
            modalConfig: this.modalConfig,
            contentComponent: BranchSearchComponent, // Need to confirm
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        region: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'CallCentreAnalysis',
                'showAddNew': false
            },
            modalConfig: this.modalConfig,
            contentComponent: ScreenNotReadyComponent, // TODO
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        team: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'CallCentreAnalysis',
                'showAddNew': false
            },
            modalConfig: this.modalConfig,
            contentComponent: ScreenNotReadyComponent, // TODO
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    public setViewBy(data: any): void {
        this.setControlValue('ViewByValue', '');
        this.setControlValue('ViewByValueDesc', '');
        this.viewBySelected = data;
        this.viewBySelectedLabel = this.viewBySelected.charAt(0).toUpperCase() + this.viewBySelected.slice(1) + ' Search';
    }

    // Callback for Contract Ellipsis
    public onEllipsisDataReceived(data: any, handle: any): void {
        switch (handle) {
            case 'employee':
                this.setControlValue('ViewByValue', data.EmployeeCode);
                this.setControlValue('ViewByValueDesc', data.EmployeeSurName);
                break;
            case 'account':
                this.setControlValue('ViewByValue', data.AccountNumber);
                this.setControlValue('ViewByValueDesc', data.AccountName);
                break;
            /*case 'region': // TODO
                this.setControlValue('ViewByValue', data.ViewByValue);
                this.setControlValue('ViewByValueDesc', data.ViewByValueDesc);
                break;*/
            /*case 'team': // TODO
                this.setControlValue('ViewByValue', data.ViewByValue);
                this.setControlValue('ViewByValueDesc', data.ViewByValueDesc);
                break;*/
        }
    };

    public onBranchDataReceived(data: any): void {
        this.setControlValue('ViewByValue', data.BranchNumber);
        this.setControlValue('ViewByValueDesc', data.BranchName);
        this.buildGrid();
    }

    public refreshGrid(): void {
        this.isGridRefreshClicked = true;
        this.buildGrid();
    }

    public buildGrid(): void {
        if (this.isGridRefreshClicked && this.riExchange.validateForm(this.uiForm)) {
            let gridURLParams: URLSearchParams,
                gridInputParams;
            gridURLParams = this.getURLSearchParamObject();
            gridURLParams.set('Level', this.getControlValue('ThisLevel'));
            gridURLParams.set('FromDate', this.getControlValue('FromDate'));
            gridURLParams.set('ToDate', this.getControlValue('ToDate'));
            gridURLParams.set('ViewBy', this.getControlValue('ViewBy'));
            gridURLParams.set('ViewByValue', this.getControlValue('ViewByValue'));
            gridURLParams.set('ContactStatus', this.getControlValue('ContactStatus'));
            gridURLParams.set('ContactType', this.getControlValue('ContactType'));
            gridURLParams.set('ContactTypeDetail', this.getControlValue('ContactTypeDetail'));
            gridURLParams.set('IncludeInactive', this.getControlValue('IncludeInactive'));
            gridURLParams.set('HeaderClickedColumn', '');
            gridURLParams.set('riCacheRefresh', 'True');
            gridURLParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
            gridURLParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
            gridURLParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
            gridURLParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
            gridURLParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
            gridURLParams.set(this.serviceConstants.Action, '2');

            gridInputParams = this.muleConfig;
            gridInputParams['search'] = gridURLParams;
            this.callAnalysisGrid.update = true;

            this.callAnalysisGrid.loadGridData(gridInputParams);
        } else {
            this.callAnalysisGrid.clearGridData();
        }
    };

    public viewByValueTabout(data: any): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            IncludeInactive: this.getControlValue('IncludeInactive'),
            ViewBy: this.getControlValue('ViewBy'),
            ViewByValue: this.getControlValue('ViewByValue'),
            Function: 'GetViewByValueDesc'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.setControlValue('ViewByValue', '');
                    this.setControlValue('ViewByValueDesc', '');
                    this.showErrorModal(data);
                } else {
                    this.setControlValue('ViewByValueDesc', data.ViewByValueDesc);
                    this.buildGrid();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    // Get Contact Types
    private getContactTypeCodes(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            IncludeInactive: this.getControlValue('IncludeInactive'),
            Function: 'GetContactTypeCodes'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else {
                    let contactTypeCodes = data.ContactTypeCodes.split('\n'),
                        contactTypeDescs = data.ContactTypeDescs.split('\n');
                    for (let i = 0; i < contactTypeCodes.length; i++) {
                        this.contactTypeCodesList.push({
                            value: contactTypeCodes[i],
                            text: contactTypeDescs[i]
                        });
                    }
                    if (this.isReturning()) {
                        this.contactTypeDropdown.selectedItem = this.getControlValue('ContactType');
                        this.onContactTypeSelect(this.getControlValue('ContactType'));
                    } else {
                        this.contactTypeDropdown.selectedItem = 'all';
                        this.onContactTypeSelect('all');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    public onContactTypeSelect(data: any): void {
        this.setControlValue('ContactType', data);
        this.getContactTypeDetailCodes();
        this.buildGrid();
    };

    // Get Contact Type Detail Codes based on Contact Types
    private getContactTypeDetailCodes(): void {
        this.contactTypeDetailCodesList = [];
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            IncludeInactive: this.getControlValue('IncludeInactive'),
            ContactType: this.getControlValue('ContactType'),
            Function: 'GetContactTypeDetailCodes'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else {
                    let contactTypeDetailCodes = data.ContactTypeDetailCodes.split('\n'),
                        contactTypeDetailDescs = data.ContactTypeDetailDescs.split('\n');
                    for (let i = 0; i < contactTypeDetailCodes.length; i++) {
                        this.contactTypeDetailCodesList.push({
                            value: contactTypeDetailCodes[i],
                            text: contactTypeDetailDescs[i]
                        });
                    }
                    if (this.isReturning())
                        this.contactDetailDropdown.selectedItem = this.getControlValue('ContactTypeDetail');
                    else
                        this.contactDetailDropdown.selectedItem = 'all';
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    public onContactTypeDetailSelect(data: any): void {
        this.setControlValue('ContactTypeDetail', data);
        this.buildGrid();
    }

    public onChangeIncludeInactive(): void {
        if (this.getControlValue('chkIncludeInactive')) {
            this.setControlValue('IncludeInactive', 'True');
        } else {
            this.setControlValue('IncludeInactive', 'False');
        }
        this.getContactTypeCodes();
    }

    public onGridColumnDbClick(col: any): void {
        this.setControlValue('PassFromDate', this.getControlValue('FromDate'));
        this.setControlValue('PassToDate', this.getControlValue('ToDate'));
        this.setControlValue('PassContactType', this.getControlValue('ContactType'));
        this.setControlValue('PassContactTypeDetail', this.getControlValue('ContactTypeDetail'));
        this.setControlValue('PassViewBy', this.getControlValue('ViewBy'));
        this.setControlValue('PassViewByValue', col.trRowData[0].text);
        this.setControlValue('PassViewByValueDesc', col.trRowData[1].text);
        this.setControlValue('PassContactStatusCode', '');
        this.setControlValue('PassIncludeInactive', this.getControlValue('IncludeInactive'));
        this.setControlValue('PassLevel', this.getControlValue('ThisLevel'));

        switch (col.cellIndex) {
            case 0:
                if (this.getControlValue('ViewBy') === 'region' && this.getControlValue('ThisLevel') !== 'BranchInRegion') {
                    this.setControlValue('PassLevel', 'BranchInRegion');
                    this.setControlValue('PassViewBy', 'region');
                    this.viewBySelected = this.getControlValue('PassViewBy');
                    this.setControlValue('ThisLevel', 'BranchInRegion');
                    this.setControlValue('ViewBy', this.getControlValue('PassViewBy'));
                    this.setControlValue('ViewByValue', this.getControlValue('PassViewByValue'));
                    this.setControlValue('ViewByValueDesc', this.getControlValue('PassViewByValueDesc'));
                    this.setControlValue('ContactType', this.getControlValue('PassContactType'));
                    this.setControlValue('ContactTypeDetail', this.getControlValue('PassContactTypeDetail'));
                    this.setControlValue('FromDate', this.getControlValue('PassFromDate'));
                    this.setControlValue('ToDate', this.getControlValue('PassToDate'));

                    if (this.getControlValue('ContactTypeDetail') === '') {
                        this.onContactTypeSelect('ALL');
                        this.setControlValue('ContactTypeDetail', this.getControlValue('PassContactTypeDetail'));
                        this.contactDetailDropdown.selectedItem = this.getControlValue('PassContactTypeDetail');
                    }
                    this.buildGrid();
                } else {
                    this.navigate('AnalysisDetail', InternalGridSearchApplicationModuleRoutes.ICABSCMCALLANALYSISTICKETGRID, {
                        'PassContactStatusCode': this.setControlValue('PassContactStatusCode', 'all')
                    });
                }
                break;
            case 2:
                this.setControlValue('PassContactStatusCode', 'all');
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                // TODO: iCABSCMCallAnalysisCallGrid not yet developed
                // this.navigate('AnalysisDetailTotal', 'ContactManagement/iCABSCMCallAnalysisCallGrid.htm');
                break;
            case 3:
                this.setControlValue('PassContactStatusCode', 'all');
                this.navigate('AnalysisDetailTotal', InternalGridSearchApplicationModuleRoutes.ICABSCMCALLANALYSISTICKETGRID);
                break;
            case 4:
                this.setControlValue('PassContactStatusCode', 'hardwiredopen');
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                // TODO: iCABSCMCallAnalysisCallGrid not yet developed
                // this.navigate('AnalysisDetailOpen', 'ContactManagement/iCABSCMCallAnalysisCallGrid.htm');
                break;
            case 5:
                this.setControlValue('PassContactStatusCode', 'hardwiredclosed');
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                // TODO: iCABSCMCallAnalysisCallGrid not yet developed
                // this.navigate('AnalysisDetailClosed', 'ContactManagement/iCABSCMCallAnalysisCallGrid.htm');
                break;
            case 6:
                this.setControlValue('PassContactStatusCode', 'hardwiredopen');
                this.navigate('AnalysisDetailOpen', InternalGridSearchApplicationModuleRoutes.ICABSCMCALLANALYSISTICKETGRID);
                break;
            case 7:
                this.setControlValue('PassContactStatusCode', 'hardwiredclosed');
                this.navigate('AnalysisDetailClosed', InternalGridSearchApplicationModuleRoutes.ICABSCMCALLANALYSISTICKETGRID);
                break;
        };
    };

    public getGridInfo(info: any): void {
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    };

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.buildGrid();
    };
}
