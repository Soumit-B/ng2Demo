import { Component, OnInit, Injector, ViewChild, Input, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSSContactTypeDetailEscalateGrid.html'
})
export class ContactTypeDetailEscalateGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;

    public pageId: string = '';
    public controls: any[] = [
        { name: 'ContactTypeCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'ContactTypeSystemDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ContactTypeDetailCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'ContactTypeDetailSystemDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'BusinessCode' },
        { name: 'KeyTypeCode' },
        { name: 'KeyTypeValue' },
        { name: 'KeyTypeName' }
    ];

    public queryParams: any = {
        operation: 'System/iCABSSContactTypeDetailEscalateGrid',
        module: 'tickets',
        method: 'ccm/maintenance'
    };

    public gridParams: any = {
        totalRecords: 0,
        itemsPerPage: 10,
        currentPage: 1,
        pageCurrent: 1,
        riGridMode: 0
    };

    public isHidePagination: boolean = true;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEDETAILESCALATEGRID;
        this.pageTitle = this.browserTitle = 'Contact Type Detail - Escalation Grid';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {
        this.setControlValue('ContactTypeCode', this.riExchange.getParentHTMLValue('ContactTypeCode'));
        this.setControlValue('ContactTypeSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeSystemDesc'));
        this.setControlValue('ContactTypeDetailCode', this.riExchange.getParentHTMLValue('ContactTypeDetailCode'));
        this.setControlValue('ContactTypeDetailSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeDetailSystemDesc'));
        this.buildGrid();
    }

    public buildGrid(): void {
        this.riGrid.PageSize = 10;
        this.riGrid.AddColumn('grKeyTypeCode', 'ContactTypeDetailEscalation', 'grKeyTypeCode', MntConst.eTypeTextFree, 18, false);
        this.riGrid.AddColumn('grKeyTypeValue', 'SOPremContactTypeDetailEscalationise', 'grKeyTypeValue', MntConst.eTypeTextFree, 12, false);
        this.riGrid.AddColumn('KeyTypeName', 'ContactTypeDetailEscalation', 'KeyTypeName', MntConst.eTypeTextFree, 12, false);
        this.riGrid.AddColumn('EscalateInd', 'ContactTypeDetailEscalation', 'EscalateInd', MntConst.eTypeImage, 1, false);
        this.riGrid.AddColumn('WorkingHoursInd', 'ContactTypeDetailEscalation', 'WorkingHoursInd', MntConst.eTypeTextFree, 20, false);
        this.riGrid.AddColumnAlign('WorkingHoursInd', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('EscalateHours', 'ContactTypeDetailEscalation', 'EscalateHours', MntConst.eTypeInteger, 5, false);
        this.riGrid.AddColumnAlign('EscalateHours', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('EscalateMinutes', 'ContactTypeDetailEscalation', 'EscalateMinutes', MntConst.eTypeInteger, 5, false);
        this.riGrid.AddColumnAlign('EscalateMinutes', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('WarningHours', 'ContactTypeDetailEscalation', 'WarningHours', MntConst.eTypeInteger, 5, false);
        this.riGrid.AddColumnAlign('WarningHours', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('WarningMinutes', 'ContactTypeDetailEscalation', 'WarningMinutes', MntConst.eTypeInteger, 5, false);
        this.riGrid.AddColumnAlign('WarningMinutes', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.loadData();
    }

    public loadData(): void {
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;

        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('ContactTypeCode', this.getControlValue('ContactTypeCode'));
        search.set('ContactTypeDetailCode', this.getControlValue('ContactTypeDetailCode'));
        search.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        search.set(this.serviceConstants.PageCurrent, this.gridParams.pageCurrent);
        search.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort)
            sortOrder = 'Ascending';
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.gridParams.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
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
            }
            );
    }

    public riGridOnGridRowClick(data: any): void {
        let additionalInfo: any;
        let additionalInfoArray: any = [];
        additionalInfo = this.riGrid.Details.GetAttribute('grKeyTypeCode', 'AdditionalProperty');
        additionalInfoArray = additionalInfo.split('^');
        this.setControlValue('BusinessCode', additionalInfoArray[0]);
        this.setControlValue('KeyTypeCode', additionalInfoArray[1]);
        this.setControlValue('KeyTypeValue', additionalInfoArray[2]);
        this.setControlValue('KeyTypeName', additionalInfoArray[3]);
    }
    public riGridOnGridRowDBClick(data: any): void {
        switch (this.riGrid.CurrentCell) {
            case 0:
                // TODO
                // this.navigate('update', 'System/iCABSSContactTypeDetailEscalation.htm');
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        }

    }

    public btnAddOnClick(): void {
        // TODO
        // this.navigate('add', 'System/iCABSSContactTypeDetailEscalation.htm');
        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
    }

    public getCurrentPage(currentPage: any): void {
        this.gridParams.pageCurrent = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    }

    public refresh(): void {
        this.loadData();
    }

}
