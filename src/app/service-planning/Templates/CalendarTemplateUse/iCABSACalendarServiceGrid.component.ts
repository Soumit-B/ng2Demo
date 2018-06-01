import { Params } from '@angular/router';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { GridAdvancedComponent } from '../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { URLSearchParams } from '@angular/http';
import { CalendarTemplateSearchComponent } from '../../../internal/search/iCABSBCalendarTemplateSearch.component';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../../shared/constants/message.constant';


@Component({
    templateUrl: 'iCABSACalendarServiceGrid.html'
})

export class CalendarServiceGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('grdcalendarservicePagination') grdcalendarservicePagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('CalendarTemplateSearchComponent') CalendarTemplateSearchComponent: EllipsisComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;


    public inputParams: any = {};
    public pageId: string = '';
    public pageTitle: string = '';
    public itemsPerPage: number = 10;
    public totalRecords: number = 0;
    public currentPageSize: number = 1;
    public maxColumn: number = 6;
    public search = new URLSearchParams();
    public errorMessage: string;
    public branchNumber: string;
    public gridSortHeaders: Array<any> = [];
    public showHeader: boolean = true;
    public headerClicked: string = '';
    public sortType: string = '';
    public showName: boolean = true;
    public isRequesting: boolean = false;


    //  queryParams
    public queryParams: any = {
        method: 'service-planning/maintenance',
        operation: 'Application/iCABSACalendarServiceGrid',
        module: 'template'
    };

    public controls = [
        { name: 'BranchNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'AnnualCalendarTemplateNumber', readonly: true, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'TemplateName', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'ShowType', readonly: true, disabled: false, required: false },
        { name: 'PortfolioStatus', readonly: true, disabled: false, required: false },
        // hidden input fields
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: false }
    ];

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Calendar Template Use';
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.buildGrid();
            this.riGrid_BeforeExecute();

        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACALENDARSERVICEGRID;
        this.browserTitle = 'Annual Template Use';
        this.search = this.getURLSearchParamObject();
    }

    //ellipsis component
    public calendartemplatesearchcomponent = CalendarTemplateSearchComponent;
    public ellipsis = {
        calendartemplatesearch: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            component: CalendarTemplateSearchComponent,
            childConfigParams: {
                parentMode: 'LookUp-AllAccessCalendar'
            }
        }
    };
    public oncalendartemplatesearchReceived(data: any): void {
        this.setControlValue('AnnualCalendarTemplateNumber', data.AnnualCalendarTemplateNumber);
        this.setControlValue('TemplateName', data.TemplateName);
    }

    public window_onload(): void {
        this.riGrid.HighlightBar = true;
        //this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.FunctionPaging = true;
        this.setControlValue('ShowType', 'All');
        this.setControlValue('PortfolioStatus', 'Current');
        if (this.parentMode === 'CalendarTemplate') {
            this.setControlValue('BranchNumber', this.utils.getBranchCode());
            this.lookupBranchName();
            this.setControlValue('AnnualCalendarTemplateNumber', this.riExchange.getParentHTMLValue('AnnualCalendarTemplateNumber'));
            this.setControlValue('TemplateName', this.riExchange.getParentHTMLValue('TemplateName'));
            this.setControlValue('PortfolioStatus', 'Current');
            this.ellipsis.calendartemplatesearch.disabled = true;
            this.showName = false;
            this.buildGrid();

        }
    }
    public lookupBranchName(): any {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.utils.getBranchCode()
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Branch = data[0][0];
            if (Branch) {
                this.setControlValue('BranchName', Branch.BranchName);
            };
        });
    }
    public TemplateNumberOnKeyDown(data: any): void {
        this.totalRecords = 0;

        if (this.getControlValue('AnnualCalendarTemplateNumber') === '') {
            this.setControlValue('TemplateName', '');
        }
        if (this.uiForm.controls['AnnualCalendarTemplateNumber'].invalid) {
            this.setControlValue('TemplateName', this.getControlValue('TemplateName'));
            this.riGrid.Clear();
        }
        else if (parseInt(this.getControlValue('AnnualCalendarTemplateNumber'), 10)) {
            this.riGrid.Clear();
            this.selectChange();
        }
    }
    public ShowHideField(ipField: any, ipVisible: any): void {
        if (ipVisible) {
            ipField.style.display = '';
        }
        else {
            ipField.style.display = 'none';
        }

    }
    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ContractNumber', 'CalendarService', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumn('ContractName', 'CalendarService', 'ContractName', MntConst.eTypeText, 8);
        this.riGrid.AddColumn('PremiseNumber', 'CalendarService', 'PremiseNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('PremiseName', 'CalendarService', 'PremiseName', MntConst.eTypeText, 8);
        this.riGrid.AddColumn('ProductCode', 'CalendarService', 'ProductCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'CalendarService', 'UsedForClosed', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.Complete();
    }
    //set parameters

    public riGrid_BeforeExecute(): void {
        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());


        //set parameters
        gridParams.set('BranchNumber', this.utils.getBranchCode());
        gridParams.set('AnnualCalendarTemplateNumber', this.getControlValue('AnnualCalendarTemplateNumber'));
        gridParams.set('ShowType', 'template');
        gridParams.set('ViewType', 'template');
        gridParams.set('PortfolioStatus', this.getControlValue('PortfolioStatus'));

        gridParams.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.currentPageSize.toString());
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '1706068');
        gridParams.set(this.serviceConstants.GridCacheRefresh, 'true');
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        gridParams.set('riSortOrder', sortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.messageModal.show(data, true);
                }
                else {
                    this.currentPageSize = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                    //this.riGrid.Update = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.Execute(data);
                }
                this.isRequesting = false;
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }


    public getCurrentPage(currentPage: any): void {
        this.currentPageSize = currentPage.value;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.riGrid_BeforeExecute();
            this.buildGrid();

        }
        else {
            this.riGrid.Clear();
        }
    }
    public riGrid_Sort(event: any): void {
        this.riGrid_BeforeExecute();
    }
    //On click
    public riGrid_BodyOnlClick(data: any): void {
        this.DetailFocus(event.srcElement);
    }
    public bodyOnClick(data: any): void {
        this.DetailFocus(data);
    }
    public DetailFocus(rsrcElement: any): void {
        let oTR: any;
        oTR = rsrcElement.parentElement.parentElement.parentElement;
        rsrcElement.focus();
        if (this.riGrid.CurrentColumnName === 'BranchNumber') rsrcElement.select();
        let obj1 = {
            'ContractRowID': oTR.children[0].children[0].getAttribute('RowID'),
            'PremiseRowID': oTR.children[2].children[0].getAttribute('RowID'),
            'ServiceCoverRowID': oTR.children[4].children[0].getAttribute('RowID')
        };
        if (this.riGrid.CurrentColumnName === 'ContractNumber') rsrcElement.select();
        let obj2 = {
            'ServiceCoverRowID': oTR.children[4].children[0].getAttribute('RowID')

        };
    }

    // Double click
    public riGrid_BodyonDblClick(event: any): void {
        this.DetailFocus(event.srcElement);
        let params: any = {
            ContractNumber: this.riGrid.Details.GetValue('ContractNumber'),
            PremiseNumber: this.riGrid.Details.GetValue('PremiseNumber'),
            ServiceCoverRowID: this.riGrid.Details.GetAttribute('ProductCode', 'rowID')
        };
        let currentcellName = this.riGrid.CurrentColumnName;
        switch (currentcellName) {
            case 'ContractNumber':
                this.navigate('LoadByKeyFields', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, params);
                break;
            case 'PremiseNumber':
                this.navigate('LoadByKeyFields', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, params);
                break;
            case 'ProductCode':
                this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, params);
                break;
        }
    }


    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }
    // post URL
    public selectChange(): void {
        this.search = new URLSearchParams();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        formdata['BusinessCode'] = this.businessCode();
        formdata['Function'] = 'SetDisplayFields';
        if (this.getControlValue('AnnualCalendarTemplateNumber') !== '') {
            formdata['AnnualCalendarTemplateNumber'] = this.getControlValue('AnnualCalendarTemplateNumber');
        }
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (res) => {
                if (res.errorMessage) {
                    this.riGrid.Clear();
                    this.errorModal.show({ msg: res.errorMessage, title: MessageConstant.Message.ErrorTitle }, false);
                }
                else {
                    this.setControlValue('TemplateName', res.TemplateName);
                    this.riGrid.Clear();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
    public riGrid_BodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.DetailFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.DetailFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
        }
    }
}
