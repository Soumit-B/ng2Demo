import { Component, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';

@Component({
    templateUrl: 'iCABSBSalesAreaPostCodeGrid.html'
})
export class SalesAreaPostCodeComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riPagination') riPagination: PaginationComponent;

    private muleConfig: any = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Business/iCABSBSalesAreaPostCodeGrid',
        contentType: 'application/x-www-form-urlencoded',
        action: '2'
    };

    public pageId: any;
    public pageSize: number = 10;
    public totalRecords: number = 0;
    public gridCurPage: number = 1;
    public isPaginationEnable: boolean = true;

    public controls: Array<any> = [
        { name: 'SalesAreaCode', readonly: false, disabled: true, required: false },
        { name: 'SalesAreaDesc', readonly: false, disabled: true, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBSALESAREAPOSTCODEGRID;
        this.pageTitle = 'Sales Area Postcode';
        this.browserTitle = 'Sales Area Postcode Grid';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
        this.buildGrid();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {
        let salesAreaCode: string = this.riExchange.getParentHTMLValue('SalesAreaCode');
        let salesAreaDesc: string = this.riExchange.getParentHTMLValue('SalesAreaDesc');
        this.setControlValue('SalesAreaCode', salesAreaCode);
        this.setControlValue('SalesAreaDesc', salesAreaDesc);
    }

    public buildGrid(): void {

        this.riGrid.Clear();
        this.riGrid.AddColumn('PostCode', 'PostCode', 'PostCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumn('State', 'PostCode', 'State', MntConst.eTypeCode, 10);
        this.riGrid.AddColumn('Town', 'PostCode', 'Town', MntConst.eTypeCode, 10);
        this.riGrid.Complete();
        this.riGrid.HighlightBar = true;

        this.riGridBeforeExecute();
    }

    public riGridBeforeExecute(): void {
        let gridQueryParams: URLSearchParams = this.getURLSearchParamObject();
        gridQueryParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set('riGridMode', '0');
        gridQueryParams.set('riCacheRefresh', 'True');
        gridQueryParams.set('riGridHandle', this.utils.gridHandle);
        gridQueryParams.set('Function', 'SalesArea');
        gridQueryParams.set('SalesAreaCode', this.getControlValue('SalesAreaCode'));
        gridQueryParams.set('BranchNumber', this.utils.getBranchCode());
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.gridCurPage.toString());

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.totalRecords = 0;
                        this.isPaginationEnable = false;
                        this.riGrid.ResetGrid();
                    } else {
                        this.gridCurPage = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        this.isPaginationEnable = (this.totalRecords > 0) ? true : false;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public getCurrentPage(currentPage: any): void {
        this.gridCurPage = currentPage.value;
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

}
