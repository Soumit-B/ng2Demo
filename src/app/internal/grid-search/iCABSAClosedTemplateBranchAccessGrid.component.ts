import { Event } from '@angular/router';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { ClosedTemplateSearchComponent } from '../../internal/search/iCABSBClosedTemplateSearch.component';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSAClosedTemplateBranchAccessGrid.html'
})

export class ClosedTemplateBranchAccessGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('grdclosedtemplatePagination') grdclosedtemplatePagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('ClosedTemplateSearchComponent') ClosedTemplateSearchComponent: EllipsisComponent;
    private queryParams: Object = {
        operation: 'Application/iCABSAClosedTemplateBranchAccessGrid',
        module: 'template',
        method: 'service-planning/maintenance'
    };
    public inputParams: Object = {};
    public pageId: string = '';
    public pageTitle: string;
    public pageSize: number = 16;
    public itemsPerPage: number = 10;
    public totalRecords: number = 0;
    public pageCurrent: number = 1;
    public search: URLSearchParams;
    public isHidePagination: boolean = true;
    public controls: Array<Object> = [
        { name: 'ClosedCalendarTemplateNumber', required: true, type: MntConst.eTypeInteger },
        { name: 'TemplateName', disabled: true, type: MntConst.eTypeText },
        { name: 'OwnerBranchNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'BranchName', disabled: true, type: MntConst.eTypeText }
    ];
    //ellipsis component
    public ellipsis = {
        closedtemplatesearch: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            component: ClosedTemplateSearchComponent,
            childConfigParams: {
                parentMode: 'LookUp-AllAccessCalendar',
                showAddNew: true
            }
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACLOSEDTEMPLATEBRANCHACCESSGRID;
        this.browserTitle = this.pageTitle = 'Branch Closed Template';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.search = this.getURLSearchParamObject();
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        if (this.parentMode === 'CalendarTemplate') {
            this.setControlValue('BranchNumber', this.utils.getBranchCode());
            this.setControlValue('ClosedCalendarTemplateNumber', this.riExchange.getParentHTMLValue('ClosedCalendarTemplateNumber'));
            this.disableControl('ClosedCalendarTemplateNumber', true);
            this.setControlValue('TemplateName', this.riExchange.getParentHTMLValue('TemplateName'));
            this.setControlValue('OwnerBranchNumber', this.riExchange.getParentHTMLValue('OwnerBranchNumber'));
            this.setControlValue('BranchName', this.riExchange.getParentHTMLValue('BranchName'));
            this.lookupBranchName();
            this.ellipsis.closedtemplatesearch.disabled = true;
            this.buildGrid();
        }
    }

    //Getting fields value
    private selectChange(): void {
        let formdata: Object = {};
        this.inputParams['module'] = this.queryParams['module'];
        this.inputParams['method'] = this.queryParams['method'];
        this.inputParams['operation'] = this.queryParams['operation'];
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('Function', 'SetDisplayFields');
        if (this.getControlValue('ClosedCalendarTemplateNumber'))
            this.search.set('ClosedCalendarTemplateNumber', this.getControlValue('ClosedCalendarTemplateNumber'));
        this.inputParams['search'] = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams['method'], this.inputParams['module'], this.inputParams['operation'], this.search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('TemplateName', data.TemplateName);
                    this.setControlValue('OwnerBranchNumber', data.OwnerBranchNumber);
                    this.setControlValue('BranchName', data.BranchName);
                    this.riGrid.Clear();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private closedTempateFocus(rsrcElement: Object): void {
        let focusParentElement: any;
        focusParentElement = rsrcElement['parentElement'].parentElement.parentElement;
        focusParentElement.focus();
        if (this.getControlValue('ClosedCalendarTemplateNumber')) {
            this.setAttribute('BranchClosedTemplateRowID', focusParentElement.children[0].children[0].children[0].getAttribute('RowID'));
            this.setAttribute('BranchNumber', focusParentElement.children[0].children[0].children[0].value);
            this.setAttribute('Row', focusParentElement.sectionRowIndex);
        };
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('BranchNumber', 'TemplateAccess', 'BranchNumber', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumn('BranchName', 'TemplateAccess', 'BranchName', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('AllowAccess', 'TemplateAccess', 'AllowAccess', MntConst.eTypeImage, 30);
        this.riGrid.AddColumnAlign('BranchNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('AllowAccess', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('BranchNumber', true);
        this.riGrid.Complete();
    }

    //Loading the Grid data
    public riGridBeforeExecute(): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        let sortOrder = 'Descending';
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set('ClosedCalendarTemplateNumber', this.getControlValue('ClosedCalendarTemplateNumber'));
        gridParams.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        gridParams.set('riSortOrder', sortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
                else {
                    this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                    this.riGrid.RefreshRequired();
                    if (this.riGrid.Update) {
                        this.riGrid.StartColumn = 0;
                        this.riGrid.StartRow = this.getAttribute('ROW');
                        this.riGrid.RowID = this.getAttribute('BranchClosedTemplateRowID');
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                    }
                    this.riGrid.Execute(data);
                    if (data.pageData && (data.pageData.lastPageNumber * 10) > 0) {
                        this.isHidePagination = false;
                    } else {
                        this.isHidePagination = true;
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public getCurrentPage(currentPage: Object): void {
        this.pageCurrent = currentPage['value'];
        this.riGrid.UpdateHeader = true;
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.buildGrid();
            this.riGridBeforeExecute();
        }
        else {
            this.riGrid.Clear();
            this.isHidePagination = true;
            this.setControlValue('TemplateName', '');
            this.setControlValue('OwnerBranchNumber', '');
            this.setControlValue('BranchName', '');
        }
    }

    //Sorting the Grid
    public riGridSort(event: Object): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public onClosedTemplateSearchReceived(data: Object): void {
        if (data) {
            this.setControlValue('ClosedCalendarTemplateNumber', data['ClosedCalendarTemplateNumber']);
            this.selectChange();
            this.isHidePagination = true;
        }
    }

    //On changing Template number
    public templateNumberOnKeyDown(data: Object): void {
        this.isHidePagination = true;
        if (!this.getControlValue('ClosedCalendarTemplateNumber')) {
            this.setControlValue('TemplateName', '');
            this.setControlValue('OwnerBranchNumber', '');
            this.setControlValue('BranchName', '');
            this.riGrid.Clear();
        }
        else
            this.selectChange();
    };

    //When clicking on the field in grid
    public riGridBodyOnClick(event: Object): void {
        this.closedTempateFocus(event['srcElement']);
    }

    //When DBclicking on the field in grid
    public riGridGridOnDblClick(event: Object): void {
        this.closedTempateFocus(event['srcElement']);
        if (this.riGrid.CurrentColumnName === 'AllowAccess') {
            this.search = this.getURLSearchParamObject();
            let formdata: Object = {};
            this.search.set(this.serviceConstants.Action, '6');
            formdata['Function'] = 'ToggleAccess';
            formdata['BranchNumber'] = this.riGrid.Details.GetValue('BranchNumber');
            formdata['BranchClosedTemplateRowID'] = this.getAttribute('BranchClosedTemplateRowID');
            formdata['ClosedCalendarTemplateNumber'] = this.getControlValue('ClosedCalendarTemplateNumber');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], this.search, formdata)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError)
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    else
                        this.riGridOnUpdate();
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                }
                );
        }
    }

    public riGridOnUpdate(): void {
        let sortOrder = 'Descending';
        this.search = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        formdata['ClosedCalendarTemplateNumber'] = this.getControlValue('ClosedCalendarTemplateNumber');
        formdata['BranchNumber'] = this.riGrid.Details.GetValue('BranchNumber');
        formdata['ROWID'] = this.getAttribute('BranchClosedTemplateRowID');
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.search.set('riSortOrder', sortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], this.search, formdata)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.riGrid.UpdateBody = true;
                    this.riGridBeforeExecute();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    //While pressing keydown
    public riGridBodyOnKeyDown(event: Object): void {
        switch (event['keyCode']) {
            case 38:
                event['returnValue'] = 0;
                if (event['srcElement'].parentElement.parentElement.parentElement.previousSibling) {
                    if (event['srcElement'].parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event['srcElement'].parentElement.parentElement.parentElement.previousSibling.children[event['srcElement'].parentElement.parentElement.cellIndex]) {
                            if (event['srcElement'].parentElement.parentElement.parentElement.previousSibling.children[event['srcElement'].parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.closedTempateFocus(event['srcElement'].parentElement.parentElement.parentElement.previousSibling.children[event['srcElement'].parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
            case 40:
            case 9:
                event['returnValue'] = 0;
                if (event['srcElement'].parentElement.parentElement.parentElement.nextSibling) {
                    if (event['srcElement'].parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event['srcElement'].parentElement.parentElement.parentElement.nextSibling.children[event['srcElement'].parentElement.parentElement.cellIndex]) {
                            if (event['srcElement'].parentElement.parentElement.parentElement.nextSibling.children[event['srcElement'].parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.closedTempateFocus(event['srcElement'].parentElement.parentElement.parentElement.nextSibling.children[event['srcElement'].parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
        }
    }

    public lookupBranchName(): void {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.riExchange.getParentHTMLValue('OwnerBranchNumber')
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError)
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            else {
                let Branch = data[0][0];
                if (Branch) {
                    this.setControlValue('BranchName', Branch.BranchName);
                };
            }
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
}
