import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, HostListener, ChangeDetectorRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { InternalMaintenanceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from '../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSBBranchHolidayGrid.html'
})

export class BranchHolidayGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public pageId: string = '';
    public search = new URLSearchParams();
    public controls = [
        { name: 'BusinessDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'BranchName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'YearNumber', readonly: false, disabled: false, required: false }
    ];

    // Grid Component Variables
    public gridConfig = {
        pageSize: 10,
        currentPage: 1,
        totalRecords: 1
    };

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Business/iCABSBBranchHolidayGrid',
        module: 'planning',
        method: 'service-planning/grid'
    };

    constructor(injector: Injector, private ref: ChangeDetectorRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBRANCHHOLIDAYGRID;

        // Page level Variables
        this.browserTitle = this.pageTitle = 'Branch Holidays';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        }
        else {
            this.window_onload();
        }
        this.buildGrid();
        this.riGrid_onRefresh();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public window_onload(): void {
        // Populate selected business description
        this.setControlValue('BusinessDesc', this.businessCode() + ' - ' + this.utils.getBusinessText().trim());
        this.disableControl('BusinessDesc', true);

        // Fetch & populate selected branch description
        this.pageParams['vBranchCode'] = this.utils.getBranchCode();
        this.setControlValue('BranchName', this.utils.getBranchText(this.pageParams['vBranchCode']));
        this.disableControl('BranchName', true);

        // Populate today's year
        this.setControlValue('YearNumber', (new Date()).getFullYear());
    }

    // Builds the structure of the grid
    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = this.gridConfig.pageSize;

        this.riGrid.AddColumn('HolidayDate', 'HolidayDate', 'HolidayDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('HolidayDesc', 'HolidayDesc', 'HolidayDesc', MntConst.eTypeTextFree, 40);

        this.riGrid.Complete();
    }

    // Populate data into the grid
    public populateGrid(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set('YearNumber', this.getControlValue('YearNumber'));
        this.search.set('BranchNumber', this.utils.getBranchCode());

        // set grid building parameters
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.PageSize, this.gridConfig.pageSize.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.gridConfig.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set(this.serviceConstants.GridSortOrder, sortOrder);
        this.search.set(this.serviceConstants.Action, '2');

        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.riGrid.RefreshRequired();
                    this.gridConfig.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridConfig.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.gridConfig.pageSize : 1;
                    this.riGrid.Execute(data);
                    this.ref.detectChanges();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Callback to retrieve the current page on user clicks
    public getCurrentPage(currentPage: any): void {
        this.gridConfig.currentPage = currentPage.value;
        this.riGrid_onRefresh();
    }

    // Refresh the grid data on user click
    public riGrid_onRefresh(): void {
        if (this.gridConfig.currentPage <= 0) {
            this.gridConfig.currentPage = 1;
        }
        this.riGrid.RefreshRequired();
        this.populateGrid();
    }

    // YearNumber OnChange event
    public yearNumber_OnChange(event: Event): void {
        this.riGrid_onRefresh();
    }

    // Grid row double click event
    public tGridBody_OnDblClick(event: Event): void {
        switch (this.riGrid.CurrentColumnName) {
            case 'HolidayDate':
                // Todo: Calender popup needs to be added
                break;
            case 'HolidayDesc':
                let RowID = this.riGrid.Details.GetAttribute('HolidayDate', 'RowID');
                if (RowID !== '1') {
                    this.setAttribute('HolidayDate', this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('HolidayDate')));
                    this.navigateToBranchHolidayMaintenance('Update');
                }
                break;
        }
    }

    // Navigation to Branch Holiday Maintenance
    public navigateToBranchHolidayMaintenance(exchangeMode: string): void {
        this.navigate(exchangeMode, InternalMaintenanceServiceModuleRoutes.ICABSBBRANCHHOLIDAYMAINTENANCE);
    }

    // Add button click event
    public btnAdd_OnClick(event: Event): void {
        this.navigateToBranchHolidayMaintenance('Add');
    }

    // Listener for keydown events
    @HostListener('document:keydown', ['$event']) document_onkeydown(ev: any): void {
        let yearNumber: any;
        let isTrigger = false;
        switch (ev.keyCode) {
            // GoTo Current Year
            case 106: // * in num pad
                yearNumber = (new Date()).getFullYear();
                isTrigger = true;
                break;
            // + 1 Year
            case 107: // + in num pad
                if (!isNaN(this.getControlValue('YearNumber'))) {
                    yearNumber = this.CInt('YearNumber') + 1;
                    isTrigger = true;
                }
                break;
            // - 1 Year
            case 109: // - in num pad -
                if (!isNaN(this.getControlValue('YearNumber'))) {
                    yearNumber = this.CInt('YearNumber') - 1;
                    isTrigger = true;
                }
                break;
        }
        if (isTrigger) {
            this.setControlValue('YearNumber', yearNumber);
            //this.riGrid_onRefresh();
        }
    };
}
