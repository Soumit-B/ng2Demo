
import { URLSearchParams } from '@angular/http';
import { Component, Injector, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';

import { InternalMaintenanceModuleRoutes } from './../../base/PageRoutes';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { DropdownStaticComponent } from '../../../shared/components/dropdown-static/dropdownstatic';
import { SeasonalTemplateSearchComponent } from './../search/iCABSBSeasonalTemplateSearch';

@Component({
    templateUrl: 'iCABSASeasonalTemplateDetailGrid.html'
})

export class SeasonalTemplateDetailGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('seasonaltemplatedetailEllipsis') public seasonaltemplatedetailEllipsis: EllipsisComponent;
    @ViewChild('seasonaltemplatedetailPagination') seasonaltemplatedetailPagination: PaginationComponent;
    @ViewChild('seasonaltemplatedetailDropdown') seasonaltemplatedetailDropdown: DropdownStaticComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public pageId: string = '';
    public setFocusTemplateNumber = new EventEmitter<boolean>();
    public deleteRowId: any;
    public modalConfig: Object;
    public showHeader = true;
    public showCloseButton = true;
    public seasonalTemplateSearchComponent = SeasonalTemplateSearchComponent;
    public itemsPerPage: number = 10;
    public pageCurrent: number = 1;
    public totalRecords: number = 0;

    public ellipsisQueryParams: any = {
        inputParamsSeasonalTemplateNumber: {
            parentMode: 'LookUp-AllAccessSeasonal'
        }
    };

    public controls = [
        { name: 'SeasonalTemplateNumber', disabled: false, required: true },
        { name: 'TemplateName', disabled: true, required: false },
        { name: 'ShowType', value: 'Current' },
        { name: 'menu' },
        { name: 'DeleteRow' }
    ];

    public queryParams: any = {
        operation: 'Application/iCABSASeasonalTemplateDetailGrid',
        module: 'template',
        method: 'service-planning/maintenance'
    };

    public menuOptionSelect = [
        { text: 'Options', value: '' }
    ];


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASEASONALTEMPLATEDETAILGRID;
        this.browserTitle = this.pageTitle = 'Seasonal Template Seasons';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public window_onload(): void {

        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;

        this.parentMode = this.riExchange.getParentMode();
        this.formData = this.riExchange.getParentHTMLValues();
        switch (this.parentMode) {
            case 'SeasonalTemplate':
                this.formData.SeasonalTemplateNumber = this.riExchange.getParentAttributeValue('SeasonalTemplateNumber');
                this.formData.TemplateName = this.riExchange.getParentAttributeValue('TemplateName');
                this.seasonaltemplatedetailEllipsis.updateComponent();
                this.buildMenuOptions();
                break;
        }
        this.buildGrid();
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ActualSeasonNumber', 'TemplateSeason', 'ActualSeasonNumber', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('FromDate', 'TemplateSeason', 'FromDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('FromWeek', 'TemplateSeason', 'FromWeek', MntConst.eTypeDateText, 2);
        this.riGrid.AddColumn('ToDate', 'TemplateSeason', 'ToDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ToWeek', 'TemplateSeason', 'ToWeek', MntConst.eTypeDateText, 2);
        this.riGrid.AddColumn('DeleteRow', 'TemplateSeason', 'DeleteRow', MntConst.eTypeImage, 1);

        this.riGrid.AddColumnAlign('ActualSeasonNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('FromDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('FromWeek', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ToDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ToWeek', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('ActualSeasonNumber', true);
        this.riGrid.AddColumnOrderable('FromDate', true);
        this.riGrid.Complete();
    }

    public riGrid_BeforeExecute(): void {

        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('SeasonalTemplateNumber', this.getControlValue('SeasonalTemplateNumber'));
        search.set('ShowType', this.getControlValue('ShowType'));

        search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.GridCacheRefresh, 'true');

        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public buildMenuOptions(): void {

        if (this.getControlValue('SeasonalTemplateNumber') !== '') {
            this.menuOptionSelect = [
                { text: 'Options', value: '' },
                { text: 'Add Season', value: 'AddSeason' },
                { text: 'Duplicate Seasons', value: 'Duplicate' }
            ];
        } else {
            this.menuOptionSelect = [
                { text: 'Options', value: '' }
            ];
        }

    }

    public populateDescriptions(): void {

        let formdata: Object = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');
        formdata[this.serviceConstants.Function] = 'SetDisplayFields';
        formdata['SeasonalTemplateNumber'] = this.getControlValue('SeasonalTemplateNumber');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formdata)
            .subscribe(
            (res) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (res.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                    this.setControlValue('SeasonalTemplateNumber', '');
                    this.setControlValue('TemplateName', '');
                    this.setFocusTemplateNumber.emit(true);
                } else {
                    this.setControlValue('TemplateName', res.TemplateName);
                    this.buildMenuOptions();
                    this.riGrid.Clear();
                    this.totalRecords = 0;
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onMenuChange(data: any): void {
        switch (data) {
            case 'AddSeason':
                this.seasonaltemplatedetailDropdown.selectedItem = '';
                this.modalAdvService.emitMessage(new ICabsModalVO('Application/iCABSATemplateSeasonMaintenance ' + MessageConstant.Message.PageNotDeveloped));
                //to do
                // this.navigate('GridSeasonAdd', Application/iCABSATemplateSeasonMaintenance.htm, {
                //     SeasonalTemplateNumber: this.getControlValue('SeasonalTemplateNumber'),
                //     TemplateName: this.getControlValue('TemplateName'),
                //     AnualSeasonCode: this.riGrid.Details.GetValue('Annual Season Code'),
                // });
                break;
            case 'Duplicate':
                this.onDuplicate();
                break;
        }
    }

    public onDuplicate(): void {

        let formdata: Object = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');
        formdata[this.serviceConstants.Function] = 'DuplicateSeasons';
        formdata['SeasonalTemplateNumber'] = this.getControlValue('SeasonalTemplateNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formdata)
            .subscribe(
            (res) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (res.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                } else {
                    this.refresh();
                }
                this.seasonaltemplatedetailDropdown.selectedItem = '';
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public showTypeOnchange(data: any): void {
        this.setControlValue('ShowType', data);
    }

    public onSeasonalTemplateNumberReceived(data: any): void {
        this.setControlValue('SeasonalTemplateNumber', data.TemplateNumber);
        this.setControlValue('TemplateName', data.TemplateName);
        if (this.getControlValue('SeasonalTemplateNumber') === '') {
            this.setControlValue('TemplateName', '');
            this.buildMenuOptions();
        } else {
            this.populateDescriptions();
        }
    }


    public refresh(): void {
        this.riGrid.RefreshRequired();
        if (this.riExchange.validateForm(this.uiForm)) {
            this.riGrid_BeforeExecute();
            this.buildGrid();
            this.buildMenuOptions();
        }
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public getCurrentPage(data: any): void {
        this.pageCurrent = data.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public getGridOnDblClick(data: any): void {

        this.DetailFocus(data.srcElement);

        let columnName = this.riGrid.CurrentColumnName;
        let params: any = {
            SeasonalTemplateNumber: this.getControlValue('SeasonalTemplateNumber'),
            TemplateName: this.getControlValue('TemplateName'),
            AnualSeasonCode: this.riGrid.Details.GetValue('Annual Season Code'),
            FromDate: this.riGrid.Details.GetValue('From Date'),
            FromWeekYear: this.riGrid.Details.GetValue('From Week/Year'),
            ToDate: this.riGrid.Details.GetValue('To Date'),
            ToWeekYear: this.riGrid.Details.GetValue('To Week/Year')
        };
        this.deleteRowId = this.riGrid.Details.GetAttribute('DeleteRow', 'rowID');

        switch (columnName) {
            case 'ActualSeasonNumber':
                if (this.getAttribute('AllowUpdate')) {
                    this.riExchange.Mode = 'GridSeasonUpdate';
                } else {
                    this.riExchange.Mode = 'GridSeasonView';
                }
                this.modalAdvService.emitMessage(new ICabsModalVO('Application/iCABSATemplateSeasonMaintenance ' + MessageConstant.Message.PageNotDeveloped));
                //to do
                //this.navigate('GridSeasonAdd', Application/iCABSATemplateSeasonMaintenance.htm , params);
                break;
            case 'DeleteRow':
                this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.PageSpecificMessage.proceedMsg, null, this.confirmOk.bind(this)));
                break;
        }
    }

    public confirmOk(): void {

        let formdata: Object = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');
        formdata[this.serviceConstants.Function] = 'DeleteRecord';
        formdata['SeasonalTemplateDetailRowID'] = this.deleteRowId;
        formdata['SeasonalTemplateNumber'] = this.getControlValue('SeasonalTemplateNumber');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formdata)
            .subscribe(
            (res) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (res.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                } else {
                    this.refresh();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public riGrid_BodyOnClick(data: any): void {
        this.DetailFocus(data.srcElement);
    }

    public DetailFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        this.setAttribute('SeasonalTemplateDetailRowID', oTR.children[0].children[0].children[0].getAttribute('rowid'));
        this.setAttribute('AllowUpdate', oTR.children[0].children[0].children[0].getAttribute('additionalproperty'));
        oTR.focus();
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
