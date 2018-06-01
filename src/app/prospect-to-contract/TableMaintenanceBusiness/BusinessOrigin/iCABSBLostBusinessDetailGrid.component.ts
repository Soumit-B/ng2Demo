import { Component, OnInit, Injector, ViewChild, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { InternalMaintenanceApplicationModuleRoutesConstant, InternalMaintenanceSalesModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from '../../../base/PageRoutes';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';
import { AjaxConstant } from './../../../../shared/constants/AjaxConstants';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSBLostBusinessDetailGrid.html'
})
export class LostBusinessDetailGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    [x: string]: any;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public pageId: string = '';
    public itemsPerPage: number = 10;
    public totalRecords: number = 1;
    public currentPage: number = 1;
    public maxColumn: number = 5;
    public isRequesting: boolean = false;
    public controls: Array<any> = [
        { name: 'BusinessDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ActiveOnly', readonly: false, disabled: false, required: false },
        { name: 'LostBusinessSearchType', readonly: false, disabled: false, required: false },
        { name: 'LostBusinessSearchValue', readonly: false, disabled: false, required: false },
        { name: 'menu', readonly: false, disabled: false, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBLOSTBUSINESSDETAILGRID;
        this.browserTitle = this.pageTitle = 'Lost Business Detail';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else
            this.setControlValue('ActiveOnly', true);
        this.setControlValue('BusinessDesc', this.utils.getBusinessCode() + '-' + this.utils.getBusinessText());
        this.setControlValue('menu', '');
        this.setControlValue('LostBusinessSearchType', 'LostBusinessCode');
        this.buildGrid();
    };

    //Grid
    public buildGrid(): void {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;

        this.riGrid.Clear();
        this.riGrid.AddColumn('LostBusinessCode', 'LostBusinessDetail', 'LostBusinessCode', MntConst.eTypeCode, 8, false, '');
        this.riGrid.AddColumnOrderable('LostBusinessCode', true);
        this.riGrid.AddColumn('LostBusinessDesc', 'LostBusinessDetail', 'LostBusinessDesc', MntConst.eTypeText, 40, false, '');
        this.riGrid.AddColumnOrderable('LostBusinessDesc', true);
        this.riGrid.AddColumn('LostBusinessDetailCode', 'LostBusinessDetail', 'LostBusinessDetailCode', MntConst.eTypeCode, 8, false, '');
        this.riGrid.AddColumnOrderable('LostBusinessDetailCode', true);
        this.riGrid.AddColumn('LostBusinessDetailDesc', 'LostBusinessDetail', 'LostBusinessDetailDesc', MntConst.eTypeText, 40, false, '');
        this.riGrid.AddColumnOrderable('LostBusinessDetailDesc', true);
        this.riGrid.AddColumn('InvalidForNew', 'LostBusinessDetail', 'InvalidForNew', MntConst.eTypeImage, 1, false, '');
        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    public riGridBeforeExecute(): void {
        let postParams: any = {};
        let search: URLSearchParams = this.getURLSearchParamObject();
        postParams.methodtype = 'grid';
        postParams.Level = 'Detail';
        search.set(this.serviceConstants.Action, '2');
        search.set('ActiveOnly', this.getControlValue('ActiveOnly'));
        search.set('SearchType', this.getControlValue('LostBusinessSearchType'));
        search.set('SearchValue', this.getControlValue('LostBusinessSearchValue'));
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.PageSize, '10');
        search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        search.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        let sortOrder: any = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);

        this.ajaxSource.next(AjaxConstant.START);
        let xhr = {
            module: 'retention',
            method: 'ccm/maintenance',
            operation: 'Business/iCABSBLostBusinessDetailGrid'
        };
        this.httpService.makePostRequest(xhr.method, xhr.module, xhr.operation, search, postParams)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorService.emitError(data);
                } else {
                    this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.Execute(data);
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                }
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    };
    //Grid Refresh
    public btnRefresh(): void {
        this.currentPage = 1;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }
    // pagination current page
    public getCurrentPage(currentPage: any): void {
        if (this.currentPage === currentPage.value) {
            return;
        }
        this.currentPage = currentPage.value;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public onDblClick(event: any): void {
        switch (this.riGrid.CurrentColumnName) {
            case 'LostBusinessDetailCode':
                this.navigate('LostBusinessDetailUpdate', InternalMaintenanceApplicationModuleRoutes.ICABSBLOSTBUSINESSDETAILMAINTENANCE, { 'ROWID': this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowid') });
                break;
            case 'LostBusinessCode':
                this.navigate('LostBusinessUpdate', InternalMaintenanceSalesModuleRoutes.ICABSBLOSTBUSINESSMAINTENANCE, { 'ROWID': this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowid') });
                break;
        }
    }

    public menuOnchange(event: any): void {
        switch (event) {
            case 'Add':
                this.navigate('LostBusinessDetailAdd', InternalMaintenanceApplicationModuleRoutes.ICABSBLOSTBUSINESSDETAILMAINTENANCE, {});
                break;
        }
    };

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    };
}
