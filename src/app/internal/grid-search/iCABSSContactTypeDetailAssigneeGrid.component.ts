import { Component, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
    templateUrl: 'iCABSSContactTypeDetailAssigneeGrid.html'
})

export class ContactTypeDetailAssigneeGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('contactTypeDetailAssigneeGridPagination') contactTypeDetailAssigneeGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;

    private pageCurrent: number = 1;
    private queryParams: any = {
        operation: 'System/iCABSSContactTypeDetailAssigneeGrid',
        module: 'tickets',
        method: 'ccm/maintenance'
    };

    public controls = [
        { name: 'ContactTypeCode', type: MntConst.eTypeCode },
        { name: 'ContactTypeSystemDesc', type: MntConst.eTypeText },
        { name: 'ContactTypeDetailCode', type: MntConst.eTypeCode },
        { name: 'ContactTypeDetailSystemDesc', type: MntConst.eTypeText }
    ];
    public showErrorHeader: boolean = true;
    public pageId: string = '';
    public itemsPerPage: number = 10;
    public totalRecords: number = 1;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEDETAILASSIGNEEGRID;
        this.pageTitle = this.browserTitle = 'Contact Type Detail - Assignee Grid';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private riGridBeforeExecute(): void {
        this.riGrid.RefreshRequired();
        let gridParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridParams.set('ContactTypeCode', this.getControlValue('ContactTypeCode'));
        gridParams.set('ContactTypeDetailCode', this.getControlValue('ContactTypeDetailCode'));
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                if (data) {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        if (data && data.hasError) {
                            this.messageModal.show(data['errorMessage'], true);
                        } else {
                            this.riGrid.Execute(data);
                        }

                    } catch (e) {
                        this.logger.log('Problem in grid load', e);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.messageModal.show(error, true);
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }

    private pageOnLoad(): void {
        this['uiForm'].disable();
        this.setControlValue('ContactTypeCode', this.riExchange.getParentHTMLValue('ContactTypeCode'));
        this.setControlValue('ContactTypeSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeSystemDesc'));
        this.setControlValue('ContactTypeDetailCode', this.riExchange.getParentHTMLValue('ContactTypeDetailCode'));
        this.setControlValue('ContactTypeDetailSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeDetailSystemDesc'));
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.buildGrid();
        this.riGrid.RefreshRequired();
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('grKeyTypeCode', 'ContactTypeDetailAssignee', 'grKeyTypeCode', MntConst.eTypeTextFree, 18, false, '');
        this.riGrid.AddColumn('grKeyTypeValue', 'ContactTypeDetailAssignee', 'grKeyTypeValue', MntConst.eTypeTextFree, 12, false, '');
        this.riGrid.AddColumn('KeyTypeName', 'ContactTypeDetailAssignee', 'KeyTypeName', MntConst.eTypeTextFree, 12, false, '');
        this.riGrid.AddColumn('AssignToDesc', 'ContactTypeDetailAssignee', 'AssignToDesc', MntConst.eTypeTextFree, 40, false, '');
        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    public getCurrentPage(currentPage: any): void {
        this.pageCurrent = currentPage.value;
        this.riGridBeforeExecute();
    }

    public riGridBodyOnClick(ev: any): void {
        let AdditionalInfo: any;
        AdditionalInfo = this.riGrid.Details.GetAttribute('grKeyTypeCode', 'additionalproperty').split('^');
        this.pageParams.BusinessCode = AdditionalInfo[0];
        this.pageParams.KeyTypeCode = AdditionalInfo[1];
        this.pageParams.KeyTypeValue = AdditionalInfo[2];
        this.pageParams.KeyTypeName = AdditionalInfo[3];
    }

    public riGridBodyOnDblClick(ev: any): void {
        if (this.riGrid.CurrentColumnName === 'grKeyTypeCode') {
            alert('Redirection to iCABSSContactTypeDetailAssignee (Maintenance page) -- not yet ready');
            // this.navigate('update', 'System/iCABSSContactTypeDetailAssignee.htm', {
            //     'parentMode': 'update'
            // });
        }
    }

    public btnAddOnClick(): void {
        alert('Redirection to iCABSSContactTypeDetailAssignee (Maintenance page) -- Page not yet ready');
        // this.navigate('add', 'System/iCABSSContactTypeDetailAssignee.htm', {
        //     'parentMode': 'add'
        // });
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }
}


