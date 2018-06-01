import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { BaseComponent } from './../../base/BaseComponent';
import { QueryParametersCallback } from './../../base/Callback';
import { ContractManagementModuleRoutes } from './../../base/PageRoutes';

import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
    templateUrl: 'iCABSCMGeneralSearchInfoGrid.html'
})

export class CMGeneralSearchInfoGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;

    public pageId: string = '';
    public controls = [];

    public xhrParams: any = {
        module: 'search',
        method: 'contract-management/maintenance',
        operation: 'ContactManagement/iCABSCMGeneralSearchInfoGrid'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMGENERALSEARCHINFOGRID;
        this.browserTitle = this.pageTitle = 'General Search Info';
    }

    ngOnInit(): void {
        super.ngOnInit();

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.buildGrid();
            this.riGridBeforeExecute();
        } else {
            this.windowOnload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // ##############################################################
    // # Window on load Events
    // ##############################################################
    public windowOnload(): void {
        this.pageParams.pageSize = 10;
        this.pageParams.totalRecords = 0;
        this.pageParams.curPage = 1;
        this.getSysCharDtetails();
    }

    // ######### Set Page SysChar ##############
    public getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInfestations,
            this.sysCharConstants.SystemCharEnableVisitDetail
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vReqInfestations = record[0]['Required'];
            this.pageParams.vSCEnableVisitDetail = record[1]['Required'];
            this.pageParams.reqInfestation = this.pageParams.vReqInfestations;
            this.setVBVariables();
            this.buildGrid();
            this.riGridBeforeExecute();
        });

    }
    // ############ Set pageParams based on sysChar values ###############
    public setVBVariables(): void {
        this.pageParams.scEnableInfestations = this.pageParams.vReqInfestations;
        this.pageParams.scEnableVisitDetail = this.pageParams.vSCEnableVisitDetail;
    }

    // ##############################################################
    // # Grid load Events
    // ##############################################################

    public buildGrid(): void {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.Clear();

        this.riGrid.AddColumn('ContractNumber', 'ContractNumber', 'ContractNumber', MntConst.eTypeCode, 12, false);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseNumber', 'PremiseNumber', 'PremiseNumber', MntConst.eTypeInteger, 4, false);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ProductCode', 'ProductCode', 'ProductCode', MntConst.eTypeCode, 4, false);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('VisitDate', 'VisitDate', 'VisitDate', MntConst.eTypeDate, 10, false);
        this.riGrid.AddColumnAlign('VisitDate', MntConst.eAlignmentCenter);

        if (this.pageParams.scEnableVisitDetail) {
            this.riGrid.AddColumn('VisitDateEnd', 'VisitDateEnd', 'VisitDateEnd', MntConst.eTypeDate, 10, false);
            this.riGrid.AddColumnAlign('VisitDateEnd', MntConst.eAlignmentCenter);
        }

        this.riGrid.AddColumn('VisitTypeCode', 'VisitTypeCode', 'VisitTypeCode', MntConst.eTypeCode, 4, false);
        this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('SharedInd', 'SharedInd', 'SharedInd', MntConst.eTypeImage, 10, false);
        this.riGrid.AddColumnAlign('SharedInd', MntConst.eAlignmentCenter);

        if (this.pageParams.scEnableVisitDetail) {
            this.riGrid.AddColumn('VisitDetail', 'VisitDetail', 'VisitDateEnd', MntConst.eTypeImage, 10, false);
            this.riGrid.AddColumnAlign('VisitDetail', MntConst.eAlignmentCenter);
        }

        this.riGrid.AddColumn('Employee', 'Employee', 'Employee', MntConst.eTypeText, 20, false);
        this.riGrid.AddColumnAlign('Employee', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('Quantity', 'Quantity', 'Quantity', MntConst.eTypeInteger, 2, false);
        this.riGrid.AddColumnAlign('Quantity', MntConst.eAlignmentCenter);
        if (this.pageParams.reqInfestation) this.riGrid.AddColumn('Infestation', 'Infestation', 'Infestation', MntConst.eTypeText, 20, false);


        this.riGrid.Complete();
    }

    public riGridBeforeExecute(): void {
        let gridQueryParams: URLSearchParams = this.getURLSearchParamObject();
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set('Function', 'GeneralSearchInfo');
        gridQueryParams.set('ImageRowID', this.riExchange.getParentAttributeValue('searchValueImageRowID'));
        gridQueryParams.set(this.serviceConstants.PageSize, this.pageParams.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.pageParams.curPage.toString());
        gridQueryParams.set(this.serviceConstants.GridMode, '0');
        gridQueryParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridQueryParams.set(this.serviceConstants.GridCacheRefresh, 'true');
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) sortOrder = 'Ascending';

        gridQueryParams.set('riSortOrder', sortOrder);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.riGrid.RefreshRequired();
                    this.pageParams.curPage = data.pageData.pageNumber || 1;
                    this.pageParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageParams.pageSize : 1;

                    if (this.riGrid.Update) {
                        this.riGrid.UpdateHeader = false;
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

    public riGridAfterExecute(): void {
        if (!this.riGrid.Update)
            if (this.riGrid.HTMLGridBody && this.riGrid.HTMLGridBody.tagName.toLowerCase() === 'tbody' && this.riGrid.HTMLGridBody.children.length > 0)
                if (this.riGrid.HTMLGridBody.children[0].children[0])
                    this.selectedRowFocus(this.riGrid.HTMLGridBody.children[0].children[0]);

    }

    // ##############################################################
    // # Grid Routines
    // ##############################################################

    public riExchangeUpdateHTMLDocument(): void {
        this.riGridBeforeExecute();
    }

    public selectedRowFocus(rsrcElement: any): void {
        if (rsrcElement) {
            let gridCell: any;
            if (rsrcElement.tagName.toLowerCase() !== 'tr') {
                gridCell = rsrcElement.parentElement;
                gridCell.children[0].children[0].children[0].focus();
                if (this.pageParams.scEnableVisitDetail)
                    this.setAttribute('ServiceVisitRowID', gridCell.children[6].children[0].getAttribute('rowid'));
                else
                    this.setAttribute('ServiceVisitRowID', gridCell.children[5].children[0].getAttribute('rowid'));
            }
        }
    }

    public riGridBodyOnKeyDown(event: any): void {
        let cellindex: number = event.srcElement.parentElement.parentElement.cellIndex;
        let rowIndex: number = event.srcElement.parentElement.parentElement.parentElement.sectionRowIndex;
        let dataLength: number = this.riGrid.HTMLGridBody.children.length;
        switch (event.keyCode) {
            case 37: // Left
                event.returnValue = 0;
                if ((rowIndex > 0) && (rowIndex < dataLength)) this.selectedRowFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[0]);
                break;
            case 39: // Right
                event.returnValue = 0;
                if ((rowIndex >= 0) && (rowIndex < dataLength - 1)) this.selectedRowFocus(this.riGrid.CurrentHTMLRow.nextSibling.children[0]);
                break;
            case 38: // Up Arror
                event.returnValue = 0;
                if ((rowIndex > 0) && (rowIndex < dataLength)) this.selectedRowFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[cellindex]);
                break;
            case 9:
            case 40: // Down Arror Or Tab
                event.returnValue = 0;
                if ((rowIndex >= 0) && (rowIndex < dataLength - 1)) this.selectedRowFocus(this.riGrid.CurrentHTMLRow.nextSibling.children[cellindex]);
                break;
        }
    }

    public riGridBodyOnClick(event: any): void {
        this.selectedRowFocus(event.srcElement.parentElement.parentElement);
    }

    public riGridBodyOnDblClick(event: any): void {
        this.selectedRowFocus(event.srcElement.parentElement.parentElement);
        switch (this.riGrid.CurrentColumnName) {
            case 'VisitDetail':
                this.riExchange.Mode = 'GeneralSearchInfo';
                this.navigate(this.riExchange.Mode, ContractManagementModuleRoutes.ICABSASERVICEVISITDETAILSUMMARY, {
                    'riGridSystemInvoiceNumber': this.getAttribute('ServiceVisitRowID')
                });
                break;
        }
    }

    public getCurrentPage(event: any): void {
        this.pageParams.curPage = event.value;
        this.riExchangeUpdateHTMLDocument();
    }

    public refresh(): void {
        if (this.pageParams.curPage <= 0) this.pageParams.curPage = 1;
        this.riExchangeUpdateHTMLDocument();
    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }
}

