import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ProspectToContractModuleRoutes, AppModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSCMWorkOrderGrid.html'
})

export class WorkOrderGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('workOrderPagination') workOrderPagination: PaginationComponent;
    @ViewChild('menuSelectDropdown') menuSelectDropdown: DropdownStaticComponent;

    public pageId: string = '';
    public isHidePagination: boolean = true;
    public controls = [
        { name: 'ProspectNumber' },
        { name: 'ProspectName' },
        { name: 'ProspectNotes' },
        { name: 'DiaryProspectNumber' },
        { name: 'PassEmployeeCode' },
        { name: 'PassEmployeeName' },
        { name: 'HighlightWONumber' },
        { name: 'PassWONumber' },
        { name: 'PassDiaryDate' },
        { name: 'PassDiaryStartTime' },
        { name: 'PassDiaryEndTime' }
    ];

    public queryParams: any = {
        method: 'ccm/maintenance',
        module: 'work-order',
        operation: 'ContactManagement/iCABSCMWorkOrderGrid'
    };

    public menuOptions: Array<any> = [
        { text: 'Options', value: 'Options' },
        { text: 'Add WorkOrder', value: 'AddWO' },
        { text: 'Diary', value: 'Diary' }
    ];

    public search: URLSearchParams = new URLSearchParams();
    public gridParams: any = {
        totalRecords: 0,
        pageCurrent: 1,
        itemsPerPage: 10,
        riGridMode: 0
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMWORKORDERGRID;
        this.pageTitle = this.browserTitle = 'Work Orders';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.buildGrid();
        }
        else
            this.windowOnLoad();
    }

    ngAfterViewInit(): void {
        this.menuSelectDropdown.selectedItem = 'Options';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnLoad(): void {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.FunctionPaging = true;

        if (this.parentMode === 'ProspectEntry') {
            this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
            this.setControlValue('DiaryProspectNumber', this.getControlValue('ProspectNumber'));
            this.setControlValue('PassEmployeeCode', this.riExchange.getParentHTMLValue('AssignToEmployeeCode'));
            this.setControlValue('PassEmployeeName', this.riExchange.getParentHTMLValue('AssignToEmployeeName'));
        }

        if (this.parentMode === 'PipelineGrid') {
            this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('PassProspectNumber'));
        }

        if ((this.parentMode === 'PipelineQuoteGrid') || (this.parentMode === 'WorkOrderMaintenance')) {
            this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
        }

        if (this.parentMode === 'DiaryAmendAppointment') {
            this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('PassProspectNumber'));
            this.setControlValue('HighlightWONumber', this.riExchange.getParentHTMLValue('PassWONumber'));
        }
        if ((this.parentMode === 'PipelineGrid') || (this.parentMode === 'PipelineQuoteGrid') || (this.parentMode === 'WorkOrderMaintenance') || (this.parentMode === 'DiaryAmendAppointment')) {
            this.setControlValue('DiaryProspectNumber', this.getControlValue('ProspectNumber'));
            this.setControlValue('PassEmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
            this.setControlValue('PassEmployeeName', this.riExchange.getParentHTMLValue('EmployeeSurname'));
        }
        this.getProspectName();
        this.buildGrid();
    }

    public getProspectName(): void {
        this.ajaxSource.next(this.ajaxconstant.START);

        let postSearchParams: URLSearchParams = new URLSearchParams();
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        postSearchParams.set(this.serviceConstants.Action, '6');

        let postParams: Object = {};
        postParams['Function'] = 'GetProspectDetails';
        postParams['ProspectNumber'] = this.getControlValue('ProspectNumber');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (res) => {
                if (res.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage));
                else {
                    this.setControlValue('ProspectName', res.ProspectName);
                    this.setControlValue('ProspectNotes', res.ProspectNotes);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('grWONumber', 'WorkOrder', 'grWONumber', MntConst.eTypeInteger, 8);
        this.riGrid.AddColumn('grWOTypeCode', 'WorkOrder', 'grWOTypeCode', MntConst.eTypeText, 5);
        this.riGrid.AddColumn('grWODate', 'WorkOrder', 'grWODate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('grWOStartTime', 'WorkOrder', 'grWOStartTime', MntConst.eTypeText, 5);
        this.riGrid.AddColumn('grWOEndTime', 'WorkOrder', 'grWOEndTime', MntConst.eTypeText, 5);
        this.riGrid.AddColumn('grWOStatusCode', 'WorkOrder', 'grWOStatusCode', MntConst.eTypeText, 5);
        this.riGrid.AddColumn('grWOResolvedInfo', 'WorkOrder', 'grWOResolvedInfo', MntConst.eTypeTextFree, 10);

        this.riGrid.AddColumnAlign('grWONumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('grWODate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('grWOStartTime', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('grWOEndTime', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('grWONumber', true);
        this.riGrid.AddColumnOrderable('grWOTypeCode', true);
        this.riGrid.AddColumnOrderable('grWODate', true);
        this.riGrid.AddColumnOrderable('grWOStatusCode', true);

        this.riGrid.Complete();

        this.loadGridData();
    }

    public loadGridData(): void {

        //this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        this.search.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.gridParams.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.search.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.queryParams.search = this.search;

        let postParams: Object = {};

        postParams['HighlightWONumber'] = this.getControlValue('HighlightWONumber');
        postParams['ProspectNumber'] = this.getControlValue('ProspectNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search, postParams)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                else {
                    this.gridParams.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    //this.riGrid.Update = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateFooter = true;
                    this.isRequesting = true;
                    this.riGrid.Execute(data);
                    if (data.pageData && (data.pageData.lastPageNumber * 10) > 0)
                        this.isHidePagination = false;
                    else
                        this.isHidePagination = true;
                }
                this.isRequesting = false;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.gridParams.totalRecords = 1;
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getCurrentPage(currentPage: any): void {
        this.gridParams.pageCurrent = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.gridParams.pageCurrent));
        this.buildGrid();
    }

    public riGrid_Sort(event: any): void {
        this.loadGridData();
    }

    public refresh(): void {
        this.gridParams.pageCurrent = 1;
        this.buildGrid();
    }

    public onGridRowClick(event: Event): void {
        this.setControlValue('PassWONumber', this.riGrid.Details.GetValue('grWONumber'));
        if (this.riGrid.CurrentColumnName === 'grWONumber') {
            this.navigate('WorkOrderGrid', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                PassWONumber: this.getControlValue('PassWONumber')
            });
        }
    }

    public menuOnChange(selectedoption: any): void {
        switch (selectedoption) {
            case 'AddWO':
                this.optionAddWOpostcall();
                break;
            case 'Diary':
                this.setControlValue('DiaryProspectnumber', this.getControlValue('ProspectNumber'));
                this.navigate('', AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMDIARYMAINTENANCE);
                break;
        }
        setTimeout(() => {
            this.menuSelectDropdown.selectedItem = 'Options';
        }, 0);
    }

    public optionAddWOpostcall(): void {
        this.ajaxSource.next(this.ajaxconstant.START);

        let postSearchParams: URLSearchParams = new URLSearchParams();
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        postSearchParams.set(this.serviceConstants.Action, '6');

        let postParams: Object = {};
        postParams['Function'] = 'CheckOpenWOS';
        postParams['ProspectNumber'] = this.getControlValue('ProspectNumber');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (res) => {
                if (res.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage));
                else {
                    if (res.OpenWOS === 'YES') {
                        this.modalAdvService.emitError(new ICabsModalVO(res.OpenWOSError));
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        return;
                    }
                    this.setControlValue('PassDiaryDate', new Date());
                    this.setControlValue('PassDiaryStartTime', '09:00');
                    this.setControlValue('PassDiaryEndTime', '10:00');
                    this.navigate('WorkOrderGridAdd', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                        PassDiaryStartTime: this.getControlValue('PassDiaryStartTime'),
                        PassDiaryEndTime: this.getControlValue('PassDiaryEndTime'),
                        PassDiaryDate: this.globalize.parseDateToFixedFormat(new Date()),
                        PassEmployeeCode: this.getControlValue('PassEmployeeCode'),
                        PassEmployeeName: this.getControlValue('PassEmployeeName'),
                        DiaryProspectNumber: this.getControlValue('DiaryProspectNumber')
                    });
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

}
